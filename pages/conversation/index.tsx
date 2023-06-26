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
    MessageContentType,
} from "@chatscope/use-chat";
import { Chat } from "../../components/Chat";
import { ExampleChatService } from '../../lib/ExampleChatService'


const messageIdGenerator = (message: ChatMessage<MessageContentType>) => nanoid();
const groupIdGenerator = () => nanoid();

const avatarUrl = "https://kellercenter.princeton.edu/sites/default/files/styles/square/public/images/2020%20Incubator%20-%2010X%20Project%20-%20Ivy%20Wang.JPG?h=3ba71f74&itok=0YopKwug"

const user1 = new User({
    id: "User1",
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "User1",
    lastName: "User1",
    username: "User1",
    email: "user1@test.com",
    bio: "user1 bio",
    avatar: avatarUrl
});
const user2 = new User({
    id: "User2",
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "User2",
    lastName: "User2",
    username: "User2",
    email: "user2@test.com",
    bio: "user2 bio",
    avatar: avatarUrl
});
const user3 = new User({
    id: "User3",
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "User3",
    lastName: "User3",
    username: "User3",
    email: "user3@test.com",
    bio: "user3 bio",
    avatar: avatarUrl,
});
const user4 = new User({
    id: "User4",
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "User4",
    lastName: "User4",
    username: "User4",
    email: "user4@test.com",
    bio: "user4 bio",
    avatar: avatarUrl,
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
    return new ExampleChatService(storage, updateState);
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
        typingUsers: new TypingUsersList({items: []}),
        draft: ""
    });
}

// Add users and conversations to the states
chats.forEach(c => {

    users.forEach(u => {
        if (u.name !== c.name) {
            c.storage.addUser(new User({
                id: u.name,
                presence: new Presence({status: UserStatus.Available, description: ""}),
                firstName: "",
                lastName: "",
                username: u.name,
                email: "",
                avatar: avatarUrl,
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
            </Container>
        </div>
    );
};

export default ChatWrapper;

