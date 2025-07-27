import { StyleSheet } from 'react-native';

const Style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF0F6',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 28,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#F9F9F9',
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
        color: '#666',
        fontSize: 15,
    },
    signUpLink: {
        color: '#4a90e2',
        fontSize: 15,
        fontWeight: '600',
    },
        passwordToggle: {
        position: 'absolute',
        right: 16,
        top: 14,
    },
    inputWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        marginTop: -10,
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    disabledButton: {
        backgroundColor: '#a0c5ed',
    },
        networkBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    networkModal: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    networkTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    networkMessage: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
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

export default Style;
