import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Conversation,
  ConversationList,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const FriendList: React.FC<{}> = () => {
  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <div
          style={{
            height: "340px",
          }}
        >
          <ConversationList>
            <Conversation
              name="Lilly"
              lastSenderName="Lilly"
              info="Yes i can do it for you"
              unreadDot
            >
              <Avatar
                src="https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"
                name="Lilly"
              />
            </Conversation>

            <Conversation
              name="Joe"
              lastSenderName="Joe"
              info="Yes i can do it for you"
              unreadDot
            >
              <Avatar
                src="https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"
                name="Joe"
              />
            </Conversation>
          </ConversationList>
        </div>
        <ChatContainer>
          <MessageList>
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "just now",
                sender: "Joe",
                direction: "incoming",
                position: "single",
              }}
            />
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default FriendList;
