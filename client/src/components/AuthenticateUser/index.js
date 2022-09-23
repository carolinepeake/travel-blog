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
import { FcGoogle } from 'react-icons/Fc';
import facebookLogo from '../../assets/f_logo_RGB-Blue_58.png';
import AuthenticationForm from './AuthenticationForm.js';
import LoginSidebar from './LoginSidebar.js';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },
}));

// can make a separate component for AuthenticationForm and render it as a child of the modal and as an alternative to the modal (user sidebar) and pass down props to it to make it dynamic

export default function AuthenticateUser({ PaperProps, ButtonProps, user, setUser, isLoggedIn, setIsLoggedIn }
  // React.ComponentPropsWithoutRef<'a'>
  ) {
  const [avatar, setAvatar] = useState('');
  const { classes, cx } = useStyles();
  const [type, toggle] = useToggle(['log in', 'register']);
  const [opened, setOpened] = useState(false);
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

    validate: (values) => ({
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
      confirmPassword: (value, values) =>
      value !== values.password ? 'Passwords do not match' : null,
    }),

    validateInputOnChange: [
      'password',
      'confirmPassword',
      'image',
    ],

    validateInputOnBlur: [
      'email',
    ],
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      console.log('foundUser: ', foundUser);
      setIsLoggedIn(true);
    }
  }, []);

  const accountBody = {
    name: form.values.name,
    email: form.values.email,
    password: form.values.password,
    terms: form.values.terms,
    city: form.values.city,
    country: form.values.country,
    image: form.values.image,
    // bucketList: ''
  };

  // refactor to use async/await
  const handleCreateAccount = async (e) => {
    // e.preventDefault();
    try {
      console.log('accountBody from handleCreateAccount: ', accountBody);
      let response = await axios.post('http://localhost:3001/users/signup', accountBody);
      console.log('response from handleCreateAccount', response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data))
      setIsLoggedIn(true);
      setOpened(false);
    } catch(err) {
      console.log('error from handleCreateAccount in Authentication component: ', err)
    };
    e.preventDefault();
    return;
  };

  function handleLogin(e) {
    console.log('form state from handleLogin: ', form.values);
    const accountBody = {
      email: form.values.email,
      password: form.values.password,
    };
    axios.post('http://localhost:3001/users/login', accountBody)
    .then((res) => {
      console.log('response from handleLogin', res.data);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data))
      setIsLoggedIn(true);
      setOpened(false);
    })
    .catch((err) => {
      console.log('error from handleLogin in Authentication component: ', err);
    })
    e.preventDefault();
  };

 const handleClickRegister = () => {
  setOpened(true);
  toggle();
 };

 const handleError = (errors, e) => {
  // if (errors.password) {
  //   alert({ message: 'passwords must match and be at least 6 characters', color: 'red' });
  // } else if (errors.email) {
  //   alert({ message: 'please provide a valid email', color: 'red' });
  // } else if (errors.image) {
  //   alert({ message: 'image file size must not be any larger than 64 MB'});
  // };
 };

 const handleSubmit = async (values, e) => {
  e.preventDefault();
  if (type === 'register') {
    console.log('handling registration');
    try {
      const savedImage = await axios.post('http://localhost:3001/posts/cloudinary/upload', {
        image: avatar,
      });
      console.log('saved avatar image: ', savedImage);
      accountBody.image = savedImage.data.url;
      // await form.setFieldValue('image', imageUrl.data.url);
      console.log('handling create account,', accountBody.image);
      await handleCreateAccount(e);
    } catch (err) {
      console.log('error uploading avatar', err);
    }
  } else {
    console.log('handling logining in');
    handleLogin();
  };
 };

  return (
    <>
    <Modal
    opened={opened}
    onClose={() => setOpened(false)}
    // make title dynamic using state.type
    title={type === "register" ? "create account" : "login"}
    >
    <AuthenticationForm user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleCreateAccount={handleCreateAccount} handleLogin={handleLogin} type={type} toggle={toggle} form={form} avatar={avatar} setAvatar={setAvatar} handleSubmit={handleSubmit} handleError={handleError} values={form.values} errors={form.errors}
    onSubmit={() => setOpened(false)}
    />
  </Modal>
    <Paper radius="md" p="xl"
     {...PaperProps}
     >
      <Text size="lg" weight={500}>
        let's go somewhere
      </Text>

      <br />

      <Text size="lg" weight={500}>
        login with
      </Text>

      <Stack grow mb="md" mt="md">
        <Button radius="xl"
        leftIcon={<FcGoogle />}
        variant="default" color="gray"
        // {...props}
        >Google</Button>
        <Button
          radius="xl"
          component="a"
          leftIcon={<img src={facebookLogo} alt="Facebook Logo" style={{width: "16px" }}/>}
          variant="default"
        >
        Facebook
        </Button>
      </Stack>

      <Divider label="or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={(e) => {form.onSubmit(handleSubmit(values, e), handleError(errors, e))}}>
        <Stack>
          <TextInput
            required
            label="email"
            placeholder="example@gmail.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'invalid email'}
          />

          <PasswordInput
            required
            label="password"
            placeholder="your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'password must include at least 6 characters'}
          />

          {/* <PasswordInput
            required
            label="confirm password"
            placeholder="confirm password"
            value={form.values.confirmPassword}
            onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
            error={form.errors.password && 'password must include at least 6 characters'}
          /> */}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            // onClick={() => toggle()}
            onClick={() => handleClickRegister()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button
          type="submit"
           // make button dynamic using state.type
          >{upperFirst(type)}</Button>
        </Group>
      </form>
    </Paper>
    </>
  );
};