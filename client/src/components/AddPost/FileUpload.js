import React, { useState, useEffect } from "react";
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
  const { classes, cx } = useStyles();
  const [fileUploadValue, setFileUploadValue] = useState(null);
  const [requestStatus, setRequestStatus] = useState('idle');
  // const [preview, setPreview] = useState('');
  const [files, setFiles] = useState([]);
  // const [imageFiles, setImageFiles] = useState([]);
  // const [fileImage, setFileImage] = useState({});
  // const [base64image, setbase64image] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // const [cloudinaryImageUrlToSave, setCloudinaryImageUrlToSave] = useState('');
  // const [cloudinaryImage, cloudinaryErr, uploadImageToCloudinary] = useCloudinary();
  const [uploadImageToCloudinary] = useCloudinary();

  // const handleUploadImage = (event = null) => {
  //   console.log('event from new FileReader: ', event);
  //   // edge cases:
  //     // gets stuck uploading
  //     // incorrect file type
  //     // file too large
  //   // if input cleared
  //     // set error message to nothing
  //     // make submit enabled
  //   // if input replaced
  //     //
  //   // if new input
  //     // make input disabled
  //     // make submit disabled?
  //     // try tp upload to cloudinary
  //       // if successful
  //         // add to form state
  //         // show preview
  //         // show file name
  //         // make input empty
  //         // make input enabled
  //       // if not successful
  //         // show error message
  //         // make input enabled
  //   setRequestStatus('pending');
  //   setErrorMessage('');
  //   if (event !== null) {
  //     let file;
  //     if (!Array.isArray(event)) {
  //       file = event;
  //     }
  //     // event.length < files ?
  //     // setFiles(event)
  //     event.length === 0 ?
  //     setRequestStatus('idle')
  //     : file = event[0];
  //     if (file) {
  //       setFileUploadValue(file);
  //       setFileImage({...fileImage, name: file.name});
  //       setFiles([file, ...files]);
  //       console.log('files :', files);
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onloadend = () => {
  //         const base64imagePayload = reader.result;
  //         setbase64image(base64imagePayload);
  //         const loadError = reader.error;
  //       };
  //     }
  //   } else {
  //     setFiles([]);
  //     setbase64image('');
  //     setImageUrlToSave('');
  //   }
  // };

  // useEffect(() => {
  //   if (base64image) {
  //     setFileImage({...fileImage, base64image: base64image});
  //     // could return spinner while waiting for request to return
  //     uploadImageToCloudinary(base64image)
  //     .then(() => {
  //       setPreview(base64image);
  //     })
  //   } else {
  //     setErrorMessage('');
  //     setPreview('');
  //   }
  // }, [base64image]);

  // useEffect(() => {
  //   cloudinaryImage && setCloudinaryImageUrlToSave(cloudinaryImage.url);
  //   setFileImage({...fileImage, cloudinaryImageUrl: cloudinaryImage.url})
  // }, [cloudinaryImage]);

  // useEffect(() => {
  //   if (cloudinaryErr.response) {
  //     cloudinaryErr.response.status === 413 ? setErrorMessage('file size must be less than 64 MB') : setErrorMessage('image upload failed');
  //     setRequestStatus('unsuccessful');
  //     return;
  //   }
  //   setErrorMessage('');
  // }, [cloudinaryErr]);

  // useEffect(() => {
  //   if (cloudinaryImageUrlToSave) {
  //      dispatch({
  //     type: "HANDLE MULTIPLE INPUTS",
  //     field: 'photos',
  //     payload: fileImage,
  //   });
  //   setRequestStatus('idle');
  // }}, [cloudinaryImageUrlToSave]);

  // useEffect(() => {
  //   if (errorMessage) {
  //     // setFileImage({...fileImage, cloudinaryErrMessage: errorMessage});
  //     // dispatch({
  //     //   type: "HANDLE MULTIPLE INPUTS",
  //     //   field: 'photos',
  //     //   payload: fileImage,
  //     // });
  //     setRequestStatus('unsuccessful');
  // }}, [errorMessage]);

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

   const uploadtoCloudinary = async (bitImage) => {

   };

   const readFile = async (file) => {

   };

   const handleChange = async (event = []) => {
    let file;
    // could move line 254 to occur after fileUploadValue is changed
    setErrorMessage('');
    setRequestStatus('pending');
    if (event.length === 0) {
      setFileUploadValue(null);
      setRequestStatus('idle');
      return;
    } else if (!Array.isArray(event)) {
      setFileUploadValue(event);
      file = event;
      // readFile(file);
    } else {
      setFileUploadValue(event[0]);
      file = event[0];
      // readFile(file);
    }
    console.log('event from handleChange: ', event,'fileupload value :', fileUploadValue, 'file: ', file);
    // readFile(file)
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (e) => {
        const fileData = reader.result;
        console.log('fileData: ', fileData, 'e: ', e);
        e.preventDefault();
        // uploadImageToCloudinary(fileData)

        try {
          const cloudinaryResponse = await uploadImageToCloudinary(fileData);
          cloudinaryResponse.name = file.name;
          cloudinaryResponse.bit64Image = fileData;
          setFiles([cloudinaryResponse, ...files]);
          console.log('cloudinary response: ', cloudinaryResponse);
          dispatch({'HANDLE MULTIPLE INPUTS', payload: cloudinaryResponse, field: 'photos'});
          setRequestStatus('idle');
        } catch (err) {
          console.log('err in handleChange: ', err);
          setErrorMessage(err.message);
          setRequestStatus('unsuccessful');
        }
      }
      reader.onerror = (e) => {
        const error = reader.error;
        e.preventDefault();
        console.log('error: ', error, 'e: ', e);
        setErrorMessage(error.type);
        setRequestStatus('unsuccessful');
      }
    }
  };

  // requestStatus, errorMessage, fileUploadValue



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
          // onChange={e => handleUploadImage(e)}
          onChange={e => handleChange(e)}
          value={requestStatus === 'idle' ? null : fileUploadValue}
          disabled={requestStatus === 'pending'}
        />

      {/* {formState.photos.length > 0 */}
      {files.length > 0
      && (
          <div className={classes.filesPreview}>

          {/* {formState.photos.map(({base64image, cloudinaryImageUrl, cloudinaryErrMessage, name}, i) => ( */}
          {files.map((cloudinaryResponse, i) => (

            <div className={classes.photoPreviews} key={cloudinaryResponse.name} i={i}>

              <Center
                inline
                className={classes.fileList}
                i={i}
              >
                <IconPhoto size={14} style={{ marginRight: 5 }} />
                <span className={classes.file}>
                  {cloudinaryResponse.name}
                  <span className={classes.close}  i={i}
                  // onClick={(e) => handleDeleteImage(i, 'photos', e)}
                  >x</span>
                </span>
              </Center>

              <div className={classes.imageContainer} >
                <span className={classes.close}  i={i}
                //  onClick={(e) => handleDeleteImage(i, 'photos', e)}
                 >x</span>
                <img
                // src={base64image}
                src={cloudinaryResponse.url}
                alt="Image preview" className={classes.imagePreview} />
              </div>

            </div>
          ))}
        </div>
      )}
     </>
  );
};

