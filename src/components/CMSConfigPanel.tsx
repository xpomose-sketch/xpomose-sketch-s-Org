/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SystemSettings, AppUser } from '../types';
import { Settings, RefreshCw, Palette, Save, Code, Database, Globe, PhoneCall } from 'lucide-react';
import { SUPABASE_SQL_MIGRATIONS } from '../data';

interface CMSConfigPanelProps {
  settings: SystemSettings;
  onSettingsChange: (settings: SystemSettings) => void;
  users: AppUser[];
  onUsersChange: (users: AppUser[]) => void;
}

export const CMSConfigPanel: React.FC<CMSConfigPanelProps> = ({
  settings,
  onSettingsChange,
  users,
  onUsersChange,
}) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'theme' | 'sql'>('branding');
  const [formState, setFormState] = useState<SystemSettings>({ ...settings });
  const [sqlCopied, setSqlCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSettingsChange(formState);
    alert('บันทึกการตั้งค่า CMS สำเร็จ ข้อมูลได้รับการอัปเดตทั้งระบบแบบ Real-time เรียบร้อยแล้ว!');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATIONS);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  const handleThemeSelect = (color: SystemSettings['themeColor']) => {
    const updated = { ...formState, themeColor: color };
    setFormState(updated);
    onSettingsChange(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      
      {/* Navigation tabs */}
      <div className="w-full md:w-56 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-1.5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2.5 mb-2">CMS แผงบริหารระบบ</h4>
        
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === 'branding' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-100'}`}
        >
          <Settings className="w-4.5 h-4.5" />
          ตั้งค่าข้อมูลหน่วยงาน
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === 'theme' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-100'}`}
        >
          <Palette className="w-4.5 h-4.5" />
          การแสดงผลและธีมสี
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === 'sql' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-100'}`}
        >
          <Code className="w-4.5 h-4.5" />
          โครงสร้าง Supabase SQL
        </button>

        <div className="mt-auto border-t pt-4 px-2.5 text-xs text-slate-400">
          <p>เวอร์ชันควบคุม: v1.2.0</p>
          <p className="mt-1">สิทธิ์เข้าถึง: ผู้ดูแลระบบสูงสุด</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        
        {/* TAB 1: BRANDING AND AGENCY SETTINGS */}
        {activeTab === 'branding' && (
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">ตั้งค่าข้อมูลหน่วยงาน (Branding & CMS)</h3>
              <p className="text-xs text-slate-500 mt-0.5">การปรับเปลี่ยนข้อความและตัวตนที่แสดงบนรายงาน PDF และหน้าส่วนผู้ใช้อื่นๆ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ชื่อหน่วยงานภาครัฐ (เต็ม)</label>
                <input
                  type="text"
                  name="agencyName"
                  value={formState.agencyName}
                  onChange={handleInputChange}
                  required
                  id="cms-agency-name"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">รนเนอร์รูปแบบเลขที่เอกสาร</label>
                <input
                  type="text"
                  name="ticketFormat"
                  value={formState.ticketFormat}
                  onChange={handleInputChange}
                  required
                  id="cms-ticket-format"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400"
                  placeholder="เช่น RM-{year}-{running}"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">โครงสร้า่งอัตโนมัติ: RM-2026-0001</span>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">ที่อยู่อย่างเป็นทางการ</label>
                <textarea
                  name="address"
                  value={formState.address}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  id="cms-address"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                <div className="relative">
                  <input
                    type="text"
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    id="cms-phone"
                    className="w-full text-xs pl-8 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">เว็บไซต์หลักหน่วยงาน</label>
                <div className="relative">
                  <input
                    type="text"
                    name="website"
                    value={formState.website}
                    onChange={handleInputChange}
                    id="cms-website"
                    className="w-full text-xs pl-8 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="border-t pt-4 col-span-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">ผู้บริหารผู้อนุมัติโครงการหลัก</h4>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ชื่อ-สกุล ผู้อนุมัติ</label>
                <input
                  type="text"
                  name="directorName"
                  value={formState.directorName}
                  onChange={handleInputChange}
                  required
                  id="cms-director-name"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ตำแหน่งราชการกระทรวง</label>
                <input
                  type="text"
                  name="directorTitle"
                  value={formState.directorTitle}
                  onChange={handleInputChange}
                  required
                  id="cms-director-title"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              id="cms-btn-save"
              className="mt-4 flex items-center justify-center gap-2 px-5 py-2 w-max text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs transition-colors self-end"
            >
              <Save className="w-4 h-4" />
              บันทึกการตั้งค่า CMS ทั้งหมด
            </button>
          </form>
        )}

        {/* TAB 2: SYSTEM THEME */}
        {activeTab === 'theme' && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">สำนักแสดงผลและชุดแผงควบคุมหลัก (UI Themes)</h3>
              <p className="text-xs text-slate-500 mt-0.5">เลือกธีมสีประจำราชการของสำนักงานเพื่อเปลี่ยนกลิ่นอาย และโครงสร้าง Layout และแบบฟอร์มภายนอก</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Royal Navy */}
              <div
                onClick={() => handleThemeSelect('royal')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${formState.themeColor === 'royal' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-350 bg-white'}`}
              >
                <div className="w-full h-8 rounded-md bg-blue-700 flex items-center justify-center text-white text-[10px] font-bold">Royal Navy</div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">สีน้ำเงินจักรพรรดิ</p>
                  <p className="text-[10px] text-slate-400">โทนข้าราชการ กรมอุตุนิยมวิทยา</p>
                </div>
              </div>

              {/* Royal Gold */}
              <div
                onClick={() => handleThemeSelect('gold')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${formState.themeColor === 'gold' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 hover:border-slate-350 bg-white'}`}
              >
                <div className="w-full h-8 rounded-md bg-amber-600 flex items-center justify-center text-white text-[10px] font-bold">Royal Gold</div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">สีทองราชสโมสร</p>
                  <p className="text-[10px] text-slate-400">โทนทรงคุณค่า กระทรวงวัฒนธรรม</p>
                </div>
              </div>

              {/* Emerald Green */}
              <div
                onClick={() => handleThemeSelect('emerald')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${formState.themeColor === 'emerald' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-350 bg-white'}`}
              >
                <div className="w-full h-8 rounded-md bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">Emerald Green</div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">สีเขียวมรกตชลนารี</p>
                  <p className="text-[10px] text-slate-400">โทนเป็นมิตร อบต. และกรมป่าไม้</p>
                </div>
              </div>

              {/* Crimson Rose */}
              <div
                onClick={() => handleThemeSelect('crimson')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${formState.themeColor === 'crimson' ? 'border-rose-600 bg-rose-50/50' : 'border-slate-200 hover:border-slate-350 bg-white'}`}
              >
                <div className="w-full h-8 rounded-md bg-rose-700 flex items-center justify-center text-white text-[10px] font-bold">Crimson Rose</div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">สีแดงชาดบริรักษ์</p>
                  <p className="text-[10px] text-slate-400">แดงตื่นตัว โครงสร้างฉุกเฉิน</p>
                </div>
              </div>

              {/* Slate Gray */}
              <div
                onClick={() => handleThemeSelect('slate')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${formState.themeColor === 'slate' ? 'border-slate-700 bg-slate-100' : 'border-slate-200 hover:border-slate-350 bg-white'}`}
              >
                <div className="w-full h-8 rounded-md bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold font-mono">Slate Gray</div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">สีเทาหินน่านทราย</p>
                  <p className="text-[10px] text-slate-400">โทนโมเดิร์น สไตล์เทศบาลยุคใหม่</p>
                </div>
              </div>

            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 mt-4 leading-relaxed">
              <strong className="text-slate-800 block mb-1">💡 ข้อมูลแนะเคล็ดไม่ลับ:</strong>
              การเลือกธีมสีจะประยุคใช้ค่าตัวแปร CSS กับปุ่มกด เส้นขอบ และโครงแวดล้อมทั้งหมดแบบไดนามิกทันที 
              เพื่อให้สอดคล้องกับตราสิมลักษณ์องค์กรของท่านอย่างดีที่สุด
            </div>
          </div>
        )}

        {/* TAB 3: BACKEND SCHEMA DATABASE */}
        {activeTab === 'sql' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <Database className="w-4.5 h-4.5 text-indigo-600" />
                  ชุดโครงสร้าง Supabase SQL Migration
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">สคริปต์สกีมาสำหรับสร้างตาราง, Foreign Key, RLS Rules และ Trigger หักพัสดุอัติโนมัติ</p>
              </div>

              <button
                onClick={handleCopySql}
                id="btn-copy-sql"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${sqlCopied ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${sqlCopied ? '' : 'animate-spin'}`} />
                {sqlCopied ? 'คัดลอกลงคลิปบอร์ดแล้ว!' : 'คัดลอก SQL Code'}
              </button>
            </div>

            {/* Code Field */}
            <div className="relative">
              <pre className="p-4 bg-slate-900 text-slate-250 text-[10px] rounded-lg overflow-x-auto font-mono max-h-72 border border-slate-850 h-50 block shadow-inner">
                <code>{SUPABASE_SQL_MIGRATIONS}</code>
              </pre>
              <div className="absolute bottom-2 right-2 bg-indigo-900 text-white text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider opacity-85 select-none font-mono">
                PostgreSQL
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs">
                <span className="block text-[10px] text-slate-400 font-bold block">ตารางความสัมพัทธ์</span>
                <span className="font-bold text-slate-800">8 ตารางหลัก</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs">
                <span className="block text-[10px] text-slate-400 font-bold block">Row Level Security</span>
                <span className="font-bold text-slate-800">สิทธิ์ตรงตามบทบาท</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs">
                <span className="block text-[10px] text-slate-400 font-bold block">ตัดยอดพัสดุอัติโนมัติ</span>
                <span className="font-bold text-emerald-700">Trigger/Function เสร็จสิ้น</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs">
                <span className="block text-[10px] text-slate-400 font-bold block">ข้ามแพลตฟอร์ม</span>
                <span className="font-bold text-blue-700">รองรับ Flutter/NextJS</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
