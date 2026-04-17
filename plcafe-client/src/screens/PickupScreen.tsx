import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useStore } from '../store/useStore';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const PickupScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const { activeOrderId, nickname, setActiveOrderId } = useStore();
  const [orderStatus, setOrderStatus] = useState<'ready' | 'completed' | string>('ready');

  useEffect(() => {
    if (!activeOrderId) return;

    const unsub = onSnapshot(doc(db, 'orders', activeOrderId), (doc) => {
      if (doc.exists()) {
        setOrderStatus(doc.data().status);
      }
    });

    return () => unsub();
  }, [activeOrderId]);

  // 수령 완료 상태일 때의 화면
  if (orderStatus === 'completed') {
    return (
      <SafeAreaView className="flex-1 bg-brand-primary justify-center">
        <View className="px-10 items-center">
          <View className="w-48 h-48 mb-12 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl">
            <Image 
              source={require('../../assets/mascot.jpg')} 
              className="w-full h-full"
              resizeMode="cover"
            />
          </div>
          <Text className="text-5xl font-black text-white text-center mb-6 leading-tight">수령이{"\n"}완료되었습니다!</Text>
          <Text className="text-xl font-bold text-white/60 text-center mb-20 leading-relaxed">
            플-카페를 이용해 주셔서 감사합니다.{"\n"}맛있게 드세요!
          </Text>
          <TouchableOpacity 
            className="w-full bg-white p-8 rounded-4xl active:scale-95 transition-all"
            onPress={() => {
              setActiveOrderId(null);
              onNavigate('main');
            }}
          >
            <Text className="text-brand-primary text-2xl font-black text-center uppercase tracking-widest">첫 화면으로</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-6 py-6 flex-1 justify-center">
        <View className="bg-white p-12 rounded-5xl border border-brand-primary/5 shadow-2xl shadow-brand-primary/10 items-center">
          <View className="bg-brand-primary/5 px-6 py-3 rounded-2xl mb-8">
            <Text className="text-xl font-black text-brand-primary uppercase tracking-[0.3em]">
              {orderStatus === 'ready' ? 'Ready for Pickup' : 'Wait for Ready'}
            </Text>
          </View>
          
          <Text className="text-brand-primary/30 text-2xl font-bold mb-2 tracking-widest uppercase">Order Number</Text>
          <Text className="text-[120px] font-black text-brand-primary leading-none mb-4 -tracking-widest">
            #{activeOrderId?.slice(-3).toUpperCase() || '---'}
          </Text>
          <Text className="text-4xl font-black text-brand-primary mb-12">{nickname || '익명'} <Text className="text-brand-primary/30">님</Text></Text>

          <View className="bg-brand-primary p-6 rounded-4xl shadow-xl shadow-brand-primary/20 mb-10">
            <View className="bg-white p-6 rounded-2xl">
              <QRCode value={activeOrderId || 'no-id'} size={220} color="#3C2A21" />
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
