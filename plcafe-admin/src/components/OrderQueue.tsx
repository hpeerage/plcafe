'use client';

const MOCK_ORDERS = [
  { id: '101', nickname: '홍길동', status: 'new', items: 3, time: '2분 전' },
  { id: '102', nickname: '이순신', status: 'making', items: 1, time: '5분 전' },
  { id: '103', nickname: '김철수', status: 'waiting', items: 2, time: '10분 전' },
  { id: '104', nickname: '박영희', status: 'new', items: 4, time: '지금' },
];

export default function OrderQueue({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="w-[450px] bg-brand-bg border-r border-brand-text/10 overflow-y-auto h-[calc(100vh-6rem)]">
      <div className="p-6">
        <h2 className="text-3xl font-black mb-6 text-brand-text">대기 목록 (4)</h2>
        <div className="space-y-4">
          {MOCK_ORDERS.map((order) => (
            <button
              key={order.id}
              onClick={() => onSelect(order.id)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all transform active:scale-95 ${
                order.status === 'new' 
                  ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                  : order.status === 'making'
                  ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                  : 'bg-green-50 border-green-200 hover:bg-green-100'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xl font-bold px-3 py-1 rounded-lg uppercase ${
                  order.status === 'new' ? 'bg-red-600 text-white' : 
                  order.status === 'making' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {order.id}
                </span>
                <span className="text-brand-text/40 font-bold">{order.time}</span>
              </div>
              <p className="text-4xl font-black text-brand-text mb-1">{order.nickname}</p>
              <p className="text-2xl text-brand-text/60 font-bold">{order.items}개 메뉴</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
