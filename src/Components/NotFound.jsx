import { Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import notFound from '../img/notfound.svg';

const NotFound = () => {
  return (
    <Flex
      width={'full'}
      justifyContent={'center'}
      alignItems={'center'}
      direction='column'
    >
      <Image src={notFound} width={600} />
      <Text fontSize={24} fontWeight={'semibold'} fontFamily={'cursive'}>
        No video posts found...
      </Text>
    </Flex>
  );
};

export default NotFound;
