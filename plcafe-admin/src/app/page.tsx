'use client';

import { useState } from 'react';
import ControlBar from '../components/ControlBar';
import OrderQueue from '../components/OrderQueue';
import OrderDetail from '../components/OrderDetail';
import MenuManager from '../components/MenuManager';

export default function Home() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('101');
  const [activeTab, setActiveTab] = useState<'orders' | 'menus'>('orders');

  return (
    <main className="min-h-screen flex flex-col bg-brand-bg overflow-hidden text-brand-primary">
      {/* Top Section */}
      <ControlBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Bottom Section: Dynamic Tab Layout */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'orders' ? (
          <>
            <OrderQueue onSelect={setSelectedOrderId} />
            <OrderDetail orderId={selectedOrderId} />
          </>
        ) : (
          <MenuManager />
        )}
      </div>
    </main>
  );
}
