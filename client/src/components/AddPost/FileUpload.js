import React, { useReducer, useState, useEffect } from "react";
import axios from 'axios';
import { createStyles, Select, TextInput, TextArea, Button, onSubmit, Group, Box, Center } from '@mantine/core';
// import { FileInput, FileInputProps, Group, Center } from '@mantine/core';
import { IconPhoto } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
  },

  input: {
    height: 'auto',
  },

  label: {
    pointerEvents: 'none',
    fontSize: theme.fontSizes.sm,
    paddingLeft: theme.spacing.sm,
    zIndex: 1,
  },

  fileList: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
    fontSize: theme.fontSizes.xs,
    padding: '3px 7px',
    borderRadius: theme.radius.sm,
  },

  file: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    border: 'solid black thin',
    borderRadius: '5px',
    paddingTop: theme.spacing.xs / 3,
    paddingBottom: theme.spacing.xs / 3,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.sm,
    position: 'relative',
    zIndex: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: 200,
    display: 'inline-block',
  },

  close: {
    position: 'absolute',
    zIndex: 2,
    fontSize: theme.fontSizes.xs,
    right: '2px',
    top: '1px',
    paddingTop: 0,

    '&:hover': {
      cursor: 'pointer',
    },
  },

  photoPreviews: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gridColumn: '1 / 3',
  },

  imagePreview: {
    width: '20%',
    height: '20%',
    marginRight: '1%',
  },

}));
// const ValueComponent: FileInputProps['valueComponent'] = ({ value }) => {
//   if (Array.isArray(value)) {
//     return (
//       <Group spacing="sm" py="xs">
//         {value.map((file, index) => (
//           <Value file={file} key={index} />
//         ))}
//       </Group>
//     );
//   }

//   return <Value file={value} />;
// };

// function Demo() {
//   return (
//     <>
//       <FileInput label="Multiple" placeholder="Multiple" multiple valueComponent={ValueComponent} />
//       <FileInput mt="md" label="Single" placeholder="Single" valueComponent={ValueComponent} />
//     </>
//   );
// }

export default function FileUpload({ formState, dispatch, handleDeleteOne, previews, setPreviews }) {
  const fileInput = React.createRef();
  const { classes, cx } = useStyles();

  const handleUploadFile = (event) => {
    dispatch({
      type: "HANDLE MULTIPLE INPUTS",
      field: 'fileList',
      payload: event.target.files[0],
    });
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base48image = reader.result;
      setPreviews([...previews, base48image]);
    };
	 };

  return (
    <>
      <label>
        add photos:
        <input
          id="fileInput"
          type="file"
          name="photos"
          accept="image/png, image/jpeg"
          multiple
          ref={fileInput}
          onChange={handleUploadFile} />
      </label>
      {formState.fileList
      && (
        formState.fileList.map((file, i) => {
          return (
            <Center
              key={i}
              inline
              className={classes.fileList}
            >
              <IconPhoto size={14} style={{ marginRight: 5 }} />
              <span className={classes.file}>
                {file.name}
                <span className={classes.close} onClick={(e) => handleDeleteOne(i, 'fileList', e)}>x</span>
              </span>
            </Center>
          );
        })
			)}
      <br />
      <div className={classes.photoPreviews}>
        {previews.map((photo) => (
          <img src={photo} alt="" key={photo} className={classes.imagePreview} />
        ))}
      </div>
    </>
  );
};

 // <div key={i}>
					// <p className={classes.file}>Filename: {photo.name}
					{/* <p>Filetype: {photo.type}</p>
					<p>Size in bytes: {photo.size}</p>
					<p>
						lastModifiedDate:{' '} */}
						{/* {photo.lastModifiedDate.toLocaleDateString()} */}
        //     <span className={classes.close} onClick={(e) => handleDeleteOne(i, 'photos', e)}>x</span>
				// 	</p>

				// </div>