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

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },
}));

// can make a separate component for AuthenticationForm and render it as a child of the modal and as an alternative to the modal (user sidebar) and pass down props to it to make it dynamic

export default function AuthenticateUser({ PaperProps, ButtonProps, user, setUser, isLoggedIn, setIsLoggedIn, avatar, setAvatar }) {
  const { classes, cx } = useStyles();
  const [type, toggle] = useToggle(['login', 'register']);
  const [isOpened, setIsOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      city: '',
      country: '',
      image: '',
    },

  // need to add image to validation => if wrong file type
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
      'image',
    ],

    validateInputOnBlur: [
      'email',
      'password',
      'confirmPassword',
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
      city: values.city,
      country: values.country,
      image: values.image,
    };
    try {
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
      // setErrorMessage(err.response.data.error);
      form.reset()
    }
    return;
  };

  const handleClickRegister = () => {
    setIsOpened(() => !isOpened);
    toggle();
  };

  let errorMessages = {};

  const handleError = (errors) => {
    if (errors.password) {
      errorMessages.passwordErrorMessage = 'passwords must match and be at least 6 characters';
    }
    if (errors.email) {
      errorMessages.emailErrorMessage = 'please provide a valid email';
    }
    if (errors.image) {
      errorMessages.imageErrorMessage = 'image file size must not be any larger than 64 MB';
    };
  };

  const handleSubmit = (values) => {
    if (type === 'register') {
      console.log('handling registration');
      handleCreateAccount(values);
    } else {
      console.log('handling logging in');
      handleLogin(values);
    }
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
            error={form.errors.password ? 'password must include at least 6 characters' : `${errorMessage}`}
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