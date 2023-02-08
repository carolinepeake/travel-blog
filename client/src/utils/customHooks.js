import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios';

export const useMapboxApi = () => {
  const [autocompleteLocations, setAutocompleteLocations] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState(null);

  // custom fetch function consumes location
  const locationFetch = async (searchTerm, locality = 'all') => {

    if (!searchTerm) {
      setAutocompleteLocations([]);
      return;
    }

    try {
      const res = await axios.get(`/locations/places/${searchTerm}/${locality}`);
      // for loop is quicker than map
      !autocompleteLocations.map(location => location.place_name).includes(searchTerm) &&
        res.data.features &&
        setAutocompleteLocations(res.data.features.map(({ place_name, context, place_type, id }) => ({ place_name, context, place_type, id })));
    } catch (error) {
      console.log('error returned from mapbox api: ', error);
      setAutocompleteErr(error.message);
    }
  };

  return [autocompleteLocations, autocompleteErr, locationFetch]; // <-- return state and fetch function
};

const reducer = (state, action) => {
  switch (action.type) {
    case "idle":
      return { status: "idle", data: undefined, error: undefined };
    case "pending":
      return { status: "pending", data: undefined, error: undefined };
    case "success":
      return { status: "success", data: action.payload, error: undefined };
    case "unsuccessful":
      return { status: "unsuccessful", data: undefined, error: action.payload };
    default:
      throw new Error("invalid action: ", action.type);
  }
};

export const useCloudinaryUpload = (event = null) => {

  const initialState = {
    status: event ? "pending" : "idle",
    data: undefined,
    error: undefined,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [bit64Image, setBit64Image] = useState(null);
  const [file, setFile] = useState(null);

  const reader = new FileReader();

  useEffect(() => {
    if (!event) {
      dispatch({ type: "idle" });
      return;
    }

    dispatch({ type: "pending" });

    const file = Array.isArray(event) ? event[0] : event;
    setFile(file);

  }, [event]);


  useEffect(() => {

    function getImageData(image) {
      return image.data  ? { name: file.name, bit64Image: bit64Image, ...image.data } : null;
    };

    const uploadImageToCloudinary = async (bit64Image) => {

      if (!bit64Image) {
        dispatch({ type: "unsuccessful", payload: 'No file sent for upload'  });
        return;
      }

      try {
        const savedImage = await axios.post('posts/cloudinary/upload', {
          image: bit64Image,
        });
        const data = getImageData(savedImage);
        dispatch({ type: "success", payload: data });
        return data;
      } catch (err) {
        if (err.response && err.response.status === 413) {
          dispatch({ type: "unsuccessful", payload: 'file size must be less than 64 MB' });
        } else if (err.message) {
          dispatch({ type: "unsuccessful", payload: err.message });
        } else {
          dispatch({ type: "unsuccessful", payload: 'Image upload failed' });
        }
      }
    };

    uploadImageToCloudinary(bit64Image);

  }, [bit64Image, dispatch]);

  useEffect(() => {

    if (!file) {
      dispatch({ type: "idle" });
      return;
    }

    reader.readAsDataURL(file);

    const handleLoadedFile = (e) => {
      e.preventDefault();
      const bit64Image = reader.result;
      setBit64Image(bit64Image);
    };

    const handleLoadError = (e) => {
      e.preventDefault();
      const error = reader.error;
      dispatch({ type: "unsuccessful", payload: error.type});
    }

    reader.addEventListener('load',  handleLoadedFile);
    reader.addEventListener('error', handleLoadError);

    return () => {
      reader.removeEventListener('load', handleLoadedFile);
      reader.removeEventListener('error', handleLoadError);
    };

  }, [file, dispatch]);

  return state;

};

