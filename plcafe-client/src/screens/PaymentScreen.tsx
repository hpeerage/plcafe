import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { checkQuotaAndPlaceOrder } from '../lib/quotaSystem';

export const PaymentScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const { points, addPoints, deductPoints, nickname, setNickname, cart, clearCart, currentFloor, setActiveOrderId } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handlePayment = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '픽업 시 호출받을 닉네임을 입력해주세요.');
      return;
    }

    if (cart.length === 0) {
      Alert.alert('알림', '장바구니가 비어 있습니다.');
      onNavigate('main');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 1. 주문 시도 (쿼터 체크 트랜잭션)
      const orderData = {
        nickname,
        items: cart,
        totalPrice: totalAmount,
        status: 'new',
        floor: currentFloor,
        packaging: '매장 컵', 
      };

      const result = await checkQuotaAndPlaceOrder(orderData);
      
      if (!result.success) {
        if (result.error === 'QUOTA_EXCEEDED') {
          Alert.alert('주문 밀림', '현재 주문이 너무 많아 잠시 후에 시도해 주세요. (10분당 최대 주문량 도달)');
        } else {
          Alert.alert('오류', '주문 도중 문제가 발생했습니다.');
        }
        setIsProcessing(false);
        return;
      }

      // 2. 포인트 차감 (주문 성공 후 차감)
      const success = deductPoints(totalAmount);
      if (!success) {
        Alert.alert('잔액 부족', '포인트가 부족합니다. 충전 후 다시 시도해주세요.');
        // 실제 운영 시에는 여기서 주문을 취소하는 로직이 필요함 (트랜잭션 강화 필요)
        setIsProcessing(false);
        return;
      }

      // 3. 완료 처리
      setActiveOrderId(result.orderId!);
      clearCart();
      onNavigate('pickup');
    } catch (error) {
      console.error('Order fail:', error);
      Alert.alert('오류', '시스템 일시적인 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const rechargePoints = (amount: number, bonus: number) => {
    addPoints(amount + bonus);
    Alert.alert('충전 완료', `${amount.toLocaleString()}원 (+보너스 ${bonus.toLocaleString()}원)이 충전되었습니다.`);
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-6 py-6 flex-1">
        <View className="flex-row items-center mb-10 px-2">
          <TouchableOpacity onPress={() => onNavigate('cart')} className="mr-6 bg-white p-4 rounded-2xl shadow-sm border border-brand-primary/5">
            <Text className="text-2xl text-brand-primary">←</Text>
          </TouchableOpacity>
          <Text className="text-4xl font-black text-brand-primary tracking-tighter">PL-MONEY <Text className="text-brand-accent">WALLET</Text></Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Current Balance Card */}
          <View className="bg-brand-primary p-10 rounded-5xl mb-8 shadow-2xl shadow-brand-primary/40">
            <Text className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-2">My Balance</Text>
            <Text className="text-6xl font-black text-white">{points.toLocaleString()}원</Text>
            <View className="h-[2px] bg-white/10 w-full my-8" />
            <View className="flex-row justify-between items-center text-white/60">
              <Text className="font-bold text-lg">PL-CAFE 멤버십 (GUEST)</Text>
              <Text className="text-brand-accent font-black text-xl">WELCOME</Text>
            </View>
          </View>

          {/* Nickname Input Section */}
          <View className="bg-white p-10 rounded-5xl border border-brand-primary/5 shadow-sm mb-8">
            <Text className="text-xl font-black text-brand-primary mb-6 uppercase tracking-widest">누가 주문하시나요?</Text>
            <TextInput
              className="bg-brand-primary/5 p-6 rounded-2xl text-2xl font-black text-brand-primary"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChangeText={setNickname}
              maxLength={10}
            />
            <Text className="text-sm text-brand-primary/30 mt-4 font-bold uppercase tracking-widest">픽업 시 해당 이름으로 호출됩니다.</Text>
          </View>

          {/* Recharge Section */}
          <View className="px-2">
            <Text className="text-xl font-black text-brand-primary mb-6 uppercase tracking-widest">포인트 충전 혜택</Text>
            <View className="flex-row gap-4 mb-8">
              <TouchableOpacity 
                className="flex-1 bg-white p-8 rounded-4xl border border-brand-primary/10 shadow-sm transition-all active:scale-95"
                onPress={() => rechargePoints(30000, 1500)}
              >
                <Text className="text-3xl font-black text-brand-primary mb-1">3만</Text>
                <View className="bg-brand-accent/10 px-3 py-1 rounded-lg self-start">
                  <Text className="text-sm font-black text-brand-accent">+5%</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-white p-8 rounded-4xl border border-brand-primary/10 shadow-sm transition-all active:scale-95"
                onPress={() => rechargePoints(50000, 5000)}
              >
                <Text className="text-3xl font-black text-brand-primary mb-1">5만</Text>
                <View className="bg-brand-accent px-3 py-1 rounded-lg self-start">
                  <Text className="text-sm font-black text-white">+10%</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          disabled={isProcessing}
          className={`p-8 rounded-4xl shadow-2xl mt-4 transition-all active:scale-95 ${
            isProcessing ? 'bg-zinc-300' : 'bg-brand-primary shadow-brand-primary/30'
          }`}
          onPress={handlePayment}
        >
          <Text className="text-white text-2xl font-black text-center uppercase tracking-widest">
            {isProcessing ? '처리 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
