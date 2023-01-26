import React, { useRef, useState, useEffect } from 'react';
import { FileInput, createStyles } from '@mantine/core';
import { IconUpload } from '@tabler/icons';

import { useCloudinary } from '../../utils/customHooks.js';
import { XIcon } from '../SearchIcon';

const useStyles = createStyles((theme) => ({

  avatarPreview: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gridColumn: '1 / 3',
    overflow: 'hidden',
  },

  imagePreview: {
    marginRight: '1%',
    height: 200,
    positionSelf: 'center',
    objectFit: 'cover',
    aspectRatio: 1,
    width: 200,
    overflow: 'hidden',
  },

}));

export default function EditProfileImage({ setImageUrlToSave }) {
  const { classes } = useStyles();
  const fileInput = React.createRef();
  const [fileUploadValue, setFileUploadValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [base64image, setbase64image] = useState('');
  const [preview, setPreview] = useState('');

  const [cloudinaryImage, cloudinaryErr, uploadImageToCloudinary] = useCloudinary();

  const handleAddImage = (event = null) => {
    setErrorMessage('');
    setFileUploadValue(event);
    if (event !== null) {
      const file = event;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64imagePayload = reader.result;
        setbase64image(base64imagePayload);
      };
    } else {
      setbase64image('');
      setImageUrlToSave('');
    }
  };

  useEffect(() => {
    if (base64image) {
      // could return spinner while waiting for request to return
      uploadImageToCloudinary(base64image)
      .then(() => {
        setPreview(base64image);
      })
    } else {
      setErrorMessage('');
      setPreview('');
    }
  }, [base64image]);

  useEffect(() => {
    cloudinaryImage && setImageUrlToSave(cloudinaryImage.url);
    console.log('cloudinaryImage: ', cloudinaryImage);
  }, [cloudinaryImage]);

  useEffect(() => {
    if (cloudinaryErr.response) {
      cloudinaryErr.response.status === 413 ? setErrorMessage('file size must be less than 64 MB') :  setErrorMessage('image upload failed');
      return;
    }
    setErrorMessage('');
  }, [cloudinaryErr]);

  const handleDeleteInput = (e) => {
    e.preventDefault();
    // prolly don't need all of this, resetting the event value might even do it, or file upload value
    console.log('current file input: ', fileInput.current);
    // fileInput.current?.();
    setErrorMessage('');
    setImageUrlToSave('');
    uploadImageToCloudinary();
    setbase64image('');
    // can prolly delete one input in a multiple file upload by keeping value as array of all inputs and then filtering value to remove the deleted file
    setFileUploadValue('');
    setPreview('');
  } ;

  // getting an error when add an image, then delete it, then try to add it again

  return(
    <>
      <FileInput
        id="imageInput"
        label="Image"
        placeholder="Upload your photo"
        type="file"
        name="preview"
        error={errorMessage}
        accept="image/png, image/jpeg"
        capture="user"
        //multiple
        // clearable
        icon={<IconUpload size={14} />}
        ref={fileInput}
        value={fileUploadValue}
        onChange={e => handleAddImage(e)}
        rightSection={fileUploadValue ? <XIcon size={14} handleDeleteInput={handleDeleteInput}/> : null}
      />

      {preview
      && (
        <div className={classes.avatarPreview}>
          <img src={preview} alt="Image preview" key={preview} className={classes.imagePreview} />
        </div>
        )}
    </>
  );
};