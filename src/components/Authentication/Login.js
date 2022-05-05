import { useState } from 'react'
import { useToast, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, Button } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from 'react-router-dom'



const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const history = useHistory();


  const handleClick = () => setShow(prev => !prev);

  const submitHandler = async (e) => {
    setLoading(true);
    if (!email || !password) {
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

    try {

      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
      };
      const { data } = await axios.post(process.env.REACT_APP_API+'/api/users/login', {
        email, password,
      },
        config
      );


      toast({
        title: 'Successfully Logged In',
        status: 'success',
        duration: 2000,
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


      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={(e) => { submitHandler(e) }}
      >
        Login
      </Button>
      <Button
        variant='solid'
        colorScheme='red'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={(e) => {
          setEmail('guest@example.com');
          setPassword('123456');
        }}
        isLoading={loading}
      >
        Get Guest User Credentials
      </Button>


    </VStack>
  )
}

export default Login