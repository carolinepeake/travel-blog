import React, { useState, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextInput,
  PasswordInput,
  Group,
  Button,
  Anchor,
  Stack,
  createStyles,
  } from '@mantine/core';

import { selectUser, addNewUser, selectLoggedInState } from '../../state/usersSlice.js';
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

const initialFormState = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
  city: '',
  country: '',
  image: '',
};

const formReducer = function(state, action) {
  switch(action.type) {
    case 'HANDLE SINGLE INPUT':
      return {
        ...state,
        [action.field]: action.payload,
      };
    case 'HANDLE SUBMIT':
      return {
        ...initialFormState
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export default function AuthenticationForm({ email, password, handleClickRegister, setIsOpened }
  ) {
  const { classes, cx } = useStyles();
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const dispatchReduxAction = useDispatch();
  const [imageUrlToSave, setImageUrlToSave] = useState('')

  useEffect(() => {
    if (typeof imageUrlToSave === 'string') {
      dispatch({
        type: 'HANDLE SINGLE INPUT',
        field: 'image',
        payload: imageUrlToSave
      });
    }
  }, [imageUrlToSave]);

  useEffect(() => {
    if (password) {
      dispatch({
        type: 'HANDLE SINGLE INPUT',
        field: 'password',
        payload: password
      });
    }
  }, [password]);

  useEffect(() => {
    if (email) {
      dispatch({
        type: 'HANDLE SINGLE INPUT',
        field: 'email',
        payload: email
      });
    }
  }, [email]);

  // will want to make it so handleParseLocation in places autocomplete doesn't override country field if user puts that input in first (and it's a country)

  const handleTextChange = (e) => {
    console.log('event target from handleTextInput:', e.target);
    dispatch({
      type: "HANDLE SINGLE INPUT",
      field: e.target.name,
      payload: e.target.value,
    });
  };

  let user = useSelector(selectUser);
  let isLoggedIn = useSelector(selectLoggedInState);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    let accountBody = {
      name: formState.name,
      email: formState.email,
      password: formState.password,
      city: formState.city,
      country: formState.country,
      image: formState.image,
    };
    try {
      const newUser = await dispatchReduxAction(addNewUser(accountBody));
      console.log('newUser: ', newUser);

      localStorage.setItem('user', JSON.stringify(user._id))

      dispatch({
        type: "HANDLE SUBMIT"
      });
      setIsOpened(false);
      // form.reset()
    } catch(err) {
      console.log('error from handleCreateAccount in Authentication component: ', err);
      // dispatch({
      //   type: "HANDLE SUBMIT"
      // });
      // form.reset()
    };
    // return;
  };

  return (
      <form value={formState} onSubmit={(e) => handleCreateAccount(e)}
      // onSubmit={form.onSubmit(
      //   (values, _event) => {handleSubmit(values)},
      //   (validationErrors, _values, _event) => {console.log(validationErrors); handleError(validationErrors)})}
      >
        <Stack>

          <TextInput
            label="Name"
            placeholder="Your name"
            value={formState.name}
            type="text"
            // {...form.getInputProps('name')}
            name="name"
            onChange={(e) => handleTextChange(e)}
            // onChange={(e) => form.setFieldValue('name', event.currentTarget.value)}
          />

          <TextInput
            required
            label="Email"
            placeholder="example@gmail.com"
            // value={form.values.email}
            value={formState.email}
            name="email"
            // {...form.getInputProps('email')}
            onChange={(e) => handleTextChange(e)}
            // error={form.errors.email && 'invalid email'}
            // onBlur={emailError}
            // onChange={(e) => form.setFieldValue('email', event.currentTarget.value)}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            // value={form.values.password}
            value={formState.password}
            name="password"
            // {...form.getInputProps('password')}
            onChange={(e) => handleTextChange(e)}
            // onChange={(e) => form.setFieldValue('password', event.currentTarget.value)}
            // error={form.errors.password && 'password must include at least 6 characters'}
          />

           <PasswordInput
            required
            label="Confirm password"
            placeholder="Confirm password"
            // value={form.values.confirmPassword}
            value={formState.confirmPassword}
            name="confirmPassword"
            // {...form.getInputProps('confirmPassword')}
            onChange={(e) => handleTextChange(e)}
            // onChange={(e) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
            // error={form.errors.confirmPassword && 'passwords must match'}
          />

          <PlacesAutocomplete
            label="City"
            placeholder="Your city"
            // formState={form.values}
            formState={formState}
            locality="city"
            handleTextChange={handleTextChange}
            // value={form.values.city}
            // form={form}
            key="cityAF"
          />

          <EditProfileImage
            setImageUrlToSave={setImageUrlToSave}
          />

        <PlacesAutocomplete
          label="Country"
          placeholder="Your country"
          locality="country"
          // formState={form.values}
          formState={formState}
          // {...form.getInputProps('name')}
          handleTextChange={handleTextChange}
          // form={form}
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