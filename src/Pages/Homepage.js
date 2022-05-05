import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Login from './../components/Authentication/Login';
import Signup from './../components/Authentication/Signup';


const Homepage = () => {

  const history = useHistory();


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    user && history.push('/chats');

  }, [history]);

  return (
    <Container maxW='xl' centerContent justifyContent='center'>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg={'white'}
        w='100%'
        m='10px 0 15px 0'
        borderWidth='1px'
      >
        <Text fontSize='4xl' fontFamily='Work Sans' color='black' >Inst-Chat</Text>
      </Box>
      <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px' color='black' >
        <Tabs variant='soft-rounded'>
          <TabList marginBottom='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage