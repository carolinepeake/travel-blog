import React, { useEffect, useState } from "react";
import axios from 'axios';
import { createStyles, MultiSelect } from '@mantine/core';

export default function SelectTags({ selectedTags, handleTextChange }) {
  const [tags, setTags] = useState([]);
  const [searchValue, onSearchChange] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/tags')
    .then((res) => {
      setTags(res.data)
     })
     .catch((err) => {
      console.log('error getting tags in select tags component', err);
     })
  }, []);

  return (
    <MultiSelect
      label="Activity Tags"
      placeholder="Select Tags"
      values={selectedTags}
      name="selectedTags"
      data={tags}
      searchable
      // onSearchChange={onSearchChange}
      // searchValue={searchValue}
      nothingFound="Activity not found. Create a new tag!"
      clearSearchOnBlur
      clearSearchOnChange
      clearButtonLabel="Clear selection"
      clearable
      maxDropdownHeight={120}
      selectOnBlur
      onChange={(query) => {handleTextChange({target: {value: query, name: 'selectedTags'}})}}
      creatable
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => {
        setTags((current) => [...current, query]);
        return query;
      }}
    />

    // <label>
    //     select tags:
    //     <select
    //     name="selectedTags"
    //     multiple={true}
    //     size={1}
    //     value={formState.selectedTags}
    //     onChange={(e) => handleSelectMultiple(e)}
    //   >
    //     {tags
    //     && (tags.map((tag, i) => {
    //       return <option
    //         type="select"
    //         value={tag}
    //         key={i}
    //         style={{width: '100px'}}
    //         >{tag}</option>
    //      }))
    //     }
    //   </select>
    //   </label>
  );


  // add to journal:
    // how to make an itemized array:
     //  const data = Array(50).fill(0).map((_, index) => `Item ${index}`);
    // need to use 'return' when mapping an array of values into react components
    // native HTML uses 'selected' attribute to designate an option as the default selected value, but
    // react uses the initial state of the select value
    // the size attribute of a select element takes a number and sets how many dropdown options display at one time when the dropdown is open

    // figure out syntax for using async/await for an axios request made inside a useEffects call

};