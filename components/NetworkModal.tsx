import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import createStyles from '../styles/style';
import Toast from 'react-native-toast-message';

const NetworkModal = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const modalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const secondToastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const styles = createStyles();


  const checkConnection = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      setIsConnected(true);
      setShowModal(false);
      clearTimers();
    } else {
      handleDisconnect();
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);

    Toast.show({
      type: 'info',
      text1: 'Network Unavailable',
      text2: 'Checking for reconnection...',
      visibilityTime: 3000,
    });

    secondToastTimerRef.current = setTimeout(() => {
      Toast.show({
        type: 'error',
        text1: 'Still No Internet',
        text2: 'Trying to reconnect...',
        visibilityTime: 3000,
      });
    }, 6000);

    modalTimerRef.current = setTimeout(() => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          setShowModal(true);
        }
      });
    }, 10000);
  };

  const clearTimers = () => {
    if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    if (secondToastTimerRef.current) clearTimeout(secondToastTimerRef.current);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setIsConnected(true);
        setShowModal(false);
        clearTimers();
      } else {
        handleDisconnect();
      }
    });

    checkConnection();

    return () => {
      unsubscribe();
      clearTimers();
    };
  }, []);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={showModal}
      onRequestClose={() => { }}
    >
      <View style={styles.networkBackdrop}>
        <View style={styles.networkModal}>
          <Text style={styles.networkTitle}>No Internet Connection</Text>
          <Text style={styles.networkMessage}>
            Please turn on mobile data or Wi-Fi to continue using the app.
          </Text>
          <Pressable style={styles.networkRetryButton} onPress={checkConnection}>
            <Text style={styles.networkRetryText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default NetworkModal;
