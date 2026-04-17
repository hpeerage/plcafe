'use client';

import { useState } from 'react';
import ControlBar from '../components/ControlBar';
import OrderQueue from '../components/OrderQueue';
import OrderDetail from '../components/OrderDetail';
import MenuManager from '../components/MenuManager';
import SettingsView from '../components/SettingsView';
import AlertToast from '../components/AlertToast';
import PickupModal from '../components/PickupModal';

export default function Home() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('101');
  const [activeTab, setActiveTab] = useState<'orders' | 'menus' | 'settings'>('orders');
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-brand-bg overflow-hidden text-brand-primary">
      {/* Modals & Alerts */}
      <AlertToast />
      <PickupModal isOpen={isPickupModalOpen} onClose={() => setIsPickupModalOpen(false)} />

      {/* Top Section */}
      <ControlBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenPickup={() => setIsPickupModalOpen(true)} 
      />

      {/* Bottom Section: Dynamic Tab Layout */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'orders' ? (
          <>
            <OrderQueue onSelect={setSelectedOrderId} />
            <OrderDetail orderId={selectedOrderId} />
          </>
        ) : activeTab === 'menus' ? (
          <MenuManager />
        ) : (
          <SettingsView />
        )}
      </div>
    </main>
  );
}
