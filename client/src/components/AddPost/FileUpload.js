import React, { useReducer, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { createStyles, Select, TextInput, TextArea, Button, onSubmit, Group, Box, Center, FileInput } from '@mantine/core';
// import { FileInput, FileInputProps, Group, Center } from '@mantine/core';
import { IconPhoto, IconUpload } from '@tabler/icons';

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
    marginRight: '1%',
    marginBottom: '1%',
    justifyContent: 'center',
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
   // display: 'grid',
    //gridTemplateColumns: 'repeat(4, 1fr)',
   // gridGap: '1%',
   //grid-gap: 1em;
    //position: relative;
   // z-index: 1;
    display: 'flex',
   flexDirection: 'row',
    //justifyContent: 'center',
    flexWrap: 'wrap',
   // gridColumn: '1 / 3',
    overflow: 'hidden',
  },

  //to-do: make the height/length ratio/measurement change dynamically based on if the photo is landscape or portrait
  imagePreview: {
    // width: '20%',
    // height: '20%',
    marginRight: '1%',
    flexBasis: 125,
    positionSelf: 'center',
    objectFit: 'cover',
    aspectRatio: '1',
    overflow: 'hidden',
    marginBottom: '1%',
  },

}));

export default function FileUpload({ formState, dispatch, handleDeleteOne, previews, setPreviews, imageValue, setImageValue }) {
  const fileInput = useRef();
  const { classes, cx } = useStyles();

  const handleUploadFile = () => {
    console.log('event.target: ', event.target);
    dispatch({
      type: "HANDLE MULTIPLE INPUTS",
      field: 'fileList',
      payload: event.target.files[0],
    });
   //setImageValue(event);
   //value={formState.fileList[formState.fileList.length - 1]}/>
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64image = reader.result;
      setPreviews([...previews, base64image]);
    };
	 };

   const handleDeleteFile = (i, field, e) => {
    handleDeleteOne(i, field, e);
    fileInput.current?.();
    setImageValue(null);
   };

   // handle deleteOne if type=image or file upload, splice previews and delete preview at index and then setpreviews

  return (
    <>
        <FileInput
          id="fileInput"
          label="Add Photos"
          placeholder="Add your photos"
          error="file size must be less than 64 MB"
          clearable
          type="file"
          name="photos"
          accept="image/png, image/jpeg"
          icon={<IconUpload size={14} />}
          multiple
          ref={fileInput}
          onChange={handleUploadFile}
          value={null}
         // value={formState.fileList}
         // onClear=
        />
        <br />
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
                <span className={classes.close} onClick={(e) => handleDeleteFile(i, 'fileList', e)}>x</span>
              </span>
            </Center>
          );
        })
			)}
      {previews.length > 0
      && (
        <>
        <div className={classes.photoPreviews}>
        {previews.map((photo, i) => (
          // <div>
          //   <span className={classes.close} onClick={(e) => handleDeleteOne(i, 'fileList', e)}>x</span>
            <img src={photo} alt="Image preview" key={photo} className={classes.imagePreview} />
          // </div>
        ))}
      </div>
        <br />
        </>
      )}
    </>
  );
};

// may want to save photos obj not just url

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