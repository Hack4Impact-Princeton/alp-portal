// import { MessageDirection } from '@chatscope/use-chat';
// import { MessageEvent, UserTypingEvent } from '@chatscope/use-chat';

// interface EventHandlerMap {
//   onMessage: (event: MessageEvent) => void;
//   onConnectionStateChanged: () => void;
//   onUserConnected: () => void;
//   onUserDisconnected: () => void;
//   onUserPresenceChanged: () => void;
//   onUserTyping: (event: UserTypingEvent) => void;
// }

// class ExampleChatService {
//   private storage: any;
//   private updateState: any;
//   private eventHandlers: EventHandlerMap;

//   constructor(storage: any, update: any) {
//     this.eventHandlers = {
//       onMessage: () => {},
//       onConnectionStateChanged: () => {},
//       onUserConnected: () => {},
//       onUserDisconnected: () => {},
//       onUserPresenceChanged: () => {},
//       onUserTyping: () => {},
//     };

//     this.storage = storage;
//     this.updateState = update;

//     if (typeof window !== 'undefined') {
//       window.addEventListener('chat-protocol', (evt: CustomEvent) => {
//         const { type, detail } = evt;
//         if (type === 'message') {
//           const message = detail.message;
//           message.direction = MessageDirection.Incoming;
//           const { conversationId } = detail;
//           if (this.eventHandlers.onMessage && detail.sender !== this) {
//             this.eventHandlers.onMessage(new MessageEvent({ message, conversationId }));
//           }
//         } else if (type === 'typing') {
//           const { userId, isTyping, conversationId, content, sender } = detail;
//           if (this.eventHandlers.onUserTyping && sender !== this) {
//             this.eventHandlers.onUserTyping(
//               new UserTypingEvent({
//                 userId,
//                 isTyping,
//                 conversationId,
//                 content,
//               })
//             );
//           }
//         }
//       });
//     }
//   }

//   sendMessage({ message, conversationId }: { message: any; conversationId: any }) {
//     if (typeof window !== 'undefined') {
//       const messageEvent = new CustomEvent('chat-protocol', {
//         detail: {
//           type: 'message',
//           message,
//           conversationId,
//           sender: this,
//         },
//       });
//       window.dispatchEvent(messageEvent);
//     }
//     return message;
//   }

//   sendTyping({ isTyping, content, conversationId, userId }: { isTyping: boolean; content: string; conversationId: any; userId: any }) {
//     if (typeof window !== 'undefined') {
//       const typingEvent = new CustomEvent('chat-protocol', {
//         detail: {
//           type: 'typing',
//           isTyping,
//           content,
//           conversationId,
//           userId,
//           sender: this,
//         },
//       });
//       window.dispatchEvent(typingEvent);
//     }
//   }

//   on(evtType: keyof EventHandlerMap, evtHandler: EventHandlerMap[keyof EventHandlerMap]) {
//     const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
//     if (key in this.eventHandlers) {
//       this.eventHandlers[key] = evtHandler;
//     }
//   }

//   off(evtType: keyof EventHandlerMap) {
//     const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
//     if (key in this.eventHandlers) {
//       this.eventHandlers[key] = () => {};
//     }
//   }
// }

// export { ExampleChatService };
