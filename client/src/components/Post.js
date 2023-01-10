import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, Card, Image, ActionIcon, Group, Text, Avatar, Badge } from '@mantine/core';
import { IconHeart, IconChevronRight, IconChevronLeft} from '@tabler/icons';
import { deletePost, selectFilteredPostById, filterSet, fetchPosts, selectFilter } from '../state/postsSlice.js';
import { selectUser, selectLoggedInState, unlikePost, likePost, selectBucketList } from '../state/usersSlice.js';

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
  const [liked, setIsLiked] = useState(false);
  const [tooltipText, setTooltipText] = useState('add to bucket list');

  const content = useRef();
  const [gridRowSpan, setGridRowSpan] = useState(0);

  function resizePost() {
    const contentHeight = parseInt(window
      .getComputedStyle(content.current)
      .getPropertyValue("height"));
    let rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    setGridRowSpan(rowSpan);
  };

  useEffect(() => {
    resizePost()
  }, [rowHeight, rowGap, content.current]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [deletePostRequestStatus, setDeletePostRequestStatus] = useState('idle')
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectLoggedInState);

  const post = useSelector((state) => selectFilteredPostById(state, postId));
  const filter = useSelector(selectFilter);
  const bucketList = user.bucketList;

  const date =  new Date(post.createdAt);

  useEffect(() => {
    console.log('isLoggedIn: ', isLoggedIn);
    if (isLoggedIn === true) {
      console.log('getting effects');
      let bucketListLength = user.bucketList.length;
      for (let i = 0; i < bucketListLength; i++) {
        if (user.bucketList[i] === post._id) {
          setIsLiked(true);
          setTooltipText('remove from bucket list');
          break;
        }
        else {
          setTooltipText('add to bucket list');
        }
      }
    }
    if (isLoggedIn === false) {
      setTooltipText('please log in to add posts to your bucket list');
      setIsLiked(false);
    }
  }, [isLoggedIn, user]);

  const canDelete = user.email === post.author.email;

  const handleDeletePost = async (e) => {
    e.preventDefault();
    console.log('post id to delete: ', post._id);
    if (canDelete) {
      try {
        setDeletePostRequestStatus('pending');
        const response = await dispatch(deletePost(post._id)).unwrap();
        // dispatch(fetchPosts());
        console.log(`post ${post._id} deleted successfully`, response.data);
      } catch (err) {
        console.error(`error deleting post ${post._id}`, err);
      } finally {
        setDeletePostRequestStatus('idle');
      }
    }
  };

  const canClickHeart = isLoggedIn;

  const handleClickHeart = async (e) => {
    e.preventDefault();
    console.log('postId: ', postId);
    if (canClickHeart) {
      if (liked) {
        try {
          // isn't catching errors - need to unwrap
         const unlikePostResponse = await dispatch(unlikePost({user: user._id, post: post._id}));
          console.log('response from handleClickHeart',  unlikePostResponse);
          setIsLiked(false);
          setTooltipText('add to bucketlist');
          // return unlikePostResponse
          // .then((unlikePostResponse) => {
            if (filter.type === 'bucketList') {
              let newBucketList = unlikePostResponse.payload.bucketList;
              dispatch(filterSet({type: 'bucketList', value: newBucketList}));
              dispatch(fetchPosts());
            }
            return newBucketList;
          // })
          // .catch(err => console.log('error setting newbucketList: ', err))
          // if (view === 'bucketlist') {
          //   let old = [...posts];
          //   setPosts(() => {
          //     old.splice(index, 1);
          //     return old;
          //   })
          // }
        } catch (err) {
          console.log(`error removing ${post.title} from bucket list`, err);
        }
      } else {
        try {
          // isn't catching error liking post
          // response is {type: 'users/likePost/rejected', payload: undefined, meta: ...}
          const likePostResponse = await dispatch(likePost({user: user._id, post: postId}));
          console.log('response from handleClickHeart',  likePostResponse);
          setIsLiked(true);
          setTooltipText('remove from bucketlist');
        } catch (err) {
          console.log(`error adding ${post.title} to bucket list`, err);
        }
      }
    }
  };

  // could do action types scroll forward and scroll back

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

 // journal:
// if (content.current) {
//   console.log('content current style: ',  content.current.style, 'content: ', content, 'type of content: ', typeof content);
// }

  const handleFilterPosts = (filter = {}, e) => {
    e && e.preventDefault();
    dispatch(filterSet(filter));
  };

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
        && <ActionIcon className={classes.close} onClick={(e) => handleDeletePost(e)}>x</ActionIcon>}
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
        <Group position="apart">
          <Text size="lg" weight={500}>
            {post.title}
          </Text>
          <ActionIcon className={classes.like}
          onClick={e => handleClickHeart(e)}
          disabled={!isLoggedIn}
          >
            <IconHeart className={classes.heart} size={18} color={theme.colors.red[6]} stroke={1.5} style={{ fill: liked ? theme.colors.red[6] : 'none' }}/>
            <span className={classes.tooltip}>{tooltipText}</span>
          </ActionIcon>
        </Group>
        <Group>
          {post.city
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts({city: post.city}, e)}>{post.city}</Badge>}
          {post.state
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts({state: post.state}, e)}>{post.state}</Badge>}
          {post.country
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts({country: post.country}, e)}>{post.country}</Badge>}
          {post.region
          && <Badge className={classes.tag} size="sm" onClick={(e) => handleFilterPosts({region: post.region}, e)}>{post.region}</Badge>}
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
            <Badge key={i} className={classes.tag} onClick={(e) => handleFilterPosts({tags: tag}, e)} >{tag}</Badge>
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
            onClick={(e) => handleFilterPosts({author: post.author._id}, e)}/>
            <Text weight={200} onClick={(e) => handleFilterPosts({author: post.author._id}, e)} className={classes.authorName}>{post.author.name} </Text>
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