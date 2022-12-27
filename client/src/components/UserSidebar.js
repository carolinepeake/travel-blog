import { useState } from 'react';
import axios from 'axios';
//make alphabetical
import { Aside, createStyles, Avatar, Stack, Button, Container, Box, Center, Modal, Text, Group } from '@mantine/core';
import { Calendar } from '@mantine/dates';
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
    [`&:hover .${getRef('tooltip')}`]: {
      visibility: 'visible',
    },
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
    [`&:hover .${getRef('tooltip')}`]: {
      visibility: 'visible',
    },
  },

  tooltip: {
    ref: getRef('tooltip'),
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


  // can add tooltip that says login is required when hover over buttons and isLoggedIn is set to false

  function handleAddProfileImage() {
    setEditProfileImageOpened(true);
    // could make edit profile
    // pop up module to edit profile
      // same as authentication form with addition of old password input if changing password
    //
  };

  const handleEditProfileImage = async(e) => {
    e.preventDefault();
    let accountBody = {
      image: ''
    };
    try {
      if (avatar) {
        const savedImage = await axios.post('http://localhost:3001/posts/cloudinary/upload', {
          image: avatar,
        });
        console.log('saved avatar image: ', savedImage);
        accountBody.image = savedImage.data.url;
        // await form.setFieldValue('image', imageUrl.data.url);
      }
      console.log('imageUrl from handleEditProfileImage: ', accountBody);
      let response = await axios.put(`http://localhost:3001/users/${user._id}/avatar`, accountBody);
      console.log('response from handleCreateAccount', response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data))
      setIsLoggedIn(true);
      setEditProfileImageOpened(false);
    } catch(err) {
      // pop up error that image size too large
      console.log('error from handleEditProfileImage in UserSidebar component: ', err);
    };
    return;
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
      <form onSubmit={(e) => handleEditProfileImage(e)}>
        <Stack>
          <EditProfileImage user={user} setUser={setUser} avatar={avatar} setAvatar={setAvatar} setEditProfileImageOpened={setEditProfileImageOpened} />
        </Stack>
        <br />
        <Button type="submit">Update Profile Photo</Button>
      </form>
    </Modal>

    <Aside className={classes.root} width={{ base: 300 }} p="xs">

      <Aside.Section style={{ display: isLoggedIn ? 'block' : 'none' }}>
        <Box onClick={() => handleAddProfileImage()} className={classes.avatarBox}>
          <Avatar src={user.image} size="xl * 5" radius="xl" alt={user.name} classNames={{ root: classes.avatarContainer, image: classes.avatarImage }} />
          <span className={classes.tooltip}>add profile image</span>
        </Box>
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
            <span className={classes.tooltip}>Feature Coming Soon</span>
          </Button>
          <Button variant="outline" color="brown" radius="lg" size="md" className={classes.button}>upcoming trips
            <span className={classes.tooltip}>Feature Coming Soon</span>
          </Button>
          <Button variant="outline" color="brown" radius="lg" size="md" className={classes.button}>past trips
            <span className={classes.tooltip}>Feature Coming Soon</span>
          </Button>
          <Button variant="outline" color="brown" radius="lg" size="md" className={classes.button} disabled={!isLoggedIn} onClick={() => setAddPostOpened(true)}>add a post
            <span className={classes.tooltip} style={{ display: isLoggedIn ? 'none' : 'block' }}>log in to add a post</span>
          </Button>
        </Stack>
      </Aside.Section>

    </Aside>
  </>
  );
};



