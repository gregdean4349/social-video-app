import { Flex, HStack, Image, Button } from '@chakra-ui/react';
import React from 'react';
import MusicBg from '../img/musicbg.jpg';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const firebaseAuth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const firebaseDb = getFirestore(firebaseApp);
  const navigate = useNavigate();

  //* SignIn to Google Authentication Service
  const login = async () => {
    //* de-structure and pull the user info
    const { user } = await signInWithPopup(firebaseAuth, provider);

    //* de-structure and pull refreshToken and providerData from user
    const { refreshToken, providerData } = user;

    //* Push the refresh token and user data to localStorage for retrieval later.
    localStorage.setItem('user', JSON.stringify(providerData));
    localStorage.setItem('accessToken', JSON.stringify(refreshToken));

    //* Push User info to Firestore, collection 'users', w/docId set as uid
    await setDoc(
      doc(firebaseDb, 'users', providerData[0].uid),
      //* User info source
      providerData[0]
    );

    //* navigate to Homepage & replace Url
    navigate('/', { replace: true });
  };

  return (
    <Flex
      justifyContent={'center'}
      alignItems={'center'}
      width={'100vw'}
      height={'100vh'}
      position={'relative'}
    >
      <Image src={MusicBg} objectFit='cover' width={'full'} height={'full'} />
      <Flex
        position={'absolute'}
        width={'100vw'}
        height={'100vh'}
        bg={'blackAlpha.600'}
        top={'0'}
        left={'0'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <HStack>
          <Button
            leftIcon={<FcGoogle />}
            fontSize={18}
            colorScheme='whiteAlpha'
            shadow={'lg'}
            //* Login to provider (Google)
            onClick={() => login()}
          >
            SignIn with Google
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Login;
