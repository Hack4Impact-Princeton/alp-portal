import { ChatEventType, ChatEventHandler, SendMessageServiceParams, SendTypingServiceParams } from "@chatscope/use-chat";
import { ChatEvent, IChatService } from "@chatscope/use-chat";
import { IStorage, UpdateState } from "@chatscope/use-chat";

export class ChatService implements IChatService {
  
  private eventHandlers: {
    [key in ChatEventType]?: ChatEventHandler<key, ChatEvent<key>>[];
  };
  private storage: IStorage;
  private updateState: UpdateState;

  constructor(storage: IStorage, updateState: UpdateState) {
    this.eventHandlers = {};
    this.storage = storage;
    this.updateState = updateState;
  }

  on<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>
  ): void {
    if (!this.eventHandlers[evtType]) {
      this.eventHandlers[evtType] = [];
    }
    // this.eventHandlers[evtType]?.push(evtHandler);
    (this.eventHandlers[evtType] as ChatEventHandler<T, H>[]).push(evtHandler);
    
  }

  //     on<T extends ChatEventType, H extends ChatEvent<T>>(evtType: T, evtHandler: ChatEventHandler<T, H>) {
//       if (!this.eventHandlers.has(evtType)) {
//         this.eventHandlers.set(evtType, new Set());
//       }
//       this.eventHandlers.get(evtType)?.add(evtHandler);
//     }

  off<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>
  ): void {
    const handlers = this.eventHandlers[evtType];
    if (handlers) {
      const index = handlers.findIndex((handler) => handler === evtHandler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  sendMessage(params: SendMessageServiceParams): void {
    // Implement your logic for sending chat messages here
    // Example implementation: Save the message to the storage and update the state
    const { conversationId, message } = params;
    this.storage.addMessage(message, conversationId, true);
    this.updateState();
  }

  sendTyping(params: SendTypingServiceParams): void {
    // Implement your logic for sending typing indicator here
    // Example implementation: Update the typing users in the storage and update the state
    const { conversationId, userId, content } = params;
    console.log(conversationId)
    console.log(userId)
    console.log(content)
    this.updateState();
  }
}


// import { ChatEventType, IStorage, UpdateState } from "@chatscope/use-chat";
// import { ChatEventHandler, SendMessageServiceParams, SendTypingServiceParams } from "@chatscope/use-chat";
// import { ChatEvent } from "@chatscope/use-chat";
// import { IChatService } from "@chatscope/use-chat";

// export class ChatService implements IChatService {
//     private eventHandlers: Map<ChatEventType, Set<ChatEventHandler<any, any>>>;
//     private storage: IStorage
//     private updateState: UpdateState
//     constructor(storage: IStorage, updateState: UpdateState) {
//       this.eventHandlers = new Map();
//       this.storage = storage
//       this.updateState = updateState
//     }
  
//     on<T extends ChatEventType, H extends ChatEvent<T>>(evtType: T, evtHandler: ChatEventHandler<T, H>) {
//       if (!this.eventHandlers.has(evtType)) {
//         this.eventHandlers.set(evtType, new Set());
//       }
//       this.eventHandlers.get(evtType)?.add(evtHandler);
//     }
  
//     off<T extends ChatEventType, H extends ChatEvent<T>>(evtType: T, evtHandler: ChatEventHandler<T, H>) {
//       const handlers = this.eventHandlers.get(evtType);
//       if (handlers) {
//         handlers.delete(evtHandler);
//       }
//     }
  
//     sendMessage(params: SendMessageServiceParams) {
//       // Implement your send logic here
//       // Example implementation:
//       console.log("Sending message:", params);
//     }
  
//     sendTyping(params: SendTypingServiceParams) {
//       // Implement your send typing logic here
//       // Example implementation:
//       console.log("Sending typing indicator:", params);
//     }
//   }
// import { ChatEventType, ChatEventHandler, SendMessageServiceParams, SendTypingServiceParams } from "@chatscope/use-chat";
// import { ChatEvent } from "@chatscope/use-chat";
// import { IStorage, UpdateState } from "@chatscope/use-chat";
// import { IChatService } from "@chatscope/use-chat";

// export class ChatService implements IChatService {
//   private eventHandlers: {
//     [key in ChatEventType]?: ChatEventHandler<key, ChatEvent<key>>[];
//   };
//   private storage: IStorage;
//   private updateState: UpdateState;

//   constructor(storage: IStorage, updateState: UpdateState) {
//     this.eventHandlers = {};
//     this.storage = storage;
//     this.updateState = updateState;
//   }

//   on<T extends ChatEventType, H extends ChatEvent<T>>(
//     evtType: T,
//     evtHandler: ChatEventHandler<T, H>
//   ): void {
//     if (!this.eventHandlers[evtType]) {
//       this.eventHandlers[evtType] = [];
//     }
//     this.eventHandlers[evtType]?.push(evtHandler);
//   }

//   off<T extends ChatEventType, H extends ChatEvent<T>>(
//     evtType: T,
//     evtHandler: ChatEventHandler<T, H>
//   ): void {
//     const handlers = this.eventHandlers[evtType];
//     if (handlers) {
//       const index = handlers.findIndex((handler) => handler === evtHandler);
//       if (index !== -1) {
//         handlers.splice(index, 1);
//       }
//     }
//   }

//   sendMessage(params: SendMessageServiceParams): void {
//     // Implement your logic for sending chat messages here
//     console.log(params)
//   }

//   sendTyping(params: SendTypingServiceParams): void {
//     // Implement your logic for sending typing indicator here
//     console.log(params)
//   }
// }

  