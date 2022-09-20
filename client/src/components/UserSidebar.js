import { useState } from 'react';
//make alphabetical
import { Aside, createStyles, Avatar, Stack, Button, Container, Box, Center, Modal, Text, Group } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import AddPost from './AddPost/AddPost.js';
import AuthenticateUser from './AuthenticateUser';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },

  profile: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
  },

  logout: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    textAlign: 'right',
    alignSelf: 'right',

    '&:hover': {
      backgroundColor: theme. colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
}));

export default function UserSidebar({user, setUser}) {
  const { classes, cx } = useStyles();
  const [opened, setOpened] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleAddPost(e) {

  };

  function handleLogout(e) {
    setIsLoggedIn(false);
    setUser({});
    localStorage.clear();
  };

  return (
  <>
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Add a post!"
      >
      <AddPost user={user} setUser={setUser}/>
    </Modal>
    <Aside className={classes.root} width={{ base: 300 }} p="xs">
      <Aside.Section style={{ display: isLoggedIn ? 'block' : 'none' }}>
        <Box>
          <Avatar size="xl * 10"></Avatar>
        </Box>
        <Group style={{alignItems: 'space between'}}>
          <Text span className={classes.profile}>logged in as {user.name}</Text>
          <Text
            span
            // className={classes.profile}
            className={cx(classes.logout)}
            onClick={(e) => handleLogout(e)}>logout</Text>
        </Group>
      </Aside.Section>
      <Aside.Section style={{ display: isLoggedIn ? 'none' : 'block' }}>
        <AuthenticateUser user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </Aside.Section>
      <Aside.Section>
        <Calendar />
      </Aside.Section>
      <Aside.Section>
        <Stack align="center" justify="space-around" spacing="xs" sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0], height: 300 })}>
          <Button variant="outline" color="cyan" radius="lg" size="md">plan a trip</Button>
          <Button variant="outline" color="cyan" radius="lg" size="md">upcoming trips</Button>
          <Button variant="outline" color="cyan" radius="lg" size="md">past trips</Button>
          <Button variant="outline" color="cyan" radius="lg" size="md" onClick={() => setOpened(true)}>add a post</Button>
        </Stack>
      </Aside.Section>
    </Aside>
  </>
  )
}


