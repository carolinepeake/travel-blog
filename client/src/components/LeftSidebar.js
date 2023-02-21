import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Aside, createStyles, Stack, Button, Modal, Tooltip } from '@mantine/core';
import { Calendar } from '@mantine/dates';

import { selectLoggedInState } from '../state/usersSlice.js';
import AddPost from './AddPost/AddPost.js';
import UserLogin from './AuthenticateUser/UserLogin';
import UserProfile from './AuthenticateUser/UserProfile';

const useStyles = createStyles((theme, _params, getRef) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },

  userButtons: {
    align: 'center',
    justify: 'space-around',
    height: 300,
  },

  button: {
    borderRadius: theme.radius.lg,
    color: theme.colorScheme === 'dark' ? theme.primaryColor[4] : theme.colors.brown[6],

    '&:hover': {
      cursor: 'pointer',
    },

    [`&:hover .${getRef('tooltipSpan')}`]: {
      visibility: 'visible',
    },

    '&[data-disabled]': {
      pointerEvents: 'all',
       '&:hover': {
        cursor: 'not-allowed',
        },
      '&:last-child': {
         backgroundColor: theme.colorScheme === 'dark' ? theme.colors.brown[6] : theme.colors.green[0],
         color: theme.colorScheme === 'dark' ? theme.primaryColor[4] : theme.colors.brown[6],
      },
    },

    '&:first-child': {
      marginTop: theme.spacing.md,
    },
  },

  tooltipSpan: {
    ref: getRef('tooltipSpan'),
    visibility: 'hidden',
    width: '160px',
    backgroundColor: 'white',
    color: 'black',
    textAlign: 'center',
    padding: '5px 2.5px',
    // borderRadius: '3px',
    borderRadius: theme.radius.sm,
    position: 'absolute',
    zIndex: '3',
    top: '-40%',
    left: '30%',
    marginLeft: '-80px', /* Use half of the width to center the tooltip */
    fontSize: theme.fontSizes.xs,
    border: 'solid black thin',
  },

}));

const DISABLED_BUTTONS_TEXT=['Plan a trip', 'Upcoming trips', 'Past trips'];

export default function LeftSidebar() {
  const { classes, cx, getRef } = useStyles();

  const [addPostOpened, setAddPostOpened] = useState(false);

  const isLoggedIn = useSelector(selectLoggedInState);

  const userSidebar = isLoggedIn ? <UserProfile /> : <UserLogin />;

  const disabledButtons = DISABLED_BUTTONS_TEXT.map((buttonText) => (
    <Button key={buttonText} variant="outline" size="lg" className={classes.button}
    disabled
    onClick={(event) => event.preventDefault()}
    >
      {buttonText}
      <span className={classes.tooltipSpan}>Feature Coming Soon</span>
    </Button>
  ));

  return (
  <>
    <Modal
      opened={addPostOpened}
      onClose={() => setAddPostOpened(false)}
      title="New Post:"
      >
      <AddPost
      setAddPostOpened={setAddPostOpened} />
    </Modal>

    <Aside className={classes.root} width={{ base: 300 }} p="xs">

      <Aside.Section>

        {userSidebar}

      </Aside.Section>

      <br/>

      <Aside.Section>
        <Calendar />
      </Aside.Section>

      <br />

      <Aside.Section>
        <Stack className={classes.userButtons} spacing="lg">
         {disabledButtons}
          <Button variant="outline" size="lg" className={classes.button} type="button"
          disabled={!isLoggedIn}
          onClick={(event) => { event.preventDefault(); setAddPostOpened(true)}}
          >Add a post
            <span className={classes.tooltipSpan}
            style={{ display: isLoggedIn ? 'none' : 'block' }}
            >Log in to add a post</span>
          </Button>
        </Stack>
      </Aside.Section>

    </Aside>
  </>
  );
};



