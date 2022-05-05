import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    useToast,
    FormControl,
    Input,
    Spinner,
    Box,
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from './../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {


    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();


    const handleSearch = async (query) => {

        setSearch(query);
        // console.log(query)
        if (!query) return;

        try {

            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/users?search=${query}`, config);

            setLoading(false);
            setSearchResult(data);


        } catch (error) {
            // console.log(error);
            toast({
                title: 'Error',
                description: 'Failed to load search results!',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }

    };

    const handleGroup = async (user) => {
        if (selectedUsers.includes(user)) {
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        setSelectedUsers([...selectedUsers, user]);
    };

    const handleDeleteUser = (user) => setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser._id !== user._id));



    const handleSubmit = async () => {

        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Select required fields',
                description: 'Please enter a group chat name and select the users',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        };

        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/chat/group`, { name: groupChatName, users: JSON.stringify(selectedUsers.map(u => u._id)) }, config);

            setChats([data, ...chats]);
            setSelectedUsers([]);
            setGroupChatName('');
            onClose();
            toast({
                title: 'New Group Chat Created',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });


        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create group chat!. Try again later',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }

    };

    const closeModal = () => {
        setSelectedUsers([]);
        setGroupChatName('');
        setSearchResult([]);
        onClose();
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work Sans'
                        d='flex'
                        justifyContent='center'
                    >New Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d='flex' flexDir='column' alignItems='center' >
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Start typing user names to see...' mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w='100%' d='flex' flexWrap='wrap' >

                            {
                                selectedUsers && selectedUsers.map((user) => (
                                    <UserBadgeItem key={user._id} user={user}
                                        handleFunction={() => handleDeleteUser(user)}
                                    />
                                ))
                            }
                        </Box>
                        {
                            loading ? <Spinner my={2}/> : (
                                search && searchResult.slice(0, 4).map((user) => (
                                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                ))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal