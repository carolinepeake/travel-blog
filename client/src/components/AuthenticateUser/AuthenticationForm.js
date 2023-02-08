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

import { formReducer, init, onFocusOut, handleTextChange } from '../../utils/reducers.js';
import { addNewUser } from '../../state/usersSlice.js';
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
  email: { value: "", touched: false, hasError: false, error: "" },
  name: { value: "", touched: false, hasError: false, error: "" },
  password: { value: "", touched: false, hasError: false, error: "" },
  confirmPassword: { value: "", touched: false, hasError: false, error: "" },
  city: { value: "", touched: false, hasError: false, error: "" },
  country: { value: "", touched: false, hasError: false, error: "" },
  image: { value: "", touched: false, hasError: false, error: "" },
  // isFormValid: false,
};

export default function AuthenticationForm({ email, password, handleClickRegister, setIsOpened }
  ) {
  const { classes, cx } = useStyles();
  const [formState, dispatch] = useReducer(formReducer, initialFormState, init);
  const dispatchReduxAction = useDispatch();
  const [imageUrlToSave, setImageUrlToSave] = useState('');

   // will want to sure state so that password and email will populate the same on user login and create account form

  useEffect(() => {
    if (password) {
     onFocusOut('password', password, dispatch, formState);
    }
  }, [password]);

  useEffect(() => {
    if (email) {
     onFocusOut('email', email, dispatch, formState);
    }
  }, [email]);

  useEffect(() => {
    if (typeof imageUrlToSave === 'string') {
      handleTextChange('image', imageUrlToSave, dispatch, formState);
    }
  }, [imageUrlToSave]);

  const onTextChange = (e) => {
    handleTextChange(e.target.name, e.target.value, dispatch, formState);
  }


  // will want to make it so handleParseLocation in places autocomplete doesn't override country field if user puts that input in first (and it's a country)


  const handleCreateAccount = async (e) => {
    e.preventDefault();
    let canSubmit = true;
    let formBody = {};
    for (const field in formState) {
      if (field.hasError === true) {
        canSubmit = false;
        break;
      }
      formBody[field] = formState[field].value;
    }
    if (canSubmit) {
      try {
        const newUser = await dispatchReduxAction(addNewUser(formBody));
        if (typeof newUser.payload._id === 'string') {
          localStorage.setItem('user', newUser.payload._id);
        }
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

  return (
      <form value={formState} onSubmit={handleCreateAccount}
      >
        <Stack>

          <TextInput
            label="Name"
            placeholder="Your name"
            value={formState.name.value}
            type="text"
            name="name"
            onChange={onTextChange}
            error={formState.name.value.length > 150 && "Name may not be longer than 150 characters"}
          />

          <TextInput
            required
            label="Email"
            placeholder="example@gmail.com"
            value={formState.email.value}
            name="email"
            onChange={onTextChange}
            onBlur={e => onFocusOut(e.target.name, e.target.value, dispatch, formState)}
            error={formState.email.value.length > 150 ? "Email may not be longer than 150 characters" : formState.email.touched && formState.email.hasError && formState.email.error}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={formState.password.value}
            name="password"
            onChange={onTextChange}
            onBlur={e => onFocusOut(e.target.name, e.target.value, dispatch, formState)}
            error={formState.password.value.length > 150 ? "Password may not be longer than 150 characters" : formState.password.touched && formState.password.hasError && formState.password.error}
          />

           <PasswordInput
            required
            label="Confirm password"
            placeholder="Confirm password"
            value={formState.confirmPassword.value}
            name="confirmPassword"
            onChange={onTextChange}
            onBlur={e => onFocusOut(e.target.name, e.target.value, dispatch, formState)}
            error={formState.confirmPassword.value.length > 150 ? "Password may not be longer than 150 characters" : formState.confirmPassword.touched && formState.confirmPassword.hasError && formState.confirmPassword.error}
          />

          <PlacesAutocomplete
            label="City"
            placeholder="Your city"
            formState={formState}
            locality="city"
            handleTextChange={onTextChange}
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
          handleTextChange={onTextChange}
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