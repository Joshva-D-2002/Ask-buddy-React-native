import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InferenceClient } from '@huggingface/inference';
import { sendChatCompletion } from '../services/chat.service';
 
const client = new InferenceClient("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");
const { height: screenHeight } = Dimensions.get('window');

type Message = { sender: 'user' | 'ai'; text: string; hidden?: boolean };
type Chat = { id: number; messages: Message[]; title: string; timestamp: Date; messageCount: number };

export default function ChatScreen() {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [isFirstLaunch, setIsFirstLaunch] = useState(true);
    const [isInitializing, setIsInitializing] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    const MAX_MESSAGES_PER_CHAT = 10;

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            setIsInitializing(true)
        } catch (error) {
            console.error('Error initializing app:', error);
            // Create default chat if everything fails
            createDefaultChat();
        } finally {
            setIsInitializing(false);
        }
    };

    const createDefaultChat = () => {
        const defaultChat: Chat = {
            id: Date.now(),
            messages: [],
            title: 'New Chat',
            timestamp: new Date(),
            messageCount: 0
        };
        setChatHistory([defaultChat]);
        setActiveChatId(defaultChat.id);
    };


    const sendInitialGreeting = async (username: string, chatId: number) => {
        const greetingMessage = `My name is ${username}`;
        setIsLoading(true);

        try {
            const aiText = await sendChatCompletion([{ role: 'user', content: greetingMessage }]);
            const filteredAiText = filterAiResponse(aiText);

            const userMessage: Message = { sender: 'user', text: greetingMessage, hidden: true };
            const aiMessage: Message = { sender: 'ai', text: filteredAiText, hidden: true };

            setChatHistory(prev =>
                prev.map(chat =>
                    chat.id === chatId
                        ? {
                            ...chat,
                            messages: [userMessage, aiMessage],
                            messageCount: 1
                        }
                        : chat
                )
            );
        } catch (error) {
            console.error('Error sending initial greeting:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterAiResponse = (response: string) => {
        return response
            .replace(/deepseek/gi, 'AskBuddy')
            .replace(/\*/g, '')               
            .replace(/#/g, '');                
    };

    const currentChat = chatHistory.find(chat => chat.id === activeChatId);

    const generateChatTitle = (firstMessage: string) => {
        return firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
    };

    const handleSend = async () => {
        if (!userInput.trim() || !activeChatId) return;

        const currentChatData = chatHistory.find(chat => chat.id === activeChatId);

        if (currentChatData && currentChatData.messageCount >= MAX_MESSAGES_PER_CHAT) {
            Alert.alert(
                'Message Limit Reached',
                `You've reached the maximum of ${MAX_MESSAGES_PER_CHAT} messages for this chat. Please start a new conversation.`,
                [
                    {
                        text: 'New Chat',
                        onPress: handleNewConversation
                    },
                    {
                        text: 'OK',
                        style: 'cancel'
                    }
                ]
            );
            return;
        }

        const userMessage: Message = { sender: 'user', text: userInput.trim() };
        const messageText = userInput.trim();
        setUserInput('');
        setIsLoading(true);

        // Update chat history with user message
        setChatHistory(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
                const newMessages = [...chat.messages, userMessage];
                const visibleMessages = newMessages.filter(msg => !msg.hidden);
                const newTitle = visibleMessages.length === 1 ? generateChatTitle(messageText) : chat.title;
                return {
                    ...chat,
                    messages: newMessages,
                    title: newTitle,
                    messageCount: chat.messageCount + 1,
                    timestamp: new Date() // Update timestamp
                };
            }
            return chat;
        }));

        try {
            const conversationHistory = currentChatData?.messages || [];
            const apiMessages = conversationHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));
            apiMessages.push({ role: 'user', content: messageText });
            
            const aiText = await sendChatCompletion(apiMessages);
            const filteredAiText = filterAiResponse(aiText);
            const aiMessage: Message = { sender: 'ai', text: filteredAiText };

            setChatHistory(prev =>
                prev.map(chat =>
                    chat.id === activeChatId
                        ? { ...chat, messages: [...chat.messages, aiMessage] }
                        : chat
                )
            );
        } catch (err) {
            console.error('Error sending message:', err);
            setChatHistory(prev =>
                prev.map(chat =>
                    chat.id === activeChatId
                        ? { ...chat, messages: [...chat.messages, { sender: 'ai', text: 'Error occurred. Please try again.' }] }
                        : chat
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewConversation = () => {
        const newId = Date.now(); // Use timestamp for unique ID
        const newChat: Chat = {
            id: newId,
            messages: [],
            title: 'New Chat',
            timestamp: new Date(),
            messageCount: 0
        };
        setChatHistory(prev => [newChat, ...prev]);
        setActiveChatId(newId);
        setSidebarVisible(false);
    };

    const handleChatSelect = (chatId: number) => {
        setActiveChatId(chatId);
        setSidebarVisible(false);
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const visibleMessages = currentChat?.messages.filter(msg => !msg.hidden) || [];

    if (isInitializing) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Main Content */}
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => setSidebarVisible(true)}
                    >
                        <Text style={styles.menuButtonText}>☰</Text>
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.header}>🤖 AskBuddy</Text>
                        <Text style={styles.subtitle}>
                            {userName ? `Hi ${userName}!` : 'Your AI Assistant'}
                        </Text>
                    </View>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.chatContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {visibleMessages.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>👋 Start a conversation!</Text>
                            <Text style={styles.emptyStateSubtext}>Ask me anything and I'll help you out.</Text>
                            {currentChat && (
                                <Text style={styles.messageCounter}>
                                    {currentChat.messageCount}/{MAX_MESSAGES_PER_CHAT} messages used
                                </Text>
                            )}
                        </View>
                    ) : (
                        <>
                            {visibleMessages.map((msg, idx) => (
                                <View
                                    key={idx}
                                    style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}
                                >
                                    <Text style={[styles.messageText, msg.sender === 'user' && styles.userMessageText]}>
                                        {msg.text}
                                    </Text>
                                </View>
                            ))}
                            {currentChat && (
                                <View style={styles.messageCounterContainer}>
                                    <Text style={styles.messageCounter}>
                                        {currentChat.messageCount}/{MAX_MESSAGES_PER_CHAT} messages used
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                    {isLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#007bff" />
                            <Text style={styles.loadingText}>Thinking...</Text>
                        </View>
                    )}
                </ScrollView>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={90}
                >
                    <View style={styles.inputContainer}>
                        <View style={styles.inputRow}>
                            <TextInput
                                value={userInput}
                                onChangeText={setUserInput}
                                placeholder="Type your message..."
                                style={styles.input}
                                multiline
                                maxLength={500}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                onPress={handleSend}
                                style={[styles.sendButton, (!userInput.trim() || isLoading) && styles.sendButtonDisabled]}
                                disabled={!userInput.trim() || isLoading}
                            >
                                <Text style={styles.sendButtonText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>

            {/* Sidebar Overlay */}
            {sidebarVisible && (
                <View style={styles.overlay}>
                    <TouchableOpacity
                        style={styles.overlayBackground}
                        onPress={() => setSidebarVisible(false)}
                    />
                    <View style={styles.sidebar}>
                        <View style={styles.sidebarHeader}>
                            <Text style={styles.sidebarTitle}>Chat History</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setSidebarVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.newChatButton} onPress={handleNewConversation}>
                                <Text style={styles.newChatButtonText}>+ New Chat</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
                            {chatHistory.map(chat => (
                                <TouchableOpacity
                                    key={chat.id}
                                    style={[styles.chatItem, chat.id === activeChatId && styles.chatItemActive]}
                                    onPress={() => handleChatSelect(chat.id)}
                                >
                                    <Text style={[styles.chatItemTitle, chat.id === activeChatId && styles.chatItemTitleActive]}>
                                        {chat.title}
                                    </Text>
                                    <Text style={[styles.chatItemTime, chat.id === activeChatId && styles.chatItemTimeActive]}>
                                        {formatTimestamp(chat.timestamp)}
                                    </Text>
                                    <Text style={[styles.chatItemPreview, chat.id === activeChatId && styles.chatItemPreviewActive]}>
                                        {chat.messageCount}/{MAX_MESSAGES_PER_CHAT} messages • {chat.messages.filter(msg => !msg.hidden).length} visible
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // ... existing styles ...
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        flexDirection: 'row',
    },
    overlayBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebar: {
        width: 300,
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderColor: '#e9ecef',
        flexDirection: 'column',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    sidebarHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#fff',
    },
    sidebarTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 12,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#495057',
    },
    newChatButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    newChatButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    chatList: {
        flex: 1,
        padding: 8,
    },
    chatItem: {
        padding: 12,
        marginVertical: 4,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    chatItemActive: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    chatItemTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#212529',
        marginBottom: 4,
    },
    chatItemTitleActive: {
        color: '#fff',
    },
    chatItemTime: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 2,
    },
    chatItemTimeActive: {
        color: '#e3f2fd',
    },
    chatItemPreview: {
        fontSize: 12,
        color: '#868e96',
    },
    chatItemPreviewActive: {
        color: '#e3f2fd',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    headerContainer: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuButtonText: {
        fontSize: 18,
        color: '#495057',
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerSpacer: {
        width: 52,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#212529',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 4,
    },
    chatContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 16,
    },
    messageCounter: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    messageCounterContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    messageBubble: {
        marginVertical: 6,
        padding: 12,
        borderRadius: 12,
        maxWidth: '80%',
        alignSelf: 'flex-start',
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#007bff',
    },
    aiBubble: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#212529',
    },
    userMessageText: {
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#6c757d',
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    input: {
        flex: 1,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        maxHeight: 100,
        backgroundColor: '#fff',
    },
    sendButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    sendButtonDisabled: {
        backgroundColor: '#6c757d',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});