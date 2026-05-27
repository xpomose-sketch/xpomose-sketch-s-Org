/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Material, RepairRequest, SystemSettings, AppUser, MaterialTransaction } from './types';

export const INITIAL_SETTINGS: SystemSettings = {
  agencyName: "องค์การบริหารส่วนตำบลดอนแก้ว (อบต.ดอนแก้ว)",
  agencyLogo: "garuda", // Preset type
  address: "เลขที่ 1 หมู่ 2 ตำบลดอนแก้ว อำเภอแม่ริม จังหวัดเชียงใหม่ 50180",
  phone: "053-123456",
  website: "www.donkaew.go.th",
  directorName: "นายสมชาย ใจงาม",
  directorTitle: "นายกองค์การบริหารส่วนตำบลดอนแก้ว",
  directorSignature: "sig_somchai", // Preset type
  themeColor: "royal",
  ticketFormat: "RM-{year}-{running}",
};

export const INITIAL_USERS: AppUser[] = [
  { id: "u-citizen", email: "citizen@test.com", name: "นายสมศักดิ์ รักสงบ", role: "citizen", phone: "081-234-5678" },
  { id: "u-officer", email: "officer@donkaew.go.th", name: "นางสาวศิริพร เรียนรู้", role: "officer", phone: "089-876-5432" },
  { id: "u-director", email: "director@donkaew.go.th", name: "นายสมชาย ใจงาม", role: "director", phone: "085-555-4321" },
  { id: "u-mechanic", email: "mechanic@donkaew.go.th", name: "นายประดิษฐ์ ซ่อมดี", role: "mechanic", phone: "086-111-2222" },
  { id: "u-materials", email: "materials@donkaew.go.th", name: "นางสาวสมจิตร รักษาสต๊อก", role: "materials", phone: "082-999-8888" },
  { id: "u-admin", email: "admin@donkaew.go.th", name: "นายอภิสิทธิ์ ควบคุมระบบ", role: "admin", phone: "080-000-0000" },
];

export const INITIAL_MATERIALS: Material[] = [
  { id: "mat-001", code: "MAT-LED-50W", name: "หลอดไฟ LED 50W", category: "หลอดไฟ", balance: 45, pricePerUnit: 450, unit: "หลอด", reorderPoint: 15 },
  { id: "mat-002", code: "MAT-TAPE-01", name: "เทปพันสายไฟ 3M", category: "วัสดุสิ้นเปลือง", balance: 120, pricePerUnit: 35, unit: "ม้วน", reorderPoint: 20 },
  { id: "mat-003", code: "MAT-WIRE-01", name: "สายไฟ THW 1x2.5 ตร.มม.", category: "สายไฟ", balance: 350, pricePerUnit: 18, unit: "เมตร", reorderPoint: 100 },
  { id: "mat-004", code: "MAT-FUSE-10A", name: "กระบอกฟิวส์พร้อมฟิวส์ 10A", category: "อุปกรณ์ไฟฟ้า", balance: 80, pricePerUnit: 55, unit: "ชุด", reorderPoint: 25 },
  { id: "mat-005", code: "MAT-BALL-40W", name: "บัลลาสต์แกนเหล็ก 40W", category: "อุปกรณ์สตาร์ทเตอร์", balance: 12, pricePerUnit: 220, unit: "อัน", reorderPoint: 10 },
  { id: "mat-006", code: "MAT-SW-01", name: "สวิตช์แสงแดด (Photocell)", category: "เซนเซอร์", balance: 8, pricePerUnit: 350, unit: "ชุด", reorderPoint: 10 }, // Below reorder point to trigger warning!
];

