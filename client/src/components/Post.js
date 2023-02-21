import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, Card, Image, ActionIcon, Group, Text, Avatar, Badge } from '@mantine/core';
import { IconHeart, IconChevronRight, IconChevronLeft } from '@tabler/icons';

import { deletePost, selectPostById, filterSet, fetchPosts } from '../state/postsSlice.js';
import { selectUser, selectLoggedInState, unlikePost, likePost } from '../state/usersSlice.js';

const useStyles = createStyles((theme, _params, getRef) => ({

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
    width: '80%',
  },

  like: {
    position: 'relative',
    display: 'inline-block',
    alignSelf: 'flex-start',
    '&:hover': {
      cursor: 'pointer',
    },
    [`&:hover .${getRef('tooltip')}`]: {
      visibility: 'visible',
    },
  },

  heart: {
    color: theme.colors.red[6],
  },

  scroll: {
    position: 'absolute',
    zIndex: '2',
    // use property to define whether right or left, might have to do right 98%
    // right: '2%',
    top: '50%',
    '&:hover': {
      cursor: 'pointer',
    },
    color: 'black',
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

export const Post = ({ postId, grid, rowGap, rowHeight }) => {
  const { classes, theme, getRef } = useStyles();
  const [likePostRequestStatus, setLikePostRequestStatus] = useState('idle');
  const [unlikePostRequestStatus, setUnlikePostRequestStatus] = useState('idle');

  //dont use filter for bucketlist, instead memoize a selector that just selects user's bucketlist based on user and then filter to that view in feed  (same with home)

  const post = useSelector((state) => selectPostById(state, postId));

  const content = useRef();
  const [gridRowSpan, setGridRowSpan] = useState(0);

  function resizePost() {
    const contentHeight = parseInt(window
      .getComputedStyle(content.current)
      .getPropertyValue("height"));
    let rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    rowSpan++;
    setGridRowSpan(rowSpan);
  };

  useEffect(() => {
    resizePost()
  }, [rowHeight, rowGap, content.current]);

  const cardHeight = (gridRowSpan - 1) * rowHeight + (gridRowSpan - 3) * rowGap;

  const [deletePostRequestStatus, setDeletePostRequestStatus] = useState('idle');

  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const canDelete = user._id === post.author._id;

  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (canDelete) {
      try {
        setDeletePostRequestStatus('pending');
        const response = await dispatch(deletePost(post._id)).unwrap();
        console.log(`post ${post._id} deleted successfully`, response);
      } catch (err) {
        console.error(`error deleting post ${post._id}`, err);
      } finally {
        setDeletePostRequestStatus('idle');
      }
    }
  };

  const [photoIndex, setPhotoIndex] = useState(0);

  function handleScrollPhotos(direction) {
    let newIndex = photoIndex + direction;
    if (newIndex === -1) {
      newIndex = post.photos.length - 1;
    }
    if (newIndex > post.photos.length -1) {
      newIndex = 0;
    }
    setPhotoIndex(newIndex);
  };

  const isLoggedIn = useSelector(selectLoggedInState);

  // could memoize selectBucketList and select postId to create a likedPosts selector and then render conditionally with isLoggenIn

  const toolTipText = !isLoggedIn ? 'please log in to add posts to your bucket list' : user.bucketList.includes(post._id) ? 'remove from bucket list' : 'add to bucket list';

  const liked = !isLoggedIn ? false : user.bucketList.includes(postId) ? true : false;

  const canClickHeart = isLoggedIn && likePostRequestStatus === 'idle' && unlikePostRequestStatus === 'idle';

  const handleClickHeart = async (e) => {
    e.preventDefault();
    if (canClickHeart) {
      if (liked) {
        try {
          setUnlikePostRequestStatus('pending');
          await dispatch(unlikePost({user: user._id, post: post._id})).unwrap();
        } catch (err) {
          console.log(`error removing ${post._id} from bucket list`, err);
        } finally {
          setUnlikePostRequestStatus('idle');
        }
      } else {
        try {
          setLikePostRequestStatus('pending');
          await dispatch(likePost({user: user._id, post: postId}));
        } catch (err) {
          console.log(`error adding ${post.title} to bucket list`, err);
        } finally {
          setLikePostRequestStatus('idle');
        }
      }
    }
  };

 // journal:
// if (content.current) {
//   console.log('content current style: ',  content.current.style, 'content: ', content, 'type of content: ', typeof content);
// }

  const handleFilterPosts = (filter = {}, e) => {
    e && e.preventDefault();
    dispatch(filterSet(filter));
  };

  const date =  new Date(post.createdAt);

  return (
  <article
     onResize={() => resizePost()}
    //  onResize={() => resizeAllGridItems()}
    // id={post._id}
    style={{ gridRowEnd: `span ${gridRowSpan}` }}
    >

    <Card
      sx={{ height: `${cardHeight}px` }}
      withBorder
      p="lg"
      radius="md"
      className={classes.card}
      ref={content}
      >

      <Card.Section mb="sm" className={classes.section} style={{padding: 0}}>
        <div height={180}/>
        {user._id === post.author._id
        &&
        <ActionIcon className={classes.close} onClick={(e) => handleDeletePost(e)}>x</ActionIcon>}

        {post.photos.length > 1
        && (
            <>
              <ActionIcon className={classes.scroll} style={{right: '2%'}} onClick={() => handleScrollPhotos(1)}>
                <IconChevronRight />
              </ActionIcon>
              <ActionIcon className={classes.scroll} style={{left: '2%'}} onClick={() => handleScrollPhotos(-1)}>
                <IconChevronLeft />
              </ActionIcon>
            </>
           )
        }
       <Image src={post.photos[photoIndex]} alt={post.title} height={180} classNames={{image: classes.image}}/>
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart" mb="xs">

          <Text size="lg" weight={500} mb={0} className={classes.title}>
            {post.title}
          </Text>

          <ActionIcon
            className={classes.like}
            onClick={e => handleClickHeart(e)}
            disabled={!isLoggedIn}
            sx={{
              '&[data-disabled]': { backgroundColor: 'transparent', border: 'none', color: 'transparent' }
            }}
          >
            <IconHeart
              className={classes.heart}
              size={18}
              stroke={1.5}
              style={{ fill: liked ? theme.colors.red[6] : 'none' }}
            />
            <span className={classes.tooltip}>{toolTipText}</span>
          </ActionIcon>

        </Group>

        <Group>
          {post.city
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts({type: 'city', value: post.city}, e)}>{post.city}</Badge>}
          {post.state
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts({type: 'state', value: post.state}, e)}>{post.state}</Badge>}
          {post.country
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts({type: 'country', value: post.country}, e)}>{post.country}</Badge>}
          {post.region
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts({type: 'region', value: post.region}, e)}>{post.region}</Badge>}
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
            // may want to save tags separately so have id other than index (unique id) // or can create unique id
            <Badge key={i} className={classes.tag} onClick={(e) => handleFilterPosts({type: 'tags', value: tag}, e)} >{tag}</Badge>
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
                  src={post.author.image}
                  radius="sm"
                  alt={post.author.name}
                  classNames={{ root: classes.avatarContainer, image: classes.avatarImage }}
                  onClick={(e) => handleFilterPosts({type: 'author', value: post.author._id}, e)}
                />
                <Text
                  weight={200}
                  onClick={(e) => handleFilterPosts({type: 'author', value: post.author._id}, e)}
                  className={classes.authorName}
                >
                  {post.author.name}
                </Text>
              </>
            )}
          </div>

          <Text size="xs" color="dimmed">{date.toLocaleDateString()}</Text>

      </Group>
      </Card.Section>
    </Card>
  </article>
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