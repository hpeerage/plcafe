'use client';

import { useState } from 'react';
import ControlBar from '../components/ControlBar';
import OrderQueue from '../components/OrderQueue';
import OrderDetail from '../components/OrderDetail';

export default function Home() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('101');

  return (
    <main className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Top Section */}
      <ControlBar />

      {/* Bottom Section: 2-Split Layout */}
      <div className="flex flex-1">
        {/* Left: Queue List */}
        <OrderQueue onSelect={setSelectedOrderId} />

        {/* Right: Detailed View */}
        <OrderDetail />
      </div>
    </main>
  );
}
