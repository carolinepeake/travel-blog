import { React, useState } from 'react';
import { createStyles, Card, Image, ActionIcon, Group, Text, Avatar, Badge } from '@mantine/core';
import { IconHeart } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
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


export default function Post({ post }) {
  const { classes, theme } = useStyles();

  return (
    <Card withBorder p="lg" radius="md" className={classes.card}>
      <Card.Section mb="sm">
        <div height={180}/>
       {/*<Image src={image} alt={title} height={180}/>*/}
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
        <Badge size="sm">{post.country}</Badge>
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
            <Badge key={i} className={classes.tag}>{tag}</Badge>
          ))}
        </Group>
      </Card.Section>

      <Card.Section className={classes.footer}>
        <Group position="apart">
          <div>
            <Avatar src={post.author.image} radius="sm" />
            <Text weight={200}>{post.author.name}</Text>
          </div>
          <Text size="xs" color="dimmed">{post.created_at}</Text>
      </Group>
      </Card.Section>
    </Card>
  );
}
