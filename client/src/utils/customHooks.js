import React, { useState } from 'react';
import axios from 'axios';

export const useMapboxApi = () => {
  const [autocompleteLocations, setAutocompleteLocations] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState("");

  // custom fetch function consumes location
  const locationFetch = async (searchTerm = "", locality = 'all') => {

    const res = await axios.get(`/locations/places/${searchTerm}/${locality}`);
    console.log('response from handleLocationChange api call:', res);
    !autocompleteLocations.includes(searchTerm) &&
      res.data.features &&
      setAutocompleteLocations(res.data.features.map((place) => place.place_name));
      console.log('autocompleteLocations: ', autocompleteLocations);
    res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
  };

  return [autocompleteLocations, autocompleteErr, locationFetch]; // <-- return state and fetch function
};