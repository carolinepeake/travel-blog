import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  Modal,
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  ButtonProps,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  createStyles,
} from '@mantine/core';
//import { showNotification } from '@mantine/notifications';

import AuthenticationForm from './AuthenticationForm.js';
// import LoginSidebar from './LoginSidebar.js';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },
}));

// can make a separate component for AuthenticationForm and render it as a child of the modal and as an alternative to the modal (user sidebar) and pass down props to it to make it dynamic

export default function AuthenticateUser({ PaperProps, ButtonProps, user, setUser, isLoggedIn, setIsLoggedIn, avatar, setAvatar }
  // React.ComponentPropsWithoutRef<'a'>
  ) {
  const { classes, cx } = useStyles();
  const [type, toggle] = useToggle(['log in', 'register']);
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      city: '',
      country: '',
      image: '',
      terms: true,
    },

    validate: (values) => {
      // can prolly refactor this to be DRY
      if (type === 'login') {
        return {
          email:
            /^\S+@\S+$/.test(values.email)
              ? null
              : 'Invalid email',
          password:
            values.password.length < 6
              ? 'Password should include at least 6 characters'
              : null,
        };
      }
      if (type === 'register') {
        return {
          email:
            /^\S+@\S+$/.test(values.email)
              ? null
              : 'Invalid email',
          password:
            values.password.length < 6
              ? 'Password should include at least 6 characters'
              : null,
          confirmPassword:
            values.confirmPassword !== values.password
              ? 'Passwords do not match'
              : null,
        };
      }
      return {};
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      // password: (value) => (value.length < 6 ? 'Password should include at least 6 characters' : null),
      // confirmPassword: (value, values) =>
      // value !== values.password ? 'Passwords do not match' : null,
    },

    validateInputOnChange: [
    ],

    validateInputOnBlur: [
      'email',
      'password',
      'confirmPassword',
      'image',
    ],
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleCreateAccount = async (values) => {
    let accountBody = {
      name: values.name,
      email: values.email,
      password: values.password,
      terms: values.terms,
      city: values.city,
      country: values.country,
      image: '',
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
      console.log('accountBody from handleCreateAccount: ', accountBody);
      let response = await axios.post('http://localhost:3001/users/signup', accountBody);
      console.log('response from handleCreateAccount', response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data))
      setIsLoggedIn(true);
      setIsOpened(false);
      form.reset()
    } catch(err) {
      console.log('error from handleCreateAccount in Authentication component: ', err);
      form.reset()
    };
    return;
  };

  const handleLogin = async (values) => {
    let accountBody = {
      email: values.email,
      password: values.password,
    };
    try {
      console.log('form state from handleLogin: ', form.values);
      let response = await axios.post('http://localhost:3001/users/login', accountBody);
      console.log('response from handleLogin', response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsLoggedIn(true);
      setIsOpened(false);
      form.reset()
    } catch (err) {
      console.log('error from handleLogin in Authentication component: ', err);
      form.reset()
    }
    return;
  };

 const handleClickRegister = () => {
  setIsOpened(() => !isOpened);
  toggle();
 };

 const handleError = (errors) => {
  if (errors.password) {
    alert({ message: 'passwords must match and be at least 6 characters', color: 'red' });
  }
  if (errors.email) {
    alert({ message: 'please provide a valid email', color: 'red' });
  }
  if (errors.image) {
    alert({ message: 'image file size must not be any larger than 64 MB'});
  };
 };

 const handleSubmit = async (values) => {
  if (type === 'register') {
    console.log('handling registration');
    try {

      await handleCreateAccount(values);
    } catch (err) {
      console.log('error creating account', err);
    }
  } else {
    try {
      console.log('handling logging in');
      await handleLogin(values);
    } catch (err) {
      console.log('error logging in', err);
    }
  };
 };

  return (
  <>
    <Modal
      opened={isOpened}
      onClose={() => handleClickRegister()}
      title={upperFirst(type)}
    >
      <AuthenticationForm form={form} avatar={avatar} setAvatar={setAvatar} handleSubmit={handleSubmit} handleError={handleError} values={form.values} errors={form.errors} handleClickRegister={handleClickRegister}
      onSubmit={() => setIsOpened(false)}
      />
    </Modal>
    <Paper radius="md" p="xl"
     {...PaperProps}
     >
      <Text size="lg" weight={500}>
        let's go somewhere
      </Text>

      <br />

      {/* <ThirdPartyLogins /> */}

      <form onSubmit={form.onSubmit(
        (values, _event) => {handleSubmit(values)},
        (validationErrors, _values, _event) => {console.log(validationErrors); handleError(validationErrors)})}>
        <Stack>
          <TextInput
            required
            label="email"
            placeholder="example@gmail.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'invalid email'}
            {...form.getInputProps('email')}
          />

          <PasswordInput
            required
            label="password"
            placeholder="your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'password must include at least 6 characters'}
          />
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => handleClickRegister()}
            size="xs"
          >Don't have an account? Register</Anchor>
          <Button type="submit">Login</Button>
        </Group>
      </form>
    </Paper>
    </>
  );
};