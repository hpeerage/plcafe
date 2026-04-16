'use client';

export default function OrderDetail({ orderId }: { orderId: string | null }) {
  return (
    <div className="flex-1 bg-brand-bg/30 h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="p-16 max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b-4 border-brand-primary/5 pb-12">
          <div className="flex items-center gap-8">
            <div className="bg-white p-6 rounded-4xl shadow-sm border border-brand-primary/5">
              <p className="text-xs font-black text-center mb-2 text-brand-primary/30 tracking-widest uppercase">Scan QR</p>
              <div className="w-28 h-28 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-5xl">
                📷
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-brand-primary/30 uppercase tracking-[0.2em] mb-3">Order #101</p>
              <h2 className="text-8xl font-black text-brand-primary tracking-tighter">홍길동 <span className="text-3xl font-bold text-brand-primary/40 ml-2">님이 주문함</span></h2>
            </div>
          </div>
          <div className="bg-red-600/10 text-red-600 px-10 py-4 rounded-4xl text-2xl font-black border-2 border-red-600/20 shadow-sm">
            신규 주문
          </div>
        </div>

        <div className="space-y-8">
          {[
            { name: '아메리카노 (HOT)', qty: 2, options: '연하게, 샷 추가' },
            { name: '플-라떼 (ICE)', qty: 1, options: '오트밀크 변경' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-10 rounded-5xl border-2 border-brand-primary/5 shadow-sm flex justify-between items-center transition-all hover:shadow-md">
              <div>
                <h3 className="text-4xl font-black text-brand-primary mb-3">{item.name}</h3>
                <p className="text-xl font-bold text-brand-primary/40">옵션: {item.options}</p>
              </div>
              <div className="bg-brand-primary/5 px-8 py-5 rounded-3xl">
                <p className="text-4xl font-black text-brand-primary">x {item.qty}</p>
              </div>
            </div>
          ))}

          <div className="bg-brand-primary/5 p-10 rounded-5xl border-2 border-dashed border-brand-primary/10 mt-12">
            <p className="text-lg font-black text-brand-primary/40 uppercase tracking-widest mb-4">포장 옵션</p>
            <p className="text-4xl font-black text-brand-primary">4구 캐리어 사용</p>
          </div>
        </div>

        <div className="flex gap-6 mt-20">
          <button className="flex-1 bg-brand-primary hover:opacity-90 py-8 rounded-4xl text-3xl font-black text-white shadow-xl shadow-brand-primary/20 transition-all active:scale-95">
            제조 시작
          </button>
          <button className="flex-[0.6] bg-white hover:bg-zinc-50 py-8 rounded-4xl text-3xl font-black text-brand-primary border-4 border-brand-primary/5 transition-all active:scale-95">
            주문 취소
          </button>
        </div>

        <button className="w-full mt-6 bg-brand-primary/5 hover:bg-brand-primary/10 py-10 rounded-5xl text-4xl font-black text-brand-primary border-4 border-brand-primary/10 flex items-center justify-center gap-4 transition-all active:scale-95 mb-20">
          <span className="text-5xl">✅</span> 제조 완료 및 호출
        </button>
      </div>
    </div>
  );
}
