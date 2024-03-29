import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createStyles, Overlay, Container, Title, Button, Text, Autocomplete } from '@mantine/core';

import { filterSet } from '../state/postsSlice.js';
import { useMapboxApi } from '../utils/customHooks.js';
import { SearchIcon} from './SearchIcon.js';

const useStyles = createStyles((theme) => ({
  hero: {
    position: 'relative',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxfDB8MXxhbGx8fHx8fHx8fA&ixlib=rb-1.2.1&q=80&w=1080&utm_source=unsplash_source&utm_medium=referral&utm_campaign=api-credit)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  container: {
    height: 400,
    width: 1000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: theme.spacing.xl * 6,
    zIndex: 1,
    position: 'relative',

    [theme.fn.smallerThan('sm')]: {
      height: 500,
      paddingBottom: theme.spacing.xl * 3,
    },

    [theme.fn.smallerThan('xs')]: {
      height: 300,
      paddingBottom: theme.spacing.xl,
    },
  },

  title: {
    color: theme.white,
    fontSize: 60,
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28,
      lineHeight: 1.3,
    },
  },

  control: {
    marginTop: theme.spacing.xl * 1.5,
  },

  button: {
    backgroundColor: 'burlywood',
    border: 'solid',
  },

  input: {
    backgroundColor: 'burlywood',
    border: 'solid',
    borderRadius: theme.radius.xl,
    fontSize: 16,
    color: theme.white,
    paddingLeft: theme.spacing.md * 1.5 - 1,
    paddingRight: theme.spacing.md * 2 - 1,
    fontWeight: 600,
    display: 'flex',
    width: '21rem',
    '&::placeholder': {
      color: theme.white,
      textAlign: 'center',
      fontSize: theme.fontSizes.xl,
    },
    '&:hover': {
      backgroundColor: theme.colors[theme.primaryColor][7],
      cursor: 'pointer',
    },
    '&:focus': {
      textAlign: 'left',
      paddingLeft: 36,
      color:  theme.colors.gray[7],
      // backgroundColor: theme.colors.green[4],
      backgroundColor: 'rgba(150,185,97,0.9)',
      cursor: 'text',
      '&::placeholder': {
        color: theme.colors.gray[7],
        textAlign: 'left',
        fontSize: theme.fontSizes.md,
        paddingLeft: 8,
      },
    },
  },

  withIcon: {
    paddingLeft: 38,
    paddingRight: 16,
  },

  dropdown: {
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors[theme.primaryColor][4],
    zIndex: 101,
  },

  item: {
    fontSize: theme.fontSizes.md,
    borderRadius: theme.radius.xl,
  },

}));

export default function Banner() {
  const { classes, cx } = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [autocompleteLocations, autocompleteErr, locationFetch] = useMapboxApi();
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();

  const handleLocationChange = async (query) => {
    setSearchTerm(query);
    if (!searchTerm) return;

    locationFetch(query, 'all');
  }

  // test place_type logic with mexico / mexico city
  const handleFilterPostsByPlaceSearch = (item) => {
    const smallestPlaceName = item.place_name.split(',').shift().toLowerCase();
    let placeType;
    if (item.place_type[0] === "country") {
      placeType = "country";
    } else if (item.place_type[0] === "district" || item.place_type[0] === "region") {
      placeType = "state";
    } else {
      placeType = "city";
    }
    dispatch(filterSet({type: placeType, value: smallestPlaceName}));
    setSearchTerm('');
    setIsFocused(false);
  };

  // autocomplete input doesn't clear

  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .25) 80%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        <Title className={classes.title}>let's go somewhere</Title>
        <Autocomplete
          value={searchTerm}
          onChange={(query) => {handleLocationChange(query)}}
          onItemSubmit={(item) => {handleFilterPostsByPlaceSearch(item)}}
          data={autocompleteLocations.map((location) => ({ ...location, value: location.place_name }))}
          filter={(value, item) => item}
          size="xl"
          icon={isFocused ? '' : <SearchIcon/>}
          //onKeyPress={(e) => {if (e.key === 'Enter') {handleFilterPostsByPlaceSearch({type: 'tags', value: search}, e)}}}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? "start typing to search places" : "where would you like to go?"}
          classNames={{root: classes.control, withIcon: classes.withIcon, input: classes.input, dropdown: classes.dropdown, item: classes.item}}
        />
      </Container>
    </div>
  );
}
