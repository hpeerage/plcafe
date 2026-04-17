import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Alert } from 'react-native';
import { MainScreen } from './src/screens/MainScreen';
import { CartScreen } from './src/screens/CartScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { PickupScreen } from './src/screens/PickupScreen';
import { PointScreen } from './src/screens/PointScreen';
import { NativeWindStyleSheet } from "nativewind";
import { useStore } from './src/store/useStore';
import { triggerOrderNotification } from './src/lib/orderAutomation';
import { useBarometer } from './src/hooks/useBarometer';

// NativeWind v2 setting for web/native compatibility
NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const { currentFloor: baroFloor } = useBarometer();
  const { activeOrderId, currentFloor, setFloor, nickname } = useStore();

  // 1. 전역 층수 업데이트
  useEffect(() => {
    if (baroFloor && baroFloor !== currentFloor) {
      setFloor(baroFloor);
    }
  }, [baroFloor]);

  // 2. 컨텍스트 인지 알림 발송 로직
  useEffect(() => {
    if (!activeOrderId) return;

    // 인접 층(1F, 3F) 또는 카페 층(2F) 도착 시 알림
    if (currentFloor === '1F' || currentFloor === '3F' || currentFloor === '2F') {
      // 실제로는 한 번만 발송하도록 처리(세션/상태 기반)가 필요하지만 
      // 여기서는 데모를 위해 조건 만족 시 발송 로직만 구현
      triggerOrderNotification(nickname, currentFloor, 1);
    }
  }, [currentFloor, activeOrderId]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'main':
        return <MainScreen onNavigate={setCurrentScreen} />;
      case 'cart':
        return <CartScreen onNavigate={setCurrentScreen} />;
      case 'payment':
        return <PaymentScreen onNavigate={setCurrentScreen} />;
      case 'pickup':
        return <PickupScreen onNavigate={setCurrentScreen} />;
      case 'point':
        return <PointScreen onNavigate={setCurrentScreen} />;
      default:
        return <MainScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="auto" />
      {renderScreen()}
    </View>
  );
}
