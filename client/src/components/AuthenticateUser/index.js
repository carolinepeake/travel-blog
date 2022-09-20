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
  const { classes, cx } = useStyles();
  const [type, toggle] = useToggle(['log in', 'register']);
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      city: '',
      country: '',
      image: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
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

  // user is getting set on change, not just once the button is clicked
  console.log('user2: ', user);

  // refactor to use async/await
  function handleCreateAccount(e) {
    console.log('form state from handleCreateAccount: ', form.values);
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
    axios.post('http://localhost:3001/users/signup', accountBody)
    .then((res) => {
      console.log('response from handleCreateAccount', res.data);
      // is setting user state (tested), even though logging user to console within this function doesn't work
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data))
      setIsLoggedIn(true);
      setOpened(false);
    })
    .catch(err => console.log('error from handleCreateAccount in Authentication component: ', err))
    // show message to user that account failed to create -- handle errors differently based on what they are
    e.preventDefault();
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

  return (
    <>
    <Modal
    opened={opened}
    onClose={() => setOpened(false)}
    // make title dynamic using state.type
    title={type === "register" ? "create account" : "login"}
    >
    <AuthenticationForm user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleCreateAccount={handleCreateAccount} handleLogin={handleLogin} type={type} toggle={toggle} form={form} onSubmit={() => setOpened(false)}/>
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

      <form onSubmit={(e) => {
        if (type === 'register') {
          console.log('handling registration');
          handleCreateAccount(e);
        } else {
          console.log('handling logining in');
          handleLogin(e);
        }
      }}>
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
            error={form.errors.password && 'password should include at least 6 characters'}
          />
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