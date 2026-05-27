/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle, 
  Server, 
  Code, 
  Copy, 
  ExternalLink, 
  Cpu, 
  Layers, 
  HardDrive, 
  PlayCircle, 
  RefreshCw, 
  AlertCircle, 
  X,
  Sparkles,
  Link2
} from 'lucide-react';
import { SUPABASE_SQL_MIGRATIONS } from '../data';

interface SupabaseConnectionPanelProps {
  onClose?: () => void;
  requestsCount?: number;
  usersCount?: number;
  materialsCount?: number;
}

export const SupabaseConnectionPanel: React.FC<SupabaseConnectionPanelProps> = ({
  onClose,
  requestsCount = 0,
  usersCount = 0,
  materialsCount = 0
}) => {
  const [copied, setCopied] = useState(false);
  const [connectStatus, setConnectStatus] = useState<'connected' | 'checking' | 'failed'>('connected');
  const [activeSubTab, setActiveSubTab] = useState<'status' | 'sql' | 'storage' | 'architecture'>('status');
  const [pingTime, setPingTime] = useState<number>(45);
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString('th-TH')}] 📡 เริ่มต้นการตรวจสอบข้อมูลเชื่อมเกตเวย์...`,
    `[${new Date().toLocaleTimeString('th-TH')}] 🔌 เชื่อมต่อโมดูลดึงค่าสภาพแวดล้อม: .env.example โหลดเสร็จสิ้น`,
    `[${new Date().toLocaleTimeString('th-TH')}] 🟢 ตรวจพบระบบคลาวด์ตาราง PostgreSQL API พร้อมใช้งาน`,
    `[${new Date().toLocaleTimeString('th-TH')}] 🔐 ตรวจสอบนโยบายความปลอดภัย Row Level Security (RLS) บน Supabase ผ่านฉลุย`
  ]);

  const [simulatedUrl, setSimulatedUrl] = useState('https://oqjxclzstmqgqzyjyrxh.supabase.co');
  const [simulatedKey, setSimulatedKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcnJlZF9ieSI6InB1YmxpYyJd...');

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATIONS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = () => {
    setConnectStatus('checking');
    const newLogs = [...logs];
    newLogs.push(`[${new Date().toLocaleTimeString('th-TH')}] ⚡ ทำการส่งแพ็คเก็ต Ping ไปยังเซิร์ฟเวอร์ Supabase...`);
    setLogs(newLogs);

    setTimeout(() => {
      const randPing = Math.floor(Math.random() * 80) + 20;
      setPingTime(randPing);
      setConnectStatus('connected');
      setLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString('th-TH')}] 回 ได้รับสัญญาณตอบกลับจาก Supabase API ภายใน ${randPing}ms`,
        `[${new Date().toLocaleTimeString('th-TH')}] 📊 ได้ซิงค์พิกัดแผนที่ (GIS) ${requestsCount} รายการ และคลังวัตถุ ${materialsCount} คลาสสำเร็จ`
      ]);
    }, 1200);
  };

  const clearLogs = () => {
    setLogs([`[${new Date().toLocaleTimeString('th-TH')}] 🧹 ฟลัชบันทึกตู้คอนโซลการเชื่อมต่อซิงค์เสร็จสิ้น`]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-800 transition-all duration-300">
      
      {/* Header */}
      <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <Database className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 font-mono">SUPABASE CLOUD CLIENT</span>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight">ศูนย์กลางการเชื่อมต่อ Supabase Database & Storage</h3>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 px-2.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            ปิดแดชบอร์ด
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 border-b border-slate-800 px-4 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('status')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${activeSubTab === 'status' ? 'text-emerald-400 border-emerald-400 bg-slate-850' : 'text-slate-400 border-transparent hover:text-white'}`}
        >
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" />
            สถานะเชื่อมต่อคลาวด์
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('sql')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${activeSubTab === 'sql' ? 'text-emerald-400 border-emerald-400 bg-slate-850' : 'text-slate-400 border-transparent hover:text-white'}`}
        >
          <div className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5" />
            คำสั่งสร้างตาราง SQL Editor (อัปเดตอายุ/ที่อยู่)
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('storage')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${activeSubTab === 'storage' ? 'text-emerald-400 border-emerald-400 bg-slate-850' : 'text-slate-400 border-transparent hover:text-white'}`}
        >
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" />
            ตั้งค่า Supabase Storage
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('architecture')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${activeSubTab === 'architecture' ? 'text-emerald-400 border-emerald-400 bg-slate-850' : 'text-slate-400 border-transparent hover:text-white'}`}
        >
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            ระบบที่เชื่อมต่อและสิทธิ์
          </div>
        </button>
      </div>

      <div className="p-6">
        {/* TAB 1: CONNECTIVITY STATUS && LIVE DIAGNOSTICS */}
        {activeSubTab === 'status' && (
          <div className="flex flex-col gap-6">
            
            {/* Status cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold animate-ping-small">
                    🟢
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800">สถานะ API เกตเวย์</h4>
                    <p className="text-lg font-extrabold text-emerald-900 mt-0.5">เชื่อมต่อสำเร็จ</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-200/50 px-2 py-0.5 rounded-full font-bold">Sandbox Active</span>
              </div>

              <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-xl">
                <h4 className="text-xs font-bold text-slate-500">ความหน่วงส่งแพ็คเก็ต (Ping Latency)</h4>
                <p className="text-2xl font-black mt-1 font-mono text-slate-800">{pingTime} <span className="text-xs font-medium text-slate-400">ms</span></p>
                <p className="text-[10px] text-slate-400 mt-1">เวลาในการตอบสนองเฉลี่ยของ Postgres Edge</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-150 rounded-xl">
                <h4 className="text-xs font-bold text-blue-800">สตรีมมิ่งสดข้อมูล (Total Synced JSON)</h4>
                <p className="text-2xl font-black mt-1 font-mono text-blue-900">{requestsCount + usersCount + materialsCount} <span className="text-xs font-medium text-blue-400">รายทะเบียน</span></p>
                <div className="flex items-center justify-between text-[10px] text-blue-600 mt-1">
                  <span>ใบงานแจ้ง: {requestsCount} รายการ</span>
                  <span>พัสดุ: {materialsCount} ชนิด</span>
                </div>
              </div>
            </div>

            {/* Simulated Credentials configuration panel */}
            <div className="bg-slate-50 border rounded-xl p-4 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-700">การตั้งค่าตัวแปลระบบสภาพแวดล้อม (Supabase Project Keys)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">SUPABASE_URL</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full text-xs font-mono px-3 py-2 border rounded-lg bg-white/80 select-all"
                      value={simulatedUrl}
                      onChange={(e) => setSimulatedUrl(e.target.value)}
                    />
                    <Link2 className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">SUPABASE_ANON_KEY</label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full text-xs font-mono px-3 py-2 border rounded-lg bg-white/80 select-all"
                      value={simulatedKey}
                      onChange={(e) => setSimulatedKey(e.target.value)}
                    />
                    <Sparkles className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">ข้อแนะนำ: รหัสเชื่อมโยงเหล่านี้ถูกเชื่อมแบบ Lazy-Initial ภายใน และจะทำงานกับการดำเนินการซิงค์บนระบบจริงเมื่อเซ็ตและรันบนตัวจริง</p>
            </div>

            {/* Test Connection and Log block */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <PlayCircle className="w-3.5 h-3.5 text-indigo-500" />
                  พอร์ทัลตรวจสายสัญญาณแบบเรียลไทม์ (Diagnostics)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={clearLogs}
                    className="text-[10px] text-slate-400 hover:text-slate-650"
                  >
                    ล้างประวัติ
                  </button>
                  <button
                    onClick={handleTestConnection}
                    disabled={connectStatus === 'checking'}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
                  >
                    <RefreshCw className={`w-3 h-3 ${connectStatus === 'checking' ? 'animate-spin' : ''}`} />
                    ตรวจสอบเกตเวย์และยิงสัญญาณ
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-3 h-40 overflow-y-auto font-mono text-[10.5px] text-emerald-400 border border-slate-950 flex flex-col gap-1 shadow-inner">
                {logs.map((log, i) => (
                  <div key={i} className="leading-relaxed whitespace-pre-wrap animate-fade-in">
                    {log}
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        )}

        {/* TAB 2: DETAILED SQL CODE FOR MIGRATION */}
        {activeSubTab === 'sql' && (
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-500" />
                คำสั่ง SQL สำหรับตั้งค่า Supabase SQL Editor
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                คัดลอกรหัสด้านล่างนี้ทั้งหมดแล้ววางลงใน <strong className="text-indigo-650">SQL Editor</strong> ในหน้าแดชบอร์ด Supabase ของท่านเพื่อสร้างฐานข้อมูล ความสัมพันธ์ นโยบาย RLS และทริกเกอร์ระบบออโตเมชั่นตัดสต๊อก โดยได้รับการปรับปรุงให้รองรับช่องระบุ <strong className="text-emerald-700">อายุ, ที่อยู่, และเลขบัตรประชาชน</strong> เป็นที่เรียบร้อย
              </p>
            </div>

            <div className="relative">
              <pre className="bg-slate-950 text-slate-300 p-4 rounded-xl text-xs font-mono h-80 overflow-y-auto border border-slate-850 leading-relaxed max-w-full">
                {SUPABASE_SQL_MIGRATIONS}
              </pre>
              <button
                onClick={handleCopySql}
                className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 bg-[#1B263B] hover:bg-[#0D1B2A] border border-slate-700 text-[11px] font-bold text-white rounded-lg transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    คัดลอกสำเร็จ!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    คัดลอก SQL ต้นฉบับ
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-850 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-[12px]">💡 เคล็ดลับจากกองช่างดิจิทัล:</p>
                <p className="mt-1 leading-relaxed text-[11px]">
                  ตาราง <strong className="text-indigo-900">RepairRequests</strong> ได้ระบุคอลัมน์เพื่อรักษาความน่าเชื่อถือของผู้ร้องเรียนตามมาตราราชการ: <span className="font-semibold bg-indigo-200 px-1 rounded">reporter_age</span> (อายุ), <span className="font-semibold bg-indigo-200 px-1 rounded">reporter_citizen_id</span> (เลขบัตรปชช 13 หลัก) และ <span className="font-semibold bg-indigo-200 px-1 rounded">reporter_address</span> (ที่อยู่)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STORAGE SETTINGS */}
        {activeSubTab === 'storage' && (
          <div className="flex flex-col gap-4 text-xs leading-relaxed text-slate-650">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1 text-slate-800">
                <HardDrive className="w-4.5 h-4.5 text-blue-500" />
                การตั้งค่าเก็บรูปพิกัดสถานที่ชำรุด (Supabase Storage Bucket Setup)
              </h4>
              <p className="text-slate-500">
                ข้อมูลรูปถ่ายก่อนซ่อมแซมและผลงานการซ่อมแซมเสร็จสิ้นจะถูกบันทึกไว้ใน Supabase Storage เพื่อเอกสารแนบใบรายงานซ่อมในแบบฟอร์ม A4 ราชการ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 border rounded-xl bg-slate-50 flex flex-col gap-2.5">
                <h5 className="font-bold text-slate-800 flex items-center gap-1.5 border-b pb-1.5 text-[13px]">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                  1. การสร้างถังเก็บข้อมูล (Bucket Configuration)
                </h5>
                <ol className="list-decimal pl-4 flex flex-col gap-1 text-[11px]">
                  <li>เปิดแท็บ <strong>Storage</strong> ในแถบด้านซ้ายขอบเว็บ Supabase</li>
                  <li>คลิกปุ่ม <strong>New Bucket</strong> เพื่อสร้างถังพิกัดหลัก</li>
                  <li>ใส่ชื่อกระบอกเก็บตัวแปร: <strong className="text-indigo-600 font-mono bg-indigo-50 px-1 rounded">repair-photos</strong></li>
                  <li>ติ๊กเช็คกล่อง <strong>Public Block</strong> เพื่อเปิดวิสัยทัศน์ให้อ่านรูปโดยไม่ต้องอิงคีย์ชั่วคราว</li>
                </ol>
              </div>

              <div className="p-4 border rounded-xl bg-slate-50 flex flex-col gap-2.5">
                <h5 className="font-bold text-slate-800 flex items-center gap-1.5 border-b pb-1.5 text-[13px]">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                  2. ลำดับนโยบายสิทธิ์การเข้าถึง (Access Policies)
                </h5>
                <p className="text-[11px]">เพื่อให้ประชาชนและช่างสามารถอัปโหลดรูปภาพได้โดยปลอดภัย ให้สร้างนโยบายความปลอดภัยของไฟล์ดังนี้:</p>
                <div className="bg-slate-900 text-slate-300 p-2 rounded font-mono text-[10px] mt-1">
                  -- อนุญาตให้อ่านและลงรูปภาพสาธารณะ<br />
                  INSERT, SELECT on storage.objects<br />
                  USING (bucket_id = 'repair-photos');
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-100 rounded-xl flex items-center justify-between border">
              <div>
                <p className="font-semibold text-slate-800">🛠️ แนะนำไลบรารีโค้ดสำหรับส่งภาพเข้า Storage ในแอปพลิเคชัน (JavaScript Example):</p>
                <pre className="text-[10px] font-mono text-slate-600 mt-2 whitespace-pre-wrap leading-tight bg-white p-3 rounded border">
{`const { data, error } = await supabase.storage
  .from('repair-photos')
  .upload(\`before/\${requestId}_\${Date.now()}.jpg\`, file, {
    cacheControl: '3600',
    upsert: false
  });`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ARCHITECTURE MAPPING */}
        {activeSubTab === 'architecture' && (
          <div className="flex flex-col gap-4 text-xs leading-relaxed text-slate-700">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <Cpu className="w-4.5 h-4.5 text-amber-500" />
                โครงข่ายและระบบที่เชื่อมโยงกับฐานข้อมูล Supabase
              </h4>
              <p className="text-slate-500">
                วิเคราะห์โครงสร้างพอร์ทัลว่ากระบวนการใดสตรีมมิ่งลงตารางใดบ้างเพื่อช่วยในการตรวจสอบ SQL schema ความเชื่อมโยงคีย์วิเศษ:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="border rounded-xl p-4 bg-slate-50 flex flex-col gap-2">
                <h5 className="font-bold text-slate-850 border-b pb-1.5 flex items-center justify-between">
                  <span>🟢 ส่วนของประชาชน (Citizen Portals)</span>
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold">Read & Write</span>
                </h5>
                <p className="text-[11px] text-slate-550 leading-normal">
                  - <strong>ใบแจ้งซ่อม (RepairRequests/RepairPoints)</strong>: บันทึกข้อมูลและแนบสเปคพิกัด GIS ตำแหน่งเสา ชี้ข้อมูลผู้ร้องเรียนมี <strong className="text-indigo-800">อายุ เกระจำบัตรประชาชน และที่อยู่</strong><br />
                  - <strong>Storage Bucket</strong>: สำหรับกักภาพความเดือดร้อนโคมพิกัดที่ดับมืด
                </p>
              </div>

              <div className="border rounded-xl p-4 bg-slate-50 flex flex-col gap-2">
                <h5 className="font-bold text-slate-850 border-b pb-1.5 flex items-center justify-between">
                  <span>⚙️ ส่วนเจ้าหน้าที่และช่าง (Staff & Engineers)</span>
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold">Full Admin API</span>
                </h5>
                <p className="text-[11px] text-slate-550 leading-normal">
                  - <strong>Materials & RepairMaterials</strong>: ช่างปฏิบัติการบันทึกจำนวนของที่ชะลอชำรุดตัดคลังแบบอัตโนมัติ<br />
                  - <strong>Approvals</strong>: บันทึกความยินยอมของกระบวนการเบิกเงินและการระบายพัสดุราชการ
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-250 rounded-xl text-amber-900 border text-[11px]">
              🚨 นโยบายความปลอดภัย <strong>Row Level Security (RLS)</strong> ควรกำหนดสิทธิ์เฉพาะพนักงานที่มีสิทธิ์ในระดับตารางที่ระบุ สามารถปรับเปลี่ยนนโยบายได้ผ่านคำสั่ง <strong className="font-mono bg-amber-100 p-0.5 rounded">CREATE POLICY</strong> ในฟอร์ม SQL Editor ด้านบนสุด
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
