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

import { formReducer, init } from '../../utils/reducers.js';
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

export default function AuthenticationForm({ email, password, handleClickRegister, setIsOpened }
  ) {
  const { classes, cx } = useStyles();
  const [formState, dispatch] = useReducer(formReducer, initialFormState, init);
  const dispatchReduxAction = useDispatch();
  const [imageUrlToSave, setImageUrlToSave] = useState('');

  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');


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
    dispatch({
      type: "HANDLE SINGLE INPUT",
      field: e.target.name,
      payload: e.target.value,
    });
  };

  const handleCheckEmail = () => {
    /^\S+@\S+$/.test(formState.email) ? setEmailErrorMessage('') : setEmailErrorMessage('Invalid email');
  };

  const handleCheckPassword = () => {
    formState.password.length < 6 ? setPasswordErrorMessage('Password should include at least 6 characters') : setPasswordErrorMessage('');
  };

  const handleCheckConfirmPassword = () => {
    formState.password !== formState.confirmPassword ? setConfirmPasswordErrorMessage('Passwords do not match') : setConfirmPasswordErrorMessage('');
  };

  const canSubmit = !emailErrorMessage && !passwordErrorMessage && !confirmPasswordErrorMessage;

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (canSubmit) {
      try {
        const newUser = await dispatchReduxAction(addNewUser(formState));

        // localStorage.setItem('user', JSON.stringify(user._id));

        dispatch({
          type: "HANDLE SUBMIT",
          payload: initialFormState
        });
        setIsOpened(false);
      } catch(err) {
        console.log('error from handleCreateAccount in Authentication component: ', err);
      }
    }
  };

  let user = useSelector(selectUser);
  let isLoggedIn = useSelector(selectLoggedInState);

  return (
      <form value={formState} onSubmit={handleCreateAccount}
      >
        <Stack>

          <TextInput
            label="Name"
            placeholder="Your name"
            value={formState.name}
            type="text"
            name="name"
            onChange={handleTextChange}
          />

          <TextInput
            required
            label="Email"
            placeholder="example@gmail.com"
            value={formState.email}
            name="email"
            onChange={handleTextChange}
            onBlur={handleCheckEmail}
            onFocus={setEmailErrorMessage('')}
            error={emailErrorMessage}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={formState.password}
            name="password"
            onChange={handleTextChange}
            error={passwordErrorMessage}
            onFocus={setPasswordErrorMessage}
            onBlur={handleCheckPassword}
            // error={form.errors.password && 'password must include at least 6 characters'}
          />

           <PasswordInput
            required
            label="Confirm password"
            placeholder="Confirm password"
            value={formState.confirmPassword}
            name="confirmPassword"
            onChange={handleTextChange}
            onFocus={setConfirmPasswordErrorMessage}
            onBlur={handleCheckConfirmPassword}
            error={confirmPasswordErrorMessage}
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
            onClick={handleClickRegister}
            size="xs"
          >Already have an account? Login
          </Anchor>
          <Button type="submit">Create Account</Button>
        </Group>
      </form>
  );
};