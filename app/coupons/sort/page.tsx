'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const STORES = ['Amazon', 'Noon', 'NameCheap', 'Booking.com', 'iHerb', 'Oofos', 'Shein', 'AliExpress'];

interface Coupon {
  id: string;
  offer: string;
  details: string;
}

const MOCK_COUPONS: Record<string, Coupon[]> = {
  Amazon: [
    { id: 'a1', offer: '20% OFF', details: 'All electronics' },
    { id: 'a2', offer: 'FREE SHIP', details: 'Orders over $25' },
    { id: 'a3', offer: '$10 OFF', details: 'First app use' },
  ],
  Noon: [
    { id: 'n1', offer: '15% OFF', details: 'Site-wide' },
    { id: 'n2', offer: 'BOGO', details: 'Select fashion items' },
  ]
};

export default function SortCouponsPage() {
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const store = e.target.value;
    setSelectedStore(store);
    setCoupons(MOCK_COUPONS[store] || []);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(coupons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setCoupons(items);
  };

  return (
    <div className="user-page-root">
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </div>
          <div>
            <h1 className="user-page-title">Sort Coupons</h1>
            <nav className="user-breadcrumb">
              <Link href="/" className="user-breadcrumb-link">Home</Link>
              <span className="user-breadcrumb-sep">›</span>
              <Link href="/coupons" className="user-breadcrumb-link">Coupons</Link>
              <span className="user-breadcrumb-sep">›</span>
              <span className="user-breadcrumb-current">Sort</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="user-form-card" style={{ maxWidth: '800px' }}>
        <div className="user-form-card-header">
          <span className="user-form-card-badge" style={{ color:'#7c3aed', background:'rgba(124,58,237,0.09)' }}>Coupon Sorting</span>
          <p className="user-form-card-sub">Select a store, then drag and drop to reorder coupons.</p>
        </div>
        
        <div className="user-form-body">
          <div className="user-field-group" style={{ maxWidth: '400px', marginBottom: '30px' }}>
            <label htmlFor="sort-store" className="user-field-label">Choose Store</label>
            <div className="user-input-wrap">
              <select id="sort-store" value={selectedStore} onChange={handleStoreChange} className="user-input user-select" style={{ paddingLeft: '12px' }}>
                <option value="">Select store…</option>
                {STORES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="user-select-arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
            </div>
          </div>

          {selectedStore && (
            <div className="cpn-sort-container">
               {coupons.length === 0 ? (
                 <div className="store-edit-empty" style={{ padding: '40px 20px' }}>
                    <p className="store-edit-empty-sub">No coupons found for this store.</p>
                 </div>
               ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="coupons-list">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="cpn-drag-list">
                        {coupons.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`cpn-drag-item ${snapshot.isDragging ? 'cpn-dragging' : ''}`}
                              >
                                <div className="cpn-drag-handle">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                                </div>
                                <div className="cpn-drag-content">
                                  <span className="cpn-drag-offer">{item.offer}</span>
                                  <span className="cpn-drag-details">{item.details}</span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
