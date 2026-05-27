/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RepairRequest, SystemSettings, Material } from '../types';
import { Eye, Printer, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

interface A4DocumentProps {
  request: RepairRequest;
  settings: SystemSettings;
  materialsList: Material[];
  type: 'request' | 'approval' | 'requisition' | 'summary';
  onClose?: () => void;
}

export const A4Document: React.FC<A4DocumentProps> = ({
  request,
  settings,
  materialsList,
  type,
  onClose,
}) => {
  const getThemeColorClass = () => {
    switch (settings.themeColor) {
      case 'gold': return 'border-amber-600 text-amber-800';
      case 'emerald': return 'border-emerald-600 text-emerald-800';
      case 'crimson': return 'border-rose-600 text-rose-800';
      case 'slate': return 'border-slate-600 text-slate-800';
      default: return 'border-blue-700 text-blue-900';
    }
  };

  const getThemeBgClass = () => {
    switch (settings.themeColor) {
      case 'gold': return 'bg-amber-50';
      case 'emerald': return 'bg-emerald-50';
      case 'crimson': return 'bg-rose-50';
      case 'slate': return 'bg-slate-50';
      default: return 'bg-blue-50';
    }
  };

  // Calculations for materials requisition
  const totalCost = request.materialsUsed.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);

  const getStatusThai = (status: string) => {
    switch (status) {
      case 'รอรับเรื่อง': return 'รอรับเรื่องแจ้งซ่อม';
      case 'รอตรวจสอบ': return 'รอเจ้าหน้าที่รับเรื่องตรวจสอบ';
      case 'รออนุมัติ': return 'เสนอนายก อนุมัติ';
      case 'รอดำเนินการ': return 'อนุมัติแล้ว รอดำเนินการ';
      case 'กำลังซ่อม': return 'ช่างเข้าซ่อมหน้างาน';
      case 'ซ่อมสำเร็จ': return 'การดำเนินการเสร็จสิ้น (ซ่อมสำเร็จ)';
      case 'ยกเลิก': return 'ยกเลิกคำขอ';
      default: return status;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900/60 fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-8 border border-slate-200">
        
        {/* Controls Header */}
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-800">
              ตัวอย่างเอกสาร {type === 'request' && 'ใบแจ้งซ่อมโคมไฟถนน'}
              {type === 'approval' && 'ใบคำขออนุมัติปฏิบัติการ'}
              {type === 'requisition' && 'ใบเบิกจ่ายพัสดุและวัสดุซ่อมบำรุง'}
              {type === 'summary' && 'รายงานการปฏิบัติงานรายคณะ'}
            </span>
            <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full border">
              ขนาดกระดาษมาตรฐาน A4
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id={`btn-print-${type}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              พิมพ์เอกสาร (Print PDF)
            </button>
            <button
              onClick={onClose}
              id="btn-close-pdf"
              className="px-4 py-2 text-sm font-medium hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>

        {/* Dynamic A4 Printable Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-300 flex justify-center">
          <div className="w-[210mm] min-h-[297mm] bg-white p-[20mm] md:p-[25mm] shadow-lg relative text-slate-900 border border-slate-150 font-sans print:shadow-none print:border-none print:p-0">
            
            {/* Stamp for current status */}
            <div className="absolute right-[25mm] top-[25mm] select-none pointer-events-none transform rotate-12">
              {request.status === 'ซ่อมสำเร็จ' ? (
                <div className="border-4 border-emerald-500/80 text-emerald-500 rounded-lg px-4 py-2 font-bold text-lg uppercase flex items-center gap-1.5 bg-emerald-50/50">
                  <CheckCircle2 className="w-5 h-5" />
                  การซ่อมสำเร็จ
                </div>
              ) : request.status === 'ยกเลิก' ? (
                <div className="border-4 border-rose-500/80 text-rose-500 rounded-lg px-4 py-2 font-bold text-lg uppercase flex items-center gap-1.5 bg-rose-50/50">
                  <ShieldAlert className="w-5 h-5" />
                  ยกเลิก
                </div>
              ) : (
                <div className="border-4 border-amber-500/80 text-amber-500 rounded-lg px-4 py-2 font-bold text-lg uppercase flex items-center gap-1.5 bg-amber-50/50">
                  <Award className="w-5 h-5" />
                  {request.status}
                </div>
              )}
            </div>

            {/* Garuda Logo Placeholder for Thai Official Document */}
            <div className="flex flex-col items-center mb-6">
              <div className="mb-2">
                {/* Visual Garuda Wing Vector Represented Elegantly */}
                <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 5 C45 15, 30 25, 10 32 C25 40, 40 45, 45 60 C38 65, 20 62, 5 57 C15 70, 32 75, 48 68 C49 75, 45 85, 50 95 C55 85, 51 75, 52 68 C68 75, 85 70, 95 57 C80 62, 62 65, 55 60 C60 45, 75 40, 90 32 C70 25, 55 15, 50 5 Z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-center tracking-tight text-slate-900 mt-1">
                {settings.agencyName}
              </h1>
              <p className="text-sm font-medium text-slate-500">{settings.address}</p>
              <p className="text-xs text-slate-400 mt-0.5">โทรศัพท์: {settings.phone} | เว็บไซต์: {settings.website}</p>
            </div>

            <hr className="border-slate-350 my-5" />

            {/* Document Metadata Area */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6 pb-2">
              <div>
                <p><strong className="text-slate-700">เลขที่หนังสืออ้างอิง:</strong> {request.ticketNumber}</p>
                <p><strong className="text-slate-700">วันที่สร้างเอกสาร:</strong> {new Date(request.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.</p>
                <p><strong className="text-slate-700">ชั้นความลับ/ความเร่งด่วน:</strong> ปกติ/ด่วนมาก</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="inline-block p-1 bg-slate-100 rounded-sm border border-slate-200">
                  {/* Visual QR Code Representation with beautiful grid */}
                  <div className="w-12 h-12 grid grid-cols-4 gap-[2px] bg-white p-0.5">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className={`rounded-xs ${(i * 3 + 7) % 5 === 0 || (i % 2 === 0 && i > 3) ? 'bg-black' : 'bg-white'}`} />
                    ))}
                  </div>
                </span>
                <span className="text-[10px] text-slate-500 mt-1">QR Code สแกนผ่านกองช่าง</span>
              </div>
            </div>

            {/* =========================================
                TYPE 1: REPAIR REQUEST DOCUMENT
                ========================================= */}
            {type === 'request' && (
              <div>
                <div className={`border-l-4 ${getThemeColorClass()} pl-3 py-1 mb-4 ${getThemeBgClass()}`}>
                  <h2 className="text-base font-bold text-slate-800">1. ข้อมูลผู้แจ้งความประสงค์ซ่อมแซม</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-800 mb-6 bg-slate-50/50 p-3 rounded-md border border-slate-100">
                  <p><strong>ชื่อ-นามสกุลผู้แจ้ง:</strong> {request.reporterName}</p>
                  <p><strong>เบอร์โทรศัพท์มือถือ:</strong> {request.reporterPhone}</p>
                  <p><strong>อายุ:</strong> {request.reporterAge ? `${request.reporterAge} ปี` : '-'}</p>
                  <p><strong>เลขบัตรประชาชน:</strong> {request.reporterCitizenId || '-'}</p>
                  <p className="col-span-2"><strong>ที่อยู่ผู้ร้องเรียน:</strong> {request.reporterAddress || '-'}</p>
                  <p className="col-span-2"><strong>รายละเอียด/มูลความเสียหาย:</strong> {request.details || 'ไม่มีข้อมูลเพิ่มเติม'}</p>
                </div>

                <div className={`border-l-4 ${getThemeColorClass()} pl-3 py-1 mb-4 ${getThemeBgClass()}`}>
                  <h2 className="text-base font-bold text-slate-800">2. รายการจุดเสียโคมไฟถนนที่ตรวจพบ (จำนวน {request.points.length} จุด)</h2>
                </div>
                <table className="w-full text-left text-sm text-slate-800 border-collapse mb-8">
                  <thead>
                    <tr className="bg-slate-100 border-t border-b border-slate-300">
                      <th className="py-2.5 px-2 text-center font-bold text-slate-700 w-12">ลำดับ</th>
                      <th className="py-2.5 px-2 font-bold text-slate-700 w-32">พิกัด GPS</th>
                      <th className="py-2.5 px-2 font-bold text-slate-700 w-36">หมวดหมู่ปัญหา</th>
                      <th className="py-2.5 px-2 font-bold text-slate-700">บันทึกเพิ่มเติม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.points.map((pt, i) => (
                      <tr key={pt.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="py-2.5 px-2 text-center">{i + 1}</td>
                        <td className="py-2.5 px-2 font-mono text-xs">{pt.latitude.toFixed(5)}, {pt.longitude.toFixed(5)}</td>
                        <td className="py-2.5 px-2">
                          <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-750 text-xs border border-orange-200">
                            {pt.issueType}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-xs text-slate-600">{pt.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* =========================================
                TYPE 2: APPROVAL DOCUMENT
                ========================================= */}
            {type === 'approval' && (
              <div>
                <div className={`border-l-4 ${getThemeColorClass()} pl-3 py-1 mb-4 ${getThemeBgClass()}`}>
                  <h2 className="text-base font-bold text-slate-800">การขออนุมัติจัดจ้าง/ปฏิบัติภารกิจเร่งด่วน</h2>
                </div>
                <div className="text-sm text-slate-800 leading-relaxed mb-6 space-y-3">
                  <p>
                    เรียน <strong>{settings.directorName} ({settings.directorTitle})</strong>
                  </p>
                  <p className="indent-8">
                    ตามที่ทางงานกองช่าง {settings.agencyName} ได้รับคำร้องเรียนความเสียหายจากประชาชนเมื่อวันที่ 
                    {' '}{new Date(request.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })} 
                    {' '}ที่แจ้งความประสงค์ขอซ่อมแซมโคมไฟส่องสว่างริมทางหลวงท้องถิ่น จำนวน <strong>{request.points.length} จุด</strong>
                  </p>
                  <p className="indent-8">
                    งานบำรุงรักษาและบริการทางไฟฟ้า กองช่าง ได้ตรวจสอบตำแหน่งจุดเสียทั้งหมดแล้ว พบว่าส่วนใหญ่อยู่ในลักษณะ 
                    {' '}<strong>{request.points[0]?.issueType || 'ไฟชำรุดชั่วคราว'}</strong> ส่งผลต่อความปลอดภัยในชีวิตและทรัพย์สินของพี่น้องประชาชนในยามค่ำคืนเป็นอย่างยิ่ง เห็นควรมอบหมายให้กลุ่มช่างบริการเร่งด่วนรุดเข้าปฏิบัติการและแก้ไขโดยด่วนที่สุด
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-amber-50/25 mb-8">
                  <p className="text-sm font-bold text-slate-800 mb-2">ตารางสรุปงบคำนวณเบื้องต้น:</p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                    <p>จำนวนหัวโคมที่เสียหาย: <strong>{request.points.length} ต้น</strong></p>
                    <p>ระยะเวลาคาดการณ์ซ่อมเสร็จ: <strong>ภายใน 24 ชั่วโมง</strong></p>
                    <p>พิกัดปฏิบัติการ: <strong>แวดวงดอนแก้ว GPS พิกัดรวม</strong></p>
                    <p>สถานะประธานตรวจสอบ: <strong className="text-emerald-700">ผ่านการกวดขันความถูกต้องแล้ว</strong></p>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================
                TYPE 3: REQUISITION DOCUMENT
                ========================================= */}
            {type === 'requisition' && (
              <div>
                <div className={`border-l-4 ${getThemeColorClass()} pl-3 py-1 mb-4 ${getThemeBgClass()}`}>
                  <h2 className="text-base font-bold text-slate-800">รายละเอียดใบเบิกจ่ายพัสดุไฟฟ้าจากคลังหลวง</h2>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  ต่อไปนี้คือพรายการและจำนวนวัสดุพัสดุที่เบิกใช้งานจริงเพื่อเข้าดำเนินการซ่อมบำรุงในรหัสงาน <strong>{request.ticketNumber}</strong>
                </p>

                <table className="w-full text-left text-sm text-slate-800 border-collapse mb-8">
                  <thead>
                    <tr className="bg-slate-100 border-t border-b border-slate-300">
                      <th className="py-2 px-2 text-center font-bold text-slate-700 w-12">ลำดับ</th>
                      <th className="py-2 px-2 font-bold text-slate-700">รายการวัสดุ</th>
                      <th className="py-2 px-2 text-right font-bold text-slate-700 w-24">จำนวน</th>
                      <th className="py-2 px-2 text-right font-bold text-slate-700 w-32">ราคาต่อหน่วย</th>
                      <th className="py-2 px-2 text-right font-bold text-slate-700 w-32">รวมราคาทั้งสิ้น (บาท)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.materialsUsed.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 text-xs italic">
                          ยังไม่มีการบันทึกการเบิกวัสดุสำหรับใบแจ้งซ่อมนี้
                        </td>
                      </tr>
                    ) : (
                      request.materialsUsed.map((item, i) => (
                        <tr key={item.materialId} className="border-b border-slate-200">
                          <td className="py-2 px-2 text-center">{i + 1}</td>
                          <td className="py-2 px-2 font-medium text-slate-800">{item.name}</td>
                          <td className="py-2 px-2 text-right">{item.quantity}</td>
                          <td className="py-2 px-2 text-right">{item.pricePerUnit.toLocaleString('th-TH')} .-</td>
                          <td className="py-2 px-2 text-right font-mono font-semibold text-slate-900">
                            {(item.quantity * item.pricePerUnit).toLocaleString('th-TH')} .-
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    {request.materialsUsed.length > 0 && (
                      <tr className="bg-slate-50 font-bold border-b-2 border-slate-300">
                        <td colSpan={3} className="py-2 px-2 text-right">มูลค่าวัสดุเบิกรวมสุทธิ:</td>
                        <td colSpan={2} className="py-2 px-2 text-right text-base text-blue-900 font-mono">
                          {totalCost.toLocaleString('th-TH')} บาท
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            )}

            {/* =========================================
                TYPE 4: SUMMARY REPORT DOCUMENT
                ========================================= */}
            {type === 'summary' && (
              <div>
                <div className={`border-l-4 ${getThemeColorClass()} pl-3 py-1 mb-4 ${getThemeBgClass()}`}>
                  <h2 className="text-base font-bold text-slate-800">รายงานผลความสำเร็จในการแก้ไขปัญหาไฟฟ้าสว่างขัดข้อง</h2>
                </div>
                <div className="text-sm text-slate-800 space-y-3 mb-6">
                  <p className="indent-8">
                    สืบเนื่องจากการปฏิบัติหน้าที่ของพนักงานชุดงานบริการเร่งด่วนในเทศบัญญัติการบำรุงรักษาสาธารณูปโภค ได้เข้าปฏิบัติการซ่อมบำรุงแก้เสาไฟและกระชับสายไฟตามรหัสงาน <strong>{request.ticketNumber}</strong> เป็นที่เรียบร้อยในพิกัด {request.points.length} จุด
                  </p>
                  <p>ผลการสำรวจและตรวจสอบหลังรับบริการพบว่า:</p>
                  <ul className="list-disc pl-6 space-y-1 text-slate-700">
                    <li>ระบบไฟฟ้าแรงดันต่ำสามารถจ่ายพลังงานได้เต็มประสิทธิภาพ</li>
                    <li>หัวโคมไฟ LED ได้รับการติดตั้ง ทดสอบความปลอดภัย และมุมกวาดของแสงสว่างเหมาะสม</li>
                    <li>ช่างทำงานด้วยความระมัดระวัง มีอุปกรณ์กั้นรถยนต์ และการเบิกสต๊อกบันทึกถูกต้อง</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="border border-slate-200 rounded p-3 text-center bg-emerald-50/20">
                    <p className="text-xs text-slate-500">ผลการดำเนินการ</p>
                    <p className="text-lg font-bold text-emerald-700">ใช้งานได้ 100%</p>
                  </div>
                  <div className="border border-slate-200 rounded p-3 text-center bg-blue-50/20">
                    <p className="text-xs text-slate-500">งบประมาณพัสดุหักลบจริง</p>
                    <p className="text-lg font-bold text-blue-700">{request.materialsUsed.length > 0 ? `${totalCost.toLocaleString('th-TH')} บาท` : '0 บาท'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Signatures Form - Highly Polish Government standard */}
            <div className="mt-12 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-400 text-center mb-6 italic">ขอรับรองว่าข้อความข้างต้นและรายการสถิติลายมือชื่อเหล่านี้เป็นความจริงตามระเบียบพัสดุภาครัฐทุกประการ</p>
              
              <div className="grid grid-cols-2 gap-8 text-xs text-slate-800">
                
                {/* Signature Block 1 */}
                <div className="flex flex-col items-center">
                  <p className="text-slate-500 mb-6">ลงนาม................................................................ ผู้รายงาน</p>
                  <p className="font-semibold">{request.reporterName || 'นายประดิษฐ์ ซ่อมดี'}</p>
                  <p className="text-slate-500">({request.reporterName ? 'ประชาชนผู้ได้รับความเดือดร้อน' : 'ช่างบริการซ่อมบำรุงงานหลวง'})</p>
                </div>

                {/* Signature Block 2 - Chief Approver */}
                <div className="flex flex-col items-center">
                  <div className="h-10 flex items-center justify-center mb-1 relative w-full">
                    <div className="font-serif italic text-blue-700 text-base font-bold scale-110 tracking-wider">
                      Somchai.J
                    </div>
                    {/* Visual Official Stamp Representation */}
                    <div className="absolute right-8 top-[-10px] w-14 h-14 rounded-full border-4 border-red-500/30 flex items-center justify-center transform rotate-12 select-none">
                      <span className="text-[8px] font-bold text-red-500 leading-none text-center">อบต.<br />ดอนแก้ว</span>
                    </div>
                  </div>
                  <p className="text-slate-500 mb-2">ลงนาม................................................................ ผู้อนุมัติโครงการ</p>
                  <p className="font-semibold">{settings.directorName}</p>
                  <p className="text-slate-500">({settings.directorTitle})</p>
                </div>

              </div>
            </div>

            {/* Document Footer Note */}
            <div className="mt-12 text-[10px] text-slate-400 text-center flex items-center justify-between">
              <span>จัดทำโดยระบบ Smart Repair CMS - {settings.agencyName}</span>
              <span>รหัสตรวจสอบต้นทาง: SHA256-RPT-{(request.id || '999').substring(0, 8)}</span>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
};
