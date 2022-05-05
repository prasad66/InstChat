import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from './../Context/ChatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './../config/ChatLogics';
import { Tooltip, Avatar } from '@chakra-ui/react';


const ScrollableChat = ({ messages }) => {


    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {
                messages && messages.map((m, i) => (
                    <div style={{ display: 'flex' }} key={m._id} >

                        {
                            ((isSameSender(messages, m, i, user._id)) || isLastMessage(messages, i, user._id)) &&
                            <Tooltip
                                label={m.sender.name}
                                placement="bottom-start"
                                hasArrow
                            >
                                <Avatar
                                    mt='7px'
                                    mr={1}
                                    size='sm'
                                    cursor='pointer'
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        }

                        <span
                            style={{
                                position: 'relative',
                                backgroundColor: `${m.sender._id === user._id ? '#8dfcaf' : '#fff'
                                    }`,
                                borderRadius: '10px',
                                padding: '5px 15px',
                                maxWidth: '75%',
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10
                            }}
                        >
                            {/* <span 
                            style={{
                                backgroundColor:"#000",
                                position: 'absolute',
                                top:0,
                                left:{m.sender._id === user._id ? '-100%' : '0'},
                                minWidth:'10px',
                                minHeight:'10px'
                            }}
                            ></span> */}
                            {m.content}
                        </span>

                    </div>
                ))
            }
        </ScrollableFeed >
    )
}

export default ScrollableChat