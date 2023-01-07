import React from 'react';
import { ActionIcon, createStyles } from '@mantine/core';
import { IconSearch } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  root: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default function SearchIcon({ search, handleFilterPosts }) {

  const { classes, cx } = useStyles();

  return(
    <ActionIcon
      aria-label="Search"
      id="iconDiv"
      className={classes.root}
      onClick={(e) => handleFilterPosts({tags: search}, e)}
    >
      <IconSearch size={20} stroke={1.5}/>
    </ActionIcon>
  );
};
