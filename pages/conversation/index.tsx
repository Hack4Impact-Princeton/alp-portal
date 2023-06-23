import { NextPage } from "next";
const { nanoid } = require('nanoid')
import "bootstrap/dist/css/bootstrap.min.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Col, Container, Row } from "react-bootstrap";
import {users, user1Model, user2Model, user3Model, user4Model} from '../../data/data'
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
} from "@chatscope/use-chat";
import { Chat } from "../../components/Chat";
import { ChatService } from "../../lib/ChatService";


const messageIdGenerator = () => nanoid();
const groupIdGenerator = () => nanoid();


const user1 = new User({
    id: "User1",
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "User1",
    lastName: "User1",
    username: "user1Username",
    email: "user1@test.com",
    bio: "user1 bio",
});
const user2 = new User({
    id: "User2",
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "User2",
    lastName: "User2",
    username: "user2Username",
    email: "user2@test.com",
    bio: "user2 bio",
});
const user3 = new User({
    id: "User3",
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "User3",
    lastName: "User3",
    username: "user3Username",
    email: "user3@test.com",
    bio: "user3 bio",
});
const user4 = new User({
    id: "User4",
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "User4",
    lastName: "User4",
    username: "user4Username",
    email: "user4@test.com",
    bio: "user4 bio",
});


const user1Storage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
const user2Storage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
const user3Storage = new BasicStorage({ groupIdGenerator, messageIdGenerator })
const user4Storage = new BasicStorage({ groupIdGenerator, messageIdGenerator })

const chats = [
    { name: user1.firstName, storage: user1Storage },
    { name: user2.firstName, storage: user2Storage },
    { name: user3.firstName, storage: user3Storage },
    { name: user4.firstName, storage: user4Storage },
];

// Create serviceFactory
const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ChatService(storage, updateState);
};

// const chatStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
function createConversation(id: ConversationId, name: string): Conversation {
    return new Conversation({
        id,
        participants: [
            new Participant({
                id: name,
                role: new ConversationRole([])
            })
        ],
        unreadCounter: 0,
        typingUsers: new TypingUsersList({ items: [] }),
        draft: ""
    });
}

// Add users and conversations to the states
chats.forEach(c => {
    users.forEach(u => {
        if (u.name !== c.name) {
            c.storage.addUser(new User({
                id: u.name,
                presence: new Presence({ status: UserStatus.Available, description: "" }),
                firstName: "",
                lastName: "",
                username: u.name,
                email: "",
                bio: ""
            }));

            const conversationId = nanoid();

            const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
            if (!myConversation) {

                c.storage.addConversation(createConversation(conversationId, u.name));

                const chat = chats.find(chat => chat.name === u.name);

                if (chat) {

                    const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
                    if (!hisConversation) {
                        chat.storage.addConversation(createConversation(conversationId, c.name));
                    }
                }
            }
        }
    });
});

const ChatWrapper: NextPage = () => {
    return (
        <div className="h-100 d-flex flex-column overflow-hidden">
            <Container fluid className="p-4 flex-grow-1 position-relative overflow-hidden">
                <Row className="h-50 pb-2 flex-nowrap">
                    <Col>
                        <ChatProvider serviceFactory={serviceFactory} storage={user1Storage} config={{
                            typingThrottleTime: 250,
                            typingDebounceTime: 900,
                            debounceTyping: true,
                            autoDraft: AutoDraft.Save | AutoDraft.Restore
                        }}>
                            <Chat user={user1} />
                        </ChatProvider>
                    </Col>
                    <Col>
                        <ChatProvider serviceFactory={serviceFactory} storage={user2Storage} config={{
                            typingThrottleTime: 250,
                            typingDebounceTime: 900,
                            debounceTyping: true,
                            autoDraft: AutoDraft.Save | AutoDraft.Restore
                        }}>
                            <Chat user={user2} />
                        </ChatProvider>
                    </Col>
                </Row>
                {/* <Row className="h-50 pt-2 flex-nowrap">
                    <Col>
                        <ChatProvider serviceFactory={serviceFactory} storage={user3Storage} config={{
                            typingThrottleTime: 250,
                            typingDebounceTime: 900,
                            debounceTyping: true,
                            autoDraft: AutoDraft.Save | AutoDraft.Restore
                        }}>
                            <Chat user={user3} />
                        </ChatProvider>
                    </Col>
                    <Col>
                        <ChatProvider serviceFactory={serviceFactory} storage={user4Storage} config={{
                            typingThrottleTime: 250,
                            typingDebounceTime: 900,
                            debounceTyping: true,
                            autoDraft: AutoDraft.Save | AutoDraft.Restore
                        }}>
                            <Chat user={user4} />
                        </ChatProvider>
                    </Col>
                </Row> */}
            </Container>
        </div>
        // <ChatProvider
        //   serviceFactory={serviceFactory}
        //   storage={user1Storage}
        //   config={{
        //     typingThrottleTime: 250,
        //     typingDebounceTime: 900,
        //     debounceTyping: true,
        //     autoDraft: AutoDraft.Save | AutoDraft.Restore,
        //   }}
        // >
        //   <Chat user={user1} />
        // </ChatProvider>
    );
};

