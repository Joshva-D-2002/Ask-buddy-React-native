import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from '../styles/style'; 

interface PasswordFieldProps extends TextInputProps {
    isVisible: boolean;
    toggleVisibility: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ isVisible, toggleVisibility, ...props }) => {
    return (
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                secureTextEntry={!isVisible}
                placeholderTextColor="#999"
                {...props}
            />
            <TouchableOpacity onPress={toggleVisibility} style={styles.passwordToggle}>
                <Feather name={isVisible ? 'eye-off' : 'eye'} size={20} color="#999" />
            </TouchableOpacity>
        </View>
    );
};


export default PasswordField;
