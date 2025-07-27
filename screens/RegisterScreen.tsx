import React, { useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Toast from 'react-native-toast-message';

import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import FormButton from '../components/FormButton';
import createStyles from '../styles/style';
import { addUser } from '../services/user.service';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const styles = createStyles();

    const showToast = (message: string) => {
        Toast.show({
            type: 'error',
            text1: message,
            position: 'top',
            visibilityTime: 3000,
        });
    };

    const isStrongPassword = (pwd: string) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(pwd);
    };

    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleRegister = async () => {
        if (!username) return showToast('Please enter a username.');
        if (!email) return showToast('Please enter your email.');
        if (!isValidEmail(email)) return showToast('Please enter a valid email address.');
        if (!phone) return showToast('Please enter your phone number.');
        if (!password) return showToast('Please enter a password.');
        if (!confirmPassword) return showToast('Please confirm your password.');

        if (!/^\d{10}$/.test(phone)) return showToast('Phone number must be exactly 10 digits.');

        if (!isStrongPassword(password)) {
            return showToast(
                'Use 6+ characters with letters and numbers.'
            );
        }

        if (password !== confirmPassword) return showToast('Passwords do not match.');

        try {
            await addUser({ username, email, phone, password });

            Toast.show({
                type: 'success',
                text1: 'Registered successfully!',
                position: 'top',
                visibilityTime: 2000,
            });

            setTimeout(() => navigation.navigate('Login'), 1500);
        } catch (err: any) {
            showToast(err.message || 'Something went wrong during registration.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container1}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to start chatting with AskBuddy</Text>

                <InputField
                    placeholder="Username"
                    autoCapitalize="words"
                    value={username}
                    onChangeText={setUsername}
                />

                <InputField
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <InputField
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />

                <PasswordField
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    isVisible={showPassword}
                    toggleVisibility={() => setShowPassword(!showPassword)}
                />

                <PasswordField
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    isVisible={showConfirmPassword}
                    toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                <FormButton title="Register" onPress={handleRegister} />

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Already have an account?</Text>
                    <Text style={styles.signUpLink} onPress={() => navigation.navigate('Login')}>
                        {' '}Login
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;
