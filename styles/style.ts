import { StyleSheet } from 'react-native';

const createStyles = (isDarkMode: boolean = false) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#EAF0F6',
    },
    container1: {
        flex: 1,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#EAF0F6',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    headerContainer: {
        paddingTop: 40,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? '#333' : '#e9ecef',
        backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuButtonText: {
        fontSize: 18,
        color: isDarkMode ? '#fff' : '#495057',
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
        color: isDarkMode ? '#fff' : '#212529',
        textAlign: 'center',
    },
    chatSubtitle: {
        fontSize: 14,
        color: isDarkMode ? '#ccc' : '#6c757d',
        textAlign: 'center',
        marginTop: 4,
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsButtonText: {
        fontSize: 18,
        color: isDarkMode ? '#fff' : '#495057',
    },

    chatContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#EAF0F6',
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
        color: isDarkMode ? '#fff' : '#495057',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: isDarkMode ? '#ccc' : '#6c757d',
        textAlign: 'center',
        marginBottom: 16,
    },
    messageCounter: {
        fontSize: 12,
        color: isDarkMode ? '#ccc' : '#6c757d',
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
        backgroundColor: isDarkMode ? '#2d2d2d' : '#f8f9fa',
        borderWidth: 1,
        borderColor: isDarkMode ? '#404040' : '#e9ecef',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        color: isDarkMode ? '#fff' : '#212529',
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
        color: isDarkMode ? '#ccc' : '#6c757d',
    },

    inputContainer: {
        backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
        borderTopWidth: 1,
        borderTopColor: isDarkMode ? '#333' : '#e9ecef',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        paddingTop: 10,
        paddingBottom: 10,
    },
    chatInput: {
        flex: 1,
        borderColor: isDarkMode ? '#404040' : '#ced4da',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        maxHeight: 100,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
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
        width: 275,
        backgroundColor: isDarkMode ? '#2d2d2d' : '#f8f9fa',
        borderRightWidth: 1,
        borderColor: isDarkMode ? '#404040' : '#e9ecef',
        flexDirection: 'column',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        paddingTop: 20
    },
    sidebarHeader: {
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? '#404040' : '#e9ecef',
        backgroundColor: isDarkMode ? '#404040' : '#fff',
    },
    sidebarTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: isDarkMode ? '#fff' : '#212529',
        marginBottom: 12,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: isDarkMode ? '#555' : '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: isDarkMode ? '#fff' : '#495057',
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
        backgroundColor: isDarkMode ? '#404040' : '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: isDarkMode ? '#555' : '#e9ecef',
    },
    chatItemActive: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    chatItemTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: isDarkMode ? '#fff' : '#212529',
        marginBottom: 4,
    },
    chatItemTitleActive: {
        color: '#fff',
    },
    chatItemTime: {
        fontSize: 12,
        color: isDarkMode ? '#ccc' : '#6c757d',
        marginBottom: 2,
    },
    chatItemTimeActive: {
        color: '#e3f2fd',
    },
    chatItemPreview: {
        fontSize: 12,
        color: isDarkMode ? '#aaa' : '#868e96',
    },
    chatItemPreviewActive: {
        color: '#e3f2fd',
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: isDarkMode ? '#2d2d2d' : 'white',
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        color: isDarkMode ? '#fff' : '#333',
        textAlign: 'center',
    },

    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? '#404040' : '#f0f0f0',
    },
    settingLabel: {
        fontSize: 16,
        color: isDarkMode ? '#fff' : '#333',
        fontWeight: '500',
    },
    settingDescription: {
        fontSize: 12,
        color: isDarkMode ? '#ccc' : '#666',
        marginTop: 2,
    },
    aboutButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    aboutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    closeModalButton: {
        backgroundColor: isDarkMode ? '#555' : '#f8f9fa',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: isDarkMode ? '#fff' : '#333',
        fontSize: 16,
        fontWeight: '600',
    },

    aboutTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 15,
        color: isDarkMode ? '#fff' : '#333',
        textAlign: 'center',
    },
    aboutSubtitle: {
        fontSize: 16,
        color: isDarkMode ? '#ccc' : '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    featuresTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: isDarkMode ? '#fff' : '#333',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    featureIcon: {
        fontSize: 16,
        marginRight: 10,
        width: 20,
    },
    featureText: {
        fontSize: 14,
        color: isDarkMode ? '#ccc' : '#666',
        flex: 1,
    },
    versionText: {
        fontSize: 12,
        color: isDarkMode ? '#aaa' : '#999',
        textAlign: 'center',
        marginTop: 20,
    },

    authContainer: {
        flex: 1,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#EAF0F6',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
        borderRadius: 16,
        padding: 28,
        shadowColor: '#000',
        shadowOpacity: isDarkMode ? 0.3 : 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: isDarkMode ? 1 : 0,
        borderColor: isDarkMode ? '#404040' : 'transparent',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: isDarkMode ? '#fff' : '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: isDarkMode ? '#ccc' : '#666',
        marginBottom: 24,
        textAlign: 'center',
    },

    input: {
        height: 50,
        borderRadius: 12,
        borderColor: isDarkMode ? '#404040' : '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#F9F9F9',
        color: isDarkMode ? '#fff' : '#000',
        fontSize: 16,
    },
    inputFocused: {
        borderColor: '#4a90e2',
        borderWidth: 2,
    },
    inputWrapper: {
        position: 'relative',
        marginBottom: 16,
    },

    passwordContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    passwordInput: {
        height: 50,
        borderRadius: 12,
        borderColor: isDarkMode ? '#404040' : '#ddd',
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingRight: 50,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#F9F9F9',
        color: isDarkMode ? '#fff' : '#000',
        fontSize: 16,
    },
    passwordToggle: {
        position: 'absolute',
        right: 16,
        top: 14,
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    passwordToggleText: {
        color: isDarkMode ? '#ccc' : '#666',
        fontSize: 16,
    },

    button: {
        backgroundColor: '#4a90e2',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#4a90e2',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 6,
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: isDarkMode ? '#555' : '#a0c5ed',
        shadowOpacity: 0.1,
        elevation: 1,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },

    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    signUpText: {
        color: isDarkMode ? '#ccc' : '#666',
        fontSize: 15,
    },
    signUpLink: {
        color: '#4a90e2',
        fontSize: 15,
        fontWeight: '600',
    },

    errorText: {
        color: '#ff4444',
        fontSize: 13,
        marginTop: -10,
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    successText: {
        color: '#28a745',
        fontSize: 13,
        marginTop: -10,
        marginBottom: 10,
        paddingHorizontal: 4,
    },

    inputError: {
        borderColor: '#ff4444',
        borderWidth: 2,
    },
    inputSuccess: {
        borderColor: '#28a745',
        borderWidth: 2,
    },
    networkBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    networkModal: {
        width: '85%',
        backgroundColor: isDarkMode ? '#2d2d2d' : 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    networkTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        color: isDarkMode ? '#fff' : '#333',
        textAlign: 'center',
    },
    networkMessage: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20,
        color: isDarkMode ? '#ccc' : '#666',
    },
    networkRetryButton: {
        backgroundColor: '#4a90e2',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    networkRetryText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },

});

export default createStyles;