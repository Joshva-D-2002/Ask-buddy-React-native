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
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert,
    Keyboard,
    Switch,
    Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendChatCompletion } from '../services/chat.service';
import createStyles from '../styles/style';

type Message = { sender: 'user' | 'ai'; text: string; hidden?: boolean };
type Chat = { id: number; messages: Message[]; title: string; timestamp: Date; messageCount: number };

export default function ChatScreen() {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [aboutVisible, setAboutVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const MAX_MESSAGES_PER_CHAT = 10;

    const styles = createStyles(isDarkMode);

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            setIsInitializing(true);
            const storedName = await AsyncStorage.getItem('username');
            const storedDarkMode = await AsyncStorage.getItem('darkMode');
            
            if (storedName) {
                setUserName(storedName);
            }
            
            if (storedDarkMode) {
                setIsDarkMode(JSON.parse(storedDarkMode));
            }

            const defaultChat: Chat = {
                id: Date.now(),
                messages: [],
                title: 'New Chat',
                timestamp: new Date(),
                messageCount: 0
            };
            setChatHistory([defaultChat]);
            setActiveChatId(defaultChat.id);

            if (storedName) {
                await sendInitialGreeting(storedName, defaultChat.id);
            }

        } catch (error) {
            console.error('Error initializing app:', error);
        } finally {
            setIsInitializing(false);
        }
    };

    const toggleDarkMode = async () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        await AsyncStorage.setItem('darkMode', JSON.stringify(newDarkMode));
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
                            messageCount: 0
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
                    timestamp: new Date()
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
        const newId = Date.now();
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

    // Features list for About section
    const features = [
        { icon: '💬', text: 'Intelligent AI conversations with context awareness' },
        { icon: '📱', text: 'Multiple chat sessions with automatic title generation' },
        { icon: '🌙', text: 'Dark mode for comfortable night-time usage' },
        { icon: '💾', text: 'Local storage for chat history and preferences' },
        { icon: '🔒', text: 'Privacy-focused design with secure data handling' },
        { icon: '⚡', text: 'Fast and responsive user interface' },
        { icon: '📊', text: 'Message counter to track conversation length' },
        { icon: '🎨', text: 'Clean and modern Material Design interface' },
        { icon: '🔄', text: 'Real-time message synchronization' },
        { icon: '⚙️', text: 'Customizable settings and preferences' }
    ];

    if (isInitializing) {
        return (
            <SafeAreaView style={[styles.loadingContainer, styles.container]}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() => setSidebarVisible(true)}
                            >
                                <Text style={styles.menuButtonText}>☰</Text>
                            </TouchableOpacity>
                            <View style={styles.headerTextContainer}>
                                <Text style={styles.header}>🤖 AskBuddy</Text>
                                <Text style={styles.chatSubtitle}>
                                    {userName ? `Hi ${userName}!` : 'Your AI Assistant'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.settingsButton}
                                onPress={() => setSettingsVisible(true)}
                            >
                                <Text style={styles.settingsButtonText}>⚙️</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Chat Content */}
                        <ScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={styles.chatContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
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

                        {/* Input Container */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputRow}>
                                <TextInput
                                    value={userInput}
                                    onChangeText={setUserInput}
                                    placeholder="Type your message..."
                                    placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
                                    style={styles.chatInput}
                                    multiline
                                    textAlignVertical="top"
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

                        {/* Settings Modal */}
                        <Modal
                            visible={settingsVisible}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setSettingsVisible(false)}
                        >
                            <View style={styles.modalBackdrop}>
                                <View style={styles.modalContainer}>
                                    <Text style={styles.modalTitle}>⚙️ Settings</Text>
                                    
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View style={styles.settingItem}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.settingLabel}>Dark Mode</Text>
                                                <Text style={styles.settingDescription}>
                                                    Enable dark theme for better night experience
                                                </Text>
                                            </View>
                                            <Switch
                                                value={isDarkMode}
                                                onValueChange={toggleDarkMode}
                                                trackColor={{ false: '#767577', true: '#007bff' }}
                                                thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                                            />
                                        </View>

                                        <View style={styles.settingItem}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.settingLabel}>User Name</Text>
                                                <Text style={styles.settingDescription}>
                                                    Current: {userName || 'Not set'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.settingItem}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.settingLabel}>Message Limit</Text>
                                                <Text style={styles.settingDescription}>
                                                    {MAX_MESSAGES_PER_CHAT} messages per chat session
                                                </Text>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.aboutButton}
                                            onPress={() => {
                                                setSettingsVisible(false);
                                                setAboutVisible(true);
                                            }}
                                        >
                                            <Text style={styles.aboutButtonText}>About AskBuddy</Text>
                                        </TouchableOpacity>
                                    </ScrollView>

                                    <TouchableOpacity
                                        style={styles.closeModalButton}
                                        onPress={() => setSettingsVisible(false)}
                                    >
                                        <Text style={styles.closeModalButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {/* About Modal */}
                        <Modal
                            visible={aboutVisible}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setAboutVisible(false)}
                        >
                            <View style={styles.modalBackdrop}>
                                <View style={styles.modalContainer}>
                                    <Text style={styles.aboutTitle}>🤖 AskBuddy</Text>
                                    <Text style={styles.aboutSubtitle}>
                                        Your intelligent AI conversation companion
                                    </Text>
                                    
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <Text style={styles.featuresTitle}>✨ Features</Text>
                                        
                                        {features.map((feature, index) => (
                                            <View key={index} style={styles.featureItem}>
                                                <Text style={styles.featureIcon}>{feature.icon}</Text>
                                                <Text style={styles.featureText}>{feature.text}</Text>
                                            </View>
                                        ))}
                                        
                                        <Text style={styles.versionText}>
                                            Version 1.0.0 • Built with React Native
                                        </Text>
                                    </ScrollView>

                                    <TouchableOpacity
                                        style={styles.closeModalButton}
                                        onPress={() => setAboutVisible(false)}
                                    >
                                        <Text style={styles.closeModalButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}