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
import PlacesAutocomplete from '../AddPost/PlacesAutocomplete.js';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    alignContent: 'space around',
    top: 0,
    zIndex: 1,
  },
}));

export default function AuthenticationForm({ PaperProps, ButtonProps, form, avatar, setAvatar, handleSubmit, handleError, handleClickRegister }
  ) {
  const { classes, cx } = useStyles();
  const [autocompleteLocations, autocompleteErr, locationFetch] = useMapboxApi();
  const [imageUrlToSave, setImageUrlToSave] = useState('')

  useEffect(() => {
    if (imageUrlToSave) {
      form.setFieldValue('image', imageUrlToSave);
    }
  }, [imageUrlToSave])

  // const handleLocationChange = async (query, locality) => {
  //   console.log('query from handleLocationChang in Authentication Form component: ', query);
  //   form.setFieldValue(locality, query);
  //   if (!form.values[locality]) return;

  //   locationFetch(query, locality);
  // };

  // will want to make it so doesn't override country field if user puts that input in first (and it's a country)
  // const handleParseLocation = async (item) => {
  //   if (item.context && item.context.length > 0) {
  //     let index = item.context.length - 1;
  //     let placeType = item.context[index].id.split('.')[0];
  //     if (placeType === 'country') {
  //       form.setFieldValue('country', item.context[index].text);
  //     }
  //   }
  //   form.setFieldValue('city', item.place_name.split(',').shift());
  // };

  const handleTextInput = (event) => {
    let formField;
    let fieldValue;
    if (event.currentTarget !== undefined) {
      formField = event.currentTarget.name;
      fieldValue = event.currentTarget.value;
    } else {
      formField = event.target.name;
      fieldValue = event.target.value;
    }
    form.values[formField] && form.setFieldValue(formField, fieldValue);
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
            name="name"
            onChange={handleTextInput}
          />

          <TextInput
            required
            label="Email"
            placeholder="example@gmail.com"
            value={form.values.email}
            name="email"
            onChange={handleTextInput}
            error={form.errors.email && 'invalid email'}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            name="password"
            onChange={handleTextInput}
            error={form.errors.password && 'password must include at least 6 characters'}
          />

           <PasswordInput
            required
            label="Confirm password"
            placeholder="Confirm password"
            value={form.values.confirmPassword}
            name="confirmPassword"
            onChange={handleTextInput}
            error={form.errors.confirmPassword && 'passwords must match'}
          />

          <PlacesAutocomplete
            label="City"
            placeholder="Your city"
            formState={form.values}
           // value={form.values.city}
            locality="city"
            //name="city"
            // onChange={(query) => {handleLocationChange(query, 'city')}}
            // onItemSubmit={(item) => {handleParseLocation(item)}}
            // data={autocompleteLocations.map((item) => ({ ...item, value: item.place_name }))}
            // filter={(value, item) => item}
            handleTextChange={handleTextInput}
          />

          <EditProfileImage avatar={avatar} setAvatar={setAvatar} setImageUrlToSave={setImageUrlToSave}/>

        <Autocomplete
          label="Country"
          placeholder="Your country"
          // value={form.values.country}
          // name="country"
          locality="country"
          formState={form.values}
          // onChange={(query) => {handleLocationChange(query, 'country')}}
          // data={autocompleteLocations.map((item) => ({ ...item, value: item.place_name }))}
          // filter={(value, item) => item}
          handleTextChange={handleTextInput}
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