/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  RepairRequest, 
  RepairPoint, 
  Material, 
  MaterialTransaction, 
  SystemSettings, 
  AppUser, 
  RequestStatus, 
  RepairMaterial 
} from './types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_USERS, 
  INITIAL_MATERIALS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_REPAIR_REQUESTS 
} from './data';
import { A4Document } from './components/A4Document';
import { InteractiveMap } from './components/InteractiveMap';
import { CMSConfigPanel } from './components/CMSConfigPanel';
import { CitizenDashboard } from './components/CitizenDashboard';
import { OfficerDashboard } from './components/OfficerDashboard';
import { DirectorDashboard } from './components/DirectorDashboard';
import { MechanicDashboard } from './components/MechanicDashboard';
import { MaterialsDashboard } from './components/MaterialsDashboard';
import { AdminUserDashboard } from './components/AdminUserDashboard';
import { SupabaseConnectionPanel } from './components/SupabaseConnectionPanel';

import { 
  LayoutDashboard, 
  Map, 
  Users, 
  Wrench, 
  Package, 
  ClipboardCheck, 
  Sliders, 
  UserCircle, 
  Bell, 
  CheckCircle, 
  TrendingUp, 
  ShoppingBag, 
  Clock,
  ShieldCheck,
  AlertTriangle,
  Database
} from 'lucide-react';

