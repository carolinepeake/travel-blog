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
import EditProfileImage from './EditProfileImage.js';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },
}));

export default function AuthenticationForm({ PaperProps, ButtonProps, form, avatar, setAvatar, handleSubmit, handleError, handleClickRegister }
 // React.ComponentPropsWithoutRef<'a'>
  ) {
  const { classes, cx } = useStyles();

  return (
      <form onSubmit={form.onSubmit(
        (values, _event) => {handleSubmit(values)},
        (validationErrors, _values, _event) => {console.log(validationErrors); handleError(validationErrors)})}
      >
        <Stack>

          <TextInput
            label="name"
            placeholder="your name"
            value={form.values.name}
            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
          />

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

           <PasswordInput
            required
            label="confirm password"
            placeholder="confirm password"
            value={form.values.confirmPassword}
            onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
            error={form.errors.password && 'password must include at least 6 characters'}
          />

          <TextInput
            label="city"
            placeholder="your city"
            value={form.values.city}
            onChange={(event) => form.setFieldValue('city', event.currentTarget.value)}
          />

          <EditProfileImage avatar={avatar} setAvatar={setAvatar}/>

        <TextInput
          label="country"
          placeholder="your country"
          value={form.values.country}
          onChange={(event) => form.setFieldValue('country', event.currentTarget.value)}
        />

        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => handleClickRegister()}
            size="xs"
          >Already have an account? Login
          </Anchor>
          <Button type="submit">Create Account</Button>
        </Group>
      </form>
  );
};