import React from 'react';
import { ActionIcon, createStyles } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  root: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export const SearchIcon = ({ search, handleFilterPosts }) => {

  const { classes, cx } = useStyles();

  return(
    <ActionIcon
      aria-label="Search"
      id="iconDiv"
      className={classes.root}
      onClick={(e) => handleFilterPosts({type: 'tags', value: search}, e)}
    >
      <IconSearch size={20} stroke={1.5}/>
    </ActionIcon>
  );
};

export const XIcon = ({ handleDeleteInput, size }) => {

  const { classes, cx } = useStyles();

  return(
    <ActionIcon
      aria-label="Delete"
      id="xIcon"
      className={classes.root}
      onClick={(e) => handleDeleteInput(e)}
    >
      <IconX size={size}
      stroke={1.5}
      />
    </ActionIcon>
  );
};


export const CrossIcon = () => {
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
<line x1="18" y1="6" x2="6" y2="18"></line>
<line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
};
