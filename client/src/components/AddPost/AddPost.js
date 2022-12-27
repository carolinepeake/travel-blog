import React, { useReducer, useState, useEffect } from "react";
import axios from 'axios';
import { createStyles, Select, TextInput, Textarea, Button, onSubmit, Group, Box } from '@mantine/core';
// import { useForm } from '@mantine/form';
import { toUpperFirst } from '../../utils/utils.js';
import FileUpload from './FileUpload.js';
import AddTag from './AddTag.js';
import SelectTags from './SelectTags.js';
import PlacesAutocomplete from './PlacesAutocomplete.js';


const useStyles = createStyles((theme) => ({
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

export default function AddPost({ user, setUser, setPosts, setAddPostOpened }) {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [previews, setPreviews] = useState([]);
  const [imageValue, setImageValue] = useState(null);

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

 // could make add tag feature a form element nested inside the module form
   // add tag button could serve as submit button
   // name could be addTag, or newTag(s)
   // could then make handle add multiple dynamic and get rid of handleAddTag and corresponding reducer case

  // can also pass down a component or element as props instead of all pf that component's props

   function handleAddTag(item) {
    dispatch({
      type: "HANDLE MULTIPLE INPUTS",
      field: 'selectedTags',
      payload: item.value,
    });
    // dispatch({
    //   type: "HANDLE SINGLE INPUT",
    //   field: 'newTag',
    //   payload: initialFormState.newTag,
    // });
    console.log(formState.selectedTags);
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
    console.log(formState.selectedTags);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (previews) {
        const promises = [];
        for (let i = 0; i < previews.length; i += 1) {
          const promise = axios.post('posts/cloudinary/upload', {
            image: previews[i],
          });
          promises.push(promise);
        }
        const uploadedPhotos = await Promise.all(promises);
        uploadedPhotos.forEach((photo) => {
          postBody.photos.push(photo.data.url);
        });
      }
      const savedLocation = await axios.post('/locations', locationBody);
      postBody.location = savedLocation.data._id;
      const savedPost = await axios.post('/posts', postBody);
      console.log('response from handleSubmitPost: ', savedPost.data);
      const posts = await axios.get('/posts');
      setPosts(posts.data);
      dispatch({
        type: "HANDLE SUBMIT"
      });
      setAddPostOpened(false);
    } catch (err) {
      console.log('error submitting form: ', err);
    }
  };

  const regions = ['Africa','Australia','Central America', 'Central Asia', 'East Asia', 'Europe', 'North Africa', 'North America', 'South America', 'Southeast Asia', 'New Zealand', 'Middle East'];

  return(
    <form value={formState} onSubmit={(e) => handleSubmitForm(e)}>

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
        // error="character limit is"
        // errorProps={errorProps}
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

      <Button type="submit">Add Post!</Button>
    </form>
  );
};

