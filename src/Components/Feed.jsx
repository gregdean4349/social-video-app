import React, { useEffect, useState } from 'react';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from '../firebase-config';
import { getAllFeeds } from '../utils/fetchData';
import { SimpleGrid } from '@chakra-ui/react';
import Spinner from './Spinner';
import VideoPin from './VideoPin';

const Feed = () => {
  //* Firestore db instance
  const firestoreDb = getFirestore(firebaseApp);
  

  const [feeds, setFeeds] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllFeeds(firestoreDb).then((data) => {
      setFeeds(data);
      setLoading(false);
    });
  }, [firestoreDb]);
  // console.log(feeds)

  if (loading) return <Spinner msg={'Loading your Feeds...'} />;

  return (
    <SimpleGrid
      minChildWidth='300px'
      spacing='15px'
      padding='2px'
      width='full'
      autoColumns={'max-content'}
      overflowX={'hidden'}
    >
      {feeds &&
        feeds.map((data) => (
          <VideoPin key={data.id} maxWidth={420} height={'80px'} data={data} />
        ))}
    </SimpleGrid>
  );
};

export default Feed;
