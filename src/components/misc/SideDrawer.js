import { Avatar, Box, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { useRef, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, } from '@chakra-ui/react'
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from './../UserAvatar/UserListItem';
import { getSender } from './../../config/ChatLogics';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
const SideDrawer = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();

    const toast = useToast();

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user, chats, setChats, setSelectedChat, notifications, setNotifications } = ChatState();

    const history = useHistory();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.replace('/');
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Search field is empty',
                description: 'Please enter a search query',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        setLoading(true);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/users?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            // console.log(error);
            toast({
                title: 'Error',
                description: 'Something went wrong',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            setLoading(false);
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/chat/`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    // console.log(notifications)


    return (
        <>
            <Box
                d="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p='5px 10px'
                borderWidth="5px"
            >

                <Tooltip label="Search Users" hasArrow placement="bottom">
                    <Button variant='ghost' ref={btnRef} colorScheme='teal' onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text d={{ base: 'none', md: 'flex' }} px='4' >
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize='2xl' fontFamily='Work sans'  >Inst-Chat</Text>

                <div className="">
                    <Menu>
                        <MenuButton p={1} mr={5}>
                            <NotificationBadge
                                count={notifications.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize='2xl' m={1}  />
                        </MenuButton>
                        <MenuList
                            pl={2}
                        >
                            {!notifications.length && 'No new messages'}
                            {notifications.map((n) => (
                                <MenuItem key={n._id} onClick={() => {
                                    setSelectedChat(n.chat);
                                    setNotifications(notifications.filter((noti) => noti._id !== n._id));
                                }} >
                                    {n.chat.isGroupChat
                                        ? `New Message in ${n.chat.chatName}`
                                        : `New message from ${getSender(user, n.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user} >
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler} >Logout</MenuItem>
                        </MenuList>

                    </Menu>
                </div>

            </Box>
            <Drawer

                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px' >Searh Users</DrawerHeader>

                    <DrawerBody>
                        <Box d='flex' pb={2} >

                            <Input
                                placeholder='Search by Name or email...'
                                mr={2}
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }}
                            />
                            <Button
                                onClick={handleSearch}
                                rightIcon={<ArrowForwardIcon />}
                                isLoading={loading}
                            >
                                Go
                            </Button>
                        </Box>

                        {
                            loading
                                ? (
                                    <ChatLoading />
                                )
                                : (
                                    searchResult.map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => accessChat(user._id)}
                                        />
                                    ))
                                )
                        }
                        {loadingChat && <Spinner ml='auto' d='flex' />}

                    </DrawerBody>

                </DrawerContent>
            </Drawer>

        </>
    )

}

export default SideDrawer;