import React from "react";
import { createStyles, Select, TextInput, TextArea, Button, onSubmit, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';


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


export default function AddPost({user}) {
  // You can add these classes as classNames to any Mantine input, it will work the same
  const { classes } = useStyles();

  const form = useForm({
    initialValues:{
      title: '',
      tags: [{tag: ''}],
      newTag: '',
      location: {
        city: '',
        state: '',
        country: '',
        region: '',
      },
      language: ['English'],
      description: '',
      photos: '',
      author: {
        name: 'carolinep',
        city: 'San Francisco',
        country: 'USA',
        image: '',
      },
      created_at: '',
    },
  });

  // const fields = form.tags.map((item, index) => (
  //   <Group key={index} mt="xs">
  //     <TextInput
  //       placeholder="e.g., surfing"
  //       sx={{ flex: 1 }}
  //       {...form.getInputProps(`tags.${index}.tag`)}
  //     />
  //   </Group>
  // ));

  return (

    {/* <form onSubmit={form.onSubmit(values => console.log(values))}> */}

      <TextInput label="post title" placeholder="e.g., bungee jumping in South Africa" classNames={classes} />

      <TextArea label="description" placeholder="..." className={classes} />

      <Select
        style={{ marginTop: 20, zIndex: 2 }}
        data={['scuba', 'kiteboarding', 'music', 'gastronomy']}
        //placeholder="add tags"
        label="what can you do here"
        classNames={classes}
      />

      // <Group>
      //   <TextInput label="add a new tag" placeholder="e.g., surfing" classNames={classes} {...form.getInputProps('tags.tag')}/>
      //   {/* {fields} */}
      //   <Button
      //       onClick={() => form.insertListItem('tags', { tag: ''})}
      //     >
      //       add a new tag
      //   </Button>

      // </Group>

      // <Group>
      //   location:
      //   <TextInput label="city" placeholder="city" classNames={classes} {...form.getInputProps('location.city')}/>
      //   <TextInput label="state" placeholder="option" classNames={classes} {...form.getInputProps('location.state')}/>
      //   <TextInput label="country" placeholder="country" classNames={classes} {...form.getInputProps('location.country')}/>
      //   <TextInput label="region" placeholder="region" classNames={classes} {...form.getInputProps('location.region')}/>
      // </Group>


      <Group position="right" mt="md">
          <Button type="submit">Add Post</Button>
      </Group>
    {/* </form> */}

  );
}

// export function AddPost({ user }) {
//   const [formState, dispatch] = useReducer(formReducer, initialFormState);

//   function handleTextChange(e) {
//     dispatch({
//       type: "HANDLE INPUT TEXT",
//       field: e.target.name,
//       payload: e.target.value,
//     });
//   };

//   function handleFormSubmit(e) {
//     console.log(e.target);
//   }

//   return(
//     <form onSubmit={form.onSubmit((values) => console.log(values))}>
//       <label>
//         title:
//         <input
//           type="text"
//           name="title"
//           value={formState.title}
//           onChange={(e) => handleTextChange(e)}
//           ></input>
//       </label>

//       <label>
//         add a new tag:
//         <input
//           type="text"
//           name="new tag"
//           value={formState.title}
//           onChange={(e) => handleTextChange(e)}
//           ></input>
//       </label>
//       <button type={button} onClick={}>add tag</button>
//       <select>
//         <option></option>
//         <input
//           type="text"
//           name="title"
//           value={formState.text}
//           ></input>
//       </select>
//     </form>
//   )
// };


// const examplePost = {id: 1, title: 'Shark Diving in Jupiter, FL', tags: ['scuba'], location: ['Florida', 'United States', 'North America'], language: ['English'], city: 'Jupiter, FL', country: 'United States', description: 'A sleepy southern coastal town an hour and a half drive north from Miami, Jupiter, Florida is home to some of the best shark diving in the world. Here, experienced divers have a rare opportunity to go deep and get personal with several species of shark including tiger, bull, nurse, reef, and the ellusive hammerhead. Emerald Charters is the better known of two (number per Google) dive companies providing this boutique dive experience.', photos: [], author: {name: 'carolinep', city: 'san francisco', country: 'usa', image: ''}, created_at: 'Aug 2022'};