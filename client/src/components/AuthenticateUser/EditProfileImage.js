import React, { useRef, useState, useEffect } from 'react';
import { FileInput, createStyles } from '@mantine/core';
import { IconUpload } from '@tabler/icons';
import { useCloudinary } from '../../utils/customHooks.js';

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

export default function EditProfileImage({ avatar, setAvatar, form }) {
  const { classes } = useStyles();
  const fileInput = React.createRef();
  const [fileUploadValue, setFileUploadValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [cloudinaryImage, cloudinaryErr, uploadImage] = useCloudinary();

  const handleAddImage = async (event) => {
    setFileUploadValue(event);
    if (event !== null) {
      const file = event;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64image = reader.result;
        setAvatar(base64image);
        uploadImage(base64image);
      };
    } else {
      setAvatar('');
      uploadImage();
    }
  };

  // useEffect(() => {
  //   avatar && uploadImage(avatar);
  // }, [avatar]);

  useEffect(() => {
    cloudinaryImage && form.setFieldValue('image', cloudinaryImage.url);
    console.log('cloudinaryImage: ', cloudinaryImage);
    // setAvatar()
  }, [cloudinaryImage]);

  useEffect(() => {
    if (cloudinaryErr) {
      cloudinaryErr.response.status === 413 ? setErrorMessage('file size must be less than 64 MB') :  setErrorMessage('image upload failed');
      setAvatar('');
    } else {
      setErrorMessage('');
    }
  }, [cloudinaryErr]);



  return(
    <>
      <FileInput
        id="avatarInput"
        label="image"
        placeholder="upload your photo"
        type="file"
        name="avatar"
        error={errorMessage}
        accept="image/png, image/jpeg"
        clearable
        icon={<IconUpload size={14} />}
        ref={fileInput}
        value={fileUploadValue}
        onChange={e => handleAddImage(e)}
      />

      {avatar
      && (
        <div className={classes.avatarPreview}>
          <img src={avatar} alt="Image preview" key={avatar} className={classes.imagePreview} />
        </div>
        )}
    </>
  );
};