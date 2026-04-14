'use client';

export default function ControlBar() {
  return (
    <div className="h-24 bg-zinc-900 text-white flex items-center justify-between px-10 border-b border-zinc-700 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <h1 className="text-4xl font-black tracking-tighter">PL-CAFE ADMIN</h1>
        <div className="flex gap-4">
          <button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl text-2xl font-bold transition-colors">
            ⚡ 피크타임 모드 ON
          </button>
          <button className="bg-zinc-700 hover:bg-zinc-600 px-8 py-3 rounded-xl text-2xl font-bold transition-colors">
            전체 완료 (Batch)
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-zinc-400 text-lg uppercase font-bold tracking-widest">Wait Time</p>
          <p className="text-3xl font-black text-orange-400">12 MIN</p>
        </div>
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-3xl">
          👤
        </div>
      </div>
    </div>
  );
}
