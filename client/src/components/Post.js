import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { createStyles, Card, Image, ActionIcon, Group, Text, Avatar, Badge } from '@mantine/core';
import { IconHeart, IconChevronRight, IconChevronLeft} from '@tabler/icons';

const useStyles = createStyles((theme, _params, getRef) => ({

  // item: {
  // },

  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    position: 'relative',
    zIndex: '1',
    overflow: 'visible',
    maxWidth: '280px',
  },

  close: {
    position: 'absolute',
    zIndex: '2',
    fontSize: theme.fontSizes.md,
    right: 10,
    top: 1,
    paddingTop: 0,
    color: 'black',
    '&:hover': {
      cursor: 'pointer',
      fontWeight: 'bold',
    },

  },

  image: {
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    // borderRadius: `${theme.radius.md} ${theme.radius.md} 0 0`,
    //position: 'relative',
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    position: 'relative',
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  like: {
    position: 'relative',
    display: 'inline-block',
    '&:hover': {
      cursor: 'pointer',
    },
    [`&:hover .${getRef('tooltip')}`]: {
      visibility: 'visible',
    },
  },

  heart: {
  },

  scrollRight: {
    position: 'absolute',
    zIndex: '2',
    right: '2%',
    top: '50%',
    '&:hover': {
      cursor: 'pointer',
    },
  },

  scrollLeft: {
    position: 'absolute',
    zIndex: '2',
    left: '2%',
    top: '50%',
    '&:hover': {
      cursor: 'pointer',
    },
  },

  tooltip: {
    ref: getRef('tooltip'),
    visibility: 'hidden',
    width: '110px',
    backgroundColor: 'white',
    color: 'black',
    textAlign: 'center',
    padding: '5px 2.5px',
    borderRadius: '3px',
    position: 'absolute',
    zIndex: '3',
    top: '-80%',
    left: '-100%',
    marginLeft: '-80px', /* Use half of the width to center the tooltip */
    fontSize: theme.fontSizes.xs,
    border: 'solid black thin',
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },

  tag: {
    '&:hover': {
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    },
  },

  footer: {
    padding: `${theme.spacing.xs}px ${theme.spacing.lg}px`,
    marginTop: 0,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  avatarContainer: {
    overflow: 'hidden',
    borderRadius: '50%',
    '&:hover': {
      cursor: 'pointer',
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
      transform: 'scale(1.1)',
    },
  },

  avatarImage: {
    borderRadius: '50%',
    objectFit: 'cover',
    aspectRatio: '1',
    position: 'relative',
  },

  authorName: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },

}));

export const Post = ({ post, index, posts, setPosts, user, grid, rowGap, rowHeight, isLoggedIn, handleFilterPosts }) => {
  const { classes, theme, getRef } = useStyles();
  const [liked, setIsLiked] = useState(false);
  const [tooltipText, setTooltipText] = useState('add to bucket list');
  const date =  new Date(post.createdAt);
  const content = useRef();
  const [gridRowSpan, setGridRowSpan] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);


  console.log('post: ', post, 'user', user);

  // might want to move this up a level or two to make axios requests unified
  // might not need to include post in parameters here
  const handleDeletePost = async (post, e) => {
    // may not be necessary
    e.preventDefault();
    try {
      const response = await axios.delete(`http://localhost:3001/posts/${post._id}`);
      console.log(`post ${post._id} deleted successfully`, response.data);
      let old = [...posts];
      await setPosts(() => {
        old.splice(index, 1);
        return old;
      });
    } catch (err) {
      console.log(`error deleting post ${post._id}`, err);
    }
  };

  const handleClickHeart = async () => {
    if (liked) {
      try {
        let response = await axios.put(`http://localhost:3001/users/${user._id}/unlike/${post._id}`);
        console.log('response from handleClickHeart', response);
        setIsLiked(false);
        setTooltipText('add to bucketlist');
        if (view === 'bucketlist') {
          let old = [...posts];
          setPosts(() => {
            old.splice(index, 1);
            return old;
          })
        }
      } catch (err) {
        console.log(`error removing ${post.title} from bucket list`, err);
      }
    } else {
      try {
      let response = await axios.put(`http://localhost:3001/users/${user._id}/like/${post._id}`);
      console.log('response from handleClickHear', response);
       setIsLiked(true);
       setTooltipText('remove from bucketlist');
     } catch (err) {
       console.log(`error adding ${post.title} to bucket list`, err);
     }
    }
  };

  useEffect(() => {
    console.log('isLoggedIn: ', isLoggedIn);
    if (isLoggedIn === true) {
      console.log('getting effects');
      let bucketListLength = user.bucketList.length;
      for (let i = 0; i < bucketListLength; i++) {
        if (user.bucketList[i] === post._id) {
          setIsLiked(true);
        }
      }
    }
    if (isLoggedIn === false) {
      setTooltipText('please log in to add posts to your bucket list');
    }
  }, [isLoggedIn]);

  // could do action types scroll forward and scroll back

  function handleScrollPhotos(direction) {
    let newIndex = photoIndex + direction;
    if (newIndex === -1) {
      newIndex = post.photos.length - 1;
    }
    if (newIndex > post.photos.length -1) {
      newIndex = 0;
    }
    // if (photoIndex < post.photos.length - 1) {
    //   setPhotoIndex((current) => (current + 1));
    // } else if (photoIndex === post.photos.length - 1) {
    //   setPhotoIndex(0);
    // } else {
    //   setPhotoIndex(newIndex);
    // };
    setPhotoIndex(newIndex);
  };

 // journal:
