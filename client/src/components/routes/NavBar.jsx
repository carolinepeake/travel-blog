import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { createStyles, Header, Container, Group, Paper, Transition, Burger, Autocomplete } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons';

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
}));

export default function NavBar({ links }) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState('/');
  const { classes, cx } = useStyles();

   // prolly don't need to link to a different page with the NavBar, but just change the state
  // and update the posts rendered based on state.tagSelected

  (links) && (
  const items = links.map((link) => {
    console.log(link.link, typeof link.link);
    return (
      <nav>
        <a
          key={'home'}
          component={Link}
          to={'/'}
          className={cx(classes.link, { [classes.linkActive]: active === '/' })}
          onClick={(event) => {
            event.preventDefault();
            setActive('home');
            close();
          }}
        >
        {'home'}
        </a> | {" "}
        <a
          key={link.label}
          component={Link}
          to={link.link}
          className={cx(classes.link, { [classes.linkActive]: active === link.link })}
          onClick={(event) => {
            event.preventDefault();
            setActive(link.link);
            close();
          }}
        >
          {link.label}
        </a>
      </nav>
    )
  });
  )



  return (
    <Header height={HEADER_HEIGHT} mb={120} className={classes.root}>
      <Container className={classes.header}>
          <Group spacing={10} className={classes.links}>
            {items}
          </Group>
          <Autocomplete
              className={classes.search}
              placeholder="Search"
              icon={<IconSearch size={16} stroke={1.5} />}
              data={['snowboarding', 'europe', 'brazil', 'march']} // can make these dynamic to last searched for user
            />

          <Burger opened={opened} onClick={toggle} title="Open navigation" aria-label="Open navigation" className={classes.burger} size="sm" />

          <Transition transition="pop-top-right" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
              </Paper>
            )}
          </Transition>
          <Outlet />
      </Container>
    </Header>
  );
}