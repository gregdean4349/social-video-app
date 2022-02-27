import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  NavBar,
  Category,
  Feed,
  Create,
  VideoPin,
  Search,
} from '../Components/index';
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
          width='7%'
        >
          {categories &&
            categories.map((data) => <Category key={data.id} data={data} />)}
        </Flex>

        <Flex
          width={'93%'}
          px={4}
          justifyContent='center'
          alignItems={'center'}
          
        >
          <Routes>
            <Route path='/' element={<Feed />} />
            <Route path='/category/:categoryId' element={<Feed />} />
            <Route path='/create' element={<Create />} />
            <Route path='/videoDetail/:videoId' element={<VideoPin />} />
            <Route path='/search' element={<Search />} />
          </Routes>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
