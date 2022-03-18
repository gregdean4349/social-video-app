// prettier-ignore
import { Button, Flex, FormLabel, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';
// prettier-ignore
import { IoCheckmark, IoChevronDown, IoCloudUpload, IoLocation, IoTrash, IoWarning, } from 'react-icons/io5';
import { firebaseApp } from '../firebase-config';
import { categories } from '../data';
import Spinner from './Spinner';
// prettier-ignore
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import AlertMsg from './AlertMsg';
import { Editor } from '@tinymce/tinymce-react';
import { fetchUser } from '../utils/fetchUser';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const { colorMode } = useColorMode();
  const textColor = useColorModeValue('gray.900', 'gray.50');
  const editorRef = useRef(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Choose a category');
  const [location, setLocation] = useState('');
  const [videoAsset, setVideoAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertIcon, setAlertIcon] = useState(null);
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  //* Fetch user information
  const [userInfo] = fetchUser();

  //*  Initialize FireStoreDb
  const firestoreDb = getFirestore(firebaseApp);

  //* Initialize Firebase Storage
  const storage = getStorage(firebaseApp);

  //* Create a firebase Storage instance
  const uploadVideo = (e) => {
    setLoading(true);

    const videoFile = e.target.files[0];
    const storageRef = ref(storage, `Videos/${Date.now()}-${videoFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //* Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded -- For progress bar...
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoAsset(downloadURL);
          setLoading(false);
          setAlert(true);
          setAlertStatus('success');
          setAlertIcon(<IoCheckmark fontSize={25} />);
          setAlertMsg('Video Uploaded Successfully To Server');
          setTimeout(() => {
            setAlert(false);
          }, 4000);
        });
      }
    );
  };

  const deleteVideo = () => {
    const deleteRef = ref(storage, videoAsset);
    deleteObject(deleteRef)
      .then(() => {
        setVideoAsset(null);
        setAlert(true);
        setAlertStatus('error');
        setAlertIcon(<IoWarning fontSize={25} />);
        setAlertMsg('Video Deleted Successfully From Server');
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDescriptionValue = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      setDescription(editorRef.current.getContent());
    }
  };

  const uploadDetails = async () => {
    try {
      setLoading(true);
      if (!title && !category && !videoAsset) {
        setAlert(true);
        setAlertStatus('error');
        setAlertIcon(<IoWarning fontSize={25} />);
        setAlertMsg('Required Fields are missing!');
        setTimeout(() => {
          setAlert(false);
        }, 4000);
        setLoading(false);
      } else {
        const data = {
          id: `${Date.now()}`,
          title: title,
          userId: userInfo?.uid,
          category: category,
          location: location,
          videoUrl: videoAsset,
          description: description,
        };

        await setDoc(doc(firestoreDb, 'videos', `${Date.now()}`), data);
        setLoading(false);
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, [title, location, description, category]);

  return (
    <Flex
      justifyContent={'center'}
      alignItems={'center'}
      width={'100vw'}
      height={'88vh'} //! change if needed
      padding={10}
    >
      <Flex
        width={'80%'}
        height={'full'}
        border={'1px'}
        borderColor={'gray.400'}
        borderRadius={'md'}
        p='4'
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={2}
      >
        {alert && (
          <AlertMsg status={alertStatus} msg={alertMsg} icon={alertIcon} />
        )}

        <Input
          variant={'flushed'}
          placeholder={'Title'}
          focusBorderColor={'gray.400'}
          isRequired
          errorBorderColor={'red.500'}
          type={'text'}
          _placeholder={{ color: 'gray.500' }}
          fontSize={20}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          width={'full'}
          gap={8}
          my={4}
        >
          <Menu>
            <MenuButton
              fontSize={20}
              width={'full'}
              colorScheme={'blue'}
              as={Button}
              rightIcon={<IoChevronDown fontSize={18} />}
            >
              {category}
            </MenuButton>
            <MenuList zIndex={101} width={'md'} shadow={'lg'}>
              {categories &&
                categories.map((data) => (
                  <MenuItem
                    key={data.id}
                    _hover={{ bg: 'blackAlpha.300' }}
                    fontSize={'20'}
                    px={4}
                    onClick={() => setCategory(data.name)}
                  >
                    {data.iconSrc}
                    <Text ml={3} color={textColor}>
                      {data.name}{' '}
                    </Text>
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={
                <IoLocation
                  fontSize={20}
                  color={`${colorMode === 'dark' ? '#f1f1f1' : '#111'}`}
                />
              }
            />
            <Input
              variant={'flushed'}
              placeholder={'Location'}
              focusBorderColor={'gray.400'}
              isRequired
              errorBorderColor={'red.500'}
              type={'text'}
              _placeholder={{ color: 'gray.500' }}
              fontSize={20}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </InputGroup>
        </Flex>
        {/* File selection */}
        <Flex
          border={'1px'}
          borderColor={'gray.500'}
          height={'400px'}
          borderStyle={'dashed'}
          width={'full'}
          borderRadius={'md'}
          overflow={'hidden'}
          position={'relative'}
        >
          {!videoAsset ? (
            <FormLabel width={'full'}>
              <Flex
                direction={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                height={'full'}
                width={'full'}
              >
                <Flex
                  direction={'column'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  height={'full'}
                  width={'full'}
                  cursor={'pointer'}
                >
                  {loading ? (
                    <Spinner
                      msg={`Upload is ${Math.floor(progress)} % done`}
                      progress={progress}
                    />
                  ) : (
                    <>
                      <IoCloudUpload
                        fontSize={40}
                        color={`${colorMode === 'dark' ? '#f1f1f1' : '#111'}`}
                      />
                      <Text mt={5} fontSize={20} color={textColor}>
                        Click to upload
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
              {!loading && (
                <input
                  type='file'
                  name='upload-video'
                  onChange={uploadVideo}
                  style={{ width: '0', height: '0' }}
                  accept='video/mp4,video/x-m4v,video/*'
                />
              )}
            </FormLabel>
          ) : (
            <Flex
              width={'full'}
              height={'full'}
              justifyContent={'center'}
              alignItems={'center'}
              bg={'black'}
              position={'relative'}
            >
              <Flex
                justifyContent={'center'}
                alignItems={'center'}
                width={'40px'}
                height={'40px'}
                rounded={'full'}
                bg={'red.700'}
                top={5}
                right={5}
                position={'absolute'}
                cursor={'pointer'}
                zIndex={10}
                onClick={deleteVideo}
              >
                <IoTrash fontSize={20} color={'white'} />
              </Flex>
              <video
                src={videoAsset}
                controls
                style={{ width: '100%', height: '100%' }}
              />
            </Flex>
          )}
        </Flex>

        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)}
          onChange={getDescriptionValue}
          apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
          init={{
            height: 500,
            width: '100%',
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
            ],
            toolbar:
              'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size: 14px; }',
            content_css: 'dark',
            skin: 'oxide-dark',
          }}
        />
        <Button
          isLoading={loading}
          loadingText='Uploading'
          colorScheme={'linkedin'}
          variant={`${loading ? 'outline' : 'solid'}`}
          width={'full'}
          _hover={{ shadow: 'lg' }}
          fontSize={20}
          padding={2}
          mt={1}
          onClick={() => uploadDetails()}
        >
          Upload
        </Button>
      </Flex>
    </Flex>
  );
};

export default Create;
