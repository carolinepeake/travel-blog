import React, { useState, useEffect, useRef } from "react";
import { createStyles, Center, FileInput } from '@mantine/core';
import { IconPhoto, IconUpload } from '@tabler/icons';

import { useCloudinary } from '../../utils/customHooks.js';
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
  const fileInput = useRef();
  const { classes, cx } = useStyles();
  const [fileUploadValue, setFileUploadValue] = useState(null);
  const [requestStatus, setRequestStatus] = useState('idle');
  const [preview, setPreview] = useState('');
  const [files, setFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [fileImage, setFileImage] = useState({});
  const [base64image, setbase64image] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cloudinaryImageUrlToSave, setCloudinaryImageUrlToSave] = useState('');
  const [cloudinaryImage, cloudinaryErr, uploadImageToCloudinary] = useCloudinary();

  const handleUploadImage = (event = null) => {
    setRequestStatus('pending');
    setErrorMessage('');
    if (event !== null) {
      let file;
      if (!Array.isArray(event)) {
        file = event;
      }
      event.length < files ?
      setFiles(event)
      : file = event[0];
      if (file) {
        setFileUploadValue(file);
        setFileImage({...fileImage, name: file.name});
        setFiles([file, ...files]);
        console.log('files :', files);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64imagePayload = reader.result;
          setbase64image(base64imagePayload);
        };
      }
    } else {
      setFiles([]);
      setbase64image('');
      setImageUrlToSave('');
    }
  };

  useEffect(() => {
    if (base64image) {
      setFileImage({...fileImage, base64image: base64image});
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
    cloudinaryImage && setCloudinaryImageUrlToSave(cloudinaryImage.url);
    setFileImage({...fileImage, cloudinaryImageUrl: cloudinaryImage.url})
  }, [cloudinaryImage]);

  useEffect(() => {
    if (cloudinaryErr.response) {
      cloudinaryErr.response.status === 413 ? setErrorMessage('file size must be less than 64 MB') :  setErrorMessage('image upload failed');
      return;
    }
    setErrorMessage('');
  }, [cloudinaryErr]);

  useEffect(() => {
    if (cloudinaryImageUrlToSave) {
       dispatch({
      type: "HANDLE MULTIPLE INPUTS",
      field: 'fileList',
      payload: fileImage,
    });
    setRequestStatus('idle');
  }}, [cloudinaryImageUrlToSave]);

  useEffect(() => {
    if (errorMessage) {
      setFileImage({...fileImage, cloudinaryErrMessage: errorMessage});
      dispatch({
        type: "HANDLE MULTIPLE INPUTS",
        field: 'fileList',
        payload: fileImage,
      });
      setRequestStatus('idle');
  }}, [errorMessage]);

  //     setPreviews([...previews, imageFile]);
  //     setRequestStatus('idle');

   const handleDeleteImage = (i, field, e) => {
    handleDeleteFile(i, field, e);
    // if (files.length <= 1) {
      setErrorMessage('');
      setRequestStatus('idle');
    // }
    if (i === 0) {
      setFileUploadValue(null);
    }
    // fileInput.current?.();
    // setImageValue(null);
   };

   // handle deleteOne if type=image or file upload, splice previews and delete preview at index and then setpreviews

   // can upload file directly to cloudinary and if don't use 64 base data URI type, can be bigger

  return (
    <>
        <FileInput
          classNames={{root: classes.root, input: classes.input, label: classes.label}}
          id="fileInput"
          label="Add Photos"
          placeholder="Add your photos"
          error={errorMessage}
          clearable
          type="file"
          name="photos"
          accept="image/png, image/jpeg"
          capture="user"
          icon={<IconUpload size={14} />}
          multiple
          ref={fileInput}
          onChange={e => handleUploadImage(e)}
          // value={fileUploadValue}
          // value={files}
          value={requestStatus === 'pending' ? fileUploadValue : null}
          // value={formState.fileList}
          disabled={requestStatus === 'pending'}
        />

      {formState.fileList.length > 0
      && (
          <div className={classes.filesPreview}>

          {formState.fileList.map(({base64image, cloudinaryImageUrl, cloudinaryErrMessage, name}, i) => (

            <div className={classes.photoPreviews} key={name} i={i}>

              <Center
                inline
                className={classes.fileList}
                i={i}
              >
                <IconPhoto size={14} style={{ marginRight: 5 }} />
                <span className={classes.file}>
                  {name}
                  <span className={classes.close}  i={i} onClick={(e) => handleDeleteImage(i, 'fileList', e)}>x</span>
                </span>
              </Center>

              <div className={classes.imageContainer} >
                <span className={classes.close}  i={i} onClick={(e) => handleDeleteImage(i, 'fileList', e)}>x</span>
                <img src={base64image} alt="Image preview" className={classes.imagePreview} />
              </div>

            </div>
          ))}
        </div>
      )}
     </>
  );
};

