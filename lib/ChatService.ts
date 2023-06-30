// This IChatService implementation is only an example and has no real business value.
// However, this is good start point to make your own implementation.
// Using this service it's possible to connects two or more chats in the same application for a demonstration purposes

import { IChatService } from "@chatscope/use-chat";
import { ChatEventType, MessageContentType, MessageDirection } from "@chatscope/use-chat";
import {
    ChatEventHandler,
    SendMessageServiceParams,
    SendTypingServiceParams,
    UpdateState,
} from "@chatscope/use-chat";
import { IStorage } from "@chatscope/use-chat";
import { ChatEvent, MessageEvent, UserTypingEvent } from "@chatscope/use-chat";
import { ChatMessage } from "@chatscope/use-chat";
import mongodb from '../lib/mongodb'
const io = require('socket.io-client')
import dbConnect from "./dbConnect";
type EventHandlers = {
    onMessage: ChatEventHandler<
        ChatEventType.Message,
        ChatEvent<ChatEventType.Message>
    >;
    onConnectionStateChanged: ChatEventHandler<
        ChatEventType.ConnectionStateChanged,
        ChatEvent<ChatEventType.ConnectionStateChanged>
    >;
    onUserConnected: ChatEventHandler<
        ChatEventType.UserConnected,
        ChatEvent<ChatEventType.UserConnected>
    >;
    onUserDisconnected: ChatEventHandler<
        ChatEventType.UserDisconnected,
        ChatEvent<ChatEventType.UserDisconnected>
    >;
    onUserPresenceChanged: ChatEventHandler<
        ChatEventType.UserPresenceChanged,
        ChatEvent<ChatEventType.UserPresenceChanged>
    >;
    onUserTyping: ChatEventHandler<
        ChatEventType.UserTyping,
        ChatEvent<ChatEventType.UserTyping>
    >;
    [key: string]: any;
};

export class ChatService implements IChatService {
    storage?: IStorage;
    updateState: UpdateState;

    eventHandlers: EventHandlers = {
        onMessage: () => { },
        onConnectionStateChanged: () => { },
        onUserConnected: () => { },
        onUserDisconnected: () => { },
        onUserPresenceChanged: () => { },
        onUserTyping: () => { },
    };

    constructor(storage: IStorage, update: UpdateState) {
        this.storage = storage;
        this.updateState = update;

        // For communication we use CustomEvent dispatched to the window object.
        // It allows you to simulate sending and receiving data from the server.
        // In a real application, instead of adding a listener to the window,
        // you will implement here receiving data from your chat server.
        if (typeof window !== 'undefined') {
            window.addEventListener("chat-protocol", (evt: Event) => {
                const event = evt as CustomEvent;

                const {
                    detail: { type },
                    detail,
                } = event;

                if (type === "message") {
                    const message = detail.message as ChatMessage<MessageContentType.TextHtml>;

                    message.direction = MessageDirection.Incoming;
                    const { conversationId } = detail;
                    if (this.eventHandlers.onMessage && detail.sender !== this) {
                        // Running the onMessage callback registered by ChatProvider will cause:
                        // 1. Add a message to the conversation to which the message was sent
                        // 2. If a conversation with the given id exists and is not active,
                        //    its unreadCounter will be incremented
                        // 3. Remove information about the sender who is writing from the conversation
                        // 4. Re-render
                        //
                        // Note!
                        // If a conversation with such id does not exist,
                        // the message will be added, but the conversation object will not be created.
                        // You have to take care of such a case yourself.
                        // You can check here if there is already a conversation in storage.
                        // If it is not there, you can create it before calling onMessage.
                        // After adding a conversation to the list, you don't need to manually run updateState
                        // because ChatProvider in onMessage will do it.
                        this.eventHandlers.onMessage(
                            new MessageEvent({ message, conversationId })
                        );
                    }
                } else if (type === "typing") {
                    const { userId, isTyping, conversationId, content, sender } = detail;

                    if (this.eventHandlers.onUserTyping && sender !== this) {
                        // Running the onUserTyping callback registered by ChatProvider will cause:
                        // 1. Add the user to the list of users who are typing in the conversation
                        // 2. Debounce
                        // 3. Re-render
                        this.eventHandlers.onUserTyping(
                            new UserTypingEvent({
                                userId,
                                isTyping,
                                conversationId,
                                content,
                            })
                        );
                    }
                }
            });
        }
    }

    async sendMessage({ message, conversationId }: SendMessageServiceParams) {
        // We send messages using a CustomEvent dispatched to the window object.
        // They are received in the callback assigned in the constructor.
        // In a real application, instead of dispatching the event here,
        // you will implement sending messages to your chat server.
        const res = await fetch(`/api/conversations/${conversationId}`, { method: "PATCH", body: JSON.stringify({ message: message }) })
        await fetch('/api/socket')
        let socket = io()
        socket.on('connect', () => console.log('connected to chat'))
        // socket.on('message', (message: ChatMessage<MessageContentType>, conversationId: string) => console.log("message", message))
        if (res.status == 200) {
            socket.emit('message', message, conversationId)
        }
        const messageEvent = new CustomEvent("chat-protocol", {
            detail: {
                type: "message",
                message,
                conversationId,
                sender: this,
            },
        });

        window.dispatchEvent(messageEvent);
        return message;
    }

    sendTyping({
        isTyping,
        content,
        conversationId,
        userId,
    }: SendTypingServiceParams) {
        if (typeof window !== undefined) {
            // We send the "typing" signalization using a CustomEvent dispatched to the window object.
            // It is received in the callback assigned in the constructor
            // In a real application, instead of dispatching the event here,
            // you will implement sending signalization to your chat server.
            const typingEvent = new CustomEvent("chat-protocol", {
                detail: {
                    type: "typing",
                    isTyping,
                    content,
                    conversationId,
                    userId,
                    sender: this,
                },
            });

            window.dispatchEvent(typingEvent);
        }
    }

    // The ChatProvider registers callbacks with the service.
    // These callbacks are necessary to notify the provider of the changes.
    // For example, when your service receives a message, you need to run an onMessage callback,
    // because the provider must know that the new message arrived.
    // Here you need to implement callback registration in your service.
    // You can do it in any way you like. It's important that you will have access to it elsewhere in the service.
    on<T extends ChatEventType, H extends ChatEvent<T>>(
        evtType: T,
        evtHandler: ChatEventHandler<T, H>
    ) {
        const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;

        if (key in this.eventHandlers) {
            this.eventHandlers[key] = evtHandler;
        }
    }

    // The ChatProvider can unregister the callback.
    // In this case remove it from your service to keep it clean.
    off<T extends ChatEventType, H extends ChatEvent<T>>(
        evtType: T,
        eventHandler: ChatEventHandler<T, H>
    ) {
        const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
        if (key in this.eventHandlers) {
            this.eventHandlers[key] = () => { };
        }
    }
}
