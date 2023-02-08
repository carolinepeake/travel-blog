import React, { useReducer, useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createStyles, Select, TextInput, Textarea, Button, onSubmit, Group, Box } from '@mantine/core';

import { toUpperFirst } from '../../utils/utils.js';
import { formReducer, init, onFocusOut, handleTextChange, handleDeleteFile } from '../../utils/reducers.js';
import { fetchPosts, addNewPost, filterSet } from '../../state/postsSlice.js';
import { selectUser } from '../../state/usersSlice.js';
import FileUpload from './FileUpload.js';
//import AddTag from './AddTag.js';
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
  title: { value: "", touched: false, hasError: false, error: "" },
  tags: { value: [], touched: false, hasError: false, error: "" },
  city: { value: "", touched: false, hasError: false, error: "" },
  state: { value: "", touched: false, hasError: false, error: "" },
  country: { value: "", touched: false, hasError: false, error: "" },
  region: { value: "", touched: false, hasError: false, error: "" },
  description: { value: "", touched: false, hasError: false, error: "" },
  photos: { value: [], touched: false, hasError: false, error: "" },
  location: { value: "", touched: false, hasError: false, error: "" },
  language: { value: "English", touched: true, hasError: false, error: "" },
};

const REGIONS = ['Africa','Australia','Central America', 'Central Asia', 'East Asia', 'Europe', 'North Africa', 'North America', 'South America', 'Southeast Asia', 'New Zealand', 'Middle East'];

export default function AddPost({ setAddPostOpened }) {
  const { classes } = useStyles();
  const [formState, dispatch] = useReducer(formReducer, initialFormState, init);
  const [addPostRequestStatus, setAddPostRequestStatus] = useState('idle');
  const dispatchReduxAction = useDispatch();

  const onTextChange = (e) => {
    handleTextChange(e.target.name, e.target.value, dispatch, formState);
  };

  const onDelete = (i, field) => {
    handleDeleteFile(i, field, dispatch, formState);
  };

  const author = useSelector(selectUser)._id;

  let postBody = {};
  for (const field in formState) {
    postBody[field] = formState[field].value;
  };
  postBody = {...postBody, author};

  const locationBody = {
    region: formState.region.value,
    state: formState.state.value,
    city: formState.city.value,
    country: formState.country.value
  };


  const canSave = postBody.author && addPostRequestStatus === 'idle';

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (formState.photos.value.length > 0) {
      postBody.photos = formState.photos.value.map(file => file.url);
    }
    try {
      const savedLocation = await axios.post('/locations', locationBody);
      postBody.location = savedLocation.data._id;
      if (canSave) {
        setAddPostRequestStatus('pending');
        await dispatchReduxAction(addNewPost(postBody)).unwrap();
        dispatchReduxAction(filterSet({type: 'none'}));
        dispatchReduxAction(fetchPosts());
        dispatch({
          type: "HANDLE SUBMIT",
          payload: initialFormState
        });
        setAddPostOpened(false);
      }
    } catch (err) {
      console.error('error submitting add post form: ', err);
    } finally {
      setAddPostRequestStatus('idle');
    }
  };

  return(
    <form value={formState} onSubmit={handleSubmitForm} className={classes.form}>

        <TextInput
          label="Title"
          required
          placeholder="Post title"
          type="text"
          name="title"
          id="title"
          value={formState.title.value}
          onChange={onTextChange}
          error={formState.title.value.length > 150 && "Title may not be longer than 150 characters"}
          ></TextInput>

     <br />

      <Textarea
        label="Description"
        required
        placeholder="Post description"
        value={formState.description.value}
        name="description"
        type="text"
        id="description"
        autosize
        onChange={onTextChange}
        error={formState.description.value.length > 1500 ? "Description may not be longer than 1500 characters" : formState.description.touched && formState.description.hasError && formState.description.error}
      ></Textarea>

      <br />

      <Group>

        {['city', 'state', 'country'].map((locality) => {
          return (
            <PlacesAutocomplete
              locality={locality}
              key={locality}
              formState={formState}
              handleTextChange={onTextChange}
              label={`Activity ${toUpperFirst(locality)}`}
              placeholder={`Activity ${locality}, if applicable`}
            />
          )
        })}

        <Select
          label="Region"
          name="region"
          placeholder="Activity region"
          value={formState.region.value}
          required
          searchable
          data={REGIONS}
          onChange={(query) => onTextChange({target: {value: query, name: 'region'}})}
        ></Select>

      </Group>

        <br/>

      <SelectTags
        tags={formState.tags.value}
        handleTextChange={onTextChange}
      />

      <br />

      <FileUpload formState={formState} dispatch={dispatch} handleDeleteFile={onDelete}/>

      <br />

      <Button type="submit">Add Post!</Button>
    </form>
  );
};

