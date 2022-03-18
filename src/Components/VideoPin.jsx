/* eslint-disable react/jsx-no-comment-textnodes */
import { Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//* Utility function getUserInfo
import { getUserInfo } from '../utils/fetchData';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from '../firebase-config';
import moment from 'moment';
import { MdUnsubscribe } from 'react-icons/md';

const VideoPin = ({ data }) => {
  //* Dark & Light Mode Toggle
  const bg = useColorModeValue('blackAlpha.700', 'gray.900');
  const textColor = useColorModeValue('gray.100', 'gray.100');
  const firestoreDb = getFirestore(firebaseApp);

  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null);

  const avatar =
    'https://lh3.googleusercontent.com/a-/AOh14GgwCCGGm7UIfAfbZKf_kQFXMFA8lDgQnh0f7XcEgQ=s96-c';

  useEffect(() => {
    const controller = new AbortController();
    if (data) setUserId(data?.userId);
    if (userId)
      //* get user information for videoPin posted by
      getUserInfo(firestoreDb, userId).then((data) => {
        setUserInfo(data);
      });
    return () => controller.abort(); // TODO remove abort controller if necessary
  }, [userId, data, firestoreDb]);

  return (
    <Flex
      justify={'space-between'}
      align={'center'}
      direction={'column'}
      cursor={'pointer'}
      shadow={'lg'}
      _hover={{ shadow: 'xl', border: '1px solid gray' }}
      overflow={'hidden'}
      position={'relative'}
      maxWidth={'300px'}
      bg={'gray.200'}
      rounded={'md'}
    >
      <Link to={`/videoDetail/${data?.id}`}>
        <video
          src={data?.videoUrl}
          muted
          onMouseOver={(e) => e.target.play()}
          onMouseOut={(e) => e.target.pause()}
        />
      </Link>
      <Flex
        position={'absolute'}
        bottom={0}
        left={0}
        p={1}
        bg={bg}
        width={'full'}
        direction={'column'}
      >
        <Flex width={'full'} justify={'space-between'} alignItems={'center'}>
          <Text color={textColor} isTruncated={'true'} fontSize={20}>
            {data?.title}
          </Text>
          <Link to={`/userDetail/${userId}`}>
            <Image
              src={userInfo ? userInfo?.photoURL : avatar}
              rounded={'full'}
              height={'50px'}
              width={'50px'}
              border={'2px'}
              borderColor={bg}
              mt={-12}
            />
          </Link>
        </Flex>

        {/* Moment Time Configuration */}

        <Text fontSize={12} textColor={'textColor'} ml={'auto'}>
          {moment(new Date(parseInt(data?.id)).toISOString()).fromNow()}
        </Text>
      </Flex>
    </Flex>
  );
};

export default VideoPin;
