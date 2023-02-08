import React, { useState, useEffect } from "react";
import { createStyles, Center, FileInput } from '@mantine/core';
import { IconPhoto, IconUpload } from '@tabler/icons';

import { useCloudinaryUpload } from '../../utils/customHooks.js';

import { XIcon } from '../SearchIcon';

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

  filesPreview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: '2%',
    overflow: 'hidden',
    justifyItems: 'center',
    justifyContent: 'stretch',
    padding: '2%',
    minheight: '40px',
    gridTemplateRows: 'auto',
  },

  photoPreviews: {
    justifySelf: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'span 1 / span 1',
    width: 'calc(374px/3)',

  },

  fileList: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
    fontSize: theme.fontSizes.xs,
    padding: '1px 1px',
    borderRadius: theme.radius.sm,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  file: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    border: 'solid black thin',
    borderRadius: theme.radius.sm,
    paddingTop: theme.spacing.xs / 3,
    paddingBottom: theme.spacing.xs / 3,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    position: 'relative',
    zIndex: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '100px',
    display: 'inline-block',
  },

  close: {
    position: 'absolute',
    zIndex: 2,
    fontSize: theme.fontSizes.xs,
    right: '2%',
    top: '0.5%',
    paddingTop: 0,

    '&:hover': {
      cursor: 'pointer',
    },
  },

  imageContainer: {
    position: 'relative',
    width: '100%,',
    height: '100%',
    marginTop: '4%',
  },

  //to-do: make the height/length ratio/measurement change dynamically based on if the photo is landscape or portrait
  imagePreview: {
    width: '100%',
    borderRadius: theme.radius.sm,
    objectFit: 'cover',
    aspectRatio: '1',
    overflow: 'hidden',
    positionSelf: 'center',
    positionObject: 'center',
  },

}));

export default function FileUpload({ formState, dispatch, handleDeleteFile }) {
  const { classes, cx } = useStyles();
  const [file, setFile] = useState(null);
  const [deleteRequestStatus, setDeleteRequestStatus] = useState('idle');

  const { data, status, error } = useCloudinaryUpload(file && file);

  useEffect(() => {
    if (data) {
      dispatch({type: 'HANDLE MULTIPLE INPUTS', payload: data, field: 'photos'});
    }
  }, [data]);

  const canDelete = formState.photos.value.length > 0 && deleteRequestStatus !== 'pending' && status !== 'pending';

   const handleDeleteImage = async (i, field, e) => {
    if (canDelete) {
      try {
        setDeleteRequestStatus('pending');
        await handleDeleteFile(i, field, e);
      } catch (err) {
        console.error('error deleting image file: ', err, 'index: ', i);
      } finally {
        setDeleteRequestStatus('idle');
      }
    }
   };

  return (
    <>
        <FileInput
          classNames={{root: classes.root, input: classes.input, label: classes.label}}
          id="fileInput"
          label="Add Photos"
          placeholder="Add your photos"
          error={status === 'unsuccessful' && error}
          clearable={status === 'unsuccessful'}
          type="file"
          name="photos"
          accept="image/png, image/jpeg"
          capture="user"
          icon={<IconUpload size={14} />}
          multiple
          onChange={(event) => setFile(event)}
          value={status === 'idle' || status === 'success' ? null : file}
          disabled={status === 'pending'}
        />

      {formState.photos.value.length > 0
      && (
          <div className={classes.filesPreview}>

          {formState.photos.value.map((data, i) => (

            <div className={classes.photoPreviews} key={data.asset_id} i={i}>

              <Center
                inline
                className={classes.fileList}
                i={i}
              >
                <IconPhoto size={14} style={{ marginRight: 5 }} />
                <span className={classes.file}>
                  {data.name}
                  <span className={classes.close}  i={i}
                  onClick={(e) => handleDeleteImage(i, 'photos', e)}
                  >x</span>
                </span>
              </Center>

              <div className={classes.imageContainer} >
                <span className={classes.close}  i={i}
                 onClick={(e) => handleDeleteImage(i, 'photos', e)}
                 >x</span>
                <img
                src={data.bit64Image}
                alt="Image preview" className={classes.imagePreview} />
              </div>

            </div>
          ))}
        </div>
      )}
     </>
  );
};

