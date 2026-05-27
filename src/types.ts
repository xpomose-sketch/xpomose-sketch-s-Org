/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IssueType = 'ไฟไม่ติด' | 'ไฟกระพริบ' | 'หลอดเสีย' | 'สายไฟชำรุด' | 'เสาเอียง' | 'อื่นๆ';

export type RequestStatus = 
  | 'รอรับเรื่อง' 
  | 'รอตรวจสอบ' 
  | 'รออนุมัติ' 
  | 'รอดำเนินการ' 
  | 'กำลังซ่อม' 
  | 'ซ่อมสำเร็จ' 
  | 'ยกเลิก';

export interface RepairPoint {
  id: string;
  requestId: string;
  latitude: number;
  longitude: number;
  imageBefore?: string;
  imageAfter?: string;
  poleNumber: string;
  issueType: IssueType;
  notes: string;
}

export interface RepairRequest {
  id: string;
  ticketNumber: string;
  createdAt: string;
  reporterName: string;
  reporterPhone: string;
  details: string;
  status: RequestStatus;
  points: RepairPoint[];
  materialsUsed: RepairMaterial[];
  history: HistoryLog[];
}

export interface RepairMaterial {
  materialId: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  balance: number;
  pricePerUnit: number;
  unit: string;
  reorderPoint: number;
}

export interface MaterialTransaction {
  id: string;
  materialId: string;
  materialName: string;
  type: 'รับเข้า' | 'เบิกออก' | 'ปรับยอด';
  quantity: number;
  pricePerUnit: number;
  date: string;
  note: string;
  operator: string;
}

export interface Approval {
  id: string;
  requestId: string;
  type: 'อนุมัติใบแจ้งซ่อม' | 'อนุมัติเบิกวัสดุ';
  status: 'รออนุมัติ' | 'อนุมัติแล้ว' | 'ไม่อนุมัติ';
  approverName: string;
  approverRole: string;
  approvedAt?: string;
  comment?: string;
}

export interface SystemSettings {
  agencyName: string;
  agencyLogo: string; // Base64 or Presets
  address: string;
  phone: string;
  website: string;
  directorName: string;
  directorTitle: string;
  directorSignature: string; // Base64 or Presets
  themeColor: 'royal' | 'gold' | 'emerald' | 'crimson' | 'slate';
  ticketFormat: string; // e.g. "RM-{year}-{running}"
}

export interface HistoryLog {
  id: string;
  date: string;
  status: RequestStatus;
  notes: string;
  operator: string;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'officer' | 'director' | 'mechanic' | 'materials' | 'admin';
  phone?: string;
}
