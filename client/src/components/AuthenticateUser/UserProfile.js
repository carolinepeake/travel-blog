import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, Avatar, Stack, Button, Box, Modal, Text, Group, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { selectUser, editAvatar, logoutUser } from '../../state/usersSlice.js';
import EditProfileImage from './EditProfileImage.js';

const useStyles = createStyles((theme, _params, getRef) => ({

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
    textAlign: 'right',
    alignSelf: 'right',

    '&:hover': {
      backgroundColor: theme. colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },

}));

export default function UserProfile() {
  const { classes, cx, getRef } = useStyles();

  const [editProfileImageOpened, setEditProfileImageOpened] = useState(false);

  const [imageUrlToSave, setImageUrlToSave] = useState('');

  const [editAvatarRequestStatus, setEditAvatarRequestStatus] = useState('idle');

  let user = useSelector(selectUser);

  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      image: '',
    },
  });

  useEffect(() => {
    if (imageUrlToSave) {
      form.setFieldValue('image', imageUrlToSave);
      return;
    }
    form.setFieldValue('image', '');
  }, [imageUrlToSave]);

  let accountBody = {
    userId: user._id,
    image: form.values.image,
  };
  const canSave = accountBody.userId && accountBody.image;

  const handleEditProfileImage = async () => {
    if (canSave) {
      try {
        setEditAvatarRequestStatus('pending');
        const newProfileImageResponse = await dispatch(editAvatar(accountBody)).unwrap();
        console.log('newProfileImageResponse: ', newProfileImageResponse);
        console.log('updated user hopefully :', user);
        localStorage.setItem('user', JSON.stringify(user));
        return newProfileImageResponse;
      } catch (err) {
        console.error('error from handleEditProfileImage in UserSidebar component: ', err);
      } finally {
        form.reset();
        setEditProfileImageOpened(false);
        setEditAvatarRequestStatus('idle');
      }
    }
  };

  function handleLogout(e) {
    e.preventDefault();
    dispatch(logoutUser());
    localStorage.clear();
  };

  return (
    <>
      <Modal
        opened={editProfileImageOpened}
        onClose={() => setEditProfileImageOpened(false)}
        title={!user.image ? "Add Profile Image" : "Edit Profile Image"}
      >
        <form
          onSubmit={form.onSubmit(() => handleEditProfileImage())}
        >
          <Stack>
            <EditProfileImage
              setImageUrlToSave={setImageUrlToSave}
            />
          </Stack>
          <br />
          <Button type="submit">Update Profile Photo</Button>
        </form>
      </Modal>

      <Tooltip
        withArrow
        // arrowPosition="center"
        position="top-end"
        offset={-60}
        label={!user.image ? "Add profile image" : "Edit profile image"}
      >
        <Box onClick={() => setEditProfileImageOpened(true)} className={classes.avatarBox}>
          <Avatar src={user.image} size="xl * 5" radius="xl" alt={user.name} classNames={{ root: classes.avatarContainer, image: classes.avatarImage }} />
        </Box>
      </Tooltip >

      <Group style={{alignItems: 'space between'}}>
        <Text span className={classes.profile}>Logged in as {user.name}</Text>
        <Text
          span
          className={cx(classes.logout, classes.profile)}
          onClick={(e) => handleLogout(e)}>Logout</Text>
      </Group>
    </>
  );
};