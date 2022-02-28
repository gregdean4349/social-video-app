import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import {
  NavBar,
  Category,
  Feed,
  Create,
  Search,
  VideoPinDetail,
  UserProfile,
} from '../Components';
import { categories } from '../data';

const Home = ({ user }) => {
  return (
    <>
      <NavBar user={user} />

      <Flex width={'100vw'}>
        <Flex
          direction={'column'}
          justifyContent='start'
          alignItems={'center'}
          width='5%'
        >
          {categories &&
            categories.map((data) => <Category key={data.id} data={data} />)}
        </Flex>

        <Flex
          width={'95%'}
          padding={4}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Routes>
            <Route path='/' element={<Feed />} />
            <Route path='/category/:categoryId' element={<Feed />} />
            <Route path='/create' element={<Create />} />
            <Route path='/videoDetail/:videoId' element={<VideoPinDetail />} />
            <Route path='/search' element={<Search />} />
            <Route path='/userDetail/:userId' element={<UserProfile />} />
          </Routes>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
