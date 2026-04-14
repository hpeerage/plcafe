'use client';

export default function OrderDetail() {
  return (
    <div className="flex-1 bg-white h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="p-12 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b-4 border-zinc-100 pb-8">
          <div>
            <p className="text-2xl font-bold text-zinc-400 uppercase tracking-widest mb-2">Order #101</p>
            <h2 className="text-7xl font-black text-zinc-900">홍길동 님이 주문함</h2>
          </div>
          <div className="bg-red-600 text-white px-8 py-4 rounded-3xl text-3xl font-black">
            신규 주문
          </div>
        </div>

        <div className="space-y-8 mb-16">
          <div className="flex justify-between items-center bg-zinc-50 p-8 rounded-[40px] border border-zinc-100">
            <div>
              <p className="text-4xl font-black text-zinc-800">아메리카노 (HOT)</p>
              <p className="text-2xl text-zinc-500 font-bold mt-2">옵션: 연하게, 샷 추가</p>
            </div>
            <p className="text-5xl font-black text-zinc-900">x 2</p>
          </div>
          
          <div className="flex justify-between items-center bg-zinc-50 p-8 rounded-[40px] border border-zinc-100">
            <div>
              <p className="text-4xl font-black text-zinc-800">플-라떼 (ICE)</p>
              <p className="text-2xl text-zinc-500 font-bold mt-2">옵션: 오트밀크 변경</p>
            </div>
            <p className="text-5xl font-black text-zinc-900">x 1</p>
          </div>

          <div className="bg-orange-50 p-8 rounded-[40px] border-2 border-orange-200">
            <p className="text-2xl font-bold text-orange-600 uppercase mb-2">포장 옵션</p>
            <p className="text-4xl font-black text-orange-900">4구 캐리어 사용</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-10 rounded-[40px] text-4xl font-black transition-all shadow-xl active:scale-95">
            제조 시작
          </button>
          <button className="bg-zinc-900 hover:bg-black text-white p-10 rounded-[40px] text-4xl font-black transition-all shadow-xl active:scale-95">
            주문 취소
          </button>
          <button className="col-span-2 bg-green-600 hover:bg-green-700 text-white p-12 rounded-[40px] text-5xl font-black mt-4 transition-all shadow-2xl active:scale-95">
            ✅ 제조 완료 및 호출
          </button>
        </div>
      </div>
    </div>
  );
}
