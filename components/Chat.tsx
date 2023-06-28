// import {useState, useMemo } from "react";
// import { MainContainer, Sidebar, ConversationList, Conversation, Avatar, MessageGroup, Message,
//   ChatContainer, ConversationHeader, MessageList, MessageInput} from "@chatscope/chat-ui-kit-react";
// import { useChat, ChatMessage, MessageContentType, MessageDirection, MessageStatus } from "@chatscope/use-chat";

//  const Chat = () => {

//   // Message input value
//   const [value, setValue] = useState("");

//   // Get all chat related values and methods from useChat hook 
//   const {
//     currentMessages, conversations, activeConversation, setActiveConversation, sendMessage, getUser
//   } = useChat();

//   // Get current user data
//   const [currentUserAvatar, currentUserName] = useMemo(() => {

//     if (activeConversation) {
//       const participant = activeConversation.participants.length > 0 ? activeConversation.participants[0] : undefined;

//       if (participant) {
//         const user = getUser(participant.id);
//         if (user) {
//           return [<Avatar src={user.avatar} />, user.username]
//         }
//       }
//     }

//     return [undefined, undefined];

//   }, [activeConversation]);

//   const handleSend = text => {

//     // Logger user (sender)
//     const currentUserId = "123";

//     const message = new ChatMessage({
//       id: "",
//       content: text,
//       contentType: MessageContentType.TextHtml,
//       senderId: currentUserId,
//       direction: MessageDirection.Outgoing,
//       status: MessageStatus.Sent
//     });

//     sendMessage({
//       message,
//       conversationId: activeConversation.id,
//       senderId: currentUserId,
//     });

//   };

//   return (<MainContainer>
//     <Sidebar position="left">
//       <ConversationList>
//         {conversations.map(c => {
          
//           // Helper for getting the data of the first participant
//           const [avatar, name] = (() => {

//             const participant = c.participants.length > 0 ? c.participants[0] : undefined;
//             if (participant) {
//               const user = getUser(participant.id);
//               if (user) {

//                 return [<Avatar src={user.avatar} />, user.username]

//               }
//             }

//             return [undefined, undefined]
//           })();

//           return (<Conversation key={c.id}
//                         name={name}
//                         active={activeConversation?.id === c.id}
//                         unreadCnt={c.unreadCounter}
//                         onClick={e => setActiveConversation(c.id)}>
//             {avatar}
//           </Conversation>);
//         })}
//       </ConversationList>
//     </Sidebar>
    
//     <ChatContainer>
      
//       <ConversationHeader>
//         {currentUserAvatar}
//         <ConversationHeader.Content userName={currentUserName} />
//       </ConversationHeader>
      
//       <MessageList>
//         {currentMessages.map(g => <MessageGroup key={g.id} direction={g.direction}>
//           <MessageGroup.Messages>
//             {g.messages.map(m => <Message key={m.id} model={{
//               type: "text",
//               payload: m.content
//             }} />)}
//           </MessageGroup.Messages>
//         </MessageGroup>)}
//       </MessageList>
      
//       <MessageInput value={value} onSend={handleSend} />
      
//     </ChatContainer>
    
//   </MainContainer>);
// }

// export default Chat

import {useMemo, useCallback, useEffect} from "react";

