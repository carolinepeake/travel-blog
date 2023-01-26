import React, { useReducer, useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createStyles, Select, TextInput, Textarea, Button, onSubmit, Group, Box } from '@mantine/core';

import { toUpperFirst } from '../../utils/utils.js';
import { fetchPosts, addNewPost, filterSet } from '../../state/postsSlice.js';
import { selectUser } from '../../state/usersSlice.js';
import FileUpload from './FileUpload.js';
import AddTag from './AddTag.js';
import SelectTags from './SelectTags.js';
import PlacesAutocomplete from './PlacesAutocomplete.js';

const useStyles = createStyles((theme) => ({
  form: {
    position: 'relative',
    width: '100%',
  },

  root: {
    position: 'relative',
  },

  input: {
    height: 'auto',
    paddingTop: 18,
  },

  label: {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));

const initialFormState = {
  title: '',
  newTag: '',
  newTags: [],
  selectedTags: [],
  city: '',
  state: '',
  country: '',
  region: '',
  language: '',
  description: '',
  fileList: [],
};

// could make a useFormReducer custom hook
const formReducer = function(state, action) {
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
      return {
        ...initialFormState
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export default function AddPost({ setAddPostOpened }) {
  const { classes } = useStyles();
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [previews, setPreviews] = useState([]);
  const [imageValue, setImageValue] = useState(null);
  const [addPostRequestStatus, setAddPostRequestStatus] = useState('idle');
  const dispatchReduxAction = useDispatch();
  const [errors, setErrors] = useState({});

  let user = useSelector(selectUser);

  const locationBody = {
    region: formState.region,
    state: formState.state,
    city: formState.city,
    country: formState.country
  };

  const postBody = {
    title: formState.title,
    description: formState.description,
    location: '',
    city: formState.city,
    state: formState.state,
    country: formState.country,
    region: formState.region,
    language: 'English',
    tags: formState.selectedTags.concat(formState.newTags),
    author: user._id,
    photos: []
  };

  function handleTextChange(e) {
    console.log('event from handle text change: ', e);
    dispatch({
      type: "HANDLE SINGLE INPUT",
      field: e.target.name,
      payload: e.target.value,
    });
  };

   function handleAddTag(item) {
    dispatch({
      type: "HANDLE MULTIPLE INPUTS",
      field: 'selectedTags',
      payload: item.value,
    });
  };

  const handleDeleteFile = (i, field, e) => {
    console.log('name: ', e.target);
    console.log('event: ', e);
    dispatch({
      type: "HANDLE DELETE INPUT",
      field: field,
      payload: i,
    });
    setImageValue(null);
    if (field === 'fileList') {
      let old = [...previews];
      setPreviews(() => {
        old.splice(i, 1);
        return old;
      });
      if (formState.fileList.length === 0) {
        dispatch({
          type: "HANDLE SINGLE INPUT",
          field: field,
          payload: '',
        });
      }
    }
  };

  function handleSelectMultiple(item) {
    // let value = Array.from(
    //   event.target.selectedOptions,
    //   (option) => option.value
    // );
    dispatch({
      type: "HANDLE SINGLE INPUT",
      field: 'selectedTags',
      payload: query,
    });
  };

  const canSave = postBody.author && addPostRequestStatus === 'idle';

  const handleSubmitForm = async (e) => {
    e.preventDefault();
      if (formState.fileList.length > 0) {
        formState.fileList.filter((file) => file.hasOwnProperty('cloudinaryImageUrl'));
        const uploadedPhotos = formState.fileList.map(file => file.cloudinaryImageUrl);
        postBody.photos = uploadedPhotos;
      }
        try {
      const savedLocation = await axios.post('/locations', locationBody);
      postBody.location = savedLocation.data._id;
      if (canSave) {
        setAddPostRequestStatus('pending');
        const savedPost = await dispatchReduxAction(addNewPost(postBody)).unwrap();
        console.log('response from handleSubmitPost: ', savedPost);
        // would really want to reset any filters to none (maybe unless filter is author === self)

        dispatchReduxAction(filterSet({type: 'none'}));
        dispatchReduxAction(fetchPosts());
        dispatch({
          type: "HANDLE SUBMIT"
        });
        setAddPostOpened(false);
      }
    } catch (err) {
      console.error('error submitting add post form: ', err);
    } finally {
      setAddPostRequestStatus('idle');
    }
  };

  const regions = ['Africa','Australia','Central America', 'Central Asia', 'East Asia', 'Europe', 'North Africa', 'North America', 'South America', 'Southeast Asia', 'New Zealand', 'Middle East'];

  return(
    <form value={formState} onSubmit={(e) => handleSubmitForm(e)} className={classes.form}>

        <TextInput
          label="Title"
          required
          placeholder="Post title"
          type="text"
          name="title"
          id="title"
          value={formState.title}
          onChange={(e) => handleTextChange(e)}
          ></TextInput>

     <br />

      <Textarea
        label="Description"
        required
        placeholder="Post description"
        value={formState.description}
        name="description"
        type="text"
        id="description"
        autosize
        onChange={(e) => handleTextChange(e)}
        // character limit error
        // error={errors.descriptionError}
      ></Textarea>

      <br />

      <Group>

        {['city', 'state', 'country'].map((locality) => {
          return (
            <PlacesAutocomplete
              locality={locality}
              key={locality}
              formState={formState}
              handleTextChange={handleTextChange}
              label={`Activity ${toUpperFirst(locality)}`}
              placeholder={`Activity ${locality}, if applicable`}
            />
          )
        })}

        <Select
          label="Region"
          name="region"
          placeholder="Activity region"
          value={formState.region}
          required
          searchable
          data={regions}
          onChange={(query) => handleTextChange({target: {value: query, name: 'region'}})}
        ></Select>

      </Group>

        <br/>

      <SelectTags
        selectedTags={formState.selectedTags}
        handleTextChange={handleTextChange}
      />

      <br />

      <FileUpload formState={formState} dispatch={dispatch} handleDeleteFile={handleDeleteFile} previews={previews} setPreviews={setPreviews} imageValue={imageValue} setImageValue={setImageValue}/>

      <br />

      <Button type="submit">Add Post!</Button>
    </form>
  );
};

