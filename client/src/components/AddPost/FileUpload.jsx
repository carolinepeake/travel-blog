import React, { useReducer, useState, useEffect } from "react";
import axios from 'axios';
import { createStyles, Select, TextInput, TextArea, Button, onSubmit, Group, Box } from '@mantine/core';

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
}));

export default function FileUpload({ formState, dispatch, handleDeleteOne }) {
  const fileInput = React.createRef();
  const { classes, cx } = useStyles();

  const handleUploadFile = (event) => {
    dispatch({
      type: "HANDLE MULTIPLE INPUTS",
      field: 'photos',
      payload: event.target.files[0],
    });
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
      onChange={handleUploadFile}
      ></input>
      </label>
      {formState.photos && (
        formState.photos.map((photo, i) => {
          return (<div key={i}>
					<p className={classes.file}>Filename: {photo.name}
					{/* <p>Filetype: {photo.type}</p>
					<p>Size in bytes: {photo.size}</p>
					<p>
						lastModifiedDate:{' '} */}
						{/* {photo.lastModifiedDate.toLocaleDateString()} */}
            <span className={classes.close} onClick={(e) => handleDeleteOne(i, 'photos', e)}>x</span>
					</p>

				</div>)
        })
			)}
      </>
  );
};