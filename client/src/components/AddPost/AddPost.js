import React, { useReducer, useState, useEffect } from "react";
import axios from 'axios';
import { createStyles, Select, TextInput, TextArea, Button, onSubmit, Group, Box } from '@mantine/core';
// import { useForm } from '@mantine/form';
import FileUpload from './FileUpload.js';
import AddTag from './AddTag.js';
import SelectTags from './SelectTags.js';

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
  location: {
    city: '',
    state: '',
    country: '',
    region: '',
  },
  language: '',
  description: '',
  photos: [],
  author: {
    name: '',
    city: '',
    country: '',
    avatar: '',
  },
  created_at: ''
};

const formReducer = function(state, action) {
  switch(action.type) {
    case 'HANDLE INPUT TEXT':
      return {
        ...state,
        [action.field]: action.payload,
      };
    case 'HANDLE MULTIPLE INPUTS':
      return {
        ...state,
        [action.field]: [...state[action.field], action.payload],
      };
    case 'HANDLE ADD TAGS':
      return {
        ...state,
        [action.field]: [...state[action.field], action.payload],
      };
    case 'HANDLE ADD USER INFO':
      return {
        ...state,
        [action.field]: action.payload,
      };
    case 'HANDLE DELETE INPUT':
      state[action.field].splice(action.payload, 1);
      return {
        ...state,
        [action.field]: state[action.field],
      }
    case 'HANDLE SUBMIT':
      return {
        ...initialFormState
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export default function AddPost({ user, setUser }) {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [selectedTags, setSelectedTags] = useState(['select tags']);

  function handleAddUserInfo(author) {
    const authorInfo = {
      name: author.name,
      city: author.city,
      country: author.country,
      avatar: author.image
    };
    dispatch({
      type: "HANDLE ADD USER INFO",
      field: 'author',
      payload: authorInfo,
    });
    console.log(formState);
  };

  function handleTextChange(e) {
    dispatch({
      type: "HANDLE INPUT TEXT",
      field: e.target.name,
      payload: e.target.value,
    });
    console.log(formState);
  };

 // could make add tag feature a form element nested inside the module form
   // add tag button could serve as submit button
   // name could be addTag, or newTag(s)
   // could then make handle add multiple dynamic and get rid of handleAddTag and corresponding reducer case

   function handleAddTag(e) {
    dispatch({
      type: "HANDLE ADD TAGS",
      field: 'newTags',
      payload: formState.newTag,
    });
    dispatch({
      type: "HANDLE INPUT TEXT",
      field: 'newTag',
      payload: initialFormState.newTag,
    });
  };

  const handleDeleteOne = (i, field, e) => {
    console.log('name: ', e.target);
    dispatch({
      type: "HANDLE DELETE INPUT",
      field: field,
      payload: i,
    });
    e.preventDefault();
  }

  function handleSelectMultiple(e) {
    let value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    dispatch({
      type: "HANDLE MULTIPLE INPUTS",
      field: e.target.name,
      payload: value,
    });
  };

  function handleSubmitForm(e) {
    console.log('event target value from handleSubmitForm: ', e.target.value);
    console.log('form state from handleSubmitForm: ', formState);
    console.log('author from handle submit post: ', user._id);
    console.log('newTags from handle submit post: ', formState.newTags);
    console.log('all tags: ', selectedTags.concat(formState.newTags));
    const postBody = {
      title: formState.title,
      description: formState.description,
      author: user._id,
      tags: selectedTags.concat(formState.newTags),
    };
    axios.post('http://localhost:3001/posts', postBody)
    .then(response => console.log('response from handleSubmitForm: ', response))
    .catch(err => console.log('error caught in handleSubmitForm: ', err))
    e.preventDefault();
    // close module
    // const tagBody = {
    //   tags: formState.newTags,
    // };
    // axios.post('http://localhost:3001/tags/addTags', tagBody)
    // .then(response => console.log('response from handleSubmitForm add tags: ', response))
    // .catch(err => console.log('error caught in handleSubmitForm add tags: ', err))
  };

  function handleClickGetPosts(e) {
    axios.get('http://localhost:3001/tests/authors')
    .then(response => console.log('response from  handleClickGetauthors: ', response.data))
    .catch(err => console.log('error caught in handleClickGetauthors: ', err))
    e.preventDefault();
  };
  //   axios.get('http://localhost:3001/posts')
  //   .then(response => console.log('response from  handleClickGetPosts: ', response.data))
  //   .catch(err => console.log('error caught in handleClickGetPosts: ', err))
  //   e.preventDefault();
  // };

  return(
    <form onSubmit={(e) => console.log(e.target)}>

      <label>
        title:
        <input
          type="text"
          name="title"
          value={formState.title}
          onChange={(e) => handleTextChange(e)}
          ></input>
      </label>

      <br />

      <label>
        description:
        <textarea
          type="text"
          name="description"
          value={formState.description}
          onChange={(e) => handleTextChange(e)}
        ></textarea>
      </label>

      <br />

      <SelectTags selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>

      <br />

      <AddTag formState={formState} dispatch={dispatch} handleTextChange={handleTextChange} handleAddTag={handleAddTag} handleDeleteOne={handleDeleteOne}/>

      <br />

      <button type="button" onClick={(e) => handleClickGetPosts(e)}>get posts</button>

      <br />

      <FileUpload formState={formState} dispatch={dispatch} handleDeleteOne={handleDeleteOne}/>

      <button type="submit" value={formState} onClick={(e) => handleSubmitForm(e)}>add post</button>

    </form>
  );
};


// const examplePost = {id: 1, title: 'Shark Diving in Jupiter, FL', tags: ['scuba'], location: ['Florida', 'United States', 'North America'], language: ['English'], city: 'Jupiter, FL', country: 'United States', description: 'A sleepy southern coastal town an hour and a half drive north from Miami, Jupiter, Florida is home to some of the best shark diving in the world. Here, experienced divers have a rare opportunity to go deep and get personal with several species of shark including tiger, bull, nurse, reef, and the ellusive hammerhead. Emerald Charters is the better known of two (number per Google) dive companies providing this boutique dive experience.', photos: [], author: {name: 'carolinep', city: 'san francisco', country: 'usa', image: ''}, created_at: 'Aug 2022'};

//   switch('HANDLE INPUT TEXT')
//     case:  {
//     }
//   switch('HANDLE SUBMIT')
//   switch('HANDLE SELECT')
// }

// export const AddPost = function({user}) {
//   // You can add these classes as classNames to any Mantine input, it will work the same
//   const { classes } = useStyles();
//   const [formState, dispatch] = useReducer(formReducer, initialFormState)


//   // reducer might be unnecessary ->


//   const fields = form.tags.map((item, index) => (
//     <Group key={index} mt="xs">
//       <TextInput
//         placeholder="e.g., surfing"
//         sx={{ flex: 1 }}
//         {...form.getInputProps(`tags.${index}.tag`)}
//       />
//     </Group>
//   ));

//   return (
//     <form onSubmit={(e) => handleSubmit(e)}>
//       <input type="text" label="title" placeholder="e.g., bungee jumping in South Africa" required classNames={classes} />

//       <textarea label="description" placeholder="..." className={classes} />

//       <select multiple
//         style={{ marginTop: 20, zIndex: 2 }}
//         data={['scuba', 'kiteboarding', 'music', 'gastronomy']}
//         placeholder="add tags"
//         label="what can you do here"
//         classNames={classes}
//       />
//       {/* // can map options */}

//          {/* <Group>
//           <TextInput label="add a new tag" placeholder="e.g., surfing" classNames={classes} {...form.getInputProps('tags.tag')}/>
//             {fields}
//           <Button
//             onClick={() => form.insertListItem('tags', { tag: ''})}
//           >
//             add a new tag
//         </Button>

//       </Group>

//       <Group>
//         location:
//         <TextInput label="city" placeholder="city" classNames={classes} {...form.getInputProps('location.city')}/>
//         <TextInput label="state" placeholder="option" classNames={classes} {...form.getInputProps('location.state')}/>
//         <TextInput label="country" placeholder="country" classNames={classes} {...form.getInputProps('location.country')}/>
//         <TextInput label="region" placeholder="region" classNames={classes} {...form.getInputProps('location.region')}/>
//       </Group>


//       <Group position="right" mt="md">
//           <Button type="submit">Add Post</Button>
//       </Group> */}
//      </form>

//   );
// }