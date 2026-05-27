/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { RepairPoint, RequestStatus, IssueType } from '../types';
import { Search, Filter, Navigation, Compass, MapPin, Grid, Layers, ZoomIn, ZoomOut } from 'lucide-react';

interface InteractiveMapProps {
  points: RepairPoint[];
  selectedPointId?: string;
  onPointSelect?: (point: RepairPoint) => void;
  onCoordinatesPick?: (lat: number, lng: number) => void;
  statusColors: Record<RequestStatus, string>;
  isInteractiveDrawing?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  points,
  selectedPointId,
  onPointSelect,
  onCoordinatesPick,
  statusColors,
  isInteractiveDrawing = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssueFilter, setSelectedIssueFilter] = useState<string>('ทั้งหมด');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ทั้งหมด');
  const [mapMode, setMapMode] = useState<'vector' | 'satellite'>('vector');
  const [navigationSteps, setNavigationSteps] = useState<string[]>([]);
  const [simulatedHeading, setSimulatedHeading] = useState<string>('งานป้องกันบรรเทาสาธารณภัย อบต.');

  // Base bounding coordinates coordinates of Donkaew Subdistrict for mapping calculation
  const baseLat = 18.852;
  const baseLng = 98.968;

  // Visual position mapping inside the SVG container (800 x 500)
  const mapWidth = 800;
  const mapHeight = 500;

  const getSgCoordinates = (lat: number, lng: number) => {
    // Lat range 18.847 to 18.857 (delta 0.01)
    // Lng range 98.960 to 98.974 (delta 0.014)
    const yRatio = (lat - 18.846) / 0.012;
    const xRatio = (lng - 98.960) / 0.012;
    
    // Scale and flip the Y axis (as SVG 0 is top)
    const x = Math.max(20, Math.min(mapWidth - 20, xRatio * mapWidth));
    const y = Math.max(20, Math.min(mapHeight - 20, mapHeight - yRatio * mapHeight));
    return { x, y };
  };

  const filteredPoints = useMemo(() => {
    return points.filter(pt => {
      const matchesSearch = pt.issueType.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            pt.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIssue = selectedIssueFilter === 'ทั้งหมด' || pt.issueType === selectedIssueFilter;
      return matchesSearch && matchesIssue;
    });
  }, [points, searchQuery, selectedIssueFilter]);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isInteractiveDrawing || !onCoordinatesPick) return;

    // Convert mouse coordinates back to coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Calculate ratio
    const xRatio = clickX / rect.width;
    const yRatio = (rect.height - clickY) / rect.height;

    // Recompute Lat/Lng
    const pickedLat = 18.846 + (yRatio * 0.012);
    const pickedLng = 98.960 + (xRatio * 0.012);

    onCoordinatesPick(pickedLat, pickedLng);
  };

  const handleStartNavigation = (pt: RepairPoint) => {
    onPointSelect?.(pt);
    setNavigationSteps([
      `ออกจาก สังกัด กองช่าง ${simulatedHeading}`,
      `ขับรถกระเช้ามุ่งหน้าไปทางทิศตะวันออก 350 เมตร`,
      `เลี้ยวขวาที่สามแยกตลาดชุมชนเข้าสู่ทางหลวงชนบท`,
      `สังเกตพิกัดความชำรุดที่หน้างานพิกัด [${pt.latitude.toFixed(5)}, ${pt.longitude.toFixed(5)}]`,
      `เปิดสัญญาณไฟฉุกเฉินและปฏิบัติหน้าที่ซ่อมบำรุงด้วยความระมัดระวัง`
    ]);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-[580px]">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-72 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-4 overflow-y-auto">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-1.5 text-sm">
            <Compass className="w-4 h-4 text-indigo-600" />
            ระบบนำทางและคัดกรองจุดซ่อม
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">ระบุพิกัดส่องสว่าง OpenStreetMap GIS</p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาตามประเภทหรือบันทึก..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="map-pole-search"
            className="w-full text-xs pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ประเภทปัญหา</label>
          <select
            value={selectedIssueFilter}
            onChange={(e) => setSelectedIssueFilter(e.target.value)}
            id="map-issue-select"
            className="w-full text-xs px-2.5 py-1.5 border rounded-lg bg-white bg-none focus:outline-none"
          >
            <option value="ทั้งหมด">ทั้งหมดทุกปัญหา</option>
            <option value="ไฟไม่ติด">ไฟไม่ติด</option>
            <option value="ไฟกระพริบ">ไฟกระพริบ</option>
            <option value="หลอดเสีย">หลอดเสีย</option>
            <option value="สายไฟชำรุด">สายไฟชำรุด</option>
            <option value="เสาเอียง">เสาเอียง</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>

        {/* Map Layout switcher */}
        <div className="flex items-center justify-between p-2 bg-white rounded-lg border text-xs">
          <span className="text-slate-600">รูปแบบแผนที่</span>
          <div className="flex gap-1">
            <button
              onClick={() => setMapMode('vector')}
              className={`px-2 py-1 rounded transition-colors ${mapMode === 'vector' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              แผนที่ถนน
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-2 py-1 rounded transition-colors ${mapMode === 'satellite' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              ดาวเทียม
            </button>
          </div>
        </div>

        {/* Points Quick List */}
        <div className="flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            รายการจุดเสียในแผนที่ ({filteredPoints.length})
          </span>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            {filteredPoints.map((pt, index) => {
              const isSelected = selectedPointId === pt.id;
              return (
                <div
                  key={pt.id}
                  onClick={() => onPointSelect?.(pt)}
                  className={`p-2 rounded-lg cursor-pointer transition-all border text-xs flex flex-col gap-1 ${
                    isSelected ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-white hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">จุดบำรุงทางที่ {index + 1}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-100">
                      {pt.issueType}
                    </span>
                  </div>
                  <p className="text-slate-500 truncate text-[11px]">{pt.notes || 'ไม่มีหมายเหตุ'}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span className="font-mono">{pt.latitude.toFixed(4)}, {pt.longitude.toFixed(4)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartNavigation(pt);
                      }}
                      className="text-indigo-600 hover:underline flex items-center gap-0.5 font-bold"
                    >
                      <Navigation className="w-3 h-3" /> นำทาง
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredPoints.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-4">ไม่พบข้อมูลเสาไฟตรงกับเงื่อนไข</p>
            )}
          </div>
        </div>

        {/* Guidance Prompt if picking */}
        {isInteractiveDrawing && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-2.5 text-xs text-teal-850 animate-pulse">
            <p className="font-bold">โหมดปักหมุด GPS:</p>
            <p className="text-[11px] mt-0.5 text-teal-700">กรุณาคลิกเลือกตำแหน่งใดๆ บนแผนที่เพื่อระบุค่าพิกัดพิกัดนำซ่อมโดยอัติโนมัติ</p>
          </div>
        )}
      </div>

      {/* Main Map Visual Canvas */}
      <div className="flex-1 bg-slate-900 overflow-hidden relative flex flex-col justify-between">
        
        {/* Top Floating Stats */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>รอซ่อม</span>
          </div>
          <div className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>กำลังทำ</span>
          </div>
          <div className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>สำเร็จ</span>
          </div>
          <div className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>รออนุมัติ</span>
          </div>
        </div>

        {/* Interactive SVG Geographic Grid Board */}
        <div className="flex-1 relative w-full h-full min-h-[300px]">
          <svg
            className="w-full h-full cursor-crosshair select-none"
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            onClick={handleMapClick}
            id="gis-map-canvas"
          >
            {/* Satellite vs Plan Background Image Vector representation */}
            {mapMode === 'satellite' ? (
              <rect width={mapWidth} height={mapHeight} fill="#141E24" />
            ) : (
              <rect width={mapWidth} height={mapHeight} fill="#F1F5F9" />
            )}

            {/* Simulated Geographic Grid Lines */}
            <g opacity="0.15" stroke={mapMode === 'satellite' ? '#ffffff' : '#64748B'} strokeWidth="1">
              {[...Array(10)].map((_, i) => (
                <line key={`v-${i}`} x1={(mapWidth / 10) * i} y1="0" x2={(mapWidth / 10) * i} y2={mapHeight} />
              ))}
              {[...Array(6)].map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={(mapHeight / 6) * i} x2={mapWidth} y2={(mapHeight / 6) * i} />
              ))}
            </g>

            {/* Geographical Accents: Canal / Water Buffer Area */}
            <path
              d="M 0 420 Q 250 400, 380 300 T 800 150"
              fill="none"
              stroke={mapMode === 'satellite' ? '#1E3A8A' : '#93C5FD'}
              strokeWidth="45"
              opacity={mapMode === 'satellite' ? '0.6' : '0.4'}
            />
            <path
              d="M 0 420 Q 250 400, 380 300 T 800 150"
              fill="none"
              stroke={mapMode === 'satellite' ? '#3B82F6' : '#60A5FA'}
              strokeWidth="4"
              opacity="0.8"
            />
            
            {/* Neighborhood / Forest Accent Areas */}
            <rect x="50" y="30" width="120" height="90" rx="15" fill={mapMode === 'satellite' ? '#064E3B' : '#DCFCE7'} opacity="0.35" />
            <rect x="520" y="320" width="180" height="120" rx="20" fill={mapMode === 'satellite' ? '#064E3B' : '#DCFCE7'} opacity="0.35" />

            {/* Main Roads / Transportation Lines Layout representation */}
            <g stroke={mapMode === 'satellite' ? '#475569' : '#FFFFFF'} strokeWidth="24" strokeLinecap="round" opacity="0.95">
              <path d="M 50 250 Q 400 220 750 250" /> {/* Main ring road */}
              <path d="M 400 50 L 400 450" /> {/* North-South Avenue */}
              <path d="M 120 80 L 120 420" /> {/* Sub Road Left */}
              <path d="M 680 80 L 680 420" /> {/* Sub Road Right */}
            </g>

            {/* Road Centers / Yellow Lines */}
            <g stroke="#EAB308" strokeWidth="1" strokeDasharray="6,8" opacity="0.75">
              <path d="M 50 250 Q 400 220 750 250" fill="none" />
              <path d="M 400 50 L 400 450" fill="none" />
            </g>

            {/* Municipal Headquarters Landmark Marker */}
            <g transform="translate(400, 230)">
              <rect x="-35" y="-25" width="70" height="35" rx="4" fill="#312E81" stroke="#E0E7FF" strokeWidth="2" />
              <polygon points="0,-18 -15,-5 15,-5" fill="#E2E8F0" />
              <text y="3" fontSize="8" fill="#F8FAFC" textAnchor="middle" fontWeight="bold">อบต.ดอนแก้ว</text>
              <line x1="0" y1="-25" x2="0" y2="-40" stroke="#F1F5F9" strokeWidth="2" />
              <polygon points="0,-40 10,-35 0,-30" fill="#EF4444" />
            </g>

            {/* GIS Street Lighting Markers Placement */}
            {filteredPoints.map((pt) => {
              const { x, y } = getSgCoordinates(pt.latitude, pt.longitude);
              const isSelected = selectedPointId === pt.id;
              
              // Map point CSS colour
              let pinColor = '#EF4444'; // waiting
              if (pt.issueType === 'ไฟกระพริบ') pinColor = '#F59E0B';
              if (pt.issueType === 'สายไฟชำรุด') pinColor = '#3B82F6';
              if (pt.issueType === 'เสาเอียง') pinColor = '#EF4444';

              // Pulse rings for highlighted pins
              return (
                <g
                  key={pt.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer transition-transform duration-250 hover:scale-130"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPointSelect?.(pt);
                  }}
                >
                  {/* Selected Ripple Layer */}
                  {isSelected && (
                    <circle r="22" fill="none" stroke="#6366F1" strokeWidth="2" className="animate-ping opacity-60" />
                  )}
                  
                  {/* Ambient Glow ring */}
                  <circle r={isSelected ? "14" : "9"} fill={pinColor} opacity="0.3" />
                  <circle r={isSelected ? "7" : "5"} fill={pinColor} stroke="#FFFFFF" strokeWidth="1.5" />
                  
                  {/* Stylized Streetlight Pole Frame Outline */}
                  <path d="M 0 0 L 0 -15 Q 0 -18 3 -18 L 8 -18" stroke="#475569" strokeWidth="1.5" fill="none" />
                  <ellipse cx="8" cy="-18" rx="2" ry="1.2" fill="#EAB308" />
                  
                  {/* Active Light Rays Representation for Successful fixed */}
                  {pt.issueType === 'ไฟไม่ติด' ? null : (
                    <polygon points="6,-16 2,-5 14,-5" fill="#FDE047" opacity="0.25" />
                  )}

                  {/* Tiny pole name tag */}
                  <g transform="translate(0, -28)">
                    <rect x="-27" y="-8" width="54" height="11" rx="2" fill="#1e293b" opacity="0.85" />
                    <text fontSize="7" fill="white" fontWeight="bold" textAnchor="middle" y="-0.5">{pt.issueType}</text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Steps Navigation Drawer */}
        {navigationSteps.length > 0 && (
          <div className="mx-4 mb-4 bg-slate-900/90 text-white backdrop-blur-md p-3.5 rounded-xl border border-slate-700 shadow-xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 text-xs">
              <p className="font-bold text-amber-400 flex items-center gap-1.5 mb-1 bg-amber-500/10 px-2 py-1 rounded w-max">
                <Navigation className="w-3.5 h-3.5" />
                GPS คลื่นวิทยุกองช่างนำร่อง
              </p>
              <ol className="list-decimal pl-4 space-y-0.5 text-slate-300">
                {navigationSteps.map((step, idx) => (
                  <li key={idx} className={idx === navigationSteps.length - 1 ? 'text-amber-300 font-medium' : ''}>{step}</li>
                ))}
              </ol>
            </div>
            <button
              onClick={() => setNavigationSteps([])}
              id="btn-nav-close"
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-600 transition-colors"
            >
              เคลียร์เส้นทาง
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
