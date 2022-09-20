import React, { useReducer, useState, useEffect } from "react";
import { createStyles, Text } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
  },

  input: {
    height: 'auto',
  },

  label: {
    pointerEvents: 'none',
    fontSize: theme.fontSizes.sm,
    //paddingLeft: theme.spacing.sm,
    zIndex: 1,
  },

  tag: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderRadius: '5px',
    paddingTop: theme.spacing.xs / 3,
    paddingBottom: theme.spacing.xs / 3,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.sm,
    position: 'relative',
    zIndex: 1,
  },

  close: {
    position: 'absolute',
    zIndex: 2,
    fontSize: theme.fontSizes.xs,
    right: '2px',
    top: '1px',
    paddingTop: 0,

    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default function AddTag({ formState, dispatch, handleTextChange, handleAddTag, handleDeleteOne }) {
  const { classes, cx } = useStyles();



  return(
    <>
      <label>
        add a new tag:
        <input
          type="text"
          name="newTag"
          value={formState.newTag}
          onChange={(e) => handleTextChange(e)}
          ></input>
        <button type="button" onClick={(e) => handleAddTag(e)}>add tag</button>
      </label>
      <br/>
      {formState.newTags
        && (
          formState.newTags.map((nTag, i) => {
            return <Text span key={i} className={classes.tag}>{nTag}
            <span className={classes.close} onClick={(e) => handleDeleteOne(i, 'newTags', e)}>x</span>
            </Text>
          }))
        }
    </>
  );
};

