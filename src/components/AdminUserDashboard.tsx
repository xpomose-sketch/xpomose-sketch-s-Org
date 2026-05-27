/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppUser } from '../types';
import { Shield, UserPlus, Trash2, Mail, Lock, CheckCircle } from 'lucide-react';

interface AdminUserDashboardProps {
  users: AppUser[];
  onAddUser: (user: Omit<AppUser, 'id'>) => void;
  onDeleteUser: (id: string) => void;
}

export const AdminUserDashboard: React.FC<AdminUserDashboardProps> = ({
  users,
  onAddUser,
  onDeleteUser,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AppUser['role']>('citizen');
  const [phone, setPhone] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('กรุณากรอกชื่อและอีเมลผู้สมัครใช้งาน!');
      return;
    }

    onAddUser({ name, email, role, phone });
    setName('');
    setEmail('');
    setPhone('');
    alert('🎉 ลงทะเบียนและกำหนดสิทธิ์ผู้ใช้งานหลวงเสร็จสมบูรณ์!');
  };

  const getRoleBadgeColorClass = (userRole: string) => {
    switch (userRole) {
      case 'admin': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'director': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'officer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mechanic': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'materials': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-205';
    }
  };

  const getRoleThai = (userRole: string) => {
    switch (userRole) {
      case 'admin': return 'ระบบแอดมินสูงสุด';
      case 'director': return 'ผู้อำนวยการ (นายก อบต.)';
      case 'officer': return 'เจ้าหน้าที่รับเรื่องตรวจสอบ';
      case 'mechanic': return 'ช่างไฟด่วนเทศบาล';
      case 'materials': return 'เจ้าพนักงานกองคลังพัสดุ';
      default: return 'ประชาชนทั่วไป';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Users table list (8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-xl shadow-md border border-slate-200 p-4 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm sm:text-base">
            <Shield className="w-5 h-5 text-indigo-500" />
            การควบคุมสิทธิ์และบทบาทราชการ ({users.length} บัญชี)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">รวมบัญชีเจ้าหน้าที่ผู้ใช้งานระบบบูรณะการ Smart Repair</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-r border-b border-t border-slate-205">
                <th className="py-2.5 px-2 text-slate-600">ชื่อผู้ใช้งาน</th>
                <th className="py-2.5 px-2 text-slate-600">อีเมลลงทะเบียน</th>
                <th className="py-2.5 px-2 text-slate-600">สิทธิ์ปฏิบัติราชการ</th>
                <th className="py-2.5 px-2 text-slate-600">เบอร์ติดต่อ</th>
                <th className="py-2.5 px-2 text-center text-slate-605"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-slate-50/50">
                  <td className="py-2 px-2 font-bold text-slate-850">{u.name}</td>
                  <td className="py-2 px-2 text-slate-500 font-mono">{u.email}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeColorClass(u.role)}`}>
                      {getRoleThai(u.role)}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-slate-550 font-mono">{u.phone || '-'}</td>
                  <td className="py-2 px-2 text-center">
                    {u.id === 'u-admin' ? (
                      <span className="text-[10px] text-slate-400 italic">ห้ามลบเด็ดขาด</span>
                    ) : (
                      <button
                        onClick={() => {
                          if (window.confirm('⚠️ ยืนยันลบสิทธิ์ผู้ใช้งานท่านนี้ออกจากระบบหรือไม่?')) onDeleteUser(u.id);
                        }}
                        className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register user form (4 cols) */}
      <div className="lg:col-span-4 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1">
            <UserPlus className="w-4 h-4 text-indigo-600" />
            ลงทะเบียนสิทธิ์เพิ่มทีมงาน
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">ระบุบัญชีและจัดตั้งสิทธิ์ความคุมระบบ</p>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5 text-xs">
          <div>
            <label className="text-[10px] font-semibold text-slate-650 block mb-1">ชื่อ-สกุล ข้าราชการ</label>
            <input
              type="text"
              placeholder="เช่น นายอภิเดช เกื้อกูล"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              id="admin-form-name"
              className="w-full px-3 py-1.5 border rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-650 block mb-1">อีเมลทางการ (Email)</label>
            <div className="relative">
              <input
                type="email"
                placeholder="office@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="admin-form-email"
                className="w-full pl-8 pr-3 py-1.5 border rounded-lg bg-white font-mono"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-650 block mb-1">เบอร์ติดต่อ</label>
            <input
              type="text"
              placeholder="0810010002"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              id="admin-form-phone"
              className="w-full px-3 py-1.5 border rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-650 block mb-1">สิทธิ์เข้าใช้งานบทบาท</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AppUser['role'])}
              id="admin-form-role"
              className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
            >
              <option value="citizen">ประชาชนทั่วไป</option>
              <option value="officer">เจ้าหน้าที่รับเรื่องตรวจสอบ</option>
              <option value="director">ผู้อำนวยการอนุมัติ (นายก อบต.)</option>
              <option value="mechanic">ช่างไฟด่วนพิกัดสนาม</option>
              <option value="materials">เจ้าหน้าที่กองคลังพัสดุ</option>
              <option value="admin">แอดมินจัดการหลังบ้าน</option>
            </select>
          </div>

          <button
            type="submit"
            id="btn-admin-add-user"
            className="mt-2 w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-750 transition-colors h-10"
          >
            สร้างบัญชีสิทธิ์ปฏิบัติงาน
          </button>
        </form>
      </div>

    </div>
  );
};
