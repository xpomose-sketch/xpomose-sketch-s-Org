/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RepairRequest, RequestStatus } from '../types';
import { Award, FileText, CheckCircle, Ban, TrendingUp, AlertCircle, DollarSign, PenTool } from 'lucide-react';

interface DirectorDashboardProps {
  requests: RepairRequest[];
  onUpdateStatus: (id: string, nextStatus: RequestStatus, notes: string, operator: string) => void;
  onPreviewDocument: (request: RepairRequest, type: 'request' | 'approval' | 'requisition' | 'summary') => void;
  statusColors: Record<RequestStatus, string>;
}

export const DirectorDashboard: React.FC<DirectorDashboardProps> = ({
  requests,
  onUpdateStatus,
  onPreviewDocument,
  statusColors,
}) => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    requests.find(r => r.status === 'รออนุมัติ')?.id || requests[0]?.id || null
  );

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  const pendingApprovalTickets = requests.filter(r => r.status === 'รออนุมัติ');

  // Multi action approvals
  const handleApproveWork = (id: string) => {
    onUpdateStatus(id, 'รอดำเนินการ', 'ผู้อำนวยการลงนามอนุมัติให้ปฏิบัติหน้าที่ซ่อมแซม จัดสรรวัสดุ และจัดตั้งงบประมาณแล้ว', 'ผู้อำนวยการ (นายก อบต.)');
    alert('ลงนามอนุมัติเอกสารและมอบหมายงานชุดงานหลวงเรียบร้อยแล้ว!');
  };

  const handleDeclineWork = (id: string) => {
    const comment = prompt('กรุณาระบุความคิดเห็นในการไม่อนุมัติโครงการซ่อมไฟนี้:');
    if (comment === null) return;
    if (!comment.trim()) {
      alert('จำเป็นต้องเขียนความคิดเห็นผลการปฏิเสธ!');
      return;
    }
    onUpdateStatus(id, 'รอตรวจสอบ', `ไม่อนุมัติ: ควงพ้นงวดเพราะเหตุผล ${comment}`, 'ผู้อำนวยการ (นายก อบต.)');
    alert('ส่งเรื่องตอบกลับแก้ไขงานแล้ว!');
  };

  // Calculations for dynamic totals
  const totalCompletedCount = requests.filter(r => r.status === 'ซ่อมสำเร็จ').length;
  const totalPendingOnDirector = pendingApprovalTickets.length;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-700 to-blue-800 text-white rounded-xl p-4 shadow-sm border border-indigo-200">
          <p className="text-[10px] uppercase font-bold text-indigo-200">เรื่องค้างอนุมัติลงนามนายก</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight">{totalPendingOnDirector}</span>
            <span className="text-xs text-indigo-150">ใบแจ้งซ่อมด่วน</span>
          </div>
          <div className="text-[10px] text-blue-150 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> จำเป็นต้องลงลายเซ็นเพื่อเบิกสายไฟ
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <p className="text-[10px] uppercase font-bold text-slate-400">ประสิทธิผลดำเนินงานหลวง</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-800 tracking-tight">
              {requests.length > 0 ? Math.round((totalCompletedCount / requests.length) * 100) : 0}%
            </span>
            <span className="text-xs text-slate-500">อัตราความสำเร็จ</span>
          </div>
          <div className="text-[10px] text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> ซ่อมแซมเสร็จแล้ว {totalCompletedCount} โครงการ
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <p className="text-[10px] uppercase font-bold text-slate-400">ต้นทุนค่าจัดหาพัสดุไฟฟ้า</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-indigo-650 tracking-tight">
              {requests.reduce((sum, r) => sum + r.materialsUsed.reduce((ptSum, pt) => ptSum + (pt.quantity * pt.pricePerUnit), 0), 0).toLocaleString('th-TH')}
            </span>
            <span className="text-xs text-slate-500">บาทรวมสุทธิ</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> หักเบิกอัตโนมัติผ่านสต๊อกพัสดุ
          </div>
        </div>
      </div>

      {/* Main Director Workspace Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Actionable List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-md border border-slate-200 p-4 flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
              <PenTool className="w-4.5 h-4.5 text-indigo-600" />
              ใบแจ้งสว่างรอลงนามอนุมัติ (Pending)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">โปรดตรวจพิกัดและรูปด้านพัศดุก่อนจ่ายกระเช้า</p>
          </div>

          <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto">
            {pendingApprovalTickets.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  req.id === selectedRequestId ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-slate-50/50 hover:bg-slate-100 border-slate-250'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-indigo-700">
                  <span>{req.ticketNumber}</span>
                  <span className="bg-indigo-100 px-1.5 py-0.5 rounded-sm">รออนุมัติซ่อม</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mt-2 truncate">{req.reporterName}</h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{req.details}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2.5">
                  <span>จุดชำรุด: {req.points.length} จุด</span>
                  <span>{new Date(req.createdAt).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
            ))}
            {pendingApprovalTickets.length === 0 && (
              <p className="text-center text-xs text-slate-400 italic py-8 bg-slate-50 border rounded-lg">ไม่มีเอกสารคั่งค้างอนุมัติใหม่</p>
            )}
          </div>

          {/* Quick links other folders */}
          <div className="border-t pt-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">ตรวจสอบสถานะอื่นคราวก่อน</span>
            <div className="grid grid-cols-2 gap-1.5">
              {requests.filter(r => r.status !== 'รออนุมัติ').slice(0, 4).map(req => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className="p-2 border rounded-lg text-[10px] text-slate-600 hover:bg-slate-50 cursor-pointer truncate"
                >
                  {req.ticketNumber} ({req.status})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Active Work order detail review (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col gap-4">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-800">{selectedRequest.ticketNumber}</h3>
                    <span
                      style={{ color: statusColors[selectedRequest.status], backgroundColor: `${statusColors[selectedRequest.status]}10` }}
                      className="text-xs px-2 py-0.5 rounded border"
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">ผู้ขอ: {selectedRequest.reporterName} • เบอร์: {selectedRequest.reporterPhone}</p>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => onPreviewDocument(selectedRequest, 'approval')}
                    id="btn-director-doc-approve"
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    ใบขออนุมัติ A4
                  </button>
                  <button
                    onClick={() => onPreviewDocument(selectedRequest, 'summary')}
                    id="btn-director-doc-sum"
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    ดูหน้ารายงานสรุป
                  </button>
                </div>
              </div>

              {/* Point Coordinates table preview */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">พิกัดทางภูมิศาสตร์ที่ร้องขอ:</span>
                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                  {selectedRequest.points.map((pt, idx) => (
                    <div key={pt.id} className="p-2 border rounded-lg bg-slate-50/50 flex justify-between items-center text-[11px] text-slate-700">
                      <div>
                        <strong>จุด {idx + 1}</strong> • พิกัด: {pt.latitude.toFixed(4)}, {pt.longitude.toFixed(4)}
                        <p className="text-slate-500 mt-0.5">{pt.notes}</p>
                      </div>
                      <span className="bg-red-50 text-red-750 px-1.5 rounded-full text-[10px]">{pt.issueType}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Signing Controls */}
              {selectedRequest.status === 'รออนุมัติ' ? (
                <div className="border border-indigo-150 rounded-xl p-4 bg-indigo-50/20 text-xs flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-bold text-indigo-900">กระดานควบคุมลงนามแบบรอยัลเซิร์ฟเวอร์</p>
                      <p className="text-[11px] text-indigo-650">เห็นควรอนุมัติให้จัดกำลังงาน เพื่อการบำบัดทุกข์บำรุงสุขแก่ระบบทางหลวง</p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end border-t pt-3 mt-1">
                    <button
                      onClick={() => handleDeclineWork(selectedRequest.id)}
                      className="flex items-center gap-1 px-4 py-2 text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5" /> ตีกลับเอกสาร
                    </button>
                    <button
                      onClick={() => handleApproveWork(selectedRequest.id)}
                      id="btn-director-sign"
                      className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-750 shadow-xs transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> อนุมัติซ่อมแซมเร่งด่วน
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/20 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-emerald-850">ใบแจ้งบำรุงรักษานี้ผ่านกระบวนการเซ็นสัญญาแล้ว</p>
                    <p className="text-[11px] text-emerald-600 mt-0.5">สถานะรวมกำลังดำเนินการเป็น: {selectedRequest.status}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-600 stroke-4" />
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center text-slate-400 italic font-medium h-48 flex items-center justify-center">
              ไม่มีใบอนุมัติคัดค้างที่เลือกไว้
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