export const INITIAL_TRANSACTIONS: MaterialTransaction[] = [
  { id: "tf-001", materialId: "mat-001", materialName: "หลอดไฟ LED 50W", type: "รับเข้า", quantity: 50, pricePerUnit: 450, date: "2026-05-10T08:30:00Z", note: "จัดซื้อประจำไตรมาส 2", operator: "นางสาวสมจิตร รักษาสต๊อก" },
  { id: "tf-002", materialId: "mat-003", materialName: "สายไฟ THW 1x2.5 ตร.มม.", type: "รับเข้า", quantity: 500, pricePerUnit: 18, date: "2026-05-10T08:35:00Z", note: "จัดซื้อประจำไตรมาส 2", operator: "นางสาวสมจิตร รักษาสต๊อก" },
  { id: "tf-003", materialId: "mat-001", materialName: "หลอดไฟ LED 50W", type: "เบิกออก", quantity: 5, pricePerUnit: 450, date: "2026-05-15T13:00:00Z", note: "ตัดจ่ายงานใบสั่งเลขที่ RM-2026-0001", operator: "นายประดิษฐ์ ซ่อมดี" },
];

export const INITIAL_REPAIR_REQUESTS: RepairRequest[] = [
  {
    id: "req-1",
    ticketNumber: "RM-2026-0001",
    createdAt: "2026-05-12T09:12:00Z",
    reporterName: "นายวิเชียร เมืองอินทร์",
    reporterPhone: "084-555-6677",
    details: "ไฟทางเสียช่วงหัวโค้ง ดับสนิท 2 ต้น ทำให้เกิดประชาร่วมทางอันตรายช่วงกลางคืน",
    status: "ซ่อมสำเร็จ",
    points: [
      {
        id: "pt-1-1",
        requestId: "req-1",
        latitude: 18.8525,
        longitude: 98.9680,
        imageBefore: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
        imageAfter: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400",
        poleNumber: "DK-0824",
        issueType: "ไฟไม่ติด",
        notes: "หลอดเสื่อมสภาพ ดำ แครก",
      },
      {
        id: "pt-1-2",
        requestId: "req-1",
        latitude: 18.8530,
        longitude: 98.9685,
        imageBefore: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
        imageAfter: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400",
        poleNumber: "DK-0825",
        issueType: "สายไฟชำรุด",
        notes: "ฟิวส์ขาด และสายไฟโดนแดดจนละลาย",
      }
    ],
    materialsUsed: [
      { materialId: "mat-001", name: "หลอดไฟ LED 50W", quantity: 2, pricePerUnit: 450 },
      { materialId: "mat-002", name: "เทปพันสายไฟ 3M", quantity: 1, pricePerUnit: 35 },
      { materialId: "mat-004", name: "กระบอกฟิวส์พร้อมฟิวส์ 10A", quantity: 1, pricePerUnit: 55 },
    ],
    history: [
      { id: "h1-1", date: "2026-05-12T09:12:00Z", status: "รอรับเรื่อง", notes: "แจ้งเข้าระบบผ่าน App โดยประชาชน", operator: "นายวิเชียร เมืองอินทร์" },
      { id: "h1-2", date: "2026-05-12T13:40:00Z", status: "รอตรวจสอบ", notes: "เจ้าหน้าที่เทศบาลได้รับข้อมูล ตรวจสอบ พิกัด ละติจูด ลองจิจูด ชัดเจน", operator: "นางสาวศิริพร เรียนรู้" },
      { id: "h1-3", date: "2026-05-13T10:15:00Z", status: "รออนุมัติ", notes: "ตรวจสอบแล้ว เห็นควรอนุมัติให้ช่างเข้าปฏิบัติงานโดยด่วน", operator: "นางสาวศิริพร เรียนรู้" },
      { id: "h1-4", date: "2026-05-13T14:30:00Z", status: "รอดำเนินการ", notes: "อนุมัติโครงการแจ้งซ่อม เลขที่ RM-2026-0001", operator: "นายสมชาย ใจงาม" },
      { id: "h1-5", date: "2026-05-15T09:00:00Z", status: "กำลังซ่อม", notes: "ช่างรับรถกระเช้า และเบิกวัสดุออกจากคลัง กำลังออกตรวจสอบหน้างาน", operator: "นายประดิษฐ์ ซ่อมดี" },
      { id: "h1-6", date: "2026-05-15T12:30:00Z", status: "ซ่อมสำเร็จ", notes: "ทำการเปลี่ยนหลอดไฟเสา DK-0824 และเปลี่ยนฟิวส์เสา DK-0825 การทำงานเปิดเป็นปกติแล้ว", operator: "นายประดิษฐ์ ซ่อมดี" },
    ]
  },
  {
    id: "req-2",
    ticketNumber: "RM-2026-0002",
    createdAt: "2026-05-24T14:20:00Z",
    reporterName: "นางอรดี รักดี",
    reporterPhone: "083-222-1144",
    details: "ไฟฟ้าริมทางกระพริบตลอดเวลาข้างตลาด อบต. ทำให้แสบตาและตอนดึกเดินเปลี่ยว",
    status: "กำลังซ่อม",
    points: [
      {
        id: "pt-2-1",
        requestId: "req-2",
        latitude: 18.8498,
        longitude: 98.9692,
        imageBefore: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
        poleNumber: "DK-1002",
        issueType: "ไฟกระพริบ",
        notes: "กระพริบรัวๆ ทุกๆ 3 วินาที",
      }
    ],
    materialsUsed: [],
    history: [
      { id: "h2-1", date: "2026-05-24T14:20:00Z", status: "รอรับเรื่อง", notes: "แจ้งผ่านระบบแอปพลิเคชัน", operator: "นางอรดี รักดี" },
      { id: "h2-2", date: "2026-05-25T09:10:00Z", status: "รอตรวจสอบ", notes: "รับเรื่องเข้าระบบ พร้อมจัดเตรียมเอกสารตรวจสอบ", operator: "นางสาวศิริพร เรียนรู้" },
      { id: "h2-3", date: "2026-05-25T11:00:00Z", status: "รออนุมัติ", notes: "ผ่านข้อเสนอและส่งพิกัดให้ช่าง", operator: "นางสาวศิริพร เรียนรู้" },
      { id: "h2-4", date: "2026-05-25T16:00:00Z", status: "รอดำเนินการ", notes: "ผู้อำนวยการอนุมัติการดำเนินงาน", operator: "นายสมชาย ใจงาม" },
      { id: "h2-5", date: "2026-05-26T10:00:00Z", status: "กำลังซ่อม", notes: "ช่างรับเรื่องเข้าระบบโมบายแอป", operator: "นายประดิษฐ์ ซ่อมดี" },
    ]
  },
  {
    id: "req-3",
    ticketNumber: "RM-2026-0003",
    createdAt: "2026-05-26T19:40:00Z",
    reporterName: "พลโทณรงค์ พวงสวรรค์",
    reporterPhone: "089-994-4444",
    details: "พายุพัดจนกิ่งไม้หักโดนกิ่งโคมไฟเอียงและบิดเบี้ยว เกรงว่าจะร่วงหล่นตัดสายพาดทางสัญจร",
    status: "รอรับเรื่อง",
    points: [
      {
        id: "pt-3-1",
        requestId: "req-3",
        latitude: 18.8545,
        longitude: 98.9650,
        imageBefore: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
        poleNumber: "DK-0145",
        issueType: "เสาเอียง",
        notes: "เสาเหล็กโค้งงอ 15 องศา",
      }
    ],
    materialsUsed: [],
    history: [
      { id: "h3-1", date: "2026-05-26T19:40:00Z", status: "รอรับเรื่อง", notes: "แจ้งเหตุฉุกเฉินผ่านมือถือ", operator: "พลโทณรงค์ พวงสวรรค์" },
    ]
  },
  {
    id: "req-4",
    ticketNumber: "RM-2026-0004",
    createdAt: "2026-05-27T07:12:00Z",
    reporterName: "นายวิโรจน์ แดนดี",
    reporterPhone: "085-777-6655",
    details: "โคมไฟดับสนิท 3 ดวงติดแถวบ้านซอย 5",
    status: "รออนุมัติ",
    points: [
      {
        id: "pt-4-1",
        requestId: "req-4",
        latitude: 18.8510,
        longitude: 98.9660,
        imageBefore: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
        poleNumber: "DK-0921",
        issueType: "ไฟไม่ติด",
        notes: "โคมดับดวงที่ 1",
      },
      {
        id: "pt-4-2",
        requestId: "req-4",
        latitude: 18.8512,
        longitude: 98.9662,
        imageBefore: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
        poleNumber: "DK-0922",
        issueType: "ไฟไม่ติด",
        notes: "โคมดับดวงที่ 2",
      },
      {
        id: "pt-4-3",
        requestId: "req-4",
        latitude: 18.8514,
        longitude: 98.9664,
        imageBefore: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
        poleNumber: "DK-0923",
        issueType: "หลอดเสีย",
        notes: "โคมดับดวงที่ 3",
      },
    ],
    materialsUsed: [],
    history: [
      { id: "h4-1", date: "2026-05-27T07:12:00Z", status: "รอรับเรื่อง", notes: "แจ้งเข้าผ่านแอป", operator: "นายวิโรจน์ แดนดี" },
      { id: "h4-2", date: "2026-05-27T07:20:00Z", status: "รอตรวจสอบ", notes: "เจ้าหน้าที่ตรวจพิกัดและเตรียมงานเรียบร้อย", operator: "นางสาวศิริพร เรียนรู้" },
      { id: "h4-3", date: "2026-05-27T07:30:00Z", status: "รออนุมัติ", notes: "ผ่านข้อเสนอพิกัด ดับ 3 ดวง แนะนำเปลี่ยนวัสดุและเบิกอุปกรณ์พัสดุ", operator: "นางสาวศิริพร เรียนรู้" },
    ]
  }
];

