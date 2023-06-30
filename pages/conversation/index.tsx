import { NextPage } from "next";
const { nanoid } = require('nanoid')
import "bootstrap/dist/css/bootstrap.min.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Col, Container, Row } from "react-bootstrap";
import { users } from '../../data/data'
import { getSession, useSession } from 'next-auth/react'
import Router from "next/router";
import {
    BasicStorage,
    ChatProvider,
    AutoDraft,
    IStorage,
    UpdateState,
    User,
    Presence,
    UserStatus,
    ChatMessage,
    Conversation,
    ConversationId,
    Participant,
    ConversationRole,
    TypingUsersList,
    MessageContentType,
    ParticipantParams
} from "@chatscope/use-chat";
import { Chat } from "../../components/Chat";
import { ChatService } from '../../lib/ChatService'
import { useEffect, useState } from "react";
import getVolunteerAccountModel, { VolunteerAccount } from "../../models/VolunteerAccount";
import getExtendedConversationParamsModel, { ExtendedConversationParamsDocument } from "../../models/Conversation";
import mongoose from "mongoose";
import dbConnect from "../../lib/dbConnect";
import mongodb from '../../lib/mongodb'
const io = require("socket.io-client");
import http from 'http'
import { Server } from 'socket.io'

//https://www.mongodb.com/developer/products/mongodb/mongo-socket-chat-example/
//https://socket.io/get-started/chat

const avatarUrl = "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"

const messageIdGenerator = (message: ChatMessage<MessageContentType>) => nanoid();
const groupIdGenerator = () => nanoid();


const user2 = new User({
    id: "test1",
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "test1",
    lastName: 'test1',
    username: `test1`,
    email: 'test1@test.com',
    bio: '',
    avatar: avatarUrl
})


// Create serviceFactory
const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ChatService(storage, updateState);

};
function createConversation(id: ConversationId, names: string[]): Conversation {
    return new Conversation({
        id,
        participants: names.map(name =>
            new Participant({
                id: name,
                role: new ConversationRole([])
            })
        ),
        unreadCounter: 0,
        typingUsers: new TypingUsersList({ items: [] }),
        draft: ""
    });
}

type ChatWrapperProps = {
    account: VolunteerAccount;
    conversations: ExtendedConversationParamsDocument<any, MessageContentType>[]; // this is really the Conversation type from models/Conversation but it's a dupe type
}
let socket
const ChatWrapper: NextPage<ChatWrapperProps> = ({ account, conversations }) => {
    
    const { status } = useSession()
    
    useEffect(() => {
        if (status === 'unauthenticated') Router.replace('/auth/login')
    }, [status])

    const user = new User({
        id: `${account.alp_id}`,
        presence: new Presence({ status: UserStatus.Available, description: "" }),
        firstName: account.fname,
        lastName: account.lname,
        username: `${account.fname} ${account.lname}`,
        email: account.email,
        bio: '',
        avatar: avatarUrl
    });

    const userStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator })
    conversations.forEach(conversation => {
        const conversationId = conversation.id as ConversationId;
        if (conversation.participants) {
            const participants = conversation.participants.map(participant => {
                return new Participant({
                    id: participant.id as string,
                    role: new ConversationRole([]),
                });
            });
            participants.map(participant => userStorage.addUser(new User({ id: participant.id, presence: new Presence({ status: UserStatus.Available, description: "" }), firstName: "", lastName: "", username: participant.id, email: '', avatar: avatarUrl, bio: '' })))

            // Create a new conversation instance and add it to the user's storage
            const newConversation = new Conversation({ id: conversationId, participants, unreadCounter: 0, typingUsers: new TypingUsersList({ items: [] }), draft: "" });
            userStorage.addConversation(newConversation);
            conversation.messages.forEach(message => {
                userStorage.addMessage(message, conversationId)
            })
        }
    });
    // const socketInitializer = async () => {

    //     await fetch('api/socket')
    //     socket = io()
    //     socket.on('connect', () => console.log("connected in the client"))
    //     socket.on('message', (message: ChatMessage<MessageContentType>, conversationId: string) => {
    //         console.log("message received")
    //         console.log("message", message)
    //         console.log("conversationId", conversationId)
    //         userStorage.addMessage(message, conversationId)
            
    //     })
    //     return null

    // }
    // useEffect(() => {socketInitializer()}, [])
    if (status == 'loading') return <p>loading...</p>

    return (
        <div className="h-100 d-flex flex-column overflow-hidden">
            <Container fluid className="p-4 flex-grow-1 position-relative overflow-hidden">
                <Row className="h-50 pb-2 flex-nowrap">
                    <Col>
                        <ChatProvider serviceFactory={serviceFactory} storage={userStorage} config={{
                            typingThrottleTime: 250,
                            typingDebounceTime: 900,
                            debounceTyping: true,
                            autoDraft: AutoDraft.Save | AutoDraft.Restore
                        }}>
                            <Chat user={user} email={account.email} />
                        </ChatProvider>
                    </Col>
                </Row>

            </Container>
        </div>
    );
};


export async function getServerSideProps(context: any) {
    try {
        await dbConnect()
    
        const session = await getSession(context)
        const email = session!.user!.email
        console.log("hi", email)
        const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
        // const testConvo = createConversation("1", ["test1", "ec c"])
        // console.log(testConvo)
        const Conversation: mongoose.Model<ExtendedConversationParamsDocument<any, MessageContentType>> = getExtendedConversationParamsModel()
        // const convo = await Conversation.create({...testConvo })
        // console.log(convo)
        const volunteerAccount = await VolunteerAccount.findOne({ email: email })
        const conversationIds = volunteerAccount!.conversations
        // finds all conversations that correspond to the volunteerAccount
        const promises = conversationIds.map(convoId => Conversation.find({ id: convoId }));
        const conversations = await Promise.all(promises);
        return { props: { conversations: JSON.parse(JSON.stringify(conversations[0])), account: JSON.parse(JSON.stringify(volunteerAccount)) } }
    } catch (e: any) {
        console.log(e)
        let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
        return { props: { error: strError } }
    }
}

export default ChatWrapper;

