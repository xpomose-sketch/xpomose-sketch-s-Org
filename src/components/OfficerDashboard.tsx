/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RepairRequest, RequestStatus } from '../types';
import { ClipboardList, CheckCircle2, ShieldAlert, Award, ChevronRight, FileText, Send, XCircle } from 'lucide-react';

interface OfficerDashboardProps {
  requests: RepairRequest[];
  onUpdateStatus: (id: string, nextStatus: RequestStatus, notes: string, operator: string) => void;
  onPreviewDocument: (request: RepairRequest, type: 'request' | 'approval' | 'requisition' | 'summary') => void;
  statusColors: Record<RequestStatus, string>;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  requests,
  onUpdateStatus,
  onPreviewDocument,
  statusColors,
}) => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(requests[0]?.id || null);
  const [dispatchNote, setDispatchNote] = useState('');

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  const handleVerifyPoint = (id: string) => {
    onUpdateStatus(id, 'รออนุมัติ', 'ได้รับการตรวจสอบความถูกต้องทางวิศวกรรมสว่างแล้ว เสนอผู้อำนวยการเพื่อรับคำอนุมัติซ่อมแซม', 'เจ้าหน้าที่รับเรื่อง');
    alert('เสนอผู้อำนวยการ อนุมัติซ่อมบำรุงเรียบร้อยแล้ว! สถานะเปลี่ยนเป็น เสนอนายก อนุมัติ');
  };

  const handleCancelRequest = (id: string) => {
    const reason = prompt('กรุณาระบุมูลเหตุและเหตุผลประกอบการยกเลิกใบแจ้งซ่อมนี้:');
    if (reason === null) return;
    if (!reason.trim()) {
      alert('จำเป็นต้องระบุที่เหตุผลยกเลิก!');
      return;
    }
    onUpdateStatus(id, 'ยกเลิก', `ยกเลิกคำขอ: ${reason}`, 'เจ้าหน้าที่รับเรื่อง');
    alert('ยกเลิกใบแจ้งซ่อมนี้สำเร็จ!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left List Pane (5 Cols) */}
      <div className="lg:col-span-5 bg-white rounded-xl shadow-md border border-slate-200 p-4 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm sm:text-base">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            รายการใบแจ้งรอบด่วน ({requests.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">รวมเรื่องฟื้นฟูปัญหาสาธารณะอุปโภคจากประชาชน</p>
        </div>

        <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
          {requests.map((req) => {
            const isSelected = req.id === selectedRequestId;
            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected ? 'bg-indigo-50/70 border-indigo-400 font-medium' : 'bg-slate-50/30 hover:bg-slate-100/50 border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold font-mono text-slate-800">{req.ticketNumber}</span>
                  <span
                    style={{ color: statusColors[req.status], backgroundColor: `${statusColors[req.status]}10` }}
                    className="text-[10px] px-2 py-0.5 font-bold rounded-full border border-current"
                  >
                    {req.status}
                  </span>
                </div>
                <h4 className="text-xs text-slate-700 font-bold mt-1.5 truncate">{req.reporterName}</h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{req.details}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                  <span>มีจุดเสีย: {req.points.length} จุด</span>
                  <span>{new Date(req.createdAt).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Detail Pane (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {selectedRequest ? (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col gap-5">
            
            {/* Ticket Header Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800">{selectedRequest.ticketNumber}</h3>
                  <span
                    style={{ color: statusColors[selectedRequest.status], backgroundColor: `${statusColors[selectedRequest.status]}15` }}
                    className="text-xs px-2.5 py-0.5 rounded-full font-bold border"
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                <p className="text-xs text-slate-550 mt-0.5">แจ้งบำรุงรักษาเมื่อ: {new Date(selectedRequest.createdAt).toLocaleString('th-TH')}</p>
              </div>

              {/* Action previews */}
              <button
                onClick={() => onPreviewDocument(selectedRequest, 'request')}
                id="btn-officer-preview-pdf"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border transition-colors"
              >
                <FileText className="w-4 h-4 text-rose-600" />
                ใบแจ้งซ่อมพิมพ์ (A4 PDF)
              </button>
            </div>

            {/* Inspector Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">ผู้ร้องคำร้อง</span>
                <p className="font-bold text-slate-800">{selectedRequest.reporterName}</p>
                <p className="text-slate-500">{selectedRequest.reporterPhone}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">การพยาสัมพันธ์</span>
                <p className="font-bold text-slate-800">มีหลอดเสียซ่อมแซม: {selectedRequest.points.length} หลอด</p>
                <p className="text-slate-500">ประเภทหลัก: {selectedRequest.points[0]?.issueType || 'เสาไฟส่องทางชำรุด'}</p>
              </div>
            </div>

            {/* List of Geographic points in detail */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">ข้อมูลระบุพิกัดในแต่ละโคมไฟถนน:</span>
              <div className="flex flex-col gap-2">
                {selectedRequest.points.map((pt, i) => (
                  <div key={pt.id} className="p-3 border rounded-xl bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">จุดชำรุดที่ {i + 1}</p>
                      <p className="text-slate-500 font-mono text-[11px] mt-0.5">GIS พิกัด: {pt.latitude.toFixed(5)}, {pt.longitude.toFixed(5)}</p>
                      <p className="text-slate-700 mt-1"><strong className="text-indigo-600 border px-1 rounded bg-indigo-50 border-indigo-120">{pt.issueType}</strong>: {pt.notes || 'ชำรุดขัดข้อง'}</p>
                    </div>

                    {pt.imageBefore && (
                      <img
                        referrerPolicy="no-referrer"
                        src={pt.imageBefore}
                        alt="Pre repair status"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action workflow panel */}
            {selectedRequest.status === 'รอรับเรื่อง' || selectedRequest.status === 'รอตรวจสอบ' ? (
              <div className="border-t pt-4 bg-indigo-50/20 p-4 rounded-xl border border-indigo-100 flex flex-col sm:flex-row justify-between gap-4 items-center">
                <div className="text-xs">
                  <p className="font-bold text-indigo-850">ประเมินคุณภาพคำเรียนร้องและตรวจสอบพิกัด</p>
                  <p className="text-indigo-700 text-[11px] mt-0.5">เมื่อตรวจสอบความถูกต้องเรื่องจะถูกเสนอนายกบริหารเพื่ออนุมัติวงพัสดุและมอบทีมกระเช้า</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleCancelRequest(selectedRequest.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> ปฏิเสธ/ยกเลิก
                  </button>
                  <button
                    onClick={() => handleVerifyPoint(selectedRequest.id)}
                    id="btn-officer-approve"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-750 shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    ผ่านและส่งอนุมัติ
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 text-xs">
                <p className="font-bold text-emerald-850 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  ผ่านขั้นตอนรับเรื่องแล้ว
                </p>
                <p className="text-emerald-700 text-[11px] mt-1">ใบคำจ้างซ่อมได้รับการบริหารทางไฟฟ้าต่อไปแล้ว ไม่สามารถกลับคลังเพื่อยกเลิกซ่อมได้</p>
              </div>
            )}

          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center text-slate-400 italic font-medium h-48 flex items-center justify-center">
            กรุณาเลือกใบเบิกในหน้าซ้ายมือเพื่อดูงานตรวจทานพิกัด
          </div>
        )}
      </div>

    </div>
  );
};
