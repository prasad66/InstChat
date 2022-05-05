import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                children
                    ? (<span onClick={onOpen} >{children}</span>)
                    : (
                        <IconButton
                            d={{ base: 'flex' }}
                            icon={<ViewIcon />}
                            onClick={onOpen}
                        />
                    )
            }

            <Modal size='lg' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h='410px'>
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work Sans"
                        d='flex'
                        justifyContent='center'
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        d='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        flexDir='column'
                    >

                        <Image
                            src={user.pic}
                            alt={user.name}
                            borderRadius='full'
                            boxSize='150px'
                        />

                        <Text
                        fontSize={{base:'28px', md:'30px'}}
                        fontFamily="Work Sans"
                        >
                            {user.email}
                        </Text>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    )
}

export default ProfileModal;

