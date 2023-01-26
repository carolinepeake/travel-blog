import React from 'react';
import { Autocomplete } from '@mantine/core';

import { useMapboxApi } from '../../utils/customHooks.js';

function PlacesAutocomplete({ locality, formState, handleTextChange, label, placeholder, form }) {

  const [autocompleteLocations, autocompleteErr, locationFetch] = useMapboxApi();

  let value = '';
  if (formState) {
    value = formState[locality];
  }

  const handleLocationChange = async (e, form) => {
    console.log('event from handleLocationChange: ', e);
    console.log('form from handleLocationChange: ', form);
    handleTextChange(e, form);
    if (!e.target.value) return;

    locationFetch(e.target.value, locality);
  };

  const handleParseInputLocation = async (item, locality, form) => {
    console.log('handleParseInputLocation item :', item);
    if (item.context && item.context.length > 0) {
      for (let index = 0; index <= item.context.length - 1; index++) {
        let placeType = item.context[index].id.split('.')[0];
        console.log('placeType :', placeType);
        if (placeType === 'country') {
          handleTextChange({target: {value: item.context[index].text, name: 'country'}}, form);
        } else if (placeType === 'region') {
          handleTextChange({target: {value: item.context[index].text, name: 'state'}}, form);
        } else if (placeType === 'district') {
          handleTextChange({target: {value: item.context[index].text, name: 'state'}}, form);
        }
      }
    }
    handleTextChange({target: {value: item.place_name.split(',').shift(), name: locality}}, form);
  };

  return (
      <Autocomplete
        value={value}
        locality={locality}
        onChange={(query) => handleLocationChange({target: {value: query, name: locality}}, form)}
        label={label}
        placeholder={placeholder}
        data={autocompleteLocations.map((item) => ({ ...item, value: item.place_name }))}
        filter={(value, item) => item}
        onItemSubmit={(item) => handleParseInputLocation(item, locality, form)}
        // { onChange: (query) => handleLocationChange({target: {value: query, name: locality}}) })}
        // {...form.getInputProps(locality, { onChange: handleLocationChange(event, form)})}
      />
  );
}

export default PlacesAutocomplete;