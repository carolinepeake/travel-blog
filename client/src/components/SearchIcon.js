import React from 'react';
import { Search } from 'tabler-icons-react';
import axios from 'axios';
import styled from 'styled-components';
import { ActionIcon, createStyles } from '@mantine/core';
import { IconSearch } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  root: {
    '&:hover': {
      cursor: 'pointer',
    },
  },

  icon: {
    '&:hover': {
      cursor: 'pointer',
    },
  }
}));

export default function SearchIcon({ search, handleFilterPostsByActivity }
  ) {

    const { classes, cx } = useStyles();

    // const handleFilterPostsByRegion = async (e) => {
    //   e.preventDefault();
    //   try {
    //     console.log('region: ', region);
    //     const response = await axios.get(`http://localhost:3001/posts/region/${region}`);
    //     const filteredPosts = response.data;
    //     console.log('response from handleFilterPosts', response.data);
    //     setPosts(filteredPosts);
    //     // setActive(link.link);
    //     setSearch('');
    //     // close();
    //   } catch (err) {
    //     console.log('error filtering posts', err);
    //   }
    // };

    return(
      <ActionIcon aria-label="Search" onClick={(e) => handleFilterPostsByActivity('tags', search, e)}
      className={classes.root}
      id="iconDiv">
        <IconSearch size={20} stroke={1.5} onClick={(e) => handleFilterPostsByActivity('tags', search)} className={classes.icon}/>
      </ActionIcon>
    );
  };

  // const IconContainer = styled.button`
  //   width: 100%;
  //   height: 100%;
  //   margin: auto 0;
  //   &:hover: {
  //     cursor: pointer;
  //   };
  // `;