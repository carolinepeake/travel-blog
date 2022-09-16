import React, { useState } from 'react';
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
// import { GoogleButton, TwitterButton } from '../SocialButtons/SocialButtons';
// import { GoogleIcon } from './GoogleIcon';
import { FcGoogle } from 'react-icons/Fc';
import facebookLogo from '../assets/f_logo_RGB_Blue_58.png';
import CreateAccount from './CreateAccount.jsx';

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
    axios.post('http://localhost:3001/users', accountBody)
    .then((res) => {
      console.log('response from handleCreateAccount', res.data);
      // is setting user state (tested), even though logging user to console within this function doesn't work
      setUser(res.data);
      setIsLoggedIn(true);
    })
    .catch(err => console.log('error from handleCreateAccount in Authentication component: ', err))
    e.preventDefault();
  };

  function handleLogin(e) {
   // setUser(res.data);
    setIsLoggedIn(true);
     // e.preventDefault();
  };

  return (
    <>
    <Modal
    opened={opened}
    onClose={() => setOpened(false)}
    // make title dynamic using state.type
    title="create account"
    >
    <CreateAccount user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} onSubmit={() => setOpened(false)}/>
  </Modal>
    <Paper radius="md" p="xl"
     {...PaperProps}
     >
      <Text size="lg" weight={500}>
        let's go somewhere
      </Text>

      <br />

      <Text size="lg" weight={500}>
        {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <Button radius="xl"
        leftIcon={<FcGoogle />}
        variant="default" color="gray"
        // {...props}
        >google</Button>
        {/* <GoogleButton radius="xl">Google</GoogleButton> */}
        <Button
          radius="xl"
          component="a"
          // leftIcon={<TwitterIcon size={16} color="#00ACEE" />}
          variant="default"
        //  {...props}
        >
        twitter
        </Button>
        {/* <TwitterButton radius="xl">Twitter</TwitterButton> */}
      </Group>

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
          {type === 'register' && (
            <TextInput
              label="name"
              placeholder="your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
            />
          )}

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

          {type === 'register' && (
            <TextInput
              label="city"
              placeholder="your city"
              value={form.values.city}
              onChange={(event) => form.setFieldValue('city', event.currentTarget.value)}
            />
          )}

          {type === 'register' && (
            <TextInput
              label="image"
              placeholder="upload your photo"
              value={form.values.image}
              onChange={(event) => form.setFieldValue('image', event.currentTarget.value)}
            />
          )}

          {type === 'register' && (
            <TextInput
              label="county"
              placeholder="your country"
              value={form.values.country}
              onChange={(event) => form.setFieldValue('country', event.currentTarget.value)}
            />
          )}

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            // onClick={() => toggle()}
            onClick={() => setOpened(true)}
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