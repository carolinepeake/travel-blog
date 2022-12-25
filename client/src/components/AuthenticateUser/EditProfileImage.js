import React, { useRef, useState } from 'react';
import { FileInput, createStyles } from '@mantine/core';
import { IconUpload } from '@tabler/icons';

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

export default function EditProfileImage({ avatar, setAvatar }) {
  const { classes } = useStyles();
  const fileInput = React.createRef();
  const [value, setValue] = useState(null);

  const handleAddImage = (event) => {
    setValue(event);
    if (event !== null) {
      const file = event;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64image = reader.result;
        setAvatar(base64image);
      };
    } else {
      setAvatar('');
    }
  };

  return(
    <>
      <FileInput
        id="avatarInput"
        label="image"
        placeholder="upload your photo"
        type="file"
        name="avatar"
        error="file size must be less than 64 MB"
        accept="image/png, image/jpeg"
        clearable
        icon={<IconUpload size={14} />}
        ref={fileInput}
        value={value}
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