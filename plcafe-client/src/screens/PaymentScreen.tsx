export const PaymentScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const rechargePoints = (amount: number, bonus: number) => {
    alert(`${amount.toLocaleString()}원 (+보너스 ${bonus.toLocaleString()}원) 충전이 완료되었습니다.`);
  };
  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-6 py-6 flex-1">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => onNavigate('cart')} className="mr-4">
            <Text className="text-4xl text-brand-text">←</Text>
          </TouchableOpacity>
          <Text className="text-4xl font-black text-brand-text">Pl-Money 결제</Text>
        </View>

        <View className="flex-1 items-center justify-center">
          {/* Current Balance */}
          <View className="bg-white/50 w-full p-8 rounded-3xl mb-12 border border-brand-text/5">
            <Text className="text-2xl text-brand-text/40 mb-2">현재 잔액</Text>
            <Text className="text-5xl font-black text-brand-text">12,500원</Text>
          </View>

          {/* Barcode Placeholder */}
          <View className="w-full bg-white/30 p-6 border-2 border-dashed border-brand-text/10 rounded-2xl items-center mb-12">
            <View className="bg-brand-text w-full h-32 mb-4" />
            <Text className="text-2xl tracking-[10px] font-mono text-brand-text">1234 5678 9012</Text>
            <Text className="text-lg text-brand-text/30 mt-2">1초 만에 바로 결제</Text>
          </View>

          {/* Recharge Buttons */}
          <Text className="text-2xl font-black self-start mb-6 text-brand-text">포인트 충전</Text>
           <View className="flex-row justify-between w-full mb-6">
            <TouchableOpacity 
              className="bg-brand-primary/10 p-8 rounded-3xl flex-1 mr-2 border border-brand-primary/20"
              onPress={() => rechargePoints(30000, 1500)}
            >
              <Text className="text-3xl font-black text-brand-primary text-center">3만 원</Text>
              <Text className="text-lg text-brand-primary/60 text-center font-bold">+5% 보너스</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-brand-primary p-8 rounded-3xl flex-1 ml-2"
              onPress={() => rechargePoints(50000, 5000)}
            >
              <Text className="text-3xl font-black text-white text-center">5만 원</Text>
              <Text className="text-lg text-white/60 text-center font-bold">+10% 보너스</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-brand-text p-8 rounded-3xl w-full"
            onPress={() => onNavigate('pickup')}
          >
            <Text className="text-white text-3xl font-bold text-center">주문 완료하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
