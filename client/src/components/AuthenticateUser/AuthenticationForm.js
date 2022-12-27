import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  Aside,
  Autocomplete,
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
import { useMapboxApi } from '../../utils/customHooks.js';
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
  const [autocompleteLocations, autocompleteErr, locationFetch] = useMapboxApi();
  const [finalUrl, setFinalUrl] = useState('')

  useEffect(() => {
    if (finalUrl) {
      form.setFieldValue('image', finalUrl);
    }
  }, [finalUrl])

  const handleLocationChange = async (query, locality) => {
    console.log('query from handleLocationChang in Authentication Form component: ', query);
    form.setFieldValue(locality, query);
    if (!form.values[locality]) return;

    locationFetch(query, locality);
  };

  // will want to make it so doesn't override country field if user puts that input in first (and it's a country)
  const handleParseLocation = async (item) => {
    if (item.context && item.context.length > 0) {
      let index = item.context.length - 1;
      let placeType = item.context[index].id.split('.')[0];
      if (placeType === 'country') {
        form.setFieldValue('country', item.context[index].text);
      }
    }
    form.setFieldValue('city', item.place_name.split(',').shift());
  };

  return (
      <form onSubmit={form.onSubmit(
        (values, _event) => {handleSubmit(values)},
        (validationErrors, _values, _event) => {console.log(validationErrors); handleError(validationErrors)})}
      >
        <Stack>

          <TextInput
            label="Name"
            placeholder="Your name"
            value={form.values.name}
            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
          />

          <TextInput
            required
            label="Email"
            placeholder="example@gmail.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'invalid email'}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'password must include at least 6 characters'}
          />

           <PasswordInput
            required
            label="Confirm password"
            placeholder="Confirm password"
            value={form.values.confirmPassword}
            onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
            error={form.errors.password && 'password must include at least 6 characters'}
          />

          <Autocomplete
            label="City"
            placeholder="Your city"
            value={form.values.city}
            onChange={(query) => {handleLocationChange(query, 'city')}}
            onItemSubmit={(item) => {handleParseLocation(item)}}
            data={autocompleteLocations.map((item) => ({ ...item, value: item.place_name }))}
            filter={(value, item) => item}
          />

          <EditProfileImage avatar={avatar} setAvatar={setAvatar} setFinalUrl={setFinalUrl}/>

        <Autocomplete
          label="Country"
          placeholder="Your country"
          value={form.values.country}
          onChange={(query) => {handleLocationChange(query, 'country')}}
          data={autocompleteLocations.map((item) => ({ ...item, value: item.place_name }))}
          filter={(value, item) => item}
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