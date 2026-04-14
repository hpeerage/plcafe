'use client';

const MOCK_ORDERS = [
  { id: '101', nickname: '홍길동', status: 'new', items: 3, time: '2분 전' },
  { id: '102', nickname: '이순신', status: 'making', items: 1, time: '5분 전' },
  { id: '103', nickname: '김철수', status: 'waiting', items: 2, time: '10분 전' },
  { id: '104', nickname: '박영희', status: 'new', items: 4, time: '지금' },
];

export default function OrderQueue({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <aside className="w-[450px] bg-brand-bg/50 border-r border-brand-primary/10 overflow-y-auto px-6 py-8 h-[calc(100vh-6rem)]">
      <div className="flex justify-between items-center mb-10 px-2">
        <h2 className="text-3xl font-black text-brand-primary">대기 목록 <span className="text-brand-primary/20">({MOCK_ORDERS.length})</span></h2>
      </div>
      
      <div className="flex flex-col gap-6">
        {MOCK_ORDERS.map((order) => (
          <div 
            key={order.id} 
            onClick={() => onSelect(order.id)}
            className={`p-8 rounded-4xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 ${
              order.status === 'making' 
                ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20' 
                : 'bg-white border-brand-primary/5 hover:border-brand-primary/10'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-2 rounded-2xl text-lg font-black ${
                order.status === 'making' ? 'bg-white text-brand-primary' : 'bg-brand-primary/10 text-brand-primary'
              }`}>
                #{order.id}
              </span>
              <span className={`text-sm font-bold uppercase tracking-widest ${
                order.status === 'making' ? 'text-white/60' : 'text-brand-primary/40'
              }`}>
                {order.time}
              </span>
            </div>
            
            <h3 className={`text-4xl font-black mb-2 ${
              order.status === 'making' ? 'text-white' : 'text-brand-primary'
            }`}>
              {order.nickname}
            </h3>
            <p className={`text-xl font-bold ${
              order.status === 'making' ? 'text-white/80' : 'text-brand-primary/40'
            }`}>
              {order.items}개 메뉴
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
