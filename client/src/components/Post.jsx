import React from 'react';

export default function Post({ post }) {
  return(
    <div>
      <h3>{post.title}</h3>
      <p>{post.text}</p>
    </div>
  )
}