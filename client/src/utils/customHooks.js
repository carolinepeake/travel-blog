import React, { useState } from 'react';
import axios from 'axios';

export const useMapboxApi = () => {
  const [autocompleteLocations, setAutocompleteLocations] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState("");

  // custom fetch function consumes location
  const locationFetch = async (searchTerm, locality = 'all') => {

    if (!searchTerm) {
      setAutocompleteLocations([]);
      return;
    }

    const res = await axios.get(`/locations/places/${searchTerm}/${locality}`);
    console.log('response from handleLocationChange api call:', res);
    // for loop is quicker than map
    !autocompleteLocations.map(location => location.place_name).includes(searchTerm) &&
      res.data.features &&
      setAutocompleteLocations(res.data.features.map(({ place_name, context, place_type, id }) => ({ place_name, context, place_type, id })));
      console.log('autocompleteLocations: ', autocompleteLocations);
    res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
  };

  return [autocompleteLocations, autocompleteErr, locationFetch]; // <-- return state and fetch function
};


export const useCloudinary = () => {
  const [cloudinaryImage, setCloudinaryImage] = useState({});
  const [cloudinaryErr, setCloudinaryErr] = useState({});

  const uploadImageToCloudinary = async (fileUrl) => {
    if (!fileUrl) {
      setCloudinaryImage('');
      setCloudinaryErr('');
    //   setCloudinaryErr({
    //     response: {
    //       status: 404,
    //       message: 'No file sent for upload'
    //     }
    //   });
    //   throw new Error('No file sent for upload');
    }

    try {
      const savedImage = await axios.post('http://localhost:3001/posts/cloudinary/upload', {
        image: fileUrl,
      });
      console.log('saved cloudinary image : ', savedImage);
      setCloudinaryImage(savedImage.data);
      // return savedImage.data;
    } catch (err) {
      console.log('error uploading cloudinary image: ', err);
      setCloudinaryErr(err);
      // throw new Error(err.message);
    }
  }

  return [cloudinaryImage, cloudinaryErr, uploadImageToCloudinary];
};