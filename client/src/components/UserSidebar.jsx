import { useState } from 'react';
import { Aside, createStyles, Avatar, Stack, Button, Container, Box, Center } from '@mantine/core';
import { Calendar } from '@mantine/dates';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },
}));

export default function UserSidebar() {
  const { classes, cx } = useStyles();
  const [opened, setOpened] = useState(false);

  return (
    <Aside className={classes.root} width={{ base: 300 }} p="xs">
      <Aside.Section>
        <Box>
          <Avatar size="xl * 10"></Avatar>
        </Box>
      </Aside.Section>
      <Aside.Section>
        <Calendar />
      </Aside.Section>
      <Aside.Section>
        <Stack align="center" justify="space-around" spacing="xs" sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0], height: 300 })}>
          <Button variant="outline" color="cyan" radius="lg" size="md">plan a trip</Button>
          <Button variant="outline" color="cyan" radius="lg" size="md">upcoming trips</Button>
          <Button variant="outline" color="cyan" radius="lg" size="md">past trips</Button>
        </Stack>
      </Aside.Section>
    </Aside>
  )
}



