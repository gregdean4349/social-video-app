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
  Image,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  ButtonGroup,
} from '@chakra-ui/react';

import { FcApproval } from 'react-icons/fc';

import { IoHome, IoPause, IoPlay, IoTrash } from 'react-icons/io5';
import {
  MdOutlineForward10,
  MdOutlineFullscreen,
  MdOutlineGraphicEq,
  MdOutlineReplay10,
  MdOutlineVolumeOff,
  MdOutlineVolumeUp,
} from 'react-icons/md';

import { firebaseApp } from '../firebase-config';
import { getFirestore } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  deleteVideo,
  getSpecificVideo,
  getUserInfo,
  recommendedFeed,
} from '../utils/fetchData';
import Spinner from './Spinner';
import logo_light from '../img/logo.png';
import HTMLReactParser from 'html-react-parser';
//* Fullscreen module
import screenfull from 'screenfull';
import moment from 'moment';
import { fetchUser } from '../utils/fetchUser';
import RecommendedVideos from './RecommendedVideos';

//* Format Date "hh:mm:ss" for current play time & video duration time
const format = (seconds) => {
  if (isNaN(seconds)) {
    return '00:00';
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')} : ${ss}`;
    //* hh:mm:ss format
  }

  return `${mm}:${ss}`;
  //* mm:ss format
};

