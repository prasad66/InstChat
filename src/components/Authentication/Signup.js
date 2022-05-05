import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, Button } from '@chakra-ui/react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import {useHistory} from 'react-router-dom'

const Signup = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pic, setPic] = useState();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();


  const handleClick = () => setShow(prev => !prev);
  const handleClick2 = () => setShow2(prev => !prev);

  const history = useHistory();

  const postDetails = (pic) => {
    setLoading(true);

    if (pic === undefined) {
      toast({
        title: 'Please select an image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      setLoading(false);
      return;
    }

    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      const data = new FormData();
      data.append('file', pic);
      data.append('upload_preset', 'chatapp');
      data.append('cloud_name', 'dsbrurrwa');
      fetch('https://api.cloudinary.com/v1_1/dsbrurrwa/image/upload', {
        method: 'POST',
        body: data
      }).then(res => res.json())
        .then(data => {
          // console.log(data)
          setPic(data.url.toString());
          setLoading(false);
        }).catch(err => {
          setLoading(false);
          toast({
            title: 'Error uploading image',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          })
        });
    } else {
      toast({
        title: 'Please select an image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      setLoading(false);
    }


  };

  const submitHandler = async (e) => {

    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill the required fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      setLoading(false);
      return;
    }
    try {

      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
      };
      const { data } = await axios.post(process.env.REACT_APP_API+'/api/users', {
        name, email, password, pic
      },
        config
      );

      toast({
        title: 'Successfully registered',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      localStorage.setItem('userInfo', JSON.stringify(data)); 
      setLoading(false);
      history.push('/chats');


    } catch (error) {
      toast({
        title: 'Error signing up',
        description: error.response.data.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      setLoading(false);
    }

  };

  return (
    <VStack spacing='5px' >

      <FormControl id='first-name' isRequired >
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter Your Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id='email' isRequired >
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter Your Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='password' isRequired >
        <FormLabel>Password</FormLabel>

        <InputGroup>
          <Input
            autoComplete='false'
            type={show ? 'text' : 'password'}
            placeholder='Password...'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {
                show ? 'Hide' : 'Show'
              }
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='password' isRequired >
        <FormLabel>Confirm Password</FormLabel>

        <InputGroup>
          <Input
            autoComplete='false'
            type={show2 ? 'text' : 'password'}
            placeholder='Confirm Password...'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick2}>
              {
                show2 ? 'Hide' : 'Show'
              }
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='pic' isRequired >
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={() => { submitHandler() }}
        isLoading={loading}
      >
        Signup
      </Button>


    </VStack>
  )
}

export default Signup