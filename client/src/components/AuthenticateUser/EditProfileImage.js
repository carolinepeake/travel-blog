import React, { useRef, useState, useEffect } from 'react';
import { FileInput, createStyles } from '@mantine/core';
import { IconUpload } from '@tabler/icons';

import { useCloudinaryUpload } from '../../utils/customHooks.js';

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
  const [fileUploadValue, setFileUploadValue] = useState('');
  const { data, status, error } = useCloudinaryUpload(fileUploadValue && fileUploadValue);

  useEffect(() => {
    if (data) {
     setImageUrlToSave(data.url);
    }
  }, [data]);

  const handleDeleteInput = (e) => {
    e.preventDefault();
    setImageUrlToSave('');
    setFileUploadValue('');
  } ;

  return(
    <>
      <FileInput
        id="imageInput"
        label="Image"
        placeholder="Upload your photo"
        type="file"
        name="preview"
        error={error}
        accept="image/png, image/jpeg"
        capture="user"
        icon={<IconUpload size={14} />}
        value={fileUploadValue}
        onChange={e => setFileUploadValue(e)}
        rightSection={fileUploadValue ? <XIcon size={14} handleDeleteInput={handleDeleteInput}/> : null}
      />

      {data
      && (
        <div className={classes.avatarPreview}>
          <img src={data.bit64Image} alt="Image preview" key={data.asset_id} className={classes.imagePreview} />
        </div>
        )}
    </>
  );
};