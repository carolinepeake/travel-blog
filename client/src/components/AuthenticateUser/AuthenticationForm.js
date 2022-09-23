import React, { useState, useEffect,
  useRef
} from 'react';
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
  FileInput,
  } from '@mantine/core';
import { IconUpload } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },

  avatarPreview: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gridColumn: '1 / 3',
    overflow: 'hidden',
  },

  imagePreview: {
    marginRight: '1%',
    height: 200,
    positionSelf: 'center',
    objectFit: 'cover',
    aspectRatio: 1,
    width: 200,
    overflow: 'hidden',
  },
}));

export default function AuthenticationForm({ PaperProps, ButtonProps, user, setUser, isLoggedIn, setIsLoggedIn, handleCreateAccount, handleLogin, type, toggle, form, avatar, setAvatar, handleSubmit, handleError, values, errors }
 // React.ComponentPropsWithoutRef<'a'>
  ) {
  const { classes, cx } = useStyles();
  const [opened, setOpened] = useState(true);
  const [value, setValue] = useState(null);
  const fileInput = React.createRef();

  const handleAddImage = (event) => {
    setValue(event);
    const file = event;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64image = reader.result;
      setAvatar(base64image);
    };
  };

  return (
      <form onSubmit={(e) => {form.onSubmit(handleSubmit(values, e), handleError(errors, e))}}
      //   e) => {
      //   if (type === 'register') {
      //     console.log('handling registration');
      //     handleCreateAccount(e);
      //   } else {
      //     console.log('handling logining in');
      //     handleLogin(e);
      //   }
      // })}
      >
      {/* <form onSubmit={(e) => {form.onSubmit(handleSubmit(values, e), handleError(errors, e))}}> */}
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

          {type === 'register' && (
            <TextInput
              label="city"
              placeholder="your city"
              value={form.values.city}
              onChange={(event) => form.setFieldValue('city', event.currentTarget.value)}
            />
          )}

          {type === 'register' && (
            <FileInput
              id="avatarInput"
              label="image"
              placeholder="upload your photo"
              type="file"
              name="avatar"
              error="file size must be less than 64 MB"
              accept="image/png, image/jpeg"
              clearable
              icon={<IconUpload size={14} />}
              ref={fileInput}
              value={value}
              onChange={handleAddImage}
            />
          )}
      {(type === 'register' && avatar)
      && (
        <div className={classes.avatarPreview}>
          <img src={avatar} alt="Image preview" key={avatar} className={classes.imagePreview} />
        </div>)}

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