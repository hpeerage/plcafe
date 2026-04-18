import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { db } from '../lib/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import mascotImg from '../../assets/mascot.jpg';
import { useBarometer } from '../hooks/useBarometer';
import { useStore } from '../store/useStore';

// 마스코트 메시지 버블 컴포넌트
const MascotBubble = ({ message }: { message: string }) => (
  <View className="absolute -left-48 top-0 bg-white px-5 py-3 rounded-2xl rounded-tr-none shadow-md border border-brand-primary/5">
    <Text className="text-brand-primary font-bold text-sm">{message}</Text>
    <View className="absolute -right-2 top-0 w-4 h-4 bg-white border-r border-t border-brand-primary/5 transform rotate-45" />
  </View>
);

interface MenuItem {
  id: string;
  name: string;
  price: number;
  fastTrack: boolean;
  complex: boolean;
  status: 'available' | 'soldout' | 'hidden';
}

export const MainScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const [isPeakMode, setIsPeakMode] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { cart, addToCart, currentFloor, setFloor, activeOrderId } = useStore();
  const { currentFloor: baroFloor } = useBarometer();
  const [mascotMsg, setMascotMsg] = useState('오늘도 환영합니다! ☕');

  useEffect(() => {
    if (cart.length > 0) {
      setMascotMsg('맛있는 음료가 담겼네요!');
    } else if (activeOrderId) {
      setMascotMsg('정성껏 준비하고 있어요!');
    } else {
      setMascotMsg('오늘도 환영합니다! ☕');
    }
  }, [cart.length, activeOrderId]);

  useEffect(() => {
    if (baroFloor) {
      setFloor(baroFloor);
    }
  }, [baroFloor]);

  useEffect(() => {
    // 1. 피크 모드 설정 리스너
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setIsPeakMode(doc.data().peakMode || false);
      }
    });

    // 2. 메뉴 리스트 리스너 (available한 메뉴만)
    const unsubMenus = onSnapshot(collection(db, 'menus'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as MenuItem))
        .filter(m => m.status === 'available');
      
      if (data.length > 0) {
        setMenuItems(data);
      } else {
        // 데이터가 없을 경우 기본 메뉴 (테스트용)
        setMenuItems([
          { id: '1', name: '아메리카노', price: 2200, fastTrack: true, complex: false, status: 'available' },
          { id: '2', name: '플-라떼', price: 3500, fastTrack: true, complex: false, status: 'available' },
          { id: '3', name: '자몽 에이드', price: 3200, fastTrack: false, complex: true, status: 'available' },
          { id: '4', name: '딸기 스무디', price: 4500, fastTrack: false, complex: true, status: 'available' },
        ]);
      }
    });

    return () => {
      unsubSettings();
      unsubMenus();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-6 py-6 flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8 px-2">
          <View>
            <Text className="text-4xl font-black text-brand-primary tracking-tighter">PL-CAFE</Text>
            <Text className="text-sm font-bold text-brand-primary/40 uppercase tracking-widest">{currentFloor}에서 주문 중</Text>
          </View>
          <TouchableOpacity 
            className="bg-white p-1 rounded-full shadow-sm border-2 border-brand-primary/10 items-center justify-center relative"
            onPress={() => onNavigate('point')}
          >
            <MascotBubble message={mascotMsg} />
            <View className="absolute -top-1 -right-1 bg-brand-accent px-2 py-1 rounded-lg z-10 shadow-sm">
              <Text className="text-white text-[10px] font-black uppercase">Point</Text>
            </View>
            <Image 
              source={mascotImg} 
              className="w-16 h-16 rounded-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
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
              {menuItems.filter(item => item.fastTrack).map((item) => (
                <TouchableOpacity 
                  key={item.id} 
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
          <Text className="text-xl font-black text-brand-primary mb-4 px-2 uppercase tracking-widest">전체 메뉴 {isPeakMode && '(PEAK)'}</Text>
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {menuItems.filter(item => !isPeakMode || !item.complex).map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  className="w-[48%] bg-white p-6 rounded-4xl border border-brand-primary/5 shadow-sm active:scale-95 transition-all"
                  onPress={() => addToCart(item)}
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <Text className="text-xl font-black text-brand-primary flex-1 mr-2">{item.name}</Text>
                    {item.fastTrack && <Text className="text-xs">⚡</Text>}
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
              <Text className="text-white font-black text-xl">{cart.reduce((sum, item) => sum + item.qty, 0)}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};
