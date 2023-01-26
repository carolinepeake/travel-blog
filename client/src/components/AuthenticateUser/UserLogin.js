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
  email: '',
  password: '',
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

// can make a separate component for AuthenticationForm and render it as a child of the modal and as an alternative to the modal (user sidebar) and pass down props to it to make it dynamic

export default function UserLogin({ PaperProps, ButtonProps }) {
  const { classes, cx } = useStyles();
  const [type, toggle] = useToggle(['login', 'register']);
  const [isOpened, setIsOpened] = useState(false);
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const dispatchReduxAction = useDispatch();
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [loginRequestStatus, setLoginRequestStatus] = useState('idle');


  // need to add image to validation => if wrong file type
    // validate: (values) => {
    //   // can prolly refactor this to be DRY
    //   if (type === 'login') {
    //     return {
    //       email:
    //         /^\S+@\S+$/.test(values.email)
    //           ? null
    //           : 'Invalid email',
    //       password:
    //         values.password.length < 6
    //           ? 'Password should include at least 6 characters'
    //           : null,
    //     };
    //   }
    //   if (type === 'register') {
    //     return {
    //       email:
    //         /^\S+@\S+$/.test(values.email)
    //           ? null
    //           : 'Invalid email',
    //       password:
    //         values.password.length < 6
    //           ? 'Password should include at least 6 characters'
    //           : null,
    //       confirmPassword:
    //         values.confirmPassword !== values.password
    //           ? 'Passwords do not match'
    //           : null,
    //     };
    //   }
    //   return {};
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      // password: (value) => (value.length < 6 ? 'Password should include at least 6 characters' : null),
      // confirmPassword: (value, values) =>
      // value !== values.password ? 'Passwords do not match' : null,
    // },

  //   validateInputOnChange: [
  //     'image',
  //   ],

  //   validateInputOnBlur: [
  //     'email',
  //     'password',
  //     'confirmPassword',
  //   ],
  // });

  let user = useSelector(selectUser);
  let isLoggedIn = useSelector(selectLoggedInState);

  function handleTextChange(e) {
    dispatch({
      type: "HANDLE SINGLE INPUT",
      field: e.target.name,
      payload: e.target.value,
    });
  };

  // can login in - client side form evaluation first

  const canLogin = loginRequestStatus === 'idle' && formState.email && formState.password;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (canLogin) {
    try {
      setLoginRequestStatus('pending');
      const response = await dispatchReduxAction(loginUser(formState)).unwrap();
      console.log('response from login user: ', response);
      setIsOpened(false);
      dispatch({
        type: "HANDLE SUBMIT"
      });
      // let userId = user._id;
      // if (userId) {localStorage.setItem('user', JSON.stringify(userId));}
    } catch (err) {
      err.message.indexOf('401') !== -1 ? setEmailErrorMessage('username not found') : err.message.indexOf('400') !== -1 ? setPasswordErrorMessage('password incorrect') : setPasswordErrorMessage('login failed');
      // dispatch({
      //   type: "HANDLE SUBMIT"
      // });
    } finally {
      setLoginRequestStatus('idle');
    }
  }
  };

  const handleClickRegister = () => {
    setIsOpened(() => !isOpened);
    toggle();
  };

  // let errorMessages = {};

  // const handleError = (errors) => {
  //   if (errors.password) {
  //     errorMessages.passwordErrorMessage = 'passwords must match and be at least 6 characters';
  //   }
  //   if (errors.email) {
  //     errorMessages.emailErrorMessage = 'please provide a valid email';
  //   }
  //   if (errors.image) {
  //     errorMessages.imageErrorMessage = 'image file size must not be any larger than 64 MB';
  //   };
  // };

  // const handleSubmit = (values) => {
  //   if (type === 'register') {
  //     console.log('handling registration');
  //     handleCreateAccount(values);
  //   } else {
  //     console.log('handling logging in');
  //     handleLogin(values);
  //   }
  // };

  return (
  <>
    <Modal
      opened={isOpened}
      onClose={() => handleClickRegister()}
      title={upperFirst(type)}
    >
      <AuthenticationForm
      // form={form}
      setIsOpened={setIsOpened}
      // handleSubmit={handleSubmit}
      // handleError={handleError}
      // values={form.values}
      // errors={form.errors}
      email={formState.email}
      password={formState.password}
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
        // onSubmit={form.onSubmit(
        // (values, _event) => {handleSubmit(values)},
        // (validationErrors, _values, _event) => {console.log(validationErrors); handleError(validationErrors)})}
      >
        <Stack>
          <TextInput
            // required
            label="Email"
            placeholder="example@gmail.com"
            value={formState.email}
            name="email"
            onBlur={() => setEmailErrorMessage('')}
            onFocus={() => setEmailErrorMessage('')}
            onChange={(event) => handleTextChange(event)}
            error={emailErrorMessage}
            // error={form.errors.email && 'invalid email'}
            // {...form.getInputProps('email')}
          />

          <PasswordInput
            // required
            label="password"
            placeholder="your password"
            value={formState.password}
            name="password"
            onFocus={() => setPasswordErrorMessage('')}
            onBlur={() => setPasswordErrorMessage('')}
            onChange={(event) => handleTextChange(event)}
            error={passwordErrorMessage}
            // error={form.errors.password ? 'password must include at least 6 characters' : `${errorMessage}`}
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