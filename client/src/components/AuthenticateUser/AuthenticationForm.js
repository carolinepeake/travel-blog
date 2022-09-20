import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  Aside,
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

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },
}));

export default function AuthenticationForm({ PaperProps, ButtonProps, user, setUser, isLoggedIn, setIsLoggedIn, handleCreateAccount, handleLogin, type, toggle, form }
  // React.ComponentPropsWithoutRef<'a'>
  ) {
  const { classes, cx } = useStyles();
  const [opened, setOpened] = useState(true);
  // const form = useForm({
  //   initialValues: {
  //     email: '',
  //     name: '',
  //     password: '',
  //     city: '',
  //     country: '',
  //     image: '',
  //     terms: true,
  //   },

  //   validate: {
  //     email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
  //     password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
  //   },
  // });

  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem("user");
  //   if (loggedInUser) {
  //     const foundUser = JSON.parse(loggedInUser);
  //     setUser(foundUser);
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  // function handleCreateAccount(e) {
  //   console.log('form state from handleCreateAccount: ', form.values);
  //   const accountBody = {
  //     name: form.values.name,
  //     email: form.values.email,
  //     password: form.values.password,
  //     terms: form.values.terms,
  //     city: form.values.city,
  //     country: form.values.country,
  //     image: form.values.image,
      // bucketList: ''
  //   };
  //   axios.post('http://localhost:3001/users/signup', accountBody)
  //   .then((res) => {
  //     console.log('response from handleCreateAccount', res.data);
  //     // is setting user (tested), even though logging user to console within this function doesn't work
  //     setUser(res.data);
  //     localStorage.setItem('user', JSON.stringify(res.data))
  //     setIsLoggedIn(true);
  //   })
  //   .catch(err => console.log('error from handleCreateAccount: ', err))
  //   e.preventDefault();
  //   // clear form state
  //   // close modal
  // };

  // function handleLogin(e) {
  //    setUser(res.data);
  //    localStorage.setItem('user', JSON.stringify(res.data));
  //    setIsLoggedIn(true);
  //    e.preventDefault();
  //  };

  return (
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
            onClick={() => toggle()}
            size="xs"
          >
            {type === "register"
              ? 'Already have an account? Login'
              : 'Don\'t have an account? Register'}
          </Anchor>
          {/* <Button type="submit">{upperFirst(type)}</Button> */}
          <Button type="submit">
            {type === "register"
              ? 'create account'
              : 'login'}
          </Button>
        </Group>
      </form>
  );
};