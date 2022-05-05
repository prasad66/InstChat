import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, IconButton, Spinner, Text, FormControl, Input, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from './../Context/ChatProvider';
import { getSender, getSenderFull } from './../config/ChatLogics';
import ProfileModal from './misc/ProfileModal';
import UpdateGroupChatModal from './misc/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import axios from 'axios';
import Lottie from 'react-lottie';
import animationData from './animations/typing.json'
import './styles.css'

const ENDPOINT = process.env.REACT_APP_API;

var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, chats, selectedChat, setSelectedChat, notifications, setNotifications } = ChatState();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);

    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, []);


    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {

            const config = {
                headers: {
                    Authorization: 'Bearer ' + user.token
                }
            };
            setLoading(true);

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            // console.log(error);
            toast({
                title: 'Error',
                description: 'Something went wrong',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    useEffect(() => {
        // setNotifications(noti=>noti.chat._id!==selectedChat._id);
        // notifications.forEach(n=>console.log(n))
    }, [selectedChat, notifications, setNotifications])
    // console.log(selectedChat?._id)

    useEffect(() => {
        socket.on('message received', (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notifications.includes(newMessageRecieved)) {
                    setNotifications([newMessageRecieved, ...notifications]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        }
        )
    });


    const sendMessage = async (e) => {

        if (e.key !== 'Enter' || !newMessage) return;

        socket.emit('stop typing', selectedChat._id);

        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };
            setNewMessage('');

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/message`, {
                content: newMessage,
                chatId: selectedChat._id,
            }, config);

            socket.emit('new message', data);
            setMessages([...messages, data]);

        } catch (error) {
            // console.log(error);
            toast({
                title: 'Error',
                description: 'Something went wrong',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }

    };

    const typingHandler = async (e) => {

        setNewMessage(e.target.value);

        // typing indicator logic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {

                setIsTyping(false);
                setTyping(false);
                socket.emit('stop typing', selectedChat._id);
            }

        }, timerLength);



    };


    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;

    }, [selectedChat]);


    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            pb={3}
                            px={2}
                            w='100%'
                            fontFamily='Work Sans'
                            d='flex'
                            justifyContent={{ base: 'space-between' }}
                            alignItems='center'
                        >
                            <IconButton
                                d={{ base: 'flex', md: 'none' }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat('')}
                            />
                            {
                                !selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(user, selectedChat.users)}
                                        <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchMessages={fetchMessages}
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                        />
                                    </>
                                )
                            }
                        </Text>
                        <Box
                            d='flex'
                            flexDir='column'
                            justifyContent='flex-end'
                            bg='#E8E8E8'
                            w='100%'
                            h='100%'
                            borderRadius='lg'
                            overflowY='hidden'
                        >
                            {
                                loading ? (
                                    <Spinner
                                        size='xl'
                                        w={20}
                                        h={20}
                                        alignSelf='center'
                                        m='auto'
                                    />
                                ) : (
                                    <div className="messages">
                                        <ScrollableChat messages={messages} />
                                    </div>
                                )
                            }

                            <FormControl onKeyDown={sendMessage} isRequired mt={3} >
                                {
                                    isTyping && (
                                        <Lottie
                                            options={defaultOptions}
                                            height={30}
                                            width={75}
                                            style={{ marginBottom: 15, marginLeft: 10 }}
                                        />
                                        // <>
                                        // Loading...
                                        // </>
                                    )
                                }
                                <Input
                                    placeholder='Type a message...'
                                    variant='filled'
                                    bg='#E8E8E8'
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                            </FormControl>

                        </Box>
                    </>
                ) : (
                    <Box d='flex' alignItems='center' justifyContent='center' h='100%' >
                        <Text fontSize='3xl' pb={3} fontFamily='Work sans' >
                            Click on a user to start chatting
                        </Text>

                    </Box>
                )
            }
        </>
    )
}

export default SingleChat