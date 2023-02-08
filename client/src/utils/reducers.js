// could make a useFormReducer custom hook
export const init = function(initialFormState) {
  return initialFormState;
};

export const formReducer = function(state, action) {
  switch(action.type) {
    case 'HANDLE SINGLE INPUT':
      return {
        ...state,
        [action.field]: action.payload,
      };
    case 'HANDLE MULTIPLE INPUTS':
      return {
        ...state,
        [action.field]: {...state[action.field], value: [...state[action.field].value, action.payload]}
      };
    case 'HANDLE DELETE INPUT':
      let old = [...state[action.field].value];
      old.splice(action.payload, 1);
      return {
        ...state,
        [action.field]: {...state[action.field], value: old}
      }
    case 'HANDLE SUBMIT':
      return init(action.payload);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

// FORM HANDLERS

export const handleTextChange = (name, value, dispatch, formState) => {
  const { hasError, error } = validateInput(name, value, formState);
  // let isFormValid = true;

  // for (const key in formState) {
  //   const item = formState[key]
  //   // Check if the current field has error
  //   if (key === name && hasError) {
  //     isFormValid = false
  //     break
  //   } else if (key !== name && item.hasError) {
  //     // Check if any other field has error
  //     isFormValid = false
  //     break
  //   }
  // }

  dispatch({
    type: "HANDLE SINGLE INPUT",
    field: name,
    payload: {
      // name,
      value,
      hasError,
      error,
      touched: false,
      // isFormValid: true,
    },
  })
  // console.table({`${name} state`: formState.name});
};

export const onFocusOut = (name, value, dispatch, formState) => {
  const { hasError, error } = validateInput(name, value, formState)
  // let isFormValid = true
  // for (const key in formState) {
  //   const item = formState[key]
  //   if (key === name && hasError) {
  //     isFormValid = false
  //     break
  //   } else if (key !== name && item.hasError) {
  //     isFormValid = false
  //     break
  //   }
  // }
  dispatch({
    type: "HANDLE SINGLE INPUT",
    field: name,
    payload: {
      // name,
      value,
      hasError,
      error,
      touched: true,
      // isFormValid: true,
    },
  });
};

export const handleDeleteFile = (i, field, dispatch, formState) => {
  dispatch({
    type: "HANDLE DELETE INPUT",
    field: field,
    payload: i,
  });
};

export const validateInput = (name, value, formState) => {
  switch (name) {
    case "email":
      if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(value)) {
        return {
          hasError: true,
          error: "Please provide a valid email"
        };
      } else {
        return {
          hasError: false,
          error: ""
        };
      }
    case "password":
      if (value.trim().length < 6) {
        return {
          hasError: true,
          error: "Password must have at least 6 characters"
        };
      } else {
        return {
          hasError: false,
          error: ""
        };
      }
    case "confirmPassword":
      if (value.trim().length < 6) {
        return {
          hasError: true,
          error: "Password must have at least 6 characters"
        };
      } else if (formState.password.value !== value.trim()) {
        return {
          hasError: true,
          error: "Passwords must match"
        };
      } else {
        return {
          hasError: false,
          error: ""
        };
      }
    default:
      return {
        hasError: false,
        error: "",
      };
  }
};



// import handletextchange function
// validate all inputs before submitting form
// make sure not immuting nested state
// make sure dispatch function is defined
// make sure trimming values before saving them in database