import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useBarometer } from '../hooks/useBarometer';

const MENU_ITEMS = [
  { id: '1', name: '아메리카노', price: 2200, fastTrack: true, complex: false },
  { id: '2', name: '플-라떼', price: 3500, fastTrack: true, complex: false },
  { id: '3', name: '자몽 에이드', price: 3200, fastTrack: false, complex: true },
  { id: '4', name: '딸기 스무디', price: 4500, fastTrack: false, complex: true },
];

export const MainScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const [isPeakMode, setIsPeakMode] = useState(false);
  const { currentFloor } = useBarometer();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setIsPeakMode(doc.data().peakMode || false);
      }
    });
    return unsub;
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-6 py-6 flex-1">
        {/* Header with Mascot */}
        <View className="flex-row justify-between items-center mb-8 px-2">
          <View>
            <Text className="text-4xl font-black text-brand-primary tracking-tighter">PL-CAFE</Text>
            <Text className="text-sm font-bold text-brand-primary/40 uppercase tracking-widest">{floor}에서 주문 중</Text>
          </View>
          <View className="bg-white p-3 rounded-2xl shadow-sm border border-brand-primary/5">
            <Text className="text-3xl">🐻</Text>
          </View>
        </View>

        {/* Bento Grid Layout */}
        <View className="flex-1">
          {/* Fast Track Section */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4 px-2">
              <Text className="text-brand-accent mr-2">⚡</Text>
              <Text className="text-xl font-black text-brand-primary uppercase tracking-tight">Fast Track <Text className="text-brand-primary/40 font-bold">(1분 픽업)</Text></Text>
            </View>
            <View className="flex-row gap-4">
              {menuItems.filter(item => item.fast).map((item) => (
                <TouchableOpacity 
                  key={item.name} 
                  className="flex-1 bg-white p-8 rounded-4xl shadow-xl shadow-brand-primary/5 border border-brand-primary/5 active:scale-95 transition-all"
                  onPress={() => addToCart(item)}
                >
                  <Text className="text-2xl font-black text-brand-primary mb-2">{item.name}</Text>
                  <Text className="text-lg font-bold text-brand-primary/40">{item.price.toLocaleString()}원</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Full Menu Grid */}
          <Text className="text-xl font-black text-brand-primary mb-4 px-2 uppercase tracking-widest">전체 메뉴</Text>
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {menuItems.filter(item => !isPeakMode || item.fast).map((item) => (
                <TouchableOpacity 
                  key={item.name} 
                  className="w-[48%] bg-white p-6 rounded-4xl border border-brand-primary/5 shadow-sm active:scale-95 transition-all"
                  onPress={() => addToCart(item)}
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <Text className="text-xl font-black text-brand-primary flex-1 mr-2">{item.name}</Text>
                    {item.fast && <Text className="text-xs">⚡</Text>}
                  </View>
                  <Text className="text-base font-bold text-brand-primary/40">{item.price.toLocaleString()}원</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Floating Cart Button */}
        {cart.length > 0 && (
          <TouchableOpacity 
            className="absolute bottom-10 right-6 left-6 bg-brand-primary p-8 rounded-4xl shadow-2xl shadow-brand-primary/30 flex-row justify-between items-center"
            onPress={() => onNavigate('cart')}
          >
            <Text className="text-white text-2xl font-black">장바구니 확인</Text>
            <View className="bg-brand-accent px-4 py-2 rounded-xl">
              <Text className="text-white font-black text-xl">{cart.length}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};
