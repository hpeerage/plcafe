import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { MainScreen } from './src/screens/MainScreen';
import { CartScreen } from './src/screens/CartScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { PickupScreen } from './src/screens/PickupScreen';
import { NativeWindStyleSheet } from "nativewind";

// NativeWind v2 setting for web/native compatibility
NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('main');

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