// Complete SQL database migrations schema with foreign keys, row level security (RLS) rules and default values.
export const SUPABASE_SQL_MIGRATIONS = `-- PostgreSQL / Supabase SQL Schema Migration Blueprint
-- แอปพลิเคชันแจ้งซ่อมโคมไฟถนนอัจฉริยะ (Smart Streetlight Repair)
-- สร้างสำหรับหน่วยงานระดับท้องถิ่น (อบต. / เทศบาล)

-- 1. ตารางตั้งค่าระบบ (System Settings CMS)
CREATE TABLE public.SystemSettings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_name VARCHAR(255) NOT NULL,
    agency_logo TEXT NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    director_name VARCHAR(150),
    director_title VARCHAR(150),
    director_signature TEXT,
    theme_color VARCHAR(50) DEFAULT 'royal',
    ticket_format VARCHAR(100) DEFAULT 'RM-{year}-{running}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ตารางผู้ใช้ (Users)
CREATE TABLE public.Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('citizen', 'officer', 'director', 'mechanic', 'materials', 'admin')),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ตารางใบแจ้งซ่อม (Repair Requests)
CREATE TABLE public.RepairRequests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reporter_name VARCHAR(150) NOT NULL,
    reporter_phone VARCHAR(50) NOT NULL,
    reporter_age INT,
    reporter_citizen_id VARCHAR(13),
    reporter_address TEXT,
    details TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'รอรับเรื่อง' CHECK (status IN ('รอรับเรื่อง', 'รอตรวจสอบ', 'รออนุมัติ', 'รอดำเนินการ', 'กำลังซ่อม', 'ซ่อมสำเร็จ', 'ยกเลิก')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ตารางพิกัดซ่อมของแต่ละจุด (Repair Points)
CREATE TABLE public.RepairPoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.RepairRequests(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    image_before TEXT,
    image_after TEXT,
    pole_number VARCHAR(100) NOT NULL,
    issue_type VARCHAR(100) NOT NULL CHECK (issue_type IN ('ไฟไม่ติด', 'ไฟกระพริบ', 'หลอดเสีย', 'สายไฟชำรุด', 'เสาเอียง', 'อื่นๆ')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ตารางพัสดุและคลังวัสดุ (Materials)
CREATE TABLE public.Materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(150),
    balance INT NOT NULL DEFAULT 0,
    price_per_unit DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    unit VARCHAR(50) NOT NULL,
    reorder_point INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ตารางประวัติการเบิก/รับพัสดุ (Material Transactions)
CREATE TABLE public.MaterialTransactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES public.Materials(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('รับเข้า', 'เบิกออก', 'ปรับยอด')),
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    note TEXT,
    operator VARCHAR(255) NOT NULL
);

-- 7. ตารางพัสดุที่ใช้ในใบแจ้งซ่อม (Repair Materials)
CREATE TABLE public.RepairMaterials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.RepairRequests(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES public.Materials(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_repair_material UNIQUE (request_id, material_id)
);

-- 8. ตารางประวัติส่งพิจารณาอนุมัติ (Approvals)
CREATE TABLE public.Approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.RepairRequests(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('อนุมัติใบแจ้งซ่อม', 'อนุมัติเบิกวัสดุ')),
    status VARCHAR(50) NOT NULL DEFAULT 'รออนุมัติ' CHECK (status IN ('รออนุมัติ', 'อนุมัติแล้ว', 'ไม่นุมัติ')),
    approver_name VARCHAR(255) NOT NULL,
    approver_role VARCHAR(150) NOT NULL,
    comment TEXT,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 9. การเปิดใช้งาน ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE public.SystemSettings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.RepairRequests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.RepairPoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.MaterialTransactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.RepairMaterials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Approvals ENABLE ROW LEVEL SECURITY;

-- นโยบาย RLS สำหรับ SystemSettings (ทุกคนอ่านได้, เฉพาะผู้ดูแลระบบที่แก้ได้)
CREATE POLICY "Allow public read-only of settings" 
ON public.SystemSettings FOR SELECT USING (true);

CREATE POLICY "Allow admin edit of settings" 
ON public.SystemSettings FOR ALL 
USING (exists(select 1 from public.Users where email = auth.jwt()->>'email' and role = 'admin'));

-- นโยบายสำหรับ RepairRequests (ประชาชนสามารถแจ้งได้, และช่าง/เจ้าหน้าที่สามารถแก้ไขได้ตามสิทธิ์)
CREATE POLICY "Allow anonymous insert repair request" 
ON public.RepairRequests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view all requests" 
ON public.RepairRequests FOR SELECT USING (true);

CREATE POLICY "Allow internal roles to update requests" 
ON public.RepairRequests FOR UPDATE 
USING (exists(select 1 from public.Users where email = auth.jwt()->>'email' and role in ('officer', 'director', 'mechanic', 'admin')));

-- นโยบายสำหรับ RepairPoints
CREATE POLICY "Allow anyone to view repair points" 
ON public.RepairPoints FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert repair point" 
ON public.RepairPoints FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow staff to update points" 
ON public.RepairPoints FOR ALL 
USING (exists(select 1 from public.Users where email = auth.jwt()->>'email' and role in ('officer', 'mechanic', 'admin')));

-- นโยบายสำหรับตารางพัสดุ Materials (อ่านได้ทั้งหน่วยงาน, เฉพาะเจ้าหน้าที่พัสดุและแอดมินจัดการ)
CREATE POLICY "Allow staff to view materials" 
ON public.Materials FOR SELECT USING (true);

CREATE POLICY "Allow inventory management for materials" 
ON public.Materials FOR ALL 
USING (exists(select 1 from public.Users where email = auth.jwt()->>'email' and role in ('materials', 'admin')));

-- =============================================
-- 10. TRIGGER อัปเดต สต๊อกวัสดุอัตโนมัติ (Auto-Deduct Stock Trigger)
-- =============================================

CREATE OR REPLACE FUNCTION public.deduct_material_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- อัปเดตจำนวนคงเหลือตัววัสดุเมื่อมีการเชื่อมวัสดุที่ใช้กับใบงานซ่อม
    UPDATE public.Materials
    SET balance = balance - NEW.quantity
    WHERE id = NEW.material_id;
    
    -- แทรกรายการบันทึกความเคลื่อนไหว (Transaction Log) ด้วย
    INSERT INTO public.MaterialTransactions (material_id, type, quantity, price_per_unit, note, operator)
    VALUES (
        NEW.material_id, 
        'เบิกออก', 
        NEW.quantity, 
        NEW.price_per_unit, 
        'เบิกติดตั้งในใบอนุมัติซ่อมเลขที่ ' || (SELECT ticket_number FROM public.RepairRequests WHERE id = NEW.request_id),
        'ระบบอัติโนมัติ (ช่างเครื่องพัสดุ)'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_deduct_material 
AFTER INSERT ON public.RepairMaterials
FOR EACH ROW EXECUTE FUNCTION public.deduct_material_stock();
`;
