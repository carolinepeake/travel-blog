import React, { useEffect, useState } from "react";
import axios from 'axios';
import { createStyles, MultiSelect } from '@mantine/core';

export default function SelectTags({ selectedTags, setSelectedTags }) {
  const [tags, setTags] = useState(['Scuba', 'Snowboarding']);

  // useEffect(() => {
    // dispatch({
    //   type: "HANDLE INPUT TEXT",
    //   field: 'selectedTags',
    //   payload: 'select tag',
    // });
  //   axios.get('http://localhost:3001/tags')
  //     .then((res) => setTags(res.data))
  //     .catch(err => console.log('error getting tags', err))
  //   // handleAddUserInfo(user)
  // }, []);

  return (
    <MultiSelect label="select tags" placeholder="select tags" value={selectedTags} name="selectedTags" data={['Scuba', 'Snowboarding']} onChange={setSelectedTags} />

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
};