export default ChatWrapper;

// import { NextPage } from "next";
// import type {Nanoid} from 'nanoid'
// import {
//   BasicStorage,
//   ChatProvider,
//   AutoDraft,
//   IStorage,
//   UpdateState,
//   User,
//   Presence,
//   UserStatus,
//   ChatMessage,
//   Conversation,
//   ConversationId,
//   Participant,
//   ConversationRole,
//   TypingUsersList,
// } from "@chatscope/use-chat";
// import {Chat} from '../../components/Chat'
// import { ChatService } from "../../lib/ChatService";

// const nanoidPromise = import("nanoid");
// const getMessageIdGenerator = async (): Promise<() => string> => {
//   const { nanoid } = await nanoidPromise;
//   return () => nanoid();
// };

// // Storage needs to generate id for messages and groups
// const messageIdGenerator = () => nanoid();
// const groupIdGenerator = () => nanoid();

// const user1 = new User({
// id: "user1Id",
// presence: new Presence({status: UserStatus.Available, description: ""}),
// firstName: "User1",
// lastName: "User1",
// username: "user1Username",
// email: "user1@test.com",
// bio: "user1 bio"
// });
// const user2 = new User({
//     id: "user2Id",
//     presence: new Presence({status: UserStatus.Available, description: ""}),
//     firstName: "User2",
//     lastName: "User2",
//     username: "user2Username",
//     email: "user2@test.com",
//     bio: "user2 bio"
// });

// const user1Storage = new BasicStorage({groupIdGenerator, messageIdGenerator: getMessageIdGenerator() });
// const user2Storage = new BasicStorage({groupIdGenerator, messageIdGenerator: getMessageIdGenerator() });



// const chats = [
//     {user1, user1Storage},
//     {user2, user2Storage}
// ]

// // function createConversation(id: ConversationId, name: string): Conversation {
// // return new Conversation({
// //     id,
// //     participants: [
// //         new Participant({
// //             id: name,
// //             role: new ConversationRole([])
// //         })
// //     ],
// //     unreadCounter: 0,
// //     typingUsers: new TypingUsersList({items: []}),
// //     draft: ""
// // });
// // }

// // Create serviceFactory
// const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
//   return new ChatService(storage, updateState);
// };

// console.log(serviceFactory)

// const chatStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});
// const ChatWrapper: NextPage = () => {

//     return (
//         <ChatProvider serviceFactory={serviceFactory} storage={chatStorage} config={{
//             typingThrottleTime: 250,
//             typingDebounceTime: 900,
//             debounceTyping: true,
//             autoDraft: AutoDraft.Save | AutoDraft.Restore
//           }}>
//             <Chat user={user1}/>
//           </ChatProvider>
//     )
// }

// export default ChatWrapper
// import { NextPage } from "next/types";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// import {
// BasicStorage,
// ChatMessage,
// ChatProvider,
// Conversation,
// ConversationId,
// ConversationRole,
// IStorage,
// MessageContentType,
// Participant,
// Presence,
// TypingUsersList,
// UpdateState,
// User,
// UserStatus
// } from "@chatscope/use-chat";
// import { nanoid } from "nanoid";
// import {Chat} from "../../components/Chat";
// import {Col, Container, Row} from "react-bootstrap";
// import {akaneModel, eliotModel, emilyModel, joeModel, users} from "../../data/data";
// import {AutoDraft} from "@chatscope/use-chat/dist/enums/AutoDraft";
// import { ChatService } from "../../lib/ChatService";
// // import {Footer} from "./components/Footer";

