import { useState, useEffect } from 'react';
import { ScrollArea } from '@mantine/core';
import Post from './Post.jsx';

export default function Feed() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts([{id: 1, title: 'Shark Diving in Jupiter, FL', tags: ['scuba'], region: ['Florida', 'United States', 'North America'], language: ['English'], city: 'Jupiter, FL', country: 'United States', text: 'A sleepy southern coastal town an hour and a half drive north from Miami, Jupiter, Florida is home to some of the best shark diving in the world. Here, experienced divers have a rare opportunity to go deep and get personal with several species of shark including tiger, bull, nurse, reef, and the ellusive hammerhead. Emerald Charters is the better known of two (number per Google) dive companies providing this boutique dive experience.', photos: [], author: 'carolinep', created_at: 'Aug 2022'}]);

  }, []);

  return(
    <Container>
      <ScrollArea style={{ height: 900 }}>
      {posts.map(post => (
        <Post
        key={post.id} post={post}></Post>
      ))}
      </ScrollArea>
    </Container>
  )
}

