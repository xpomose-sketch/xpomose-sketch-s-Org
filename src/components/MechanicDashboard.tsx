/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RepairRequest, RequestStatus, Material, RepairMaterial } from '../types';
import { Wrench, CheckCircle2, Navigation, AlertTriangle, PackageOpen, Plus, Trash2, Camera, FileText } from 'lucide-react';

interface MechanicDashboardProps {
  requests: RepairRequest[];
  materials: Material[];
  onUpdateStatus: (id: string, nextStatus: RequestStatus, notes: string, operator: string) => void;
  onUpdateMaterialsUsed: (id: string, materialsUsed: RepairMaterial[]) => void;
  onPreviewDocument: (request: RepairRequest, type: 'request' | 'approval' | 'requisition' | 'summary') => void;
  statusColors: Record<RequestStatus, string>;
}

export const MechanicDashboard: React.FC<MechanicDashboardProps> = ({
  requests,
  materials,
  onUpdateStatus,
  onUpdateMaterialsUsed,
  onPreviewDocument,
  statusColors,
}) => {
  const mechanicJobs = requests.filter(r => 
    r.status === 'รอดำเนินการ' || r.status === 'กำลังซ่อม' || r.status === 'ซ่อมสำเร็จ'
  );

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    mechanicJobs.find(r => r.status === 'กำลังซ่อม')?.id || mechanicJobs[0]?.id || null
  );

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  // Material builder states inside job completion
  const [usedMaterials, setUsedMaterials] = useState<RepairMaterial[]>([]);
  const [selectedMatId, setSelectedMatId] = useState<string>(materials[0]?.id || '');
  const [quantityInput, setQuantityInput] = useState<number>(1);
  const [repairNotes, setRepairNotes] = useState('');

  // Sync materials if draft state is already saved
  React.useEffect(() => {
    if (selectedRequest) {
      setUsedMaterials(selectedRequest.materialsUsed);
      setRepairNotes(selectedRequest.status === 'ซ่อมสำเร็จ' ? 'ปฏิบัติหน้าที่เสร็จสิ้นอย่างประณีตเรียบร้อยแล้ว' : '');
    }
  }, [selectedRequestId, selectedRequest]);

  const handleAcceptJob = () => {
    if (!selectedRequest) return;
    onUpdateStatus(selectedRequest.id, 'กำลังซ่อม', 'พนักงานฝ่ายช่างซ่อมบำรุงและรถกระเช้า รับงานเพื่อเร่งซ่อมบำรุงหน้างานทางสว่างหลวงไฟ', 'นายประดิษฐ์ ซ่อมดี (หัวหน้าชุดปฏิบัติงาน)');
    alert('รับทราบเรื่องและเริ่มต้นปฏิบัติหน้าที่แล้ว ดำเนินการออกตรวจสอบสิ่งพิกัด!');
  };

  const handleAddMaterialItem = () => {
    const mat = materials.find(m => m.id === selectedMatId);
    if (!mat) return;
    if (quantityInput <= 0) {
      alert('กรุณาระบุจำนวนวัสดุมากกว่า 0!');
      return;
    }
    if (mat.balance < quantityInput) {
      alert(`⚠️ พัสดุคงคลังไม่พอเบิก! ปัจจุบัน ${mat.name} เหลือเพียง ${mat.balance} ${mat.unit}`);
      return;
    }

    const existsIdx = usedMaterials.findIndex(m => m.materialId === selectedMatId);
    if (existsIdx > -1) {
      const updated = [...usedMaterials];
      updated[existsIdx].quantity += quantityInput;
      setUsedMaterials(updated);
    } else {
      setUsedMaterials([...usedMaterials, {
        materialId: mat.id,
        name: mat.name,
        quantity: quantityInput,
        pricePerUnit: mat.pricePerUnit,
      }]);
    }
    setQuantityInput(1);
  };

  const handleRemoveMaterialItem = (matId: string) => {
    setUsedMaterials(usedMaterials.filter(m => m.materialId !== matId));
  };

  const handleCompleteJob = () => {
    if (!selectedRequest) return;
    if (usedMaterials.length === 0) {
      const confirmNoMat = window.confirm('⚠️ ท่านไม่ได้เบรกชิ้นพัสดุใดๆ ในคลังออกเลย ยืนยันทำงานสำเร็จโดยไม่ใช้วัสดุหรือไม่?');
      if (!confirmNoMat) return;
    }

    // Save materials and trigger stock deduct actions
    onUpdateMaterialsUsed(selectedRequest.id, usedMaterials);

    // Save final status with custom notes
    onUpdateStatus(
      selectedRequest.id, 
      'ซ่อมสำเร็จ', 
      repairNotes || 'ทำการเปลี่ยนหลอดไฟ ทดสอบระบบสว่างทางหลวงเรียบร้อย ใช้งานได้สมบูรณ์', 
      'นายประดิษฐ์ ซ่อมดี (หัวหน้าชุดปฏิบัติงาน)'
    );

    alert('🎉 ลงบันทึกรายงานความสำเร็จ พร้อมอัปเดตและหักลดคงคลังเรียบร้อยแล้ว!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Jobs list (4 Cols) */}
      <div className="lg:col-span-4 bg-white rounded-xl shadow-md border border-slate-200 p-4 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
            <Wrench className="w-4.5 h-4.5 text-indigo-600" />
            ตารางงานของช่วงกองช่าง ({mechanicJobs.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">กองช่าง และรถกระเช้าลอยฉุกเฉิน</p>
        </div>

        <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto">
          {mechanicJobs.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequestId(req.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                req.id === selectedRequestId ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-slate-50/50 hover:bg-slate-100 border-slate-250'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold font-mono text-slate-700">{req.ticketNumber}</span>
                <span
                  style={{ color: statusColors[req.status], backgroundColor: `${statusColors[req.status]}10` }}
                  className="text-[9px] px-1.5 py-0.5 rounded font-bold border border-current"
                >
                  {req.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mt-2 truncate">แจ้งโดย: {req.reporterName}</h4>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">ประเภทหลัก: {req.points[0]?.issueType || '-'} ({req.points.length} จุด)</p>
            </div>
          ))}
          {mechanicJobs.length === 0 && (
            <p className="text-center text-xs text-slate-400 italic py-8">ไม่มีกระดาษคำสั่งงานช่วงนี้</p>
          )}
        </div>
      </div>

      {/* Right Work bench Detail (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {selectedRequest ? (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col gap-5">
            
            {/* Header section */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800">{selectedRequest.ticketNumber}</h3>
                  <span
                    style={{ color: statusColors[selectedRequest.status], backgroundColor: `${statusColors[selectedRequest.status]}12` }}
                    className="text-xs px-2.5 py-0.5 rounded"
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">รายละเอียดชำรุด: {selectedRequest.details}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onPreviewDocument(selectedRequest, 'requisition')}
                  id="btn-mechanic-doc-req"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  ใบเบิกวัสดุซ่อม (A4)
                </button>
              </div>
            </div>

            {/* Geographical details with Navigation map triggers */}
            <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-150">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">เป้าหมายปักพินพิกัด:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {selectedRequest.points.map((pt, idx) => (
                  <div key={pt.id} className="p-2.5 bg-white border rounded-lg flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-800">จุดซ่อมบำรุงที่ {idx + 1}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">GPS: {pt.latitude.toFixed(5)}, {pt.longitude.toFixed(5)}</p>
                      <p className="text-slate-700 font-medium mt-1">ปัญหา: {pt.issueType}</p>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 text-[9px] border font-bold">พินนำซ่อม</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase actions controls */}
            {selectedRequest.status === 'รอดำเนินการ' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                <div>
                  <p className="font-bold text-amber-805 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    โปรดยืนยันเพื่อรับมอบหมายงานซ่อมแซมทางสว่างหลวง
                  </p>
                  <p className="text-amber-700 mt-1">การกดรับเรื่องจะระดมช่างเข้าสู่หน้างาน GPS นำซ่อมโดยฉับไว</p>
                </div>
                <button
                  onClick={handleAcceptJob}
                  id="btn-mechanic-accept"
                  className="w-full md:w-auto px-5 py-2.5 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm transition-all text-center"
                >
                  เริ่มแผนปฏิบัติการทันที
                </button>
              </div>
            )}

            {selectedRequest.status === 'กำลังซ่อม' && (
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-4 bg-slate-50/20">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <PackageOpen className="w-4.5 h-4.5 text-indigo-600" />
                    ระบุจัดรายการเบิกวัสดุคลังเพื่อประกอบซ่อม
                  </h4>
                  <p className="text-[11px] text-slate-550 mt-0.5">เลือกรายการและการันตีราคาเพื่อหักสต๊อกอัตโนมัติ</p>
                </div>

                {/* material selection row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">เลือกวัสดุอุปรณ์</label>
                    <select
                      value={selectedMatId}
                      onChange={(e) => setSelectedMatId(e.target.value)}
                      id="mechanic-mat-selector"
                      className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white"
                    >
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.balance} {m.unit} คงเหลือ)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">จำนวนที่เบิกใช้จริง</label>
                    <input
                      type="number"
                      min={1}
                      value={quantityInput}
                      onChange={(e) => setQuantityInput(parseInt(e.target.value) || 1)}
                      id="mechanic-quantity"
                      className="w-full text-xs px-3 py-2 border rounded-lg bg-white"
                    />
                  </div>

                  <button
                    onClick={handleAddMaterialItem}
                    id="btn-mechanic-add-mat-item"
                    className="flex items-center justify-center gap-1 px-4 py-2 border border-blue-200 text-xs font-bold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors h-10"
                  >
                    <Plus className="w-4 h-4" /> ดึงพัสดุนี้
                  </button>
                </div>

                {/* Material drafting table list */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-t border-b border-slate-205">
                      <th className="py-2 px-1 text-slate-600">พัสดุและวัสดุซ่อมบำรุง</th>
                      <th className="py-2 px-1 text-center w-20 text-slate-600">จำนวนใช้</th>
                      <th className="py-2 px-1 text-right w-24 text-slate-600">ราคา/หน่วย</th>
                      <th className="py-2 px-1 text-right w-28 text-slate-600">รวมราคา</th>
                      <th className="py-2 px-1 text-center w-12 text-slate-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {usedMaterials.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-5 text-center text-slate-400 italic font-medium text-[11px]">
                          ยังไม่ได้เลือกจ่ายพัสดุใดๆ ลงในใบเบิกซ่อมนี้
                        </td>
                      </tr>
                    ) : (
                      usedMaterials.map(item => (
                        <tr key={item.materialId} className="border-b border-slate-150">
                          <td className="py-2 px-1 font-bold text-slate-800">{item.name}</td>
                          <td className="py-2 px-1 text-center font-mono font-bold text-indigo-700">{item.quantity}</td>
                          <td className="py-2 px-1 text-right font-mono text-slate-500">{item.pricePerUnit.toLocaleString('th-TH')} .-</td>
                          <td className="py-2 px-1 text-right font-mono font-semibold text-slate-900">{(item.quantity * item.pricePerUnit).toLocaleString('th-TH')} .-</td>
                          <td className="py-2 px-1 text-center">
                            <button
                              onClick={() => handleRemoveMaterialItem(item.materialId)}
                              className="text-rose-600 p-1 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {usedMaterials.length > 0 && (
                    <tfoot>
                      <tr className="font-bold border-b bg-slate-50 text-[11px]">
                        <td colSpan={3} className="py-2 px-1 text-right">ยอดรวมค่าเสื่อมพัสดุรวม:</td>
                        <td className="py-2 px-1 text-right text-indigo-950 font-mono">
                          {usedMaterials.reduce((sum, i) => sum + (i.quantity * i.pricePerUnit), 0).toLocaleString('th-TH')} บาท
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>

                {/* Confirm result text notes */}
                <div className="border-t pt-3 flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">ผลการบูรณะปฏิสังขรณ์หน้างาน (Notes)</label>
                    <textarea
                      rows={2}
                      placeholder="เช่น ทำการติดตั้งสวิตช์โคมตัวใหม่และเก็บหางสายไฟฟ้าอย่างดี ใช้งานได้เรียบร้อย..."
                      value={repairNotes}
                      onChange={(e) => setRepairNotes(e.target.value)}
                      id="mechanic-completion-notes"
                      className="w-full text-xs px-3 py-2 border rounded-lg bg-white"
                    />
                  </div>

                  {/* Complete Action buttons */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCompleteJob}
                      id="btn-mechanic-complete-job"
                      className="flex items-center gap-1 px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all border"
                    >
                      <CheckCircle2 className="w-4 h-4" />บันทึกปฏิบัติซ่อมสำเร็จเสร็จสิ้น
                    </button>
                  </div>
                </div>

              </div>
            )}

            {selectedRequest.status === 'ซ่อมสำเร็จ' && (
              <div className="border border-emerald-150 rounded-xl p-4 bg-emerald-50/20 text-xs flex flex-col gap-3">
                <p className="font-bold text-emerald-850 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  การปฏิบัติภารกิจหน่วยหลวง ซ่อมแซมเรียบร้อยเสร็จสิ้น!
                </p>
                <div className="grid grid-cols-2 gap-4 text-slate-700">
                  <div>
                    <p className="font-bold block text-slate-400">ภาพจำลองหลังซ่อมแล้ว (After View)</p>
                    <img
                      referrerPolicy="no-referrer"
                      src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400"
                      alt="repaired streetlight lit elegantly"
                      className="w-28 h-20 object-cover rounded-lg border mt-1 border-slate-205"
                    />
                  </div>
                  <div>
                    <p>พัสดุหักตัดรวมแล้ว: <strong>{selectedRequest.materialsUsed.length} รายการ</strong></p>
                    <p className="mt-1">มูลเม็ดรวมต้นทุน: <strong className="text-blue-900 font-bold">{selectedRequest.materialsUsed.reduce((sum, i) => sum + (i.quantity * i.pricePerUnit), 0).toLocaleString('th-TH')} บาท</strong></p>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center text-slate-400 italic font-medium h-48 flex items-center justify-center">
            กรุณาเลือกตารางงานด้านซ้ายเพื่อดำเนินงานทางสว่างหลวง
          </div>
        )}
      </div>

    </div>
  );
};
