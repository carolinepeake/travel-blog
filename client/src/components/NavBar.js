import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, Header, Container, Group, Paper, Transition, Burger, Autocomplete, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { SearchIcon} from './SearchIcon.js';
import { filterSet, selectAllTags, selectFilter } from '../state/postsSlice.js';
import { selectBucketList, selectLoggedInState } from '../state/usersSlice.js';

const HEADER_HEIGHT = 60;

const quickLinks = ['kiteboarding', 'scuba', 'music', 'gastronomy'];
const bucketListLink = {link: '/bucketlist', label: 'bucketlist'};
const home = {link: '/home', label: 'home'};

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 101,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 400,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'visible',

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

    // '&[data-disabled]': {
    //   pointerEvents: 'all',
    //   cursor: 'not-allowed',
    // },

    '&:disabled': {
      pointerEvents: 'all',
      cursor: 'not-allowed',
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

export default function NavBar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(home.link);
  const { classes, cx } = useStyles();
  const [search, setSearch] = useState('');
  const [hidePopUp, setHidePopUp] = useState(true);
  const [view, setView] = useState('home');
  const dispatch = useDispatch();

  let tags = useSelector(selectAllTags);
  let bucketList = useSelector(selectBucketList);
  let isLoggedIn = useSelector(selectLoggedInState);
  let filter = useSelector(selectFilter);

  // const [filterTerm = 'home'] = Object.values(filter);
  // const [filterType] = Object.keys(filter);
  // if (filter.type === 'none') {
  //   setActive('home');
  // } else if (filter.type === 'bucketList') {
  //      setActive('bucketList');
  //    } else if (quicklinks.includes(filter.value)) {
  //     setActive(filter.value);
  //    } else {
  //     setActive('');
  //    }
    // links.includes(filterTerm)) {
  //   setActive(filterTerm);
  // } else {
  //   setActive('');
  // }
  // filterType === 'bucketlist' ? setActive(bucketListLink.link) : links.includes(filterTerm) ? setActive(filterTerm) : setActive('');

  // async?
  const handleFilterPosts = async (filter = {type: 'none'}, e) => {
    e && e.preventDefault();
    try {
      await dispatch(filterSet(filter));
      const filterTerm = filter.value;
      quickLinks.includes(filterTerm) ? setActive(filterTerm) : setActive('');
      setTimeout(() => setSearch(''), 500);
      close();
    } catch (err) {
      console.log('error filtering posts', err);
    }
  };

  // This works also if favouriteFoods is: favouriteFoods:[{type:Schema.Types.ObjectId, ref:'Food'}] – https://stackoverflow.com/questions/18148166/find-document-with-array-that-contains-a-specific-value

  const handleFilterPostsByBucketList = async (e) => {
    e.preventDefault();
    if (isLoggedIn && bucketList) {
      try {
        console.log('bucketList in handleFilterPostsByBucketList: ', bucketList);
        await dispatch(filterSet({ type: 'bucketList', value: bucketList }));
        setActive(bucketListLink.link);
        setView("bucketList")
        close();
      } catch (err) {
        console.log('error filtering posts by bucketlist', err);
      }
    } else {
      console.log('error -  user not logged in to filter posts by bucketList');
      setHidePopUp(false);
      setTimeout(setHidePopUp, 5000, true);
    }
  };

  const handleClickHome = async (e) => {
    try {
      e.preventDefault();
      dispatch(filterSet({type: 'none'}));
      setActive(home.link);
      close();
    } catch (err) {
      console.log('error returning home', err);
    }
  };

  const activityLinks = quickLinks.map((link) => (
      <a
        key={link}
        href={`/${link}`}
        className={cx(classes.link, { [classes.linkActive]: active === link })}
        onClick={(e) => handleFilterPosts({type: 'tags', value: link}, e)}
      >
        {link}
      </a>
  ));

  // could use switch/case for clicking on diff links

  return (
    <Header height={HEADER_HEIGHT} mb={32} className={classes.root}>
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
              href={bucketListLink.link}
              className={cx(classes.link, { [classes.linkActive]: active === bucketListLink.link })}
              onClick={(e) => {e.preventDefault; handleFilterPostsByBucketList(e)}} disabled={!isLoggedIn}
            >
              {bucketListLink.label}
              <span
                className={classes.popup} id="myPopup"
                style={{ visibility: hidePopUp ? 'hidden' : 'visible', transition: 'visibility 5s', display: isLoggedIn ? 'none' : 'block' }}
              >
                Must be logged in to filter by posts saved to your bucket list.
              </span>
            </a>

            {activityLinks}


          </Group>

          <Autocomplete
              classNames={{root: classes.search}}
              placeholder="search by activity"
              rightSection={<SearchIcon
              search={search}
              handleFilterPosts={handleFilterPosts}
              />}
              zIndex={101}
              data={tags} // can make these dynamic to last searched for user -- think may automatically be
              value={search}
              positionDependencies={[active]}
              onChange={setSearch}
              // onBlur={setSearch(filter.value)}
              onKeyPress={(e) => {if (e.key === 'Enter') {handleFilterPosts({type: 'tags', value: search}, e)}}}
              onItemSubmit={item => {const searchTerm = item.value; setSearch(searchTerm); handleFilterPosts({type: 'tags', value: searchTerm})}}
            />

          <Burger opened={opened} onClick={toggle} title="Open navigation" aria-label="Open navigation" className={classes.burger} size="sm" />

          <Transition transition="pop-top-right" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                <a
                  href={home.link}
                  className={cx(classes.link, { [classes.linkActive]: active === home.link })}
                  onClick={(e) => handleClickHome(e)}
                >
                  {home.label}
                </a>
                <a
                  href={bucketListLink.link}
                  className={cx(classes.link, { [classes.linkActive]: active === bucketListLink.link })}
                  onClick={(e) => handleFilterPostsByBucketList(e)}
                >
                {bucketListLink.label}
                </a>
                {activityLinks}
              </Paper>
            )}
          </Transition>
      </Container>
    </Header>
  );
};