import { MainContainer, Sidebar, ConversationList, Conversation, Avatar, ChatContainer, ConversationHeader, MessageGroup, Message,MessageList, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";

import {
    useChat,
    ChatMessage,
    MessageContentType,
    MessageDirection,
    MessageStatus
} from "@chatscope/use-chat";
import {MessageContent, TextContent, User} from "@chatscope/use-chat";

export const Chat = ({user}:{user:User}) => {
    
    // Get all chat related values and methods from useChat hook 
    const {
        currentMessages, conversations, activeConversation, setActiveConversation,  sendMessage, getUser, currentMessage, setCurrentMessage,
        sendTyping, setCurrentUser
    } = useChat();
    
    useEffect( () => {
        setCurrentUser(user);
    },[user, setCurrentUser]);
    
    // Get current user data
    const [currentUserAvatar, currentUserName] = useMemo(() => {

        if (activeConversation) {
            const participant = activeConversation.participants.length > 0 ? activeConversation.participants[0] : undefined;

            if (participant) {
                const user = getUser(participant.id);
                if (user) {
                    return [<Avatar src={user.avatar} />, user.username]
                }
            }
        }

        return [undefined, undefined];

    }, [activeConversation, getUser]);

    const handleChange = (value:string) => {
        // Send typing indicator to the active conversation
        // You can call this method on each onChange event
        // because sendTyping method can throttle sending this event
        // So typing event will not be send to often to the server
        setCurrentMessage(value);
        if ( activeConversation ) {
            sendTyping({
                conversationId: activeConversation?.id,
                isTyping:true,
                userId: user.id,
                content: value, // Note! Most often you don't want to send what the user types, as this can violate his privacy!
                throttle: true
            });
        }
        
    }
    
    const handleSend = (text:string) => {
        
        const message = new ChatMessage({
            id: "", // Id will be generated by storage generator, so here you can pass an empty string
            content: text as unknown as MessageContent<TextContent>,
            contentType: MessageContentType.TextHtml,
            senderId: user.id,
            direction: MessageDirection.Outgoing,
            status: MessageStatus.Sent
        });
        
        if ( activeConversation ) {
            sendMessage({
                message,
                conversationId: activeConversation.id,
                senderId: user.id,
            });
        }

    };
    
    const getTypingIndicator = useCallback(
        () => {
            
                if (activeConversation) {

                    const typingUsers = activeConversation.typingUsers;

                    if (typingUsers.length > 0) {

                        const typingUserId = typingUsers.items[0].userId;

                        // Check if typing user participates in the conversation
                        if (activeConversation.participantExists(typingUserId)) {

                            const typingUser = getUser(typingUserId);

                            if (typingUser) {
                                return <TypingIndicator content={`${typingUser.username} is typing`} />
                            }

                        }

                    }

                }
                

            return undefined;

        }, [activeConversation, getUser],
    );
    
    return (<MainContainer responsive>
        <Sidebar position="left" scrollable>
            <ConversationHeader style={{backgroundColor:"#fff"}}>
                <Avatar src={"https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"} />
                <ConversationHeader.Content>
                    {user.username}
                </ConversationHeader.Content>
            </ConversationHeader>
            <ConversationList>
                {conversations.map(c => {
                    // Helper for getting the data of the first participant
                    const [avatar, name] = (() => {

                        const participant = c.participants.length > 0 ? c.participants[0] : undefined;
                        
                        if (participant) {
                            const user = getUser(participant.id);
                            if (user) {

                                return [<Avatar src={user.avatar} />, user.username]

                            }
                        }

                        return [undefined, undefined]
                    })();

                    return <Conversation key={c.id}
                                  name={name}
                                  info={c.draft ? `Draft: ${c.draft.replace(/<br>/g,"\n").replace(/&nbsp;/g, " ")}` : ``}
                                  active={activeConversation?.id === c.id}
                                  unreadCnt={c.unreadCounter}
                                  onClick={() => setActiveConversation(c.id)}>
                        {avatar}
                    </Conversation>
                })}
            </ConversationList>
        </Sidebar>
        
        <ChatContainer>
            {activeConversation && <ConversationHeader>
                {currentUserAvatar}
                <ConversationHeader.Content userName={currentUserName} />
            </ConversationHeader>}
            <MessageList typingIndicator={getTypingIndicator()}>
                {activeConversation && currentMessages.map( (g) => <MessageGroup key={g.id} direction={g.direction}>
                    <MessageGroup.Messages>
                        {g.messages.map((m:ChatMessage<MessageContentType>) => <Message key={m.id} model={{
                            type: "html",
                            payload: m.content,
                            direction: m.direction,
                            position: "normal"
                        }} />)}
                    </MessageGroup.Messages>
                </MessageGroup>)}
            </MessageList>
            <MessageInput value={currentMessage} onChange={handleChange} onSend={handleSend} disabled={!activeConversation} attachButton={false} placeholder="Type here..."/>
        </ChatContainer>
        
    </MainContainer>);
    
}