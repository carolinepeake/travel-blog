import React, { useState, useEffect } from 'react';
import {
  TextInput,
  PasswordInput,
  Group,
  Button,
  Anchor,
  Stack,
  createStyles,
  } from '@mantine/core';
  import { UseFormReturnType  } from '@mantine/form';
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

export default function AuthenticationForm({ form, avatar, setAvatar, handleSubmit, handleError, handleClickRegister }
  ) {
  const { classes, cx } = useStyles();
  const [imageUrlToSave, setImageUrlToSave] = useState('')

  useEffect(() => {
    if (imageUrlToSave) {
      form.setFieldValue('image', imageUrlToSave);
    }
  }, [imageUrlToSave])

  // will want to make it so handleParseLocation in places autocomplete doesn't override country field if user puts that input in first (and it's a country)

  const handleTextInput = async (event, form) => {
    console.log('event currrent target :', event.currentTarget);
    console.log('form from handleTextInput: ', form);
    let formField;
    let fieldValue;
    if (event.currentTarget !== undefined) {
      console.log('not undefined');
      formField = event.currentTarget.name;
      fieldValue = event.currentTarget.value;
    } else {
      formField = event.target.name;
      fieldValue = event.target.value;
    }
    console.log('formField: ', formField, 'formValue :', fieldValue);
    // formState[formField] && form.setFieldValue(formField, fieldValue);
    if (form) {
      await form.values[formField] && form.setFieldValue(formField, fieldValue);
      console.log('form from handleTextInput', form);
      return form;
    }
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
            {...form.getInputProps('name')}
            // name="name"
            // onChange={(e) => handleTextInput(e)}
            onChange={(e) => form.setFieldValue('name', event.currentTarget.value)}
          />

          <TextInput
            required
            label="Email"
            placeholder="example@gmail.com"
           value={form.values.email}
           // name="email"
            {...form.getInputProps('email')}
            // onChange={handleTextInput}
            error={form.errors.email && 'invalid email'}
            onChange={(e) => form.setFieldValue('email', event.currentTarget.value)}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            // name="password"
            {...form.getInputProps('password')}
            // onChange={handleTextInput}
            onChange={(e) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'password must include at least 6 characters'}
          />

           <PasswordInput
            required
            label="Confirm password"
            placeholder="Confirm password"
            value={form.values.confirmPassword}
            // name="confirmPassword"
            {...form.getInputProps('confirmPassword')}
            // onChange={handleTextInput}
            onChange={(e) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
            error={form.errors.confirmPassword && 'passwords must match'}
          />

          <PlacesAutocomplete
            label="City"
            placeholder="Your city"
            formState={form.values}
            locality="city"
            handleTextChange={handleTextInput}
            // value={form.values.city}
            form={form}
            key="cityAF"
          />

          <EditProfileImage avatar={avatar} setAvatar={setAvatar} setImageUrlToSave={setImageUrlToSave}/>

        <PlacesAutocomplete
          label="Country"
          placeholder="Your country"
          locality="country"
          formState={form.values}
          // {...form.getInputProps('name')}
          handleTextChange={handleTextInput}
          form={form}
          key="countryAF"
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