const VideoPinDetail = () => {
  const textColor = useColorModeValue('gray.900', 'gray.50');
  const { videoId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const navigate = useNavigate();

  //* Fetch localUser info
  const [localUser] = fetchUser();

  //* Video Player reference
  const playerContainer = useRef();
  const playerRef = useRef();

  //* Firestore database instance
  const firestoreDb = getFirestore(firebaseApp);

  const avatar =
    'https://lh3.googleusercontent.com/a-/AOh14GgwCCGGm7UIfAfbZKf_kQFXMFA8lDgQnh0f7XcEgQ=s96-c';

  //* Get specific video details from Firestore database
  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      getSpecificVideo(firestoreDb, videoId).then((data) => {
        setVideoInfo(data);

        recommendedFeed(firestoreDb, data.category, videoId).then((feed) => {
          setFeeds(feed);
        });

        getUserInfo(firestoreDb, data.userId).then((user) => {
          setUserInfo(user);
        });

        setIsLoading(false);
      });
    }
  }, [videoId, firestoreDb]);

  useEffect(() => {}, [muted, volume, played]);

  //* Set Volume Slider to State and Mute if === 0
  const onvolumechange = (evt) => {
    setVolume(parseFloat(evt / 100));

    evt === 0 ? setMuted(true) : setMuted(false);
  };

  //* FastForward and Rewind buttons
  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleProgress = (changeState) => {
    if (!seeking) {
      setPlayed(parseFloat(changeState.played / 100) * 100);
    }
  };

  //* Video Seek - Scroll Bar
  const handleSeekChange = (evt) => {
    setPlayed(parseFloat(evt / 100));
  };

  const onSeekMouseDown = () => {
    setSeeking(true);
  };

  const onSeekMouseUp = (evt) => {
    setSeeking(false);
    playerRef.current.seekTo(evt / 100);
  };

  //* Video current play time & video duration time
  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : '00:00';

  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : '00:00';

  const elapsedTime = format(currentTime + 0.5);

  const totalDuration = format(duration);

  //* Delete the posted video
  const deleteTheVideo = (videoId) => {
    setIsLoading(true);
    deleteVideo(firestoreDb, videoId);
    navigate('/', { replace: true }); // TODO: Delete video from Firebase Storage
  };

  //* Load Spinner while working data from Firebase
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
    >
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
              muted={muted}
              volume={volume}
              onProgress={handleProgress}
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
                  <IoPlay fontSize={60} color={'#f1f1f1'} cursor={'pointer'} />
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
                  value={played * 100}
                  transition='ease-in-out'
                  transitionDuration={'0.5'}
                  onChange={handleSeekChange}
                  onMouseDown={onSeekMouseDown}
                  onChangeEnd={onSeekMouseUp}
                >
                  <SliderTrack
                    bg={'teal.50'}
                    transition='ease-in-out'
                    transitionDuration={'0.5'}
                  >
                    <SliderFilledTrack
                      bg={'teal.300'}
                      transition='ease-in-out'
                      transitionDuration={'0.5'}
                    />
                  </SliderTrack>
                  <SliderThumb
                    boxSize={5}
                    bg='teal.300'
                    transition='ease-in-out'
                    transitionDuration={'0.5'}
                  >
                    <Box color={'teal.600'} as={MdOutlineGraphicEq} />
                  </SliderThumb>
                </Slider>
                {/* Other Video Player Controls */}
                <Flex width={'full'} alignItems='center' my={2} gap={10}>
                  <MdOutlineReplay10
                    fontSize={30}
                    color={'#f1f1f1'}
                    cursor='pointer'
                    onClick={handleRewind}
                  />
                  <Box onClick={() => setIsPlaying(!isPlaying)}>
                    {!isPlaying ? (
                      <IoPlay
                        fontSize={25}
                        color={'#f1f1f1'}
                        cursor={'pointer'}
                      />
                    ) : (
                      <IoPause
                        fontSize={25}
                        color={'#f1f1f1'}
                        cursor={'pointer'}
                      />
                    )}
                  </Box>
                  <MdOutlineForward10
                    fontSize={30}
                    color={'#f1f1f1'}
                    cursor='pointer'
                    onClick={handleFastForward}
                  />
                  {/* Volume Controls */}
                  <Flex alignItems={'center'}>
                    <Box onClick={() => setMuted(!muted)}>
                      {!muted ? (
                        <MdOutlineVolumeUp
                          fontSize={30}
                          color='#f1f1f1'
                          cursor='pointer'
                        />
                      ) : (
                        <MdOutlineVolumeOff
                          fontSize={30}
                          color='#f1f1f1'
                          cursor='pointer'
                        />
                      )}
                    </Box>
                    <Slider
                      aria-label='slider-ex-1'
                      defaultValue={volume * 100}
                      min={0}
                      max={100}
                      size='sm'
                      width={20}
                      mx={2}
                      onChangeStart={onvolumechange}
                      onChangeEnd={onvolumechange}
                    >
                      <SliderTrack bg='teal.50'>
                        <SliderFilledTrack bg='teal.300' />
                      </SliderTrack>
                      <SliderThumb boxSize={2} bg='teal.300' />
                    </Slider>
                  </Flex>

                  {/* Duration of Video */}
                  <Flex alignItems={'center'} gap={2}>
                    <Text fontSize={16} color='whitesmoke'>
                      {elapsedTime}
                    </Text>
                    <Text fontSize={16} color='whitesmoke'>
                      /
                    </Text>
                    <Text fontSize={16} color='whitesmoke'>
                      {totalDuration}
                    </Text>
                  </Flex>

                  <Image src={logo_light} width={'120px'} ml='auto' />

                  <MdOutlineFullscreen
                    fontSize={30}
                    color='#f1f1f1'
                    cursor={'pointer'}
                    onClick={() => {
                      screenfull.toggle(playerContainer.current);
                    }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          {/* Video Description */}
          {videoInfo?.description && (
            <Flex my={6} direction={'column'}>
              <Text my={2} fontSize={25} fontWeight={'semibold'}>
                Description
              </Text>
              {HTMLReactParser(videoInfo?.description)}
            </Flex>
          )}
        </GridItem>

        <GridItem width={'100%'} colSpan={1}>
          {userInfo && (
            <Flex direction={'column'} width={'full'}>
              <Flex alignItems={'center'} width={'full'}>
                <Image
                  src={userInfo ? userInfo?.photoURL : avatar}
                  rounded={'full'}
                  height={'60px'}
                  width={'60px'}
                  minWidth={'60px'}
                  minHeight={'60px'}
                />
                <Flex direction={'column'} ml={2}>
                  <Flex alignItems={'center'}>
                    <Text
                      isTruncated
                      color={textColor}
                      fontWeight={'semibold'}
                      mx={2}
                    >
                      {userInfo?.displayName}
                    </Text>
                    <FcApproval />
                  </Flex>
                  {videoInfo?.id && (
                    <Text ml={2} fontSize={12}>
                      {moment(
                        new Date(parseInt(videoInfo.id)).toISOString()
                      ).fromNow()}
                    </Text>
                  )}
                </Flex>
              </Flex>
              {/* Action buttons */}
              <Flex justifyContent={'space-around'} mt={6}>
                {userInfo?.uid === localUser.uid && (
                  <Popover closeOnEsc>
                    <PopoverTrigger>
                      <Button colorScheme={'red'}>
                        <IoTrash fontSize={20} color={'#fff'} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Confirmation!</PopoverHeader>
                      <PopoverBody>
                        Are you sure you want to delete the post?
                      </PopoverBody>

                      <PopoverFooter
                        display={'flex'}
                        justifyContent={'flex-end'}
                      >
                        <ButtonGroup>
                          <Button
                            colorScheme={'red'}
                            onClick={() => deleteTheVideo(videoId)}
                          >
                            Yes (Esc to cancel)
                          </Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                )}

                <a
                  href={videoInfo.videoUrl}
                  download
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button colorScheme={'whatsapp'}>Free Download</Button>
                </a>
              </Flex>
            </Flex>
          )}
        </GridItem>
      </Grid>

      {feeds && (
        <Flex direction={'column'} width={'full'} my={6}>
          <Text my={4} fontSize={25} fontWeight={'semibold'}>
            Recommended Videos
          </Text>
          <RecommendedVideos feeds={feeds} />
        </Flex>
      )}
    </Flex>
  );
};

export default VideoPinDetail;
