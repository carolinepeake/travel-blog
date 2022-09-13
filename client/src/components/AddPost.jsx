import React, { useReducer, useState, useEffect } from "react";
import { createStyles, Select, TextInput, TextArea, Button, onSubmit, Group, Box } from '@mantine/core';
// import { useForm } from '@mantine/form';

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

const formReducer = function(state, action) {
  switch(action.type) {
    case 'HANDLE INPUT TEXT':
      return {
        ...state,
        [action.field]: action.payload,
      };
    case 'HANDLE SELECT MULTIPLE':
      return {
        ...state,
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
        ...formInitialState
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export default function AddPost({ user }) {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [tags, setTags] = useState(['Scuba', 'Snowboarding']);

  // useEffect(() => {
  //   axios.get('/tags')
  //     .then(setTags(result.data))
  //     .catch(err => console.log(err))
  // }, []);

  function handleTextChange(e) {
    dispatch({
      type: "HANDLE INPUT TEXT",
      field: e.target.name,
      payload: e.target.value,
    });
    console.log(formState);
  };

  // function handleAddMultiple(e) {
  //   dispatch({
  //     type: "HANDLE ADD MULTIPLE",
  //     field: e.target.name,
  //     payload: e.target.value,
  //   });
 // };

 // could make add tag feature a form element nested inside the module form
   // add tag button could serve as submit button
   // name could be addTag, or newTag(s)
   // could then make handle add multiple dynamic and get rid of handleAddTag and corresponding reducer case

   function handleAddTag(e) {
    dispatch({
      type: "HANDLE ADD TAG",
      field: 'newTags',
      payload: formState.newTag,
    });
    dispatch({
      type: "HANDLE INPUT TEXT",
      field: 'newTag',
      payload: '',
    })
   // console.log('newTags: ', formState.newTags);
  };

  function handleSelectMultiple(e) {
    dispatch({
      type: "HANDLE SELECT MULTIPLE",
      field: e.target.name,
      payload: e.target.value,
    });
    // console.log('selected tags: ', formState.selectedTags);
  };

  function handleSubmitForm(e) {
    console.log('event target value from handleformSubmit: ', e.target.value);
    console.log('form state from handleFormSubmit: ', formState);
    axios.post('/posts', e.target.value)
    .then(response => console.log(response.status))
    .catch(err => console.log('error caught in handleSubmitForm: ', err))
    e.preventDefault();
  }

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
      <label>
        select tags:
        <select
        name="selectedTags"
        multiple={true}
        value={formState.selectedTags}
        onChange={(e) => handleSelectMultiple(e)}
      >
        {tags
        && (tags.map((tag, i) => {
          return <option
            type="select"
            value={tag}
            key={i}
            >{tag}</option>
         }))
        }
      </select>
      </label>
      <br />
      <label>
        add a new tag:
        <input
          type="text"
          name="newTag"
          value={formState.newTag}
          onChange={(e) => handleTextChange(e)}
          ></input>
        <button type="button" onClick={(e) => handleAddTag(e)}>add tag</button>
      </label>
      <br />
      {formState.newTags
      && (
        formState.newTags.map((nTag, i) => {
          return <span key={i}>{nTag}</span>
        }))
      }
      <br />

      {/* <label>
        add photos:
        <input
          type="file"
          value={e.target.value}
          ></input>
        <button
        // possibly supposed to be a different button type
        type="button" onClick={(e) => handleAddTag(e)}>add tag</button>
      </label> */}

      <button type="submit" value={formState} onClick={(e) => handleSubmitForm(e)}>add post</button>

    </form>
  )
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