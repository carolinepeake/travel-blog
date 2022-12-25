import React, { useState } from 'react';
import { Autocomplete } from '@mantine/core';
import axios from 'axios';

function PlacesAutocomplete() {
  const [city, setCity] = useState("");
  const [autocompleteCities, setAutocompleteCities] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState("");

  const handleCityChange = async (e) => {
    console.log('event from handleCityChange: ', e);
    setCity(e.target.value);
    if (!city) return;

    const res = await axios.get(`/locations/places/${e.target.value}`);
    console.log('response from handleCityChange api call:', res);
    !autocompleteCities.includes(e.target.value) &&
      res.data.features &&
      setAutocompleteCities(res.data.features.map((place) => place.place_name));
      console.log('autocompleteCities: ', autocompleteCities);
    res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
  };

  return (
    <Autocomplete
      value={city}
      onChange={(query) => {handleCityChange({target: {value: query}})}}
      label="Your city"
      placeholder="Start typing to see options"
      data={autocompleteCities}
      filter={(value, item) => item}
    />
  );
}

export default AutocompleteCity;