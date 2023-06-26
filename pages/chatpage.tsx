// import { useEffect } from "react";
// import {
//   ChatProvider,
//   AutoDraft,
//   BasicStorage,
//   IStorage,
//   TypingUsersList,
//   UpdateState,
//   User,
//   UserStatus,
// } from "@chatscope/use-chat";
// import { Chat } from "../components/Chat";
// import { ExampleChatService } from "../lib/ExampleChatService";

// const user1Storage = new BasicStorage({ groupIdGenerator, messageIdGenerator });

// const ChatPage = ({ user }: { user: User }) => {
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       // Set user presence to offline when the tab is closed or refreshed
//       user.presence.status = UserStatus.Offline;
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
//     return new ExampleChatService(storage, updateState);
//   };

//   return (
//     <ChatProvider
//       serviceFactory={serviceFactory}
//       storage={user1Storage}
//       config={{
//         typingThrottleTime: 250,
//         typingDebounceTime: 900,
//         debounceTyping: true,
//         autoDraft: AutoDraft.Save | AutoDraft.Restore,
//       }}
//     >
//       <Chat user={user} />
//     </ChatProvider>
//   );
// };

// export default ChatPage;