// if (content.current) {
//   console.log('content current style: ',  content.current.style, 'content: ', content, 'type of content: ', typeof content);
// }

const handleFilterByAuthor = async (e) => {
  e.preventDefault();
  try {
    console.log('author id: ', post.author._id);
    let response = await axios.get(`http://localhost:3001/posts/user/${post.author._id}`);
    console.log('response from filter posts by author: ', response);
    setPosts(response.data);
  } catch (err) {
    console.log('error filtering posts by author', err);
  }
};

  function resizePost() {
    const contentHeight = parseInt(window
      .getComputedStyle(content.current)
      .getPropertyValue("height"));
    let rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    setGridRowSpan(rowSpan);
  };

  useEffect(() => {
    resizePost()
  }, []);

  // maybe make div an article element
  return (
  <div
    // className={classes.item}
     onResize={() => resizePost()}
    //  onResize={() => resizeAllGridItems()}
    //  id={post._id}
     style={{ gridRowEnd: `span ${gridRowSpan}` }}>

    <Card
      withBorder p="lg"
      radius="md"
      className={classes.card}
      // id="card"
      ref={content}
      >

      <Card.Section mb="sm" className={classes.section} style={{padding: 0}}>
        <div height={180}/>
        {user.email === post.author.email
        && <ActionIcon className={classes.close} post={post} onClick={(e) => handleDeletePost(post, e)}>x</ActionIcon>}
        {post.photos.length > 1
        && (
            <>
              <ActionIcon className={classes.scrollRight} onClick={() => handleScrollPhotos(1)}>
                <IconChevronRight />
              </ActionIcon>
              <ActionIcon className={classes.scrollLeft} onClick={() => handleScrollPhotos(-1)}>
                <IconChevronLeft />
              </ActionIcon>
            </>
           )
        }
       <Image src={post.photos[photoIndex]} alt={post.title} height={180} classNames={{image: classes.image}}/>
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text size="lg" weight={500}>
            {post.title}
          </Text>
          <ActionIcon className={classes.like} onClick={e => handleClickHeart(e)} style={{disabled: isLoggedIn ? 'false' : 'true' }}>
            <IconHeart className={classes.heart} size={18} color={theme.colors.red[6]} stroke={1.5} style={{ fill: liked ? theme.colors.red[6] : 'none' }}/>
            <span className={classes.tooltip}>{tooltipText}</span>
          </ActionIcon>
        </Group>
        <Group>
          {post.location.city
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts('city', post.location.city, e)}>{post.location.city}</Badge>}
          {post.location.state
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts('state', post.location.state, e)}>{post.location.state}</Badge>}
          {post.location.country
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts('country', post.location.country, e)}>{post.location.country}</Badge>}
          {post.region
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts('region', post.location.region, e)}>{post.region}</Badge>}
        </Group>
        <Text size="sm" mt="xs">
          {post.description}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} color="dimmed">
          Perfect for you, if you enjoy
        </Text>
        <Group spacing={7} mt={5}>
          {post.tags &&
          post.tags.map((tag, i) => (
            // may want to save tags separately so have id other than index (unique id)
            <Badge key={i} className={classes.tag} onClick={(e) => handleFilterPosts('tags', tag, e)} >{tag}</Badge>
          ))}
        </Group>
      </Card.Section>

      <Card.Section className={classes.footer}>
        <Group position="apart">
          <div>
            {post.author
            && (
              <>
              <Avatar
            // can make avatar HOC
            src={post.author.image} radius="sm" alt={post.author.name} classNames={{ root: classes.avatarContainer, image: classes.avatarImage }}
            onClick={(e) => handleFilterByAuthor(e)}/>
            <Text weight={200} onClick={(e) => handleFilterByAuthor(e)} className={classes.authorName}>{post.author.name} </Text>
            </>
            )}

          </div>
          <Text size="xs" color="dimmed">{date.toLocaleDateString()}</Text>
      </Group>
      </Card.Section>
    </Card>
  </div>
  );
};

// would need to move this function to Feed component (parent) and either use forwardRef() or make Post a class component to make a DOM ref to it that is usable in Feed (parent) component.  Or possibly could use getElementsByClassName but not sure
  // function resizeAllGridItems(){
  //   const allItems = document.getElementsByClassName("item");
  //   for (let x=0; x < allItems.length; x++){
  //     resizeGridItem(allItems[x]);
  //   }
  //   console.log('allItems: ', allItems);
  // };

  // function resizeInstance(instance){
  //   item = instance.elements[0];
  //   resizeGridItem(item);
  // };

// window.onload = resizeAllGridItems();

//(wasn't in blog post)
// useEffect(() => {
//   resizeAllGridItems();
// }, []);

// window.addEventListener("resize", resizeAllGridItems);

// allItems = document.getElementsByClassName("item");
// for (let x=0; x < allItems.length; x++) {
//   imagesLoaded( allItems[x], resizeInstance);
// }

// const testItem = document.getElementById(`${post._id}`);
// console.log('testItem: ', testItem, 'type of testItem: ', typeof testItem);

// return (
//   <div className={classes.item} onResize={() => resizeAllGridItems()} id={post._id} style={{ gridRowEnd: `span ${gridRowSpan}` }}>
//     <Card withBorder p="lg" radius="md" className={classes.card} id="card" ref={content}></Card>
//   </div>
// )