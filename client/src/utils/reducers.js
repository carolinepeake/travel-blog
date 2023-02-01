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
        [action.field]: [...state[action.field], action.payload],
      };
    case 'HANDLE DELETE INPUT':
      let old = [...state[action.field]];
      old.splice(action.payload, 1);
      return {
        ...state,
        [action.field]: old,
      }
    case 'HANDLE SUBMIT':
      return init(action.payload);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
