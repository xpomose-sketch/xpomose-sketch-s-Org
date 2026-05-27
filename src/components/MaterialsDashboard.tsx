/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Material, MaterialTransaction } from '../types';
import { Package, AlertCircle, TrendingUp, TrendingDown, ClipboardList, Plus, History, RefreshCw, Layers } from 'lucide-react';

interface MaterialsDashboardProps {
  materials: Material[];
  transactions: MaterialTransaction[];
  onAddTransaction: (tx: Omit<MaterialTransaction, 'id' | 'date'>) => void;
}

export const MaterialsDashboard: React.FC<MaterialsDashboardProps> = ({
  materials,
  transactions,
  onAddTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

  // Restock state action
  const [selectedMatId, setSelectedMatId] = useState(materials[0]?.id || '');
  const [transactionType, setTransactionType] = useState<'รับเข้า' | 'เบิกออก' | 'ปรับยอด'>('รับเข้า');
  const [quantityInput, setQuantityInput] = useState<number>(10);
  const [noteInput, setNoteInput] = useState('');

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mat = materials.find(m => m.id === selectedMatId);
    if (!mat) return;
    if (quantityInput <= 0) {
      alert('จำนวนขีดป้อนเข้าระบพพัสดุจำเป็นต้องมากกว่า 0!');
      return;
    }

    if (transactionType === 'เบิกออก' && mat.balance < quantityInput) {
      alert(`⚠️ ไม่สามารถเบิกออกได้! พัสดุคงเหลือในตู้อบมีเพียง ${mat.balance} ${mat.unit}`);
      return;
    }

    onAddTransaction({
      materialId: mat.id,
      materialName: mat.name,
      type: transactionType,
      quantity: quantityInput,
      pricePerUnit: mat.pricePerUnit,
      note: noteInput || `${transactionType}พัสดุด้วยตนเองผ่านฝ่ายพัสดุ`,
      operator: 'นางสาวสมจิตร รักษาสต๊อก (กองงานพัสดุ)',
    });

    setQuantityInput(10);
    setNoteInput('');
    alert('🎉 ลงบันทึกประวัติการเดินพัสดุ และจัดสต๊อกสำเร็จเรียบร้อย!');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Tab select header */}
      <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-center">
        <button
          onClick={() => setActiveTab('inventory')}
          id="btn-mat-tab-inventory"
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded transition-colors ${activeTab === 'inventory' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          <Package className="w-4 h-4" />
          รายการพัสดุและคลังวัสดุหลวง
        </button>
        <button
          onClick={() => setActiveTab('history')}
          id="btn-mat-tab-history"
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded transition-colors ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          <History className="w-4 h-4" />
          ประวัติการเคลื่อนไหวพัสดุ ({transactions.length})
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inventory Table (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow-md border border-slate-200 p-4 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">ตารางพัสดุและคลังวัสดุหลัก</h3>
                <p className="text-xs text-slate-500 mt-0.5">ระบบกวดขันยอดคงเหลือ และจุดสังเกตสั่งซื้อขั้นต่ำ</p>
              </div>

              {/* Search input */}
              <input
                type="text"
                placeholder="ค้นหาตามรหัส/ชื่อวัสดุ..."
                value={searchQuery}
                id="mat-search"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs px-3 py-1.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-t border-b border-slate-250">
                    <th className="py-2.5 px-2 text-slate-600">รหัสสิ่งของ</th>
                    <th className="py-2.5 px-2 text-slate-600">ชื่อชิ้นพัสดุหลัก</th>
                    <th className="py-2.5 px-2 text-slate-600">หมวดหมู่</th>
                    <th className="py-2.5 px-2 text-center text-slate-600">คงเหลือปัจจุบัน</th>
                    <th className="py-2.5 px-2 text-right text-slate-600">ราคา/หน่วย</th>
                    <th className="py-2.5 px-2 text-center text-slate-600">สถานะสั่งเพิ่ม</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((mat) => {
                    const isLowStock = mat.balance <= mat.reorderPoint;
                    return (
                      <tr key={mat.id} className={`border-b border-slate-150 hover:bg-slate-50/50 ${isLowStock ? 'bg-amber-50/20' : ''}`}>
                        <td className="py-2 px-2 font-mono text-slate-705 font-bold">{mat.code}</td>
                        <td className="py-2 px-2 font-semibold text-slate-900">{mat.name}</td>
                        <td className="py-2 px-2 text-slate-500">{mat.category}</td>
                        <td className="py-2 px-2 text-center">
                          <span className={`px-2 py-1.5 rounded-md font-mono font-bold text-xs ${isLowStock ? 'text-amber-800 bg-amber-100 font-extrabold animate-pulse' : 'text-slate-800'}`}>
                            {mat.balance} {mat.unit}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right font-mono">{mat.pricePerUnit.toLocaleString('th-TH')} .-</td>
                        <td className="py-2 px-2 text-center">
                          {isLowStock ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-650 text-[10px] font-bold border border-rose-200">
                              <AlertCircle className="w-3 h-3 text-rose-500 animate-bounce" />
                              พัสดุใกล้หมดแล้ว!
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100">
                              ปกติ
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Restock form (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">โมดูลรับเข้า / ปรับยอดสต๊อกพัสดุ</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">บันทึกยอดพัสดุด่วนลงดาต้าเบส</p>
            </div>

            <form onSubmit={handleTransactionSubmit} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-650 block mb-1">เลือกวัสดุอุปรณ์</label>
                <select
                  value={selectedMatId}
                  onChange={(e) => setSelectedMatId(e.target.value)}
                  id="materials-form-select"
                  className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.balance} คงเหลือ)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-650 block mb-1">ประเภทความเคลื่อนไหว</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as 'รับเข้า' | 'เบิกออก' | 'ปรับยอด')}
                  id="materials-form-type"
                  className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                >
                  <option value="รับเข้า">📥 รับเข้าพัสดุ (จัดซื้อจัดจ้าง)</option>
                  <option value="เบิกออก">📤 เบิกออกพัสดุ (ตัดจ่ายภายนอก)</option>
                  <option value="ปรับยอด">🔧 ปรับปรุงยอด (เช็คสต๊อกปะทะ)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-650 block mb-1">จำนวนพัสดุ</label>
                <input
                  type="number"
                  min={1}
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(parseInt(e.target.value) || 10)}
                  id="materials-form-qty"
                  className="w-full px-3 py-1.5 border rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-650 block mb-1">บันทึกหมายเหตุเพิ่มเติม</label>
                <input
                  type="text"
                  placeholder="เช่น ตรวจสอบสินค้าคงคลังประจำสัปดาห์"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  id="materials-form-note"
                  className="w-full px-3 py-1.5 border rounded-lg bg-white"
                />
              </div>

              <button
                type="submit"
                id="btn-materials-form-submit"
                className="mt-2 w-full flex items-center justify-center gap-1 px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors h-10"
              >
                <Plus className="w-4 h-4" /> บันทึกความเคลื่อนไหว
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* Transaction History */
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              สมุดรายวัน บันทึกประวัติเคลื่อนไหวคลังพัสดุ
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">รวมประวัติการรับเข้า เบิกออก และการหักจ่ายโดยช่างคุมงานกระเช้าทั้งหมด</p>
          </div>

          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {transactions.map((tx) => {
              const isGreen = tx.type === 'รับเข้า';
              const isRed = tx.type === 'เบิกออก';
              return (
                <div key={tx.id} className="p-3 border rounded-xl bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                  <div className="flex items-center gap-3.5">
                    <span className={`p-1.5 rounded-full ${isGreen ? 'bg-emerald-100 text-emerald-800' : isRed ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'}`}>
                      {isGreen ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{tx.materialName} ({tx.quantity} หน่วย)</p>
                      <p className="text-[10px] text-slate-500">ปฏิบัติงานโดย: {tx.operator} • หมายเหตุ: {tx.note}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end md:items-end">
                    <span className="font-bold font-mono text-slate-900">{(tx.quantity * tx.pricePerUnit).toLocaleString('th-TH')} .-</span>
                    <span className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleString('th-TH')}</span>
                  </div>
                </div>
              );
            })}
            {transactions.length === 0 && (
              <p className="text-center text-xs text-slate-400 italic py-8">ไม่มีการบันทึกประวัติการเดินคลัง</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
