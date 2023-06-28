import { useEffect } from "react";
import {
  ChatProvider,
  AutoDraft,
  BasicStorage,
  IStorage,
  TypingUsersList,
  UpdateState,
  User, 
  UserStatus,
  Conversation,
  ConversationId,
  Participant,
  ConversationRole,
} from "@chatscope/use-chat";
import { Chat } from "./Chat";
import { ExampleChatService } from "../lib/ExampleChatService";
const { nanoid } = require("nanoid");

const avatarUrl =
  "https://kellercenter.princeton.edu/sites/default/files/styles/square/public/images/2020%20Incubator%20-%2010X%20Project%20-%20Ivy%20Wang.JPG?h=3ba71f74&itok=0YopKwug";

const messageIdGenerator = () => nanoid();
const groupIdGenerator = () => nanoid();

const createConversation = (id: ConversationId, participant1: string, participant2: string): Conversation => {
  return new Conversation({
    id,
    participants: [
      new Participant({
        id: participant1,
        role: new ConversationRole([]),
      }),
      new Participant({
        id: participant2,
        role: new ConversationRole([]),
      }),
    ],
    unreadCounter: 0,
    typingUsers: new TypingUsersList({ items: [] }),
    draft: "",
  });
};

const user1 = new User({
  id: "User1",
  presence: { status: UserStatus.Available, description: "" },
  firstName: "User1",
  lastName: "User1",
  username: "User1",
  email: "user1@test.com",
  bio: "user1 bio",
  avatar: avatarUrl,
});

const user2 = new User({
  id: "User2",
  presence: { status: UserStatus.Available, description: "" },
  firstName: "User2",
  lastName: "User2",
  username: "User2",
  email: "user2@test.com",
  bio: "user2 bio",
  avatar: avatarUrl,
});

const user1Storage = new BasicStorage({ groupIdGenerator, messageIdGenerator });

const ChatPage = ({ user }: { user: User }) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      user.presence.status = UserStatus.Away;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ExampleChatService(storage, updateState);
  };

  return (
    <ChatProvider
      serviceFactory={serviceFactory}
      storage={user1Storage}
      config={{
        typingThrottleTime: 250,
        typingDebounceTime: 900,
        debounceTyping: true,
        autoDraft: AutoDraft.Save | AutoDraft.Restore,
      }}
    >
      <Chat user={user} />
    </ChatProvider>
  );
};

export default ChatPage;