// // sendMessage and addMessage methods can automagically generate id for messages and groups
// // This allows you to omit doing this manually, but you need to provide a message generator
// // The message id generator is a function that receives message and returns id for this message
// // The group id generator is a function that returns string
// const messageIdGenerator = (message: ChatMessage<MessageContentType>) => nanoid();
// const groupIdGenerator = () => nanoid();

// const eliotStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});

// // Create serviceFactory
// const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
// return new ChatService(storage, updateState);
// };

// const akane = new User({
// id: akaneModel.name,
// presence: new Presence({status: UserStatus.Available, description: ""}),
// firstName: "",
// lastName: "",
// username: akaneModel.name,
// email: "",
// bio: ""
// });

// const emily = new User({
// id: emilyModel.name,
// presence: new Presence({status: UserStatus.Available, description: ""}),
// firstName: "",
// lastName: "",
// username: emilyModel.name,
// email: "",
// bio: ""
// });




// const chats = [
// {name: "Akane", storage: akaneStorage},
// {name: "Eliot", storage: eliotStorage},
// ];

// function createConversation(id: ConversationId, name: string): Conversation {
// return new Conversation({
//     id,
//     participants: [
//         new Participant({
//             id: name,
//             role: new ConversationRole([])
//         })
//     ],
//     unreadCounter: 0,
//     typingUsers: new TypingUsersList({items: []}),
//     draft: ""
// });
// }

// // Add users and conversations to the states
// chats.forEach(c => {

// users.forEach(u => {
//     if (u.name !== c.name) {
//         c.storage.addUser(new User({
//             id: u.name,
//             presence: new Presence({status: UserStatus.Available, description: ""}),
//             firstName: "",
//             lastName: "",
//             username: u.name,
//             email: "",
//             avatar: u.avatar,
//             bio: ""
//         }));

//         const conversationId = nanoid();

//         const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
//         if (!myConversation) {

//             c.storage.addConversation(createConversation(conversationId, u.name));

//             const chat = chats.find(chat => chat.name === u.name);

//             if (chat) {

//                 const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
//                 if (!hisConversation) {
//                     chat.storage.addConversation(createConversation(conversationId, c.name));
//                 }

//             }

//         }

//     }
// });

// });

// export const ChatWrapper: NextPage =() => {
// return (
//     <div className="h-100 d-flex flex-column overflow-hidden">
//         <Container fluid className="p-4 flex-grow-1 position-relative overflow-hidden">
//             <Row className="h-50 pb-2 flex-nowrap">
//                 <Col>
//                     <ChatProvider serviceFactory={serviceFactory} storage={akaneStorage} config={{
//                         typingThrottleTime: 250,
//                         typingDebounceTime: 900,
//                         debounceTyping: true,
//                         autoDraft: AutoDraft.Save | AutoDraft.Restore
//                     }}>
//                         <Chat user={akane}/>
//                     </ChatProvider>
//                 </Col>
//                 <Col>
//                     <ChatProvider serviceFactory={serviceFactory} storage={eliotStorage} config={{
//                         typingThrottleTime: 250,
//                         typingDebounceTime: 900,
//                         debounceTyping: true,
//                         autoDraft: AutoDraft.Save | AutoDraft.Restore
//                     }}>
//                         <Chat user={eliot}/>
//                     </ChatProvider>
//                 </Col>
//             </Row>
//             <Row className="h-50 pt-2 flex-nowrap">
//                 <Col>
//                     <ChatProvider serviceFactory={serviceFactory} storage={emilyStorage} config={{
//                         typingThrottleTime: 250,
//                         typingDebounceTime: 900,
//                         debounceTyping: true,
//                         autoDraft: AutoDraft.Save | AutoDraft.Restore
//                     }}>
//                         <Chat user={emily}/>
//                     </ChatProvider>
//                 </Col>
//                 <Col>
//                     <ChatProvider serviceFactory={serviceFactory} storage={joeStorage} config={{
//                         typingThrottleTime: 250,
//                         typingDebounceTime: 900,
//                         debounceTyping: true,
//                         autoDraft: AutoDraft.Save | AutoDraft.Restore
//                     }}>
//                         <Chat user={joe}/>
//                     </ChatProvider>
//                 </Col>
//             </Row>
//         </Container>
//     </div>
// );
// }
// export default ChatWrapper