import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import createStyles from '../styles/style';

interface FormButtonProps {
    title: string;
    onPress: () => void;
}
const styles = createStyles();

const FormButton: React.FC<FormButtonProps> = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);


export default FormButton;
