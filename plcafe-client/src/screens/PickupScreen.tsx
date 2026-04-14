import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export const PickupScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const orderId = "ORD-123456";

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-6 py-6 flex-1 justify-center">
        <View className="bg-white p-12 rounded-5xl border border-brand-primary/5 shadow-2xl shadow-brand-primary/10 items-center">
          <View className="bg-brand-primary/5 px-6 py-3 rounded-2xl mb-8">
            <Text className="text-xl font-black text-brand-primary uppercase tracking-[0.3em]">Ready for Pickup</Text>
          </View>
          
          <Text className="text-brand-primary/30 text-2xl font-bold mb-2 tracking-widest uppercase">Order Number</Text>
          <Text className="text-[120px] font-black text-brand-primary leading-none mb-4 -tracking-widest">#101</Text>
          <Text className="text-4xl font-black text-brand-primary mb-12">홍길동 <Text className="text-brand-primary/30">님</Text></Text>

          <View className="bg-brand-primary p-6 rounded-4xl shadow-xl shadow-brand-primary/20 mb-10">
            <View className="bg-white p-6 rounded-2xl">
              <QRCode value={orderId} size={220} color="#3C2A21" />
            </View>
          </View>

          <Text className="text-xl font-bold text-brand-primary/40 text-center leading-relaxed">
            바리스타에게 위 QR 코드를{"\n"}보여주시면 음료를 드립니다.
          </Text>
        </View>

        <TouchableOpacity 
          className="mt-12 bg-white/50 p-8 rounded-4xl border border-brand-primary/10 active:scale-95 transition-all"
          onPress={() => onNavigate('main')}
        >
          <Text className="text-brand-primary text-2xl font-black text-center uppercase tracking-widest">메인으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
