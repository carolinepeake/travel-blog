import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { MultiSelect } from '@mantine/core';

import { selectAllTags } from '../../state/postsSlice.js';

export default function SelectTags({ tags, handleTextChange }) {
  const [selectTags, setSelectTags] = useState([]);

  const allTags = useSelector(selectAllTags);

  useEffect(() => {
    allTags && setSelectTags(allTags);
  }, [])

  const [searchValue, onSearchChange] = useState('');

  return (
    <MultiSelect
      label="Activity Tags"
      placeholder="Select Tags"
      values={tags}
      name="selectedTags"
      data={selectTags}
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
      onChange={(query) => {handleTextChange({target: {value: query, name: 'tags'}})}}
      creatable
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => {
        setSelectTags((current) => [...current, query]);
        return query;
      }}
    />
  );
};