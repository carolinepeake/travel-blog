import { React, useState } from 'react';
import axios from 'axios';
import { createStyles, Card, Image, ActionIcon, Group, Text, Avatar, Badge } from '@mantine/core';
import { IconHeart } from '@tabler/icons';

const useStyles = createStyles((theme, _params, getRef) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    position: 'relative',
    zIndex: '1',
    overflow: 'visible',
  },

  close: {
    position: 'absolute',
    zIndex: '2',
    fontSize: theme.fontSizes.xs,
    right: 10,
    top: 1,
    paddingTop: 0,

    '&:hover': {
      cursor: 'pointer',
    },
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
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

  tooltip: {
    ref: getRef('tooltip'),
    visibility: 'hidden',
    width: '100px',
    backgroundColor: 'black',
    color: '#fff',
    textAlign: 'center',
    padding: '5px 0',
    borderRadius: '6px',
    position: 'absolute',
    zIndex: '3',
    top: '-100%',
    left: '-100%',
    marginLeft: '-50px', /* Use half of the width to center the tooltip */
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
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
  },

  avatarImage: {
    borderRadius: '50%',
    objectFit: 'cover',
    aspectRatio: '1',
    position: 'relative',
  },
}));

// if post is liked by user, should have a red heart upon refresh

export default function Post({ post, index, posts, setPosts, user }) {
  const { classes, theme, getRef } = useStyles();
  const [liked, setIsLiked] = useState(false);
  const [tooltipText, setTooltipText] = useState('add to bucket list');
  const date =  new Date(post.createdAt);

  // might want to move this up a level or two to make axios requests unified
  // might not need to include post in parameters here
  const handleDeletePost = async (post, e) => {
    // may not be necessary
    e.preventDefault();
    try {
      // could handle authorization w/o even sending request maybe
      // const authorization =
      const response = await axios.delete(`http://localhost:3001/posts/${post._id}`
      // , {
        // headers: {
          // need to make sure authorized to delete post - authorized if logged in as user who made post
      //     authorization:
      //   }
      // }
      );
      console.log(`post ${post._id} deleted successfully`, response.data);
      setPosts(() => {
        posts.splice(index, 1);
        return posts;
      });
    } catch (err) {
      console.log(`error deleting post ${post._id}`, err);
    }
  };

  const handleClickHeart = async () => {
    if (liked) {
      try {
        let response = await axios.put(`http://localhost:3001/users/${user._id}/unlike/${post._id}`);
        console.log('response from handleClickHear', response);
        setIsLiked(false);
        setTooltipText('add to bucketlist');
        // if view filtered to only bucket list items, remove from view
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

  return (
    <Card withBorder p="lg" radius="md" className={classes.card}>

       <span className={classes.close} post={post} onClick={(e) => handleDeletePost(post, e)}>x</span>

      <Card.Section mb="sm">
        <div height={180}/>
       <Image src={post.photos[0]} alt={post.title} height={180}/>
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text size="lg" weight={500}>
            {post.title}
          </Text>
          <ActionIcon className={classes.like} onClick={e => handleClickHeart(e)}>
            <IconHeart className={classes.heart} size={18} color={theme.colors.red[6]} stroke={1.5} style={{ fill: liked ? theme.colors.red[6] : 'none' }}/>
            <span className={classes.tooltip}>{tooltipText}</span>
          </ActionIcon>
        </Group>
        {post.location
        && <Badge size="sm">{post.location.country}</Badge>}
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
            <Badge key={i} className={classes.tag}>{tag}</Badge>
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
            src={post.author.image} radius="sm" alt={post.author.name} classNames={{ root: classes.avatarContainer, image: classes.avatarImage }}/>
            <Text weight={200}>{post.author.name}</Text>
            </>
            )}

          </div>
          <Text size="xs" color="dimmed">{date.toLocaleDateString()}</Text>
      </Group>
      </Card.Section>
    </Card>
  );
};