export default function App() {
  // Global Database State Simulator
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [transactions, setTransactions] = useState<MaterialTransaction[]>(INITIAL_TRANSACTIONS);
  const [requests, setRequests] = useState<RepairRequest[]>(INITIAL_REPAIR_REQUESTS);
  const [showSupabasePanel, setShowSupabasePanel] = useState(false);

  // Active Tester Role simulation
  const [activeRole, setActiveRole] = useState<AppUser['role']>('admin');
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  
  // Navigation tabs state
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'map' | 'citizen' | 'officer' | 'director' | 'mechanic' | 'materials' | 'admin_users' | 'cms'>('dashboard');

  // Interactive selected items
  const [selectedPointId, setSelectedPointId] = useState<string | undefined>(undefined);
  const [pickedLat, setPickedLat] = useState<number | undefined>(undefined);
  const [pickedLng, setPickedLng] = useState<number | undefined>(undefined);
  const [mapPickMode, setMapPickMode] = useState<boolean>(false);

  // Print Preview document control states
  const [previewDoc, setPreviewDoc] = useState<{ request: RepairRequest; type: 'request' | 'approval' | 'requisition' | 'summary' } | null>(null);

  // Live Firebase/Push notification log accumulator
  const [notifications, setNotifications] = useState<{ id: string; msg: string; date: string }[]>([
    { id: "msg-120", msg: "🚨 บันทึกเสาไฟเอียง DK-0145 โดยประชาชน พิกัด อบต.", date: "2026-05-26 19:40:00" },
    { id: "msg-121", msg: "📢 ส่งสัญญาลานพัสดุหักตัดยอดใบแจ้งเลขที่ RM-2026-0001 สำเร็จ", date: "2026-05-27 07:15:00" },
  ]);

  const pushNotification = (msg: string) => {
    setNotifications(prev => [
      { id: Date.now().toString(), msg, date: new Date().toLocaleTimeString('th-TH') },
      ...prev
    ].slice(0, 5)); // Keep only latest 5 logs
  };

  const getThemeBgColor = () => {
    switch (settings.themeColor) {
      case 'gold': return 'from-amber-600 to-amber-800';
      case 'emerald': return 'from-emerald-600 to-emerald-800';
      case 'crimson': return 'from-rose-600 to-rose-800';
      case 'slate': return 'from-slate-600 to-slate-800';
      default: return 'from-indigo-600 to-blue-800'; // royal
    }
  };

  const getThemeAccentBorder = () => {
    switch (settings.themeColor) {
      case 'gold': return 'border-amber-600';
      case 'emerald': return 'border-emerald-600';
      case 'crimson': return 'border-rose-600';
      case 'slate': return 'border-slate-600';
      default: return 'border-indigo-600';
    }
  };

  const getThemeTextColor = () => {
    switch (settings.themeColor) {
      case 'gold': return 'text-amber-800';
      case 'emerald': return 'text-emerald-800';
      case 'crimson': return 'text-rose-800';
      case 'slate': return 'text-slate-800';
      default: return 'text-blue-900';
    }
  };

  // Status mapping colors
  const statusColors: Record<RequestStatus, string> = {
    'รอรับเรื่อง': '#EF4444',     // Red
    'รอตรวจสอบ': '#3B82F6',    // Blue
    'รออนุมัติ': '#6366F1',     // Indigo/Purple 
    'รอดำเนินการ': '#8B5CF6',   // Violet
    'กำลังซ่อม': '#F59E0B',     // Yellow/Amber
    'ซ่อมสำเร็จ': '#10B981',    // Emerald/Green
    'ยกเลิก': '#64748B',       // Slate/Gray
  };

  // Unified status color selector
  const getStatusThaiBadge = (status: RequestStatus) => {
    const col = statusColors[status];
    return (
      <span 
        style={{ color: col, backgroundColor: `${col}10`, borderColor: `${col}40` }} 
        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
      >
        {status}
      </span>
    );
  };

  // 1. Create a Repair Request from Citizen Form
  const handleCreateRequest = (newReq: Omit<RepairRequest, 'id' | 'ticketNumber' | 'createdAt' | 'status' | 'materialsUsed' | 'history'>) => {
    const runningId = (requests.length + 1).toString().padStart(4, '0');
    const computedTicketNo = settings.ticketFormat
      .replace('{year}', '2026')
      .replace('{running}', runningId);

    const fullRequestObj: RepairRequest = {
      ...newReq,
      id: `req-${Date.now()}`,
      ticketNumber: computedTicketNo,
      createdAt: new Date().toISOString(),
      status: 'รอรับเรื่อง',
      materialsUsed: [],
      history: [
        {
          id: `h-100-${Date.now()}`,
          date: new Date().toISOString(),
          status: 'รอรับเรื่อง',
          notes: 'คำร้องถูกบันทึกสำเร็จทางโทรศัพท์มือถือราษฎร์',
          operator: newReq.reporterName,
        }
      ]
    };

    setRequests(prev => [fullRequestObj, ...prev]);
    pushNotification(`🔔 พุชแจ้งเตือนข้าราชการ: ใบคำชำรุดเลขที่ ${computedTicketNo} เข้าสู่ระบบตรวจสอบแล้ว!`);
  };

  // 2. Update Request Status with logs creation
  const handleUpdateStatus = (id: string, nextStatus: RequestStatus, notes: string, operator: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: nextStatus,
          history: [
            ...req.history,
            {
              id: `h-${Date.now()}`,
              date: new Date().toISOString(),
              status: nextStatus,
              notes,
              operator,
            }
          ]
        };
      }
      return req;
    }));

    const ticketNo = requests.find(r => r.id === id)?.ticketNumber || '';
    pushNotification(`🔔 มีการเคลื่อนไหวใบงาน ${ticketNo} เปลี่ยนสถานะเป็น -> [${nextStatus}]`);
  };

  // 3. Complete repair materials requisition (Deduct from warehouse balance!)
  const handleUpdateMaterialsUsed = (id: string, materialsUsedList: RepairMaterial[]) => {
    // Deduct stock balance for used item
    setMaterials(prev => prev.map(m => {
      const matchInUse = materialsUsedList.find(um => um.materialId === m.id);
      if (matchInUse) {
        return {
          ...m,
          balance: Math.max(0, m.balance - matchInUse.quantity)
        };
      }
      return m;
    }));

    // Save logs transaction
    materialsUsedList.forEach(item => {
      const txObj: MaterialTransaction = {
        id: `tx-${Date.now()}-${item.materialId}`,
        materialId: item.materialId,
        materialName: item.name,
        type: 'เบิกออก',
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        date: new Date().toISOString(),
        note: `ตัดจ่ายพัสดุสำหรับปฏิบัติภารกิจ งานใบแจ้งซ่อมเลขที่ ${requests.find(r => r.id === id)?.ticketNumber || ''}`,
        operator: 'ช่างบำรุง กองช่าง'
      };
      setTransactions(prev => [txObj, ...prev]);
    });

    // Register inside requests order DB
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          materialsUsed: materialsUsedList,
        };
      }
      return req;
    }));
  };

  // 4. Warehouse transaction manager (Add/Adjust Manual)
  const handleAddMaterialTransaction = (tx: Omit<MaterialTransaction, 'id' | 'date'>) => {
    const fullTx: MaterialTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
    };

    setMaterials(prev => prev.map(m => {
      if (m.id === tx.materialId) {
        let nextBalance = m.balance;
        if (tx.type === 'รับเข้า') nextBalance += tx.quantity;
        if (tx.type === 'เบิกออก') nextBalance = Math.max(0, m.balance - tx.quantity);
        if (tx.type === 'ปรับยอด') nextBalance = tx.quantity;

        return { ...m, balance: nextBalance };
      }
      return m;
    }));

    setTransactions(prev => [fullTx, ...prev]);
    pushNotification(`🔔 พัสดุถูกเคลื่อนไหว: [${tx.type}] ${tx.materialName} จำนวน ${tx.quantity} หน่วยสำเร็จ`);
  };

  const handlePointSelect = (pt: RepairPoint) => {
    setSelectedPointId(pt.id);
    const linkedReq = requests.find(r => r.id === pt.requestId);
    if (linkedReq) {
      if (activeRole === 'officer') {
        setCurrentTab('officer');
      } else if (activeRole === 'mechanic') {
        setCurrentTab('mechanic');
      } else if (activeRole === 'director') {
        setCurrentTab('director');
      }
    }
  };

  const mapPoints = useMemo(() => {
    return requests.flatMap(req => req.points || []);
  }, [requests]);

  const handleCoordinatePick = (lat: number, lng: number) => {
    setPickedLat(lat);
    setPickedLng(lng);
    setMapPickMode(false);
    setCurrentTab('citizen');
    pushNotification(`📍 ปักเข็มจับพิกัดกึ่งกลางพิกัด GIS สำเร็จ: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  };

  const handleAddUser = (newUser: Omit<AppUser, 'id'>) => {
    const user: AppUser = {
      ...newUser,
      id: `u-${Date.now()}`
    };
    setUsers(prev => [...prev, user]);
    pushNotification(`👤 เพิ่มบัญชีผู้ใช้ใหม่: [${user.role}] ${user.name} เข้าระบบ`);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (userToDelete) {
      pushNotification(`👤 ลบบัญชีผู้ใช้: ${userToDelete.name} ออกจากระบบ`);
    }
  };

  // Dashboard calculations for widget
  const totalTickets = requests.length;
  const pendingIntake = requests.filter(r => r.status === 'รอรับเรื่อง').length;
  const pendingOfficerCheck = requests.filter(r => r.status === 'รอตรวจสอบ').length;
  const pendingDirectorApprove = requests.filter(r => r.status === 'รออนุมัติ').length;
  const pendingMechanics = requests.filter(r => r.status === 'รอดำเนินการ' || r.status === 'กำลังซ่อม').length;
  const totalRepairedSuccess = requests.filter(r => r.status === 'ซ่อมสำเร็จ').length;
  const totalCancelled = requests.filter(r => r.status === 'ยกเลิก').length;

  const lowStockMaterials = materials.filter(m => m.balance <= m.reorderPoint);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col text-slate-800 antialiased font-sans">
      
      {/* 1. Header with custom Governmental Branding - Geometric Balance Style */}
      <header className="bg-white text-[#0D1B2A] py-3.5 px-6 shadow-sm border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-50 border border-blue-100 rounded-lg">
            {/* Crown Garuda Emblems in header */}
            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 5 C45 15, 30 25, 10 32 C25 40, 40 45, 45 60 C38 65, 20 62, 5 57 C15 70, 32 75, 48 68 C49 75, 45 85, 50 95 C55 85, 51 75, 52 68 C68 75, 85 70, 95 57 C80 62, 62 65, 55 60 C60 45, 75 40, 90 32 C70 25, 55 15, 50 5 Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-[#0D1B2A] tracking-tight">ระบบบำรุงรักษาโคมไฟถนนราชการหลวง (GIS CMS)</h1>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              {settings.agencyName}
            </p>
          </div>
        </div>

        {/* 2. Interactive Role Swapper Simulator Panel / Live Administrator banner */}
        {isSimulationMode ? (
          <div className="bg-slate-100 border border-slate-200 p-1.5 rounded-xl flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto">
            <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap hidden lg:flex items-center gap-1 px-1">
              <UserCircle className="w-4 h-4 text-slate-605" />
              จำลองบทบาทสิทธิ์:
            </span>
            <div className="flex gap-1 items-center">
              {(['citizen', 'officer', 'director', 'mechanic', 'materials', 'admin'] as const).map((rl) => {
                const active = rl === activeRole;
                let label = '';
                if (rl === 'citizen') label = 'ประชาชน';
                if (rl === 'officer') label = 'รับเรื่อง';
                if (rl === 'director') label = 'ผู้บริหาร';
                if (rl === 'mechanic') label = 'ช่างไฟ';
                if (rl === 'materials') label = 'กองคลัง';
                if (rl === 'admin') label = 'คุมกอง';

                return (
                  <button
                    key={rl}
                    onClick={() => {
                      setActiveRole(rl);
                      // Match tab automatically
                      if (rl === 'citizen') setCurrentTab('citizen');
                      else if (rl === 'officer') setCurrentTab('officer');
                      else if (rl === 'director') setCurrentTab('director');
                      else if (rl === 'mechanic') setCurrentTab('mechanic');
                      else if (rl === 'materials') setCurrentTab('materials');
                      else if (rl === 'admin') setCurrentTab('cms');
                    }}
                    id={`btn-role-swap-${rl}`}
                    className={`text-[10px] sm:text-xs px-2.5 py-1.5 font-bold rounded-lg transition-all ${
                      active ? 'bg-[#1B263B] text-white shadow-sm font-extrabold' : 'hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setIsSimulationMode(false);
                  setActiveRole('admin');
                  setCurrentTab('dashboard');
                }}
                id="btn-exit-simulation-mode"
                className="text-[10px] bg-red-105 hover:bg-red-200 text-red-705 border border-red-200 px-2.5 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1 shrink-0 ml-1.5"
                title="ปิดโมดูสลับสิทธิ์การกรองพิกัด"
              >
                <AlertTriangle className="w-3 h-3 text-red-500" />
                ออกจากโหมดจำลอง
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-150 p-1.5 px-3 rounded-xl flex items-center justify-between gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-emerald-800 font-extrabold flex items-center gap-1">
                🔒 โหมดการทำงานทางการ (สิทธิ์แอดมินหลัก)
              </span>
            </div>
            <button
              onClick={() => setIsSimulationMode(true)}
              id="btn-enter-simulation-mode"
              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              🔌 เปิดใช้โหมดจำลองสิทธิ์
            </button>
          </div>
        )}
      </header>

      {/* Outer Layout Frame */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar (Geometric Balance Style: Deep Navy #1B263B) */}
        <aside className="w-full lg:w-64 bg-[#1B263B] text-slate-300 border-r border-[#1B263B] flex flex-col justify-between shrink-0">
          <div className="flex flex-col">
            
            {/* Sidebar Branding Header */}
            <div className="p-5 flex items-center gap-3 border-b border-slate-700/40">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">SmartLight CMS</span>
            </div>

            <div className="p-4 flex flex-col gap-1.5">
              
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 block">
                เมนูหลักและการสลับจอ
              </span>

              {/* Dashboard summary stats tab */}
              <button
                onClick={() => setCurrentTab('dashboard')}
                id="sidebar-tab-dashboard"
                className={`flex items-center gap-3 px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-md transition-all text-left ${currentTab === 'dashboard' ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-bold' : 'text-slate-300 hover:bg-slate-800/50'}`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                สรุปภาพรวมแผงควบคุม
              </button>

              {/* Geographic Maps tab */}
              <button
                onClick={() => setCurrentTab('map')}
                id="sidebar-tab-map"
                className={`flex items-center gap-3 px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-md transition-all text-left ${currentTab === 'map' ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-bold' : 'text-slate-300 hover:bg-slate-800/50'}`}
              >
                <Map className="w-4 h-4 shrink-0" />
                แผนที่สาธารณะ (GIS)
                <span className="ml-auto text-[10px] bg-red-650 text-white px-2 py-0.5 rounded font-bold">
                  {mapPoints.filter(p => p.issueType === 'ไฟไม่ติด').length}
                </span>
              </button>

              {/* Citizen tab */}
              <button
                onClick={() => setCurrentTab('citizen')}
                id="sidebar-tab-citizen"
                className={`flex items-center gap-3 px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-md transition-all text-left ${currentTab === 'citizen' ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-bold' : 'text-slate-300 hover:bg-slate-800/50'}`}
              >
                <Users className="w-4 h-4 shrink-0" />
                พอร์ทัลแจ้งเรื่องประชาชน
              </button>

              {/* Officer Complaints Check desk */}
              <button
                onClick={() => setCurrentTab('officer')}
                id="sidebar-tab-officer"
                className={`flex items-center gap-3 px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-md transition-all text-left ${currentTab === 'officer' ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-bold' : 'text-slate-300 hover:bg-slate-800/50'} ${activeRole !== 'officer' && activeRole !== 'admin' ? 'opacity-40' : ''}`}
              >
                <ClipboardCheck className="w-4 h-4 shrink-0 text-sky-400" />
                งานตรวจสอบคัดกรอง
                {pendingIntake > 0 && (
                  <span className="ml-auto text-[10px] bg-sky-550 text-white px-1.5 py-0.5 rounded font-bold">
                    {pendingIntake}
                  </span>
                )}
              </button>

              {/* Director approval desk */}
              <button
                onClick={() => setCurrentTab('director')}
                id="sidebar-tab-director"
                className={`flex items-center gap-3 px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-md transition-all text-left ${currentTab === 'director' ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-bold' : 'text-slate-300 hover:bg-slate-800/50'} ${activeRole !== 'director' && activeRole !== 'admin' ? 'opacity-40' : ''}`}
              >
                <Sliders className="w-4 h-4 shrink-0 text-amber-400" />
                เสนอนายก่อนุมัติซ่อม
                {pendingDirectorApprove > 0 && (
                  <span className="ml-auto text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                    {pendingDirectorApprove}
                  </span>
                )}
              </button>

              {/* Mechanic workbench */}
              <button
                onClick={() => setCurrentTab('mechanic')}
                id="sidebar-tab-mechanic"
                className={`flex items-center gap-3 px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-md transition-all text-left ${currentTab === 'mechanic' ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-bold' : 'text-slate-300 hover:bg-slate-800/50'} ${activeRole !== 'mechanic' && activeRole !== 'admin' ? 'opacity-40' : ''}`}
              >
                <Wrench className="w-4 h-4 shrink-0 text-purple-450" />
                ช่างบริการ ซ่อมไฟกระเช้า
                {pendingMechanics > 0 && (
                  <span className="ml-auto text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-bold">
                    {pendingMechanics}
                  </span>
                )}
              </button>

              {/* Warehouse stock desk */}
              <button
                onClick={() => setCurrentTab('materials')}
                id="sidebar-tab-materials"
                className={`flex items-center gap-3 px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-md transition-all text-left ${currentTab === 'materials' ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-bold' : 'text-slate-300 hover:bg-slate-800/50'} ${activeRole !== 'materials' && activeRole !== 'admin' ? 'opacity-40' : ''}`}
              >
                <Package className="w-4 h-4 shrink-0 text-rose-400" />
                คลังและวัสดุภาครัฐ
                {lowStockMaterials.length > 0 && (
                  <span className="ml-auto text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-extrabold animate-pulse">
                    ใกล้หมด!
                  </span>
                )}
              </button>

              {/* Space divider */}
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mt-4 mb-2 block">
                จัดระบบสูงสุด (System Admin)
              </span>

              {/* User roles configuration tab */}
              <button
                onClick={() => setCurrentTab('admin_users')}
                id="sidebar-tab-users"
                className={`flex items-center gap-3 px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-md transition-all text-left ${currentTab === 'admin_users' ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-bold' : 'text-slate-300 hover:bg-slate-800/50'} ${activeRole !== 'admin' ? 'opacity-35' : ''}`}
              >
                <Users className="w-4 h-4 shrink-0 text-teal-400" />
                จัดการผู้ใช้ & สิทธิ์
              </button>

              {/* CMS controls tab */}
              <button
                onClick={() => setCurrentTab('cms')}
                id="sidebar-tab-cms"
                className={`flex items-center gap-3 px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-md transition-all text-left ${currentTab === 'cms' ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-bold' : 'text-slate-300 hover:bg-slate-800/50'} ${activeRole !== 'admin' ? 'opacity-35' : ''}`}
              >
                <Sliders className="w-4 h-4 shrink-0 text-fuchsia-400" />
                ตั้งค่า CMS & Supabase SQL
              </button>

            </div>
          </div>

          <div className="flex flex-col">
            {/* User Profile Block */}
            <div className="p-4 bg-slate-900/40 border-t border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-750 flex items-center justify-center text-[10px] font-bold text-white border border-slate-600">
                  อบต
                </div>
                <div className="flex flex-col overflow-hidden text-left">
                  <span className="text-xs font-semibold text-white truncate">วิศวกรควบคุมระบบ</span>
                  <span className="text-[9.5px] text-slate-450 truncate">admin@muni.go.th</span>
                </div>
              </div>
            </div>

            {/* 3. Simulated Mobile Firebase Push Notifications Logs Overlay Footer */}
            {isSimulationMode && (
              <div className="p-4 bg-slate-950 border-t border-slate-850">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-yellow-500 animate-swing animate-pulse" />
                  ประวัติพุชเรียลไทม์ (Firebase)
                </span>
                <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-1 px-2.5 bg-slate-900 border border-slate-800 rounded text-[9.5px] leading-relaxed text-slate-300">
                      <p className="line-clamp-2">{notif.msg}</p>
                      <span className="text-[8px] text-slate-500 block mt-0.5">{notif.date} น.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Core Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* A. VIEW 1: SUMMARY ANALYTICS SUMMARY DASHBOARD */}
          {currentTab === 'dashboard' && (
            <div className="flex flex-col gap-6">

              {/* Supabase Cloud Connection Status Banner */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 md:p-5 border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <Database className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-300">ตัวชี้วัดความเข้ากันได้</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 mr-1 bg-emerald-400 rounded-full animate-ping"></span>
                        เชื่อมต่อสำเร็จ (Supabase Active)
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 mt-1">ระบบคลาวด์ Sandbox และหน่วยจัดเก็บรูปภาพ Storage</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ขับเคลื่อนด้วย PostgreSQL และ Supabase Storage (รูปภาพใบแจ้งซ่อมรองรับฟิลด์บันทึกผู้แจ้งซ่อมมี: อายุ, ที่อยู่, เลขประจำตัวประชาชน 13 หลัก)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                  <button
                    onClick={() => setShowSupabasePanel(!showSupabasePanel)}
                    id="btn-toggle-supabase-panel"
                    className={`w-full md:w-auto px-4 py-2 text-xs font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                      showSupabasePanel 
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-755 border border-slate-700' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    {showSupabasePanel ? 'ซ่อนการตั้งค่าตาราง SQL' : 'แสดงการเชื่อมโยง & คำสั่ง SQL เพื่อรัน SQL Editor'}
                  </button>
                </div>
              </div>

              {/* Collapsible Supabase Connection & SQL diagnostics panel */}
              {showSupabasePanel && (
                <div className="animate-fade-in duration-300">
                  <SupabaseConnectionPanel 
                    onClose={() => setShowSupabasePanel(false)}
                    requestsCount={requests.length}
                    usersCount={users.length}
                    materialsCount={materials.length}
                  />
                </div>
              )}
              
              {/* Main metrics statistics top grid board */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">ใบแจ้งซ่อมทั้งหมดในระบบ</p>
                  <p className="text-3xl font-extrabold text-slate-800 mt-1 font-mono">{totalTickets}</p>
                  <p className="text-[10px] text-slate-500 mt-1.5">บันทึกสดผ่าน Postgres API</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl shadow-xs border border-amber-200 text-center">
                  <p className="text-[10px] uppercase font-bold text-amber-700">กำลังบำรุงรักษาซ่อมแซม</p>
                  <p className="text-3xl font-extrabold text-amber-800 mt-1 font-mono">{pendingMechanics}</p>
                  <p className="text-[10px] text-amber-600 mt-1.5">ช่างไฟสนามอยู่ระหว่างตรวจสอบ</p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl shadow-xs border border-emerald-250 text-center">
                  <p className="text-[10px] uppercase font-bold text-emerald-700">ภารกิจซ่อมเสร็จสิ้น</p>
                  <p className="text-3xl font-extrabold text-emerald-800 mt-1 font-mono">{totalRepairedSuccess}</p>
                  <p className="text-[10px] text-emerald-600 mt-1.5">เปิดส่องสว่างปกติแล้วค่ำคืน</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-xl shadow-xs border border-slate-205 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">พัสดุไฟฟ้าต่ำกว่าเซฟตี้</p>
                  <p className="text-3xl font-extrabold text-rose-700 mt-1 font-mono">{lowStockMaterials.length}</p>
                  <p className="text-[10px] text-rose-500 mt-1.5 font-bold animate-pulse">จำเป็นต้องทำเรื่องสั่งซื้อเพิ่ม!</p>
                </div>
              </div>

              {/* Warnings and Prompts */}
              {lowStockMaterials.length > 0 && (
                <div className="p-3.5 bg-rose-50 border border-rose-250 rounded-xl text-xs text-rose-850 flex items-center justify-between flex-col md:flex-row gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
                    <div>
                      <p className="font-extrabold">🚨 มีรายการพัสดุในคลังพัสดุหลักใกล้จะสิ้นสภาพ (ต่ำกว่า Reorder Limit):</p>
                      <p className="text-rose-650 text-[11px] mt-0.5">
                        {lowStockMaterials.map(m => `• ${m.name} เหลือเพียง ${m.balance} ${m.unit}`).join(' ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setCurrentTab('materials'); setActiveRole('admin'); }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[10px] whitespace-nowrap self-end"
                  >
                    ไปตรวจสอบหน้าระบุพัสดุ
                  </button>
                </div>
              )}

              {/* GIS Dashboard map module display */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">แผนผังระบบตรวจการณ์ แผนที่ GIS ดอนแก้ว</h3>
                    <p className="text-xs text-slate-500 mt-0.5">จำลองการปักหมุดเสาไฟฟ้าและระบุสีความเร่งด่วนตามพิกัดดาวเทียม</p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('map')}
                    className="text-xs text-indigo-650 hover:underline font-bold"
                  >
                    ขยายเพื่อดูแผนที่บานใหญ่ &rarr;
                  </button>
                </div>

                <div className="h-[280px] overflow-hidden rounded-xl border">
                  <InteractiveMap
                    points={mapPoints}
                    selectedPointId={selectedPointId}
                    onPointSelect={handlePointSelect}
                    statusColors={statusColors}
                  />
                </div>
              </div>

              {/* Repair orders listing bottom grid boards */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-slate-800">ฐานข้อมูลใบแจ้งคำขอซ่อมบำรุง ลำดับล่าสุด</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">รวมเรื่องร้องเรียนที่ได้รับมอบหมายเข้าระบบกลาง</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-t border-b border-slate-205">
                        <th className="py-2.5 px-2 text-slate-650">เลขที่ใบแจ้งซ่อม</th>
                        <th className="py-2.5 px-2 text-slate-650">วันที่บันทึกซอฟต์</th>
                        <th className="py-2.5 px-2 text-slate-650">ชื่อประชาชนผู้แจ้งความปัง</th>
                        <th className="py-2.5 px-2 text-slate-650">ยอดจุดเสียหาย</th>
                        <th className="py-2.5 px-2 text-slate-650">ลักษณะเด่น</th>
                        <th className="py-2.5 px-2 text-slate-650 text-center">สถานะปัจจุบัน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr key={req.id} className="border-b hover:bg-slate-50/50">
                          <td className="py-2.5 px-2 font-mono font-bold text-slate-700">{req.ticketNumber}</td>
                          <td className="py-2.5 px-2 text-slate-500">{new Date(req.createdAt).toLocaleDateString('th-TH')}</td>
                          <td className="py-2.5 px-2 font-bold text-slate-800">{req.reporterName}</td>
                          <td className="py-2.5 px-2 text-center font-bold text-indigo-600">{req.points.length} จุด</td>
                          <td className="py-2.5 px-2 text-slate-600 truncate max-w-[200px]">{req.details || 'ไม่มีรายละเอียดเสริม'}</td>
                          <td className="py-2.5 px-2 text-center">
                            {getStatusThaiBadge(req.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* B. VIEW 2: COMPLETE EMBEDDED GEOGRAPHIC INTERACTIVE MAP */}
          {currentTab === 'map' && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">ระบบสำรวจพิกัดเสาไฟ OpenStreetMap GIS</h3>
                <p className="text-xs text-slate-500 mt-0.5">สลับระหว่างมุมมองถนนเพื่อหาพิกัด สั่งจัดเส้นทาง หรือปักจุดเสาโคมด่วน</p>
              </div>

              <InteractiveMap
                points={mapPoints}
                selectedPointId={selectedPointId}
                onPointSelect={handlePointSelect}
                onCoordinatesPick={handleCoordinatePick}
                statusColors={statusColors}
                isInteractiveDrawing={mapPickMode}
              />
            </div>
          )}

          {/* C. VIEW 3: CITIZEN WORKSPACE DESK PORTAL */}
          {currentTab === 'citizen' && (
            <CitizenDashboard
              requests={requests}
              onCreateRequest={handleCreateRequest}
              pickedLat={pickedLat}
              pickedLng={pickedLng}
              onClearPickedCoordinates={() => { setPickedLat(undefined); setPickedLng(undefined); }}
              statusColors={statusColors}
              onTriggerMapPickMode={(isActive) => { setMapPickMode(isActive); if (isActive) setCurrentTab('map'); }}
            />
          )}

          {/* D. VIEW 4: OFFICER COMPLAINTS INTAKE DESK */}
          {currentTab === 'officer' && (
            <OfficerDashboard
              requests={requests}
              onUpdateStatus={handleUpdateStatus}
              onPreviewDocument={(request, type) => setPreviewDoc({ request, type })}
              statusColors={statusColors}
            />
          )}

          {/* E. VIEW 5: DIRECTOR EXECUTIVE DECISION AND DESIGNS DESK */}
          {currentTab === 'director' && (
            <DirectorDashboard
              requests={requests}
              onUpdateStatus={handleUpdateStatus}
              onPreviewDocument={(request, type) => setPreviewDoc({ request, type })}
              statusColors={statusColors}
            />
          )}

          {/* F. VIEW 6: MECHANIC FLIGHT CREW AND DISPATCH BENCH */}
          {currentTab === 'mechanic' && (
            <MechanicDashboard
              requests={requests}
              materials={materials}
              onUpdateStatus={handleUpdateStatus}
              onUpdateMaterialsUsed={handleUpdateMaterialsUsed}
              onPreviewDocument={(request, type) => setPreviewDoc({ request, type })}
              statusColors={statusColors}
            />
          )}

          {/* G. VIEW 7: MATERIAL INVENTORY AND REQUISITIONS DESK */}
          {currentTab === 'materials' && (
            <MaterialsDashboard
              materials={materials}
              transactions={transactions}
              onAddTransaction={handleAddMaterialTransaction}
            />
          )}

          {/* H. VIEW 8: ADMIN USERS PORTAL */}
          {currentTab === 'admin_users' && (
            <AdminUserDashboard
              users={users}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {/* I. VIEW 9: CMS SETTINGS AND SYSTEM CONFIGS */}
          {currentTab === 'cms' && (
            <CMSConfigPanel
              settings={settings}
              onSettingsChange={setSettings}
              users={users}
              onUsersChange={setUsers}
            />
          )}

        </main>
      </div>

      {/* 4. Unified dynamic Government Forms preview popup modal panel */}
      {previewDoc && (
        <A4Document
          request={previewDoc.request}
          settings={settings}
          materialsList={materials}
          type={previewDoc.type}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {/* Footer System Credits */}
      <footer className="bg-slate-900 border-t border-slate-800 text-center py-4 text-[11px] text-slate-500">
        สงวนลิขสิทธิ์ความปลอดภัย © 2026. ระบบ CMS สำนักงานอัจฉริยะกวดขันโคมไฟสาธารณะ ดอนแก้ว. ขับเคลื่อนด้วยพลัง Supabase PostgreSQL API และ Material 3
      </footer>

    </div>
  );
}
