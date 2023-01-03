import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createStyles, Header, Container, Group, Paper, Transition, Burger, Autocomplete, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import styled from 'styled-components';
import SearchIcon from './SearchIcon.js';
import {
  fetchPosts
} from '../state/postsReducer.js';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  search: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  searchIcon: {
    // '&:hover': {
      cursor: 'pointer',
    // },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    position: 'relative',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },

  //add animation to make fade in and fade out
  // make disappear if focus/click/tab away
  popup: {
    width: '220px',
    backgroundColor: '#555',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '6px',
    padding: '8px 0',
    position: 'absolute',
    zIndex: '2',
    top: '110%',
    left: '50%',
    marginLeft: '-80px',

    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      marginLeft: '-5px',
      borderWidth: '5px',
      borderStyle: 'solid',
      borderColor: '#555 transparent transparent transparent',
    },
  },

}));

export default function NavBar({ links, home, bucketList, setPosts, user, isLoggedIn, handleFilterPosts }) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(home.link);
  const { classes, cx } = useStyles();
  const [search, setSearch] = useState('');
  const [hidePopUp, setHidePopUp] = useState(true);
  const [view, setView] = useState('home');
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();

    useEffect(() => {
      axios.get('http://localhost:3001/tags')
      .then((res) => {
        setTags(res.data)
      })
      .catch((err) => {
        console.log('error getting tags in select tags component', err);
      })
    }, []);

   // prolly don't need to link to a different page with the NavBar, but just change the state
  // and update the posts rendered based on state.tagSelected

  const handleFilterPostsByLink = async (route, link, e) => {
    e && e.preventDefault();
    try {
      await dispatch(fetchPosts({tags: link.label}));
      setActive(link.link);
      close();
    } catch (err) {
      console.log('error filtering posts', err);
    }
  };

  const handleFilterPostsByActivity = async (route, filteredTerm, e) => {
    e && e.preventDefault();
    console.log('filtered term: ', filteredTerm);
    try {
      await dispatch(fetchPosts({tags: filteredTerm}));
      setSearch('');
    } catch (err) {
      console.log('error filtering posts', err);
    }
  };

  // This works also if favouriteFoods is: favouriteFoods:[{type:Schema.Types.ObjectId, ref:'Food'}] – https://stackoverflow.com/questions/18148166/find-document-with-array-that-contains-a-specific-value

  const handleFilterPostsByBucketList = async (e) => {
    e.preventDefault();
    if (user.email !== undefined) {
      try {
        console.log('user: ', user);
        const userId = user._id;
        const response = await axios.get(`http://localhost:3001/users/${userId}`);
        const filteredPosts = response.data.bucketList;
        console.log('response from handleFilterPosts', response.data);
        setPosts(filteredPosts);
        setActive(bucketList.link);
        setView("bucketlist")
        close();
      } catch (err) {
        console.log('error filtering posts by bucketlist', err);
      }
    } else {
     // alert("Must be logged in to filter by posts saved to your bucket list.")
       // return error need to be logged in, or disable bucketList link and make tooltip over it urging user to sign in to see
      console.log('getting to else in handleClick');
      setHidePopUp(false);
      setTimeout(setHidePopUp, 5000, true);
    }
  };

  const handleClickHome =
  // async
  (e) => {
    e.preventDefault();
    dispatch(fetchPosts());
    // try {
    //   const response = await axios.get('http://localhost:3001/posts/');
    //   const filteredPosts = response.data;
    //   console.log('response from handleFilterPosts', response.data);
    //   setPosts(filteredPosts);
      setActive(home.link);
      close();
    // } catch (err) {
    //   console.log('error returning home', err);
    // }
  };

  const items = links.map((link) => (
      <a
        key={link.label}
        href={link.link}
        className={cx(classes.link, { [classes.linkActive]: active === link.link })}
        onClick={(e) => handleFilterPostsByLink('tags', link, e)}
      >
        {link.label}
      </a>
  ));

  // const data = regions.map((item) => ({ ...item, value: item.label }));
  let data = [];
  if (tags.length > 0) {
    data = tags;
  }

  // could use switch/case for clicking on diff links

  return (
    <Header height={HEADER_HEIGHT} mb={40} className={classes.root}>
      <Container className={classes.header}>
          <Group spacing={10} className={classes.links}>
            <a
              href={home.link}
              className={cx(classes.link, { [classes.linkActive]: active === home.link })}
              onClick={(e) => handleClickHome(e)}
            >
            {home.label}
            </a>
            <a
              href={bucketList.link}
              className={cx(classes.link, { [classes.linkActive]: active === bucketList.link })}
              onClick={(e) => handleFilterPostsByBucketList(e)} disabled={!isLoggedIn}
            >
            {bucketList.label}
            <span className={classes.popup} id="myPopup"
            style={{ visibility: hidePopUp ? 'hidden' : 'visible', transition: 'visibility 5s' }}
            >Must be logged in to filter by posts saved to your bucket list.</span>
            </a>

            {items}
          </Group>
          {/* <Button>
            component={Autocomplete}
            classNames={{root: classes.search, icon: classes.searchIcon}}
            placeholder="search by activity"
            icon={<SearchIcon
            search={search}
            handleFilterPostsByActivity={handleFilterPostsByActivity}
            //onClick={(e) => handleFilterPostsByActivity('tags', search, e)}
            // size={16} stroke={1.5}
            // className={classes.searchIcon}
            />}
            // zIndex={101}
            onItemSubmit={(item) => handleFilterPostsByActivity('tags', item)}
            data={data} // can make these dynamic to last searched for user
            value={search}
            onChange={setSearch}
            onKeyPress={(e) => {if (e.key === 'Enter') {handleFilterPostsByActivity('tags', search, e)}}}
            onItemSubmit={(search) => {handleFilterPostsByActivity('tags', search)}}
          </Button> */}
          <Autocomplete
              classNames={{root: classes.search, icon: classes.searchIcon}}
              placeholder="search by activity"
              icon={<SearchIcon
              search={search}
              handleFilterPostsByActivity={handleFilterPostsByActivity}
              //onClick={(e) => handleFilterPostsByActivity('tags', search, e)}
              // size={16} stroke={1.5}
              className={classes.searchIcon}
              />}
              // zIndex={101}
              data={data} // can make these dynamic to last searched for user -- think may automatically be
              value={search}
              onChange={setSearch}
              onKeyPress={(e) => {if (e.key === 'Enter') {handleFilterPostsByActivity('tags', search, e)}}}
              //onItemSubmit={(searchTerm) => {handleFilterPostsByActivity('tags', searchTerm)}}
              onItemSubmit={(item) => {let searchTerm = item.value; handleFilterPostsByActivity('tags', searchTerm)}}
            />

          <Burger opened={opened} onClick={toggle} title="Open navigation" aria-label="Open navigation" className={classes.burger} size="sm" />

          <Transition transition="pop-top-right" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                <a
                  href={home.link}
                  className={cx(classes.link, { [classes.linkActive]: active === home.link })}
                  onClick={(e) => handleClickHome(home, e)}
                >
                  {home.label}
                </a>
                <a
                  href={bucketList.link}
                  className={cx(classes.link, { [classes.linkActive]: active === bucketList.link })}
                  onClick={(e) => handleFilterPostsByBucketList(bucketList, e)}
                >
                {bucketList.label}
                </a>
                {items}
              </Paper>
            )}
          </Transition>
      </Container>
    </Header>
  );
};


