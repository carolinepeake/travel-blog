import { React, useState } from 'react';
import axios from 'axios';
import { createStyles, Card, Image, ActionIcon, Group, Text, Avatar, Badge } from '@mantine/core';
import { IconHeart } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    position: 'relative',
    zIndex: '1',
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
    color: theme.colors.red[6],
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
}));



export default function Post({ post, index, posts, setPosts }) {
  const { classes, theme } = useStyles();

  // might want to move this up a level or two to make axios requests unified
  const handleDeletePost = async (post, e) => {
    axios.delete('/posts', { data: { _id: post._id } })
    .then((res) => {
      console.log(`post ${post._id} deleted successfully`, res.data);
      setPosts(() => {
        posts.splice(index, 1);
        return posts;
      });
    })
    .catch((err) => {
      console.log(`error deleting post ${post._id}`, err);
    })
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
          <ActionIcon>
            <IconHeart size={18} color={theme.colors.red[6]} stroke={1.5} />
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
            src={post.author.image} radius="sm" />
            <Text weight={200}>{post.author.name}</Text>
            </>
            )}

          </div>
          {/* <Text size="xs" color="dimmed">{post.createdAt.toLocaleDateString()}</Text> */}
      </Group>
      </Card.Section>
    </Card>
  );
};
