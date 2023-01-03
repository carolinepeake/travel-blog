const initialFormState = {
  title: '',
  selectedTags: [],
  newTag: '',
  newTags: [],
  location: {
    city: '',
    state: '',
    country: '',
    region: '',
  },
  language: '',
  description: '',
  photos: '',
  author: {
    name: '',
    city: '',
    country: '',
    avatar: '',
  },
  created_at: ''
};

const formReducer = function(state = {}, action) {
  switch(action.type) {
    case 'HANDLE INPUT TEXT':
      return {
        ...state,
        [action.field]: action.payload,
      };
    case 'HANDLE SELECT MULTIPLE':
      return {
        ...state,
        // could also use concat
        [action.field]: [...state[action.field], action.payload],
      };
    // case 'HANDLE ADD MULTIPLE':
    //   return {
    //     ...state,
    //     [action.field]: [...state[action.field], action.payload],
    //   };
    case 'HANDLE ADD TAG':
      return {
        ...state,
        [action.field]: [...state[action.field], action.payload],
      };
    case 'HANDLE SUBMIT':
      return {
        ...initialFormState
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
