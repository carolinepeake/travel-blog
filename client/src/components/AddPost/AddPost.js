import React, { useReducer, useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createStyles, Select, TextInput, Textarea, Button, onSubmit, Group, Box } from '@mantine/core';

import { toUpperFirst } from '../../utils/utils.js';
import { formReducer, init } from '../../utils/reducers.js';
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
  title: '',
  tags: [],
  city: '',
  state: '',
  country: '',
  region: '',
  description: '',
  photos: [],
  location: '',
  language: 'English',
};


export default function AddPost({ setAddPostOpened }) {
  const { classes } = useStyles();
  const [formState, dispatch] = useReducer(formReducer, initialFormState, init);
  const [previews, setPreviews] = useState([]);
  const [imageValue, setImageValue] = useState('');
  const [addPostRequestStatus, setAddPostRequestStatus] = useState('idle');
  const dispatchReduxAction = useDispatch();
  const [errors, setErrors] = useState({});

  function handleTextChange(e) {
    dispatch({
      type: "HANDLE SINGLE INPUT",
      field: e.target.name,
      payload: e.target.value,
    });
  };

  //  function handleAddTag(item) {
  //   dispatch({
  //     type: "HANDLE MULTIPLE INPUTS",
  //     field: 'selectedTags',
  //     payload: item.value,
  //   });
  // };

  const handleDeleteFile = (i, field, e) => {
    dispatch({
      type: "HANDLE DELETE INPUT",
      field: field,
      payload: i,
    });
    setImageValue('');
    if (field === 'photos') {
      let old = [...previews];
      setPreviews(() => {
        old.splice(i, 1);
        return old;
      });
      if (formState.photos.length === 0) {
        dispatch({
          type: "HANDLE SINGLE INPUT",
          field: field,
          payload: '',
        });
      }
    }
  };

  function handleSelectMultiple(item) {
    // let values = Array.from(
    //   event.target.selectedOptions,
    //   (option) => option.value
    // );
    dispatch({
      type: "HANDLE SINGLE INPUT",
      field: 'selectedTags',
      payload: query,
    });
  };

  const author = useSelector(selectUser)._id;

  const postBody = {...formState, author};

  const locationBody = {
    region: formState.region,
    state: formState.state,
    city: formState.city,
    country: formState.country
  };


  const canSave = postBody.author && addPostRequestStatus === 'idle';

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (formState.photos.length > 0) {
      postBody.photos = formState.photos.filter((file) => file.hasOwnProperty('cloudinaryImageUrl')).map(file => file.cloudinaryImageUrl);
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

  const regions = ['Africa','Australia','Central America', 'Central Asia', 'East Asia', 'Europe', 'North Africa', 'North America', 'South America', 'Southeast Asia', 'New Zealand', 'Middle East'];

  return(
    <form value={formState} onSubmit={handleSubmitForm} className={classes.form}>

        <TextInput
          label="Title"
          required
          placeholder="Post title"
          type="text"
          name="title"
          id="title"
          value={formState.title}
          onChange={handleTextChange}
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
        onChange={handleTextChange}
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
        tags={formState.tags}
        handleTextChange={handleTextChange}
      />

      <br />

      <FileUpload formState={formState} dispatch={dispatch} handleDeleteFile={handleDeleteFile}/>

      <br />

      <Button type="submit">Add Post!</Button>
    </form>
  );
};

