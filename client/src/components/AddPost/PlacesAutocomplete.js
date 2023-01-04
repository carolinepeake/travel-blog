import React from 'react';
import { Autocomplete } from '@mantine/core';
import { useMapboxApi } from '../../utils/customHooks.js';

function PlacesAutocomplete({ locality, formState, handleTextChange, label, placeholder }) {

  const [autocompleteLocations, autocompleteErr, locationFetch] = useMapboxApi();

  let value = '';
  if (formState) {
    value = formState[locality];
  }

  const handleLocationChange = async (e) => {
    console.log('event from handleLocationChange: ', e);
    handleTextChange(e);
    if (!value) return;

    locationFetch(e.target.value, locality);
  };

  const handleParseInputLocation = async (item) => {
    if (item.context && item.context.length > 0) {
      for (let index = item.context.length - 1; index >= 0; index--) {
        let placeType = item.context[index].id.split('.')[0];
        if (placeType === 'country') {
          handleTextChange({target: {value: item.context[index].text, name: 'country'}});
        } else if (placeType === 'region') {
          handleTextChange({target: {value: item.context[index].text, name: 'state'}});
        } else if (placeType === 'district') {
          handleTextChange({target: {value: item.context[index].text, name: 'state'}});
        }
      }
    }
    handleTextChange({target: {value: item.place_name.split(',').shift(), name: locality}});
  };

  return (
      <Autocomplete
        value={value}
        onChange={(query) => {handleLocationChange({target: {value: query, name: locality}})}}
        label={label}
        placeholder={placeholder}
        data={autocompleteLocations.map((item) => ({ ...item, value: item.place_name }))}
        filter={(value, item) => item}
        onItemSubmit={(item) => {handleParseInputLocation(item)}}
      />
  );
}

export default PlacesAutocomplete;