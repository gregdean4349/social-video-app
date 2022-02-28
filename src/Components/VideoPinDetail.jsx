import {
  Box,
  Flex,
  Grid,
  GridItem,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { IoHome, IoPlay } from 'react-icons/io5';
import { MdOutlineReplay10 } from 'react-icons/md';

import { firebaseApp } from '../firebase-config';
import { getFirestore } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { getSpecificVideo } from '../utils/fetchData';
import Spinner from './Spinner';

const VideoPinDetail = () => {
  const textColor = useColorModeValue('gray.900', 'gray.50');
  const { videoId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  //* Custom reference
  const playerContainer = useRef();
  const playerRef = useRef();

  //* Firestore database instance
  const firestoreDb = getFirestore(firebaseApp);

  //* Get specific video details
  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      getSpecificVideo(firestoreDb, videoId).then((data) => {
        setVideoInfo(data);
        setIsLoading(false);
      });
    }
  }, [videoId, firestoreDb]);

  if (isLoading) return <Spinner msg={'Loading your Video...'} />;

  return (
    <Flex
      width={'full'}
      height={'auto'}
      justifyContent={'center'}
      alignItems={'center'}
      direction='column'
      py={2}
      px={4}
      bg={'gray.900'} //*
    >
      Video player page
      <Flex alignItems={'center'} width={'full'} my={4}>
        <Link to={'/'}>
          <IoHome fontSize={25} />
        </Link>
        <Box width={'1px'} height={18} bg={'gray.500'} mx={2}></Box>
        <Text
          isTruncated
          color={textColor}
          fontWeight={'semibold'}
          width={'100%'}
        >
          {videoInfo?.title}
        </Text>
      </Flex>
      {/* Main Grid for Video */}
      <Grid templateColumns='repeat(4, 1fr)' gap={2} width={'100%'}>
        <GridItem width={'100%'} colSpan={3} p={2}>
          <Flex
            width={'full'}
            bg={'black'}
            position='relative'
            ref={playerContainer}
          >
            <ReactPlayer
              url={videoInfo?.videoUrl}
              ref={playerRef}
              width={'100%'}
              height={'100%'}
              playing={isPlaying}
              // muted={muted}
              // volume={volume}
              // onProgress={handleProgress}
            />
            {/* Video player Controls */}
            <Flex
              position={'absolute'}
              top={0}
              right={0}
              bottom={0}
              left={0}
              direction='column'
              justifyContent={'space-between'}
              alignItems='center'
              zIndex={1}
              // cursor='pointer'
            >
              {/* Play icon */}
              <Flex
                alignItems={'center'}
                justifyContent='center'
                onClick={() => setIsPlaying(!isPlaying)}
                width='full'
                height='full'
              >
                {!isPlaying && (
                  <IoPlay fontSize={60} color={'#f2f2f2'} cursor={'pointer'} />
                )}
              </Flex>
              {/* Video Player Progress Controls */}
              <Flex
                width={'full'}
                alignItems='center'
                direction={'column'}
                px={4}
                bgGradient='linear(to-t, blackAlpha.900, blackAlpha.500, blackAlpha.50)'
              >
                <Slider
                  aria-label='slider-ex-4'
                  min={0}
                  max={100}
                  // value={played * 100}
                  transition='ease-in-out'
                  transitionDuration={'0.2'}
                  // onChange={handleSeekChange}
                  // onMouseDown={onSeekMouseDown}
                  // onChangeEnd={onSeekMouseUp}
                >
                  <SliderTrack bg={'teal.50'}>
                    <SliderFilledTrack bg={'teal.300'} />
                    <SliderThumb
                      boxSize={5}
                      bg='teal.500'
                      transition='ease-in-out'
                      transitionDuration={'0.2'}
                    />
                  </SliderTrack>
                </Slider>
                {/* Other Video Player Controls */}
                <Flex width={'full'} alignItems='center' my={2} gap={10}>
                  <MdOutlineReplay10
                    fontSize={30}
                    color={'#f1f1f1'}
                    cursor='pointer'
                    // onClick={handleFastRewind}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem width={'100%'} colSpan={1} bg={'blue.900'} p={2}></GridItem>
      </Grid>
    </Flex>
  );
};

export default VideoPinDetail;
