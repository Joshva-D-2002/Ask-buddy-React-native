import React, { useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import FormButton from '../components/FormButton';
import styles from '../styles/style';
import { authenticateUser } from '../services/user.service';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const showToast = (message: string) => {
    Toast.show({
        type: 'error',
        text1: message,
        position: 'top',
        visibilityTime: 3000,
    });
};

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email) return showToast('Please enter your email.');
        if (!password) return showToast('Please enter your password.');

        try {
            const user = await authenticateUser(email, password);

            if (user) {
                Toast.show({
                    type: 'success',
                    text1: 'Login successful!',
                    position: 'top',
                    visibilityTime: 2000,
                });
                setTimeout(() => navigation.navigate('Chat'), 1500);
            } else {
                showToast('Invalid email or password.');
            }
        } catch (error) {
            showToast('Login failed. Please try again.');
        }
    };

    const goToRegister = () => navigation.navigate('Register');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.title}>AskBuddy</Text>
                <Text style={styles.subtitle}>Your smart AI chat assistant</Text>

                <InputField
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <PasswordField
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    isVisible={showPassword}
                    toggleVisibility={() => setShowPassword(prev => !prev)}
                />

                <FormButton title="Login" onPress={handleLogin} />

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Don't have an account?</Text>
                    <Text style={styles.signUpLink} onPress={goToRegister}>
                        {' '}Sign up
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
