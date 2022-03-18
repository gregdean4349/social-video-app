import React, { useEffect, useState } from 'react';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from '../firebase-config';
import { categoryFeeds, getAllFeeds } from '../utils/fetchData';
import { SimpleGrid } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import Spinner from './Spinner';
import VideoPin from './VideoPin';
import NotFound from './NotFound';

const Feed = () => {
  //* Firestore db instance
  const firestoreDb = getFirestore(firebaseApp);
  const { categoryId } = useParams();

  const [feeds, setFeeds] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      categoryFeeds(firestoreDb, categoryId).then((data) => {
        setFeeds(data);
        setLoading(false);
      });
    } else {
      getAllFeeds(firestoreDb).then((data) => {
        setFeeds(data);
        setLoading(false);
      });
    }
  }, [firestoreDb, categoryId]);

  //* Show Not Found page if no videos

  if (loading) return <Spinner msg={'Loading your Feeds...'} />;
  // if (!feeds.length > 0) return <NotFound />;
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
