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

      // localStorage.setItem('user', JSON.stringify(user._id));

      dispatch({
        type: "HANDLE SUBMIT"
      });
      setIsOpened(false);
    } catch(err) {
      console.log('error from handleCreateAccount in Authentication component: ', err);
    } finally {

    }
    // return;
  };

  return (
      <form value={formState} onSubmit={(e) => handleCreateAccount(e)}
      >
        <Stack>

          <TextInput
            label="Name"
            placeholder="Your name"
            value={formState.name}
            type="text"
            name="name"
            onChange={(e) => handleTextChange(e)}
          />

          <TextInput
            required
            label="Email"
            placeholder="example@gmail.com"
            value={formState.email}
            name="email"
            onChange={(e) => handleTextChange(e)}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={formState.password}
            name="password"
            onChange={(e) => handleTextChange(e)}
            // error={form.errors.password && 'password must include at least 6 characters'}
          />

           <PasswordInput
            required
            label="Confirm password"
            placeholder="Confirm password"
            value={formState.confirmPassword}
            name="confirmPassword"
            onChange={(e) => handleTextChange(e)}
            // error={form.errors.confirmPassword && 'passwords must match'}
          />

          <PlacesAutocomplete
            label="City"
            placeholder="Your city"
            formState={formState}
            locality="city"
            handleTextChange={handleTextChange}
            key="cityAF"
          />

          <EditProfileImage
            setImageUrlToSave={setImageUrlToSave}
          />

        <PlacesAutocomplete
          label="Country"
          placeholder="Your country"
          locality="country"
          formState={formState}
          handleTextChange={handleTextChange}
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