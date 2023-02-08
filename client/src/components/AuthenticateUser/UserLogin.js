import React, { useState, useEffect, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useToggle, upperFirst } from '@mantine/hooks';
import {
  Modal,
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

import { formReducer, init, handleTextChange } from '../../utils/reducers.js';
import { selectUser, loginUser, selectLoggedInState } from '../../state/usersSlice.js';
import AuthenticationForm from './AuthenticationForm.js';

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
  password: { value: "", touched: false, hasError: false, error: "" },
};

// can make a separate component for AuthenticationForm and render it as a child of the modal and as an alternative to the modal (user sidebar) and pass down props to it to make it dynamic

export default function UserLogin({ PaperProps, ButtonProps }) {
  const { classes, cx } = useStyles();
  const [type, toggle] = useToggle(['login', 'register']);
  const [isOpened, setIsOpened] = useState(false);
  const [formState, dispatch] = useReducer(formReducer, initialFormState, init);
  const dispatchReduxAction = useDispatch();
  const [loginRequestStatus, setLoginRequestStatus] = useState('idle');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  let user = useSelector(selectUser);
  let isLoggedIn = useSelector(selectLoggedInState);

  const onTextChange = (e) => {
    handleTextChange(e.target.name, e.target.value, dispatch, formState);
  }

  // can login in - client side form evaluation first

  const canLogin = loginRequestStatus === 'idle' && formState.email.value && formState.password.value;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (canLogin) {
    try {
      setLoginRequestStatus('pending');
      const loggedInUser = await dispatchReduxAction(loginUser({email: formState.email.value, password: formState.password.value})).unwrap();
      setIsOpened(false);
      dispatch({
        type: "HANDLE SUBMIT",
        payload: initialFormState
      });
      let userId = loggedInUser._id;
      if (typeof userId === "string") {
        localStorage.setItem('user', userId);
      }
    } catch (err) {
      err.message.indexOf('401') !== -1 ? setEmailErrorMessage('username not found') : err.message.indexOf('400') !== -1 ? setPasswordErrorMessage('password incorrect') : setPasswordErrorMessage('login failed');
    } finally {
      setLoginRequestStatus('idle');
    }
  }
  };

  const handleClickRegister = () => {
    setIsOpened(() => !isOpened);
    toggle();
  };

  // need to fix onBlur and onFocus to how it was

  return (
  <>
    <Modal
      opened={isOpened}
      onClose={() => handleClickRegister()}
      title={upperFirst(type)}
    >
      <AuthenticationForm
      setIsOpened={setIsOpened}
      email={formState.email.value}
      password={formState.password.value}
      handleClickRegister={handleClickRegister}
      onSubmit={() => setIsOpened(false)}
      />
    </Modal>

    <Paper radius="md" p="xl"
     {...PaperProps}
     >
      <Text size="lg" weight={500}>
        let's go somewhere
      </Text>

      <br />

      {/* <ThirdPartyLogins /> */}

      <form
        value={formState}
        onSubmit={(e) =>  handleLogin(e)}
      >
        <Stack>
          <TextInput
            // required
            label="Email"
            placeholder="example@gmail.com"
            value={formState.email.value}
            name="email"
            onBlur={() => setEmailErrorMessage('')}
            // onBlur={e => onFocusOut(e.target.name, e.target.value, dispatch, formState)}
            onChange={onTextChange}
            error={emailErrorMessage}
          />

          <PasswordInput
            // required
            label="password"
            placeholder="your password"
            value={formState.password.value}
            name="password"
            onBlur={() => setPasswordErrorMessage('')}
            // onBlur={e => onFocusOut(e.target.name, e.target.value, dispatch, formState)}
            onChange={onTextChange}
            error={passwordErrorMessage}
          />
        </Stack>


        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => handleClickRegister()}
            size="xs"
          >Don't have an account? Register</Anchor>
          <Button type="submit">Login</Button>
        </Group>
      </form>
    </Paper>
    </>
  );
};