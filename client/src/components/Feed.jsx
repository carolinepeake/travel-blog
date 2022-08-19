import { useState, useEffect } from 'react';
import { ScrollArea, SimpleGrid, Container, useMantineTheme  } from '@mantine/core';
import Post from './Post.jsx';

const examplePost = {id: 1, title: 'Shark Diving in Jupiter, FL', tags: ['scuba'], location: {city: 'Jupiter', state: 'Florida', country: 'United States', region: 'North America'}, language: ['English'], city: 'Jupiter, FL', country: 'United States', description: 'A sleepy southern coastal town an hour and a half drive north from Miami, Jupiter, Florida is home to some of the best shark diving in the world. Here, experienced divers have a rare opportunity to go deep and get personal with several species of shark including tiger, bull, nurse, reef, and the ellusive hammerhead. Emerald Charters is the better known of two (number per Google) dive companies providing this boutique dive experience.', photos: [], author: {name: 'carolinep', city: 'san francisco', country: 'usa', image: ''}, created_at: 'Aug 2022'};

export default function Feed() {
  const theme = useMantineTheme();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts([examplePost]);
  }, []);

  return (
    <Container my="md">
      <ScrollArea style={{ height: 900 }}>
        <SimpleGrid cols={3} spacing="xl * 2" breakpoints={[{ maxWidth: 'xs', cols: 1, spacing: 'sm' }, {maxWidth: 'sm', cols: 1, spacing: 'sm'}, {maxWidth: 'md', cols: 2, spacing: 'md'}, {maxWidth: 'lg', cols: 3, spacing: 'l'}]}>
          {posts.map(post => (
          <Post
          key={post.id} post={post}></Post>
        ))}
        </SimpleGrid>
      </ScrollArea>
    </Container>
  );
}



