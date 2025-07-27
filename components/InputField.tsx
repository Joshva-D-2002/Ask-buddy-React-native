import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import styles from '../styles/style';

interface InputFieldProps extends TextInputProps {}

const InputField: React.FC<InputFieldProps> = (props) => {
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor="#999"
            {...props}
        />
    );
};

export default InputField;
