/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RepairRequest, RepairPoint, IssueType, RequestStatus } from '../types';
import { MapPin, Plus, Send, CheckCircle2, History, AlertTriangle, Phone, User, Trash2 } from 'lucide-react';

interface CitizenDashboardProps {
  requests: RepairRequest[];
  onCreateRequest: (req: Omit<RepairRequest, 'id' | 'ticketNumber' | 'createdAt' | 'status' | 'materialsUsed' | 'history'>) => void;
  pickedLat?: number;
  pickedLng?: number;
  onClearPickedCoordinates?: () => void;
  statusColors: Record<RequestStatus, string>;
  onTriggerMapPickMode: (isActive: boolean) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  requests,
  onCreateRequest,
  pickedLat,
  pickedLng,
  onClearPickedCoordinates,
  statusColors,
  onTriggerMapPickMode,
}) => {
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterAge, setReporterAge] = useState('');
  const [reporterAddress, setReporterAddress] = useState('');
  const [reporterCitizenId, setReporterCitizenId] = useState('');
  const [mainDetails, setMainDetails] = useState('');

  // Points list accumulator for the pending repair request
  const [points, setPoints] = useState<Omit<RepairPoint, 'id' | 'requestId' | 'imageAfter'>[]>([]);

  // Individual point builder state
  const [issueType, setIssueType] = useState<IssueType>('ไฟไม่ติด');
  const [notes, setNotes] = useState('');
  const [inputLat, setInputLat] = useState('18.8525');
  const [inputLng, setInputLng] = useState('98.9680');

  const [activeTab, setActiveTab] = useState<'report' | 'history'>('report');

  // Trigger GPS mapping coordinate sync
  const handleAutoGPS = () => {
    // Generate slight random offsets around the municipal office
    const computedLat = 18.848 + (Math.random() * 0.008);
    const computedLng = 98.963 + (Math.random() * 0.008);
    setInputLat(computedLat.toFixed(5));
    setInputLng(computedLng.toFixed(5));
    alert(`🛰️ ระบบจำลองปักหมุดสำเร็จ GPS พิกัด: [${computedLat.toFixed(5)}, ${computedLng.toFixed(5)}]`);
  };

  // Sync coords if picked on map
  React.useEffect(() => {
    if (pickedLat && pickedLng) {
      setInputLat(pickedLat.toFixed(5));
      setInputLng(pickedLng.toFixed(5));
    }
  }, [pickedLat, pickedLng]);

  const handleAddPoint = () => {
    const doubleLat = parseFloat(inputLat);
    const doubleLng = parseFloat(inputLng);
    if (isNaN(doubleLat) || isNaN(doubleLng)) {
      alert('ค่าละติจูด/ลองจิจูด ไม่ถูกต้อง');
      return;
    }

    setPoints([...points, {
      latitude: doubleLat,
      longitude: doubleLng,
      imageBefore: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400", // Standard damaged light placeholder image
      poleNumber: "",
      issueType,
      notes,
    }]);

    // Clear point builder
    setNotes('');
    onClearPickedCoordinates?.();
    onTriggerMapPickMode(false);
  };

  const handleRemovePoint = (index: number) => {
    setPoints(points.filter((_, idx) => idx !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName || !reporterPhone) {
      alert('กรุณาระบุชื่อผู้แจ้งและเบอร์ติดต่อ!');
      return;
    }
    if (points.length === 0) {
      alert('กรุณาลงทะเบียนอย่างน้อย 1 จุดเสียหายที่ต้องการแจ้งซ่อม!');
      return;
    }

    onCreateRequest({
      reporterName,
      reporterPhone,
      reporterAge,
      reporterAddress,
      reporterCitizenId,
      details: mainDetails,
      points: points.map(pt => pt as RepairPoint),
    });

    // Reset Citizen form states
    setReporterName('');
    setReporterPhone('');
    setReporterAge('');
    setReporterAddress('');
    setReporterCitizenId('');
    setMainDetails('');
    setPoints([]);
    alert('🎉 ส่งเรื่องขอบูรณะการและแจ้งไฟทางหลวงสำเร็จ! เรื่องถูกบันทึกเข้าระบบราชการกลางเป็นที่เรียบร้อย');
    setActiveTab('history');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* citizen navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-center">
        <button
          onClick={() => { setActiveTab('report'); onTriggerMapPickMode(false); }}
          id="btn-citizen-tab-report"
          className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'report' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          <Plus className="w-4 h-4" />
          กรอกคำขอแจ้งซ่อม (New Form)
        </button>
        <button
          onClick={() => { setActiveTab('history'); onTriggerMapPickMode(false); }}
          id="btn-citizen-tab-history"
          className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          <History className="w-4 h-4" />
          ติดตามสถานะคราวก่อน ({requests.length})
        </button>
      </div>

      {activeTab === 'report' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Left */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">ฟอร์มส่งคำร้องแจ้งชำรุด (ส่งทางราชการตำบล)</h3>
              <p className="text-xs text-slate-500 mt-0.5">กรุณากรอกข้อมูลจริงเพื่อให้ช่างสามารถเข้าปฏิบัติรวดเร็วที่สุด</p>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">ชื่อผู้ร้องเรียน</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="นายสมชาย รักสงบ"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      required
                      id="citizen-reporter-name"
                      className="w-full text-xs pl-8 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="เช่น 0812345678"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      required
                      id="citizen-reporter-phone"
                      className="w-full text-xs pl-8 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Added complainant Age, Citizen ID and Address fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">อายุ (ปี)</label>
                  <input
                    type="number"
                    placeholder="เช่น 35"
                    value={reporterAge}
                    onChange={(e) => setReporterAge(e.target.value)}
                    required
                    id="citizen-reporter-age"
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">เลขประจำตัวประชาชน (13 หลัก)</label>
                  <input
                    type="text"
                    maxLength={13}
                    placeholder="เช่น 1234567890123"
                    value={reporterCitizenId}
                    onChange={(e) => setReporterCitizenId(e.target.value)}
                    required
                    id="citizen-reporter-citizen-id"
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ที่อยู่ผู้ร้องเรียน</label>
                <textarea
                  placeholder="ที่อยู่ปัจจุบันของผู้ร้องเรียน..."
                  value={reporterAddress}
                  onChange={(e) => setReporterAddress(e.target.value)}
                  required
                  rows={2}
                  id="citizen-reporter-address"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ปัญหาโดยรวมพิกัด (เช่น ในซอยลึก)</label>
                <textarea
                  placeholder="เขียนอธิบายถึงพิกัดจุดเสียเพื่อเป็นข้อมูลเบื้องต้นแก่ผู้บันทึกระบบ..."
                  value={mainDetails}
                  onChange={(e) => setMainDetails(e.target.value)}
                  rows={2}
                  id="citizen-reporter-details"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              {/* Added Points area */}
              <div className="border-t pt-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-3">
                  จุดนำซ่อมที่ลงทะเบียนไว้เสร็จแล้ว ({points.length} จุดหลัก)
                </span>
                {points.length === 0 ? (
                  <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50 text-slate-400 text-xs italic">
                    ยังไม่มีการเพิ่มพิกัดจุดชำรุด! กรุณากำหนดพิกัดจากกล่องเครื่องมือด้านขวามือและตั้งค่าแล้วกดปุ่มบันทึกพิน
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {points.map((pt, index) => (
                      <div key={index} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-150 text-xs shadow-2xs">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-rose-500" />
                          <div>
                            <p className="font-bold text-slate-800">จุดที่ {index + 1} | <span className="text-indigo-600">{pt.issueType}</span></p>
                            <p className="text-[10px] text-slate-500">พิกัด GPS: {pt.latitude.toFixed(4)}, {pt.longitude.toFixed(4)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePoint(index)}
                          className="p-1 hover:bg-rose-100 text-rose-605 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                id="btn-citizen-submit"
                className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
                ส่งเรื่องและใบแจ้งซ่อมเข้าสู่ระบบหน่วยงานหลวง
              </button>
            </form>
          </div>

          {/* Point Builder Right */}
          <div className="lg:col-span-5 bg-slate-50 rounded-xl border border-slate-250 p-5 flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">เพิ่มรายละเอียดจุดเสียโคมไฟ</h3>
              <p className="text-xs text-slate-550 mt-0.5">ระบุพิกัดละตำแหน่งแต่ละเสารายต้นที่ท่านเจอปัญหา</p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-705 block mb-1">ลักษณะที่เสียหาย</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as IssueType)}
                  id="pt-builder-issue"
                  className="w-full text-xs px-2.5 py-2 border rounded-lg bg-white"
                >
                  <option value="ไฟไม่ติด">ไฟไม่ติดดับสนิห</option>
                  <option value="ไฟกระพริบ">ไฟกระพริบ/แสงวับๆ</option>
                  <option value="หลอดเสีย">หลอดเสีย/โคมไหม้</option>
                  <option value="สายไฟชำรุด">สายไฟฟ้าพาดห้อยหรือชำรุด</option>
                  <option value="เสาเอียง">เสาไฟบิดเบี้ยวหรือคดเอียง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-705 block mb-1">Latitude (ละติจูด)</label>
                  <input
                    type="text"
                    value={inputLat}
                    onChange={(e) => setInputLat(e.target.value)}
                    id="pt-builder-lat"
                    className="w-full text-xs px-3 py-1.5 border rounded-lg bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-705 block mb-1">Longitude (ลองจิจูด)</label>
                  <input
                    type="text"
                    value={inputLng}
                    onChange={(e) => setInputLng(e.target.value)}
                    id="pt-builder-lng"
                    className="w-full text-xs px-3 py-1.5 border rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              {/* GPS Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAutoGPS}
                  className="flex items-center justify-center gap-1 px-3 py-2 border border-slate-300 text-[11px] font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  📡 ตรวจ GPS มือถือ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onTriggerMapPickMode(true);
                    alert('🗺️ เข้าสู่โหมดปักจุดนำซ่อม! กรุณาคลิกเลือกจุดเสียสว่างบนแผนที่โดยตรง เพื่อคัดลอกพิกัดโดยอัติโนมัติ');
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 border border-blue-200 text-[11px] font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  🎯 แตะพิกัดจากแผนที่
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-705 block mb-1">คำแนะนำตัวนำ (ยึดหลักสังเกต)</label>
                <input
                  type="text"
                  placeholder="เช่น ข้างร้านค้าปลาเผาโบราณ"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  id="pt-builder-notes"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <button
                type="button"
                onClick={handleAddPoint}
                id="pt-builder-add"
                className="mt-2 w-full flex items-center justify-center gap-1 px-4 py-2.5 text-xs font-bold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
                เซฟจุดเสานี้และเพิ่มลงใบแจ้ง
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* History lists view */
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-800">ประวัติคำขอแจ้งซ่อมแซมทางสว่าง</h3>
            <p className="text-xs text-slate-500 mt-0.5">รวมประวัติคราวย่อยที่ท่านเคยแจ้งไว้ ผ่านการบันทึกฐานข้อมูล Supabase Postgree</p>
          </div>

          <div className="flex flex-col gap-4">
            {requests.map((req) => (
              <div key={req.id} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-xs transition-shadow">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{req.ticketNumber}</span>
                    <span
                      style={{ color: statusColors[req.status], backgroundColor: `${statusColors[req.status]}15` }}
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold border border-current"
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">แจ้งวันที่: {new Date(req.createdAt).toLocaleDateString('th-TH')} • มีเสาเสีย: {req.points.length} จุด</p>
                  <p className="text-xs text-slate-700">{req.details}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs min-w-[200px]">
                  <p className="font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <History className="w-3.5 h-3.5 text-indigo-600" />
                    สถานะการซ่อมแซมล่าสุด
                  </p>
                  {req.history[req.history.length - 1] ? (
                    <div className="text-slate-600 text-[11px] space-y-0.5">
                      <p><strong>รายละเอียด:</strong> {req.history[req.history.length - 1].notes}</p>
                      <p><strong>ผู้รับสิทธิ์ล่าสุด:</strong> {req.history[req.history.length - 1].operator}</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-[10px]">บันทึกแรกกำลังเคลื่อนไหว</p>
                  )}
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-center text-xs text-slate-400 italic py-8">ไม่มีประวัติการแจ้งซ่อมแซมมาก่อนหน้านี้</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
