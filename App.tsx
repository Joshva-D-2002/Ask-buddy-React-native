import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import NetworkModal from './components/NetworkModal';

export default function App() {
  return (
    <NavigationContainer>
      <NetworkModal />
      <AppNavigator />
      <Toast />
    </NavigationContainer>
  );
}