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

// export const useFilterPosts = async (route, filterTerm, e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.get(`http://localhost:3001/posts/filter/${route}/${filterTerm}`);
//       let filteredPosts = response.data;
//       console.log('response from handleFilterPosts in App component', response.data);
//       setPosts(filteredPosts);
//     } catch (err) {
//       console.log('error filtering posts', err);
//     }
// };

export const useCloudinary = () => {
  const [cloudinaryImage, setCloudinaryImage] = useState({});
  const [cloudinaryErr, setCloudinaryErr] = useState('');

  const uploadImageToCloudinary = async (fileUrl) => {
    if (!fileUrl) {
      setCloudinaryImage('');
      setCloudinaryErr('');
      return;
    }

    try {
      const savedImage = await axios.post('http://localhost:3001/posts/cloudinary/upload', {
        image: fileUrl,
      });
      console.log('saved image: ', savedImage);
      setCloudinaryImage(savedImage.data)
    } catch (err) {
      console.log('error uploading cloudinary image: ', err);
      // if (err.response.status === 413) {
        // set to err.message or whatever it is
        // useEffect if cloudinaryErr changes and change local error message state depending on err obj
        //setCloudinaryErr('error uploading image, file must be less than 64 mb');
      // }
      setCloudinaryErr(err);
    }
  }

  return [cloudinaryImage, cloudinaryErr, uploadImageToCloudinary];
};