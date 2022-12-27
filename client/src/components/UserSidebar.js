import React, { useState, useEffect } from 'react';
import axios from 'axios';
//make alphabetical
import { Aside, createStyles, Avatar, Stack, Button, Container, Box, Center, Modal, Text, Group, Tooltip } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { useForm } from '@mantine/form';
import AddPost from './AddPost/AddPost.js';
import AuthenticateUser from './AuthenticateUser';
import EditProfileImage from './AuthenticateUser/EditProfileImage.js';

const useStyles = createStyles((theme, _params, getRef) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },

  avatarBox: {
    '&:hover': {
      cursor: 'pointer',
    },
    // [`&:hover .${getRef('tooltip')}`]: {
    //   visibility: 'visible',
    // },
    overflow: 'visible',
  },

  avatarContainer: {
    overflow: 'hidden',
  },

  avatarImage: {
    borderRadius: '50%',
    objectFit: 'cover',
    aspectRatio: '1',
    position: 'relative',
   // top: '50%',
   // transform: 'translateY(-50%)',
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

  button: {
    '&:hover': {
      cursor: 'pointer',
    },
    [`&:hover .${getRef('tooltipSpan')}`]: {
      visibility: 'visible',
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
    borderRadius: '3px',
    position: 'absolute',
    zIndex: '3',
    top: '-40%',
    left: '10%',
    marginLeft: '-80px', /* Use half of the width to center the tooltip */
    fontSize: theme.fontSizes.xs,
    border: 'solid black thin',
  },

}));

// need to make it so shows tooltip when hovering over avatar

export default function UserSidebar({ user, setUser, setPosts, isLoggedIn, setIsLoggedIn }) {
  const { classes, cx, getRef } = useStyles();
  const [addPostOpened, setAddPostOpened] = useState(false);
  const [editProfileImageOpened, setEditProfileImageOpened] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [finalUrl, setFinalUrl] = useState('');

  const form = useForm({
    initialValues: {
      image: '',
    },

    validateInputOnChange: [
      'image',
    ],
  });


  // const handleAddProfileImage = () => {
  //   setEditProfileImageOpened(true);
  //   // could make edit profile
  //   // pop up module to edit profile
  //     // same as authentication form with addition of old password input if changing password
  //   //
  // };

  const handleEditProfileImage = async () => {
    let accountBody = {
      image: form.values.image,
    };
    try {
      console.log('imageUrl from handleEditProfileImage: ', accountBody);
      let response = await axios.put(`http://localhost:3001/users/${user._id}/avatar`, accountBody);
      console.log('response from handleEditProfileImage', response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsLoggedIn(true);
      setEditProfileImageOpened(false);
      form.reset();
    } catch (err) {
      // pop up error that image size too large
      console.log('error from handleEditProfileImage in UserSidebar component: ', err);
      form.reset();
    }
    return;
  };

  useEffect(() => {
    if (finalUrl) {
      form.setFieldValue('image', finalUrl);
    }
  }, [finalUrl]);

  const handleSubmit = async (values) => {
    try {
      await handleEditProfileImage(values);
    } catch (err) {
      console.log('error creating account', err);
    }
  };

  const handleError = (errors) => {
    if (errors.image) {
      alert({ message: 'image file size must not be any larger than 64 MB'});
    };
   };

  function handleLogout(e) {
    setIsLoggedIn(false);
    setUser({});
    localStorage.clear();
  };


  // add use-focus-trap matine hook to add focus for each input element

  return (
  <>
    <Modal
      opened={addPostOpened}
      onClose={() => setAddPostOpened(false)}
      title="New Post:"
      >
      <AddPost user={user} setUser={setUser} setAddPostOpened={setAddPostOpened} setPosts={setPosts} />
    </Modal>

    <Modal
      opened={editProfileImageOpened}
      onClose={() => setEditProfileImageOpened(false)}
      title="Edit Profile Image:"
    >
       <form onSubmit={form.onSubmit(
        (values, _event) => {handleEditProfileImage(values)},
        (validationErrors, _values, _event) => {console.log(validationErrors); handleError(validationErrors)})}>
        <Stack>
          <EditProfileImage
           avatar={avatar} setAvatar={setAvatar} setFinalUrl={setFinalUrl}/>
        </Stack>
        <br />
        <Button type="submit">Update Profile Photo</Button>
      </form>
    </Modal>

    <Aside className={classes.root} width={{ base: 300 }} p="xs">

      <Aside.Section style={{ display: isLoggedIn ? 'block' : 'none' }}>
        {!user.image
        ? <Tooltip
          withArrow
          // arrowPosition="center"
          position="top-end"
          offset={-60}
          label="Add profile image"
        >
          <Box onClick={() => setEditProfileImageOpened(true)} className={classes.avatarBox}>
            <Avatar src={user.image} size="xl * 5" radius="xl" alt={user.name} classNames={{ root: classes.avatarContainer, image: classes.avatarImage }} />
          </Box>
        </Tooltip >
        : <Box onClick={() => setEditProfileImageOpened(true)} className={classes.avatarBox}>
            <Avatar src={user.image} size="xl * 5" radius="xl" alt={user.name} classNames={{ root: classes.avatarContainer, image: classes.avatarImage }} />
        </Box>}

        <Group style={{alignItems: 'space between'}}>
          <Text span className={classes.profile}>Logged in as {user.name}</Text>
          <Text
            span
            // className={classes.profile}
            className={cx(classes.logout)}
            onClick={(e) => handleLogout(e)}>Logout</Text>
        </Group>
      </Aside.Section>

      <Aside.Section style={{ display: isLoggedIn ? 'none' : 'block' }}>
        <AuthenticateUser user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} avatar={avatar} setAvatar={setAvatar} />
      </Aside.Section>

      <br/>

      <Aside.Section>
        <Calendar />
      </Aside.Section>

      <Aside.Section>
        <Stack align="center" justify="space-around" spacing="xs" sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0], height: 300 })}>
          <Button variant="outline" color="brown" radius="lg" size="md" className={classes.button}>plan a trip
            <span className={classes.tooltipSpan}>Feature Coming Soon</span>
          </Button>
          <Button variant="outline" color="brown" radius="lg" size="md" className={classes.button}>upcoming trips
            <span className={classes.tooltipSpan}>Feature Coming Soon</span>
          </Button>
          <Button variant="outline" color="brown" radius="lg" size="md" className={classes.button}>past trips
            <span className={classes.tooltipSpan}>Feature Coming Soon</span>
          </Button>
          <Button variant="outline" color="brown" radius="lg" size="md" className={classes.button} disabled={!isLoggedIn} onClick={() => setAddPostOpened(true)}>add a post
            <span className={classes.tooltipSpan} style={{ display: isLoggedIn ? 'none' : 'block' }}>log in to add a post</span>
          </Button>
        </Stack>
      </Aside.Section>

    </Aside>
  </>
  );
};



