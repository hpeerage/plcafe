import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
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

  const filteredMenu = isPeakMode ? MENU_ITEMS.filter(item => !item.complex) : MENU_ITEMS;

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <ScrollView className="px-6 py-4">
        <Text className="text-4xl font-black mb-8 text-brand-text">PL-CAFE 주문</Text>

        {/* Fast Track Section */}
        <View className="mb-10">
          <Text className="text-2xl font-bold mb-4 text-brand-primary">⚡ Fast Track (1분 픽업)</Text>
          <View className="flex-row flex-wrap justify-between">
            {filteredMenu.filter(item => item.fastTrack).map(item => (
              <TouchableOpacity
                key={item.id}
                className="bg-brand-primary/10 p-8 rounded-3xl w-[48%] mb-4 border-2 border-brand-primary/20"
                onPress={() => onNavigate('cart')}
              >
                <Text className="text-3xl font-black text-center mb-2 text-brand-text">{item.name}</Text>
                <Text className="text-xl text-center text-brand-text/60">{item.price}원</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Regular Menu Section */}
        <View className="mb-10">
          <Text className="text-2xl font-black mb-4 text-brand-text">전체 메뉴 {isPeakMode && '(Peak Mode 활성)'}</Text>
          {filteredMenu.map(item => (
            <TouchableOpacity
              key={item.id}
              className="bg-white/50 p-6 rounded-2xl mb-4 flex-row justify-between items-center border border-brand-text/5"
              onPress={() => onNavigate('cart')}
            >
              <Text className="text-2xl font-bold text-brand-text">{item.name}</Text>
              <Text className="text-xl text-brand-text/40">{item.price}원</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Cart Button */}
      <TouchableOpacity
        className="absolute bottom-10 right-10 bg-brand-text p-6 rounded-full shadow-xl"
        onPress={() => onNavigate('cart')}
      >
        <Text className="text-white text-2xl font-black">장바구니 확인</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
