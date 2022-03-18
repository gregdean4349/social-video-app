import React from 'react';
import logo_dark from '../img/logo_dark.png';
import logo_light from '../img/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { IoAdd, IoLogOut, IoMoon, IoSearch, IoSunny } from 'react-icons/io5';

const NavBar = ({ user }) => {
  //* Dark & Light Mode Toggle
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.600', 'gray.300');
  const navigate = useNavigate();

  return (
    <Flex
      justifyContent={'space-between'}
      alignItems='center'
      width={'100vw'}
      p='4'
    >
      <Link to={'/'}>
        <Image
          src={colorMode === 'light' ? logo_dark : logo_light}
          width={'180px'}
        />
      </Link>
      <InputGroup mx='6' width={'60vw'}>
        <InputLeftElement
          pointerEvents='none'
          children={<IoSearch fontSize={25} />}
        />
        <Input
          type={'text'}
          placeholder='Search...'
          fontSize={18}
          fontWeight={'medium'}
          variant={'filled'}
        />
      </InputGroup>
      <Flex justify={'center'} alignItems={'center'}>
        <Flex
          width={'40px'}
          height={'40px'}
          justifyContent={'center'}
          alignItems={'center'}
          cursor={'pointer'}
          borderRadius={'5px'}
          onClick={toggleColorMode}
        >
          {colorMode === 'light' ? (
            <IoMoon fontSize={25} />
          ) : (
            <IoSunny fontSize={25} />
          )}
        </Flex>

        {/* Create Button */}
        <Link to={'/create'}>
          <Flex
            width={'40px'}
            height={'40px'}
            bgColor={bg}
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius={'5px'}
            mx={'6'}
            cursor={'pointer'}
            _hover={{ shadow: 'lg' }}
            transition='ease-in-out'
            transition-duration={'0.3s'}
          >
            <IoAdd
              fontSize={25}
              color={`${colorMode === 'dark' ? '#111' : '#f1f1f1'}`}
            />
          </Flex>
        </Link>
        <Menu>
          <MenuButton>
            <Image
              src={user?.photoURL}
              width={'40px'}
              height={'40px'}
              rounded={'full'}
            />
          </MenuButton>
          <MenuList shadow={'lg'}>
            <Link to={`/userDetail/${user?.uid}`}>
              <MenuItem>My Account</MenuItem>
            </Link>
            <MenuItem
              flexDirection={'row'}
              gap={'4'}
              alignItems={'center'}
              onClick={() => {
                localStorage.clear();
                navigate('/login', { replace: true });
              }}
            >
              Logout <IoLogOut fontSize={25} />
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default NavBar;
