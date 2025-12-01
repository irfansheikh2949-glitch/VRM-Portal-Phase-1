import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, Users, BarChart2, Phone, CheckSquare, User, FileText, 
  Gift, Download, Settings, Search, Bell, Plus, ChevronRight, 
  ArrowUp, ArrowDown, Filter, MoreHorizontal, Mail, MessageCircle,
  Calendar, Clock, AlertCircle, X, CheckCircle, PhoneCall, ChevronDown,
  PieChart, Activity, Layers, TrendingUp, Inbox, Send, RefreshCw,
  AlertTriangle, Check, Paperclip, ChevronLeft, Eye, Edit, Target,
  Trophy, Mic, Megaphone, PlayCircle, PauseCircle, Copy, Briefcase,
  MapPin, DollarSign, FileBarChart, LogOut, Award, BookOpen, LifeBuoy, 
  FileCheck, ClipboardList, Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen,
  PanelRightClose, PanelRightOpen, SidebarClose, SidebarOpen, Share2,
  Linkedin, Facebook, Twitter, Instagram, Image as ImageIcon, FileType, Shield,
  Zap, Database, MousePointer, Timer, Grid, Menu, Sparkles, Brain, CheckCircle2, Circle,
  Car, Heart, Building2, Umbrella, ShoppingBag
} from 'lucide-react';
import {
  MOCK_PARTNERS, MOCK_PARTNER_NOTES, MOCK_MARKETING_ASSETS, ANALYTICS_DATA,
  MOCK_CAMPAIGNS, CAMPAIGN_LEADERBOARD, CAMPAIGN_PARTNERS_DETAIL, CAMPAIGN_CALL_LOGS,
  CAMPAIGN_MESSAGES, CAMPAIGN_INSIGHTS, CAMPAIGN_ACTIVITY, MOCK_TICKETS,
  MOCK_TICKET_HISTORY, MOCK_CALL_LOGS_DETAILED, COMM_HUB_KPIS, RECENT_ALERTS,
  INITIAL_TASKS, MOCK_COMMS, AI_BRIEFING,
  formatCurrency, formatCompactCurrency
} from './data';
import { Partner, Campaign, Ticket } from './types';

// ==========================================
// 2. REUSABLE CHART COMPONENTS
// ==========================================

interface DonutChartProps {
  data: any[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
}

const DonutChart = ({ data, size = 160, strokeWidth = 20, centerLabel = "Total", centerValue = "100%" }: DonutChartProps) => {
  let cumulativePercent = 0;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {data.map((item: any, i: number) => {
          const dashArray = `${(item.value / 100) * circumference} ${circumference}`;
          const dashOffset = -((cumulativePercent / 100) * circumference);
          cumulativePercent += item.value;
          return (
            <circle
              key={i} cx={center} cy={center} r={radius} fill="transparent"
              stroke={item.colorHex || item.fill || 'currentColor'} strokeWidth={strokeWidth}
              strokeDasharray={dashArray} strokeDashoffset={dashOffset}
              className={`transition-all duration-500 ease-out hover:opacity-80 cursor-pointer ${!item.colorHex && !item.fill ? item.tailwindClass : ''}`}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
        <span className="text-2xl font-bold text-slate-800">{centerValue}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{centerLabel}</span>
      </div>
    </div>
  );
};

const DualAxisBarChart = ({ data, xAxisKey, barKey, lineKey, barColor = "bg-blue-500", lineColor = "border-indigo-500", height = 256, formatYAxis = (val: any) => val, tooltipFormat = { bar: 'Value', line: 'Count' } }: any) => {
  const maxBarVal = Math.max(...data.map((d: any) => d[barKey])) || 1;
  const maxLineVal = Math.max(...data.map((d: any) => d[lineKey])) || 1;
  const ticks = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div className="w-full relative" style={{ height: height }}>
      <div className="h-full w-full flex items-end justify-between gap-2 px-2 pb-6 relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 z-0">
          {ticks.map((p, i) => (
            <div key={i} className="border-b border-slate-100 w-full h-0 flex items-center">
              <span className="text-[10px] text-slate-300 -mt-4 bg-white pr-1">{formatYAxis((maxBarVal * p))}</span>
            </div>
          ))}
        </div>
        {data.map((d: any, i: number) => {
          const barHeightPercent = (d[barKey] / maxBarVal) * 100;
          const pointHeightPercent = (d[lineKey] / maxLineVal) * 80;
          return (
            <div key={i} className="flex-1 h-full flex flex-col justify-end relative group z-10">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-lg">
                <p className="font-bold border-b border-slate-600 mb-1 pb-1">{d[xAxisKey]}</p>
                <div className="grid grid-cols-2 gap-x-3 text-[10px]">
                  <span className="text-slate-300">{tooltipFormat.bar}:</span><span className="font-medium">{d[barKey]}</span>
                  <span className="text-slate-300">{tooltipFormat.line}:</span><span className="font-medium">{d[lineKey]}</span>
                </div>
              </div>
              <div className={`w-full ${barColor} rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-300 relative`} style={{ height: `${barHeightPercent}%` }}></div>
              <div className={`absolute w-3 h-3 bg-white border-2 ${lineColor} rounded-full left-1/2 -translate-x-1/2 z-20 shadow-sm transition-all duration-500`} style={{ bottom: `${pointHeightPercent}%` }}></div>
              <span className="text-xs text-slate-500 text-center mt-2 font-medium">{d[xAxisKey]}</span>
            </div>
          )
        })}
      </div>
    </div>
  );
};

const SimpleTrendChart = ({ data }: any) => {
  const maxPremium = Math.max(...data.map((d: any) => d.premium));
   
  return (
    <div className="h-64 w-full flex items-end justify-between gap-2 px-2 pb-6 relative border-b border-l border-slate-100">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
        {[100, 75, 50, 25, 0].map((p, i) => (
          <div key={i} className="border-b border-slate-100 w-full h-0 flex items-center">
              <span className="text-[10px] text-slate-300 -mt-4">₹{(maxPremium * (p/100)).toFixed(1)} Cr</span>
          </div>
        ))}
      </div>

      {data.map((d: any, i: number) => {
        const heightPercent = (d.premium / maxPremium) * 100;
        return (
          <div key={i} className="flex-1 h-full flex flex-col justify-end relative group z-10">
            <div className="w-full bg-blue-500 rounded-t-md opacity-80 group-hover:opacity-100 transition-all duration-300 relative" style={{ height: `${heightPercent}%` }}></div>
            <span className="text-xs text-slate-500 text-center mt-2 font-medium">{d.month}</span>
          </div>
        )
      })}
    </div>
  );
};

// ==========================================
// 3. LAYOUT COMPONENTS
// ==========================================

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, toggleSidebar }: any) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'cockpit', label: 'Partner 360', icon: User },
    { id: 'partners', label: 'My Partners', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'comm', label: 'Comm. Hub', icon: Phone },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'tickets', label: 'Tickets', icon: FileText },
    { id: 'campaigns', label: 'Campaigns', icon: Gift },
    { id: 'reports', label: 'Reports', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 z-20 shadow-xl transition-all duration-300 ease-in-out`}>
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} text-white border-b border-slate-800`}>
        <div className="w-10 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-500/20 shrink-0">VRM</div>
        {!isCollapsed && <span className="font-bold text-lg tracking-tight whitespace-nowrap">PartnerPortal</span>}
      </div>
      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        {menuItems.filter(item => !(item as any).hidden).map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-6'} py-3 transition-all duration-200 border-l-4 ${activeTab === item.id ? 'bg-slate-800 text-white border-blue-500 shadow-inner' : 'border-transparent hover:bg-slate-800 hover:text-white'}`}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={20} className={`shrink-0 ${activeTab === item.id ? 'text-blue-400' : ''}`} />
            {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors`}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600 shrink-0" />
          {!isCollapsed && (
             <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Irfan Sheikh</p>
                <p className="text-xs text-slate-500 truncate">Virtual RM</p>
             </div>
          )}
        </div>
        <button 
          onClick={toggleSidebar}
          className="w-full mt-4 flex items-center justify-center p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
           {isCollapsed ? <PanelLeftOpen size={20}/> : <PanelLeftClose size={20}/>}
        </button>
      </div>
    </div>
  );
};

const Header = ({ isCollapsed }: any) => (
  <header className={`h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm transition-all duration-300 ${isCollapsed ? 'pl-8' : 'pl-8'}`}>
    <div className="flex items-center gap-4 flex-1 max-w-xl">
      <div className="relative w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input type="text" placeholder="Search partners, codes, or policies..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"/>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <button className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors border border-teal-100 shadow-sm"><Plus size={16} /> <span>Quick Action</span></button>
      <div className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-colors"><Bell size={20} className="text-slate-600" /><span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span></div>
    </div>
  </header>
);

// ==========================================
// 4. FEATURE MODULES
// ==========================================

const DashboardTab = ({ setPartnerView }: any) => {
  const stats = useMemo(() => {
    const totalGWP = MOCK_PARTNERS.reduce((sum, p) => sum + p.gwp, 0);
    const activeCount = MOCK_PARTNERS.filter(p => p.status === 'Active').length;
    const totalPolicies = MOCK_PARTNERS.reduce((sum, p) => sum + p.policies, 0);
    return [
      { label: 'Active Partners', value: activeCount, change: '+2', trend: 'up', color: 'blue', subtext: `Out of ${MOCK_PARTNERS.length} total` },
      { label: 'Total GWP (YTD)', value: formatCompactCurrency(totalGWP), change: '+8.5%', trend: 'up', color: 'emerald', subtext: 'Target: ₹8.0 Cr' },
      { label: 'Policies Issued', value: totalPolicies.toLocaleString(), change: '-2.1%', trend: 'down', color: 'indigo', subtext: 'Last month: 870' },
      { label: 'Quote-to-Bind', value: '34%', change: '+1.4%', trend: 'up', color: 'purple', subtext: 'Industry avg: 30%' },
    ];
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
              <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stat.trend === 'up' ? <ArrowUp size={10} className="mr-1" /> : <ArrowDown size={10} className="mr-1" />} {stat.change}
              </span>
            </div>
            <div className="mt-4"><h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3><p className="text-xs text-slate-400 mt-1">{stat.subtext}</p></div>
            <div className={`mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden`}><div className={`h-full rounded-full bg-${stat.color}-500 w-3/4`}></div></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><AlertCircle size={18} className="text-blue-500" />Priority Alerts</h3>
              <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
              {RECENT_ALERTS.map((alert, idx) => (
                <div key={idx} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0 ${alert.type === 'success' ? 'bg-green-500' : alert.type === 'danger' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 font-medium group-hover:text-blue-700 transition-colors">{alert.msg}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock size={10} /> {alert.time}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-all">Action</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50"><h3 className="font-semibold text-slate-800">Top Performers</h3></div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {MOCK_PARTNERS.sort((a,b) => b.gwp - a.gwp).slice(0,5).map((p, i) => (
              <div key={p.id} onClick={() => setPartnerView(p)} className="p-3 flex items-center gap-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{i + 1}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-600">{p.name}</p><p className="text-xs text-slate-500">{formatCompactCurrency(p.gwp)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PartnersTab = ({ setPartnerView }: any) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-4 border-b border-slate-100 flex justify-between items-center gap-4">
      <div className="flex gap-3 overflow-x-auto pb-1 flex-1">
        <div className="relative">
            <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm pl-3 pr-8 py-2 text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100 transition-colors">
                <option>All Tiers</option>
                <option>Platinum</option>
                <option>Gold</option>
                <option>Silver</option>
                <option>Bronze</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
        </div>
        <div className="relative">
            <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm pl-3 pr-8 py-2 text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100 transition-colors">
                <option>All Status</option>
                <option>Active</option>
                <option>NOC Shared</option>
                <option>Inactive</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
        </div>
        <div className="relative">
            <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm pl-3 pr-8 py-2 text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100 transition-colors">
                <option>All Dispositions</option>
                <option>Interested</option>
                <option>Callback</option>
                <option>Promise to Pay</option>
                <option>Service Query</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
        </div>
        <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Filter size={14}/> More Filters
        </button>
      </div>
      <div className="relative min-w-[140px]">
        <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg text-sm pl-3 pr-8 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Sort by GWP</option>
            <option>Sort by Potential</option>
            <option>Sort by Disposition Date</option>
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
      </div>
    </div>
    <div className="overflow-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
          <tr>
            {['Partner', 'Tier / Status', 'Potential vs MTD Ach.', 'YoY MTD (PY vs CY)', 'Connects / Attempts', 'Last Disposition', 'Date', 'Action'].map((h, i) => (
                <th key={i} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_PARTNERS.map((p) => (
            <tr key={p.id} onClick={() => setPartnerView(p)} className="hover:bg-blue-50/40 cursor-pointer group transition-colors">
              <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">{p.name.substring(0,2).toUpperCase()}</div>
                      <div>
                          <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 whitespace-nowrap">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.code}</p>
                      </div>
                  </div>
              </td>
              <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${p.tier === 'Platinum' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>{p.tier}</span>
                    <span className={`text-xs font-semibold ${
                        p.status === 'Active' ? 'text-green-600' : 
                        p.status === 'NOC Shared' ? 'text-amber-600' : 'text-red-500'
                    }`}>
                        {p.status}
                    </span>
                  </div>
              </td>
              <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 w-32">
                      <div className="flex justify-between text-[10px]">
                          <span className="font-bold text-slate-700">{formatCompactCurrency(p.mtdAchievement)}</span>
                          <span className="text-slate-400">{formatCompactCurrency(p.potential)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${p.mtdAchievement >= p.potential ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${Math.min((p.mtdAchievement/p.potential)*100, 100)}%`}}></div>
                      </div>
                  </div>
              </td>
              <td className="px-6 py-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                      <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-400">PY: {formatCompactCurrency(p.prevYearMTD)}</span>
                          <span className="text-sm font-bold text-slate-700">CY: {formatCompactCurrency(p.currYearMTD)}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.currYearMTD >= p.prevYearMTD ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {p.currYearMTD >= p.prevYearMTD ? <ArrowUp size={10}/> : <ArrowDown size={10}/>}
                      </span>
                  </div>
              </td>
              <td className="px-6 py-4">
                  <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{p.mtdConnects} / {p.mtdAttempts}</span>
                      <span className="text-[10px] text-slate-400">
                          {Math.round((p.mtdConnects / (p.mtdAttempts || 1)) * 100)}% Rate
                      </span>
                  </div>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-700">{p.lastDisposition}</td>
              <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">{p.dispositionDate}</td>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal size={18} />
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Partner 360 (Cockpit) ---
const Partner360 = ({ partner, onBack, onRaiseTicket }: any) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [businessSubTab, setBusinessSubTab] = useState('leads'); 
  const [ticketSubTab, setTicketSubTab] = useState('pending quotes'); 
  
  // New collapsible panel state - Default to 'metrics' to show stats/profile on load
  const [activePanel, setActivePanel] = useState<string | null>('metrics'); // 'metrics', 'notes', 'profile', 'menu'
   
  const [notes, setNotes] = useState(MOCK_PARTNER_NOTES);
  const [newNote, setNewNote] = useState('');
  const [aiTalkingPoints, setAiTalkingPoints] = useState(AI_BRIEFING.talkingPoints);
  const [aiTasks, setAiTasks] = useState(AI_BRIEFING.tasks);
  const [sellNowProduct, setSellNowProduct] = useState<string | null>(null);

  const [socialMedia, setSocialMedia] = useState({
    linkedin: 'linkedin.com/in/rajesh-kumar',
    facebook: 'facebook.com/rajesh.insurance',
    twitter: '@rajesh_insure',
    instagram: ''
  });

  // Calculate detailed stats for the new grid (Mock logic)
  const detailedStats = {
    prevMonthBiz: partner.prevYearMTD || 1500000,
    currMonthBiz: partner.currYearMTD || 1800000,
    attempts: partner.mtdAttempts || 45,
    connects: partner.mtdConnects || 32,
    pendingLeads: 12,
    pendingQuotes: 5,
    contestAchievement: 65, // %
    newPolicies: 45,
    renewalPolicies: 12,
    renewalPending: 8,
    conversionRatio: 18, // %
    customerBase: 850,
    opportunity: 5000000,
    potential: partner.potential || 2500000,
    mtdBiz: partner.mtdAchievement || 1800000,
    lastLogin: 'Today, 09:15 AM',
    lastActivity: 'Quote Created (Motor)',
    onboardingStatus: 'Completed' // Added for display
  };

  const handleAddNote = () => {
      if (!newNote.trim()) return;
      const note = {
          id: Date.now(),
          type: 'note',
          content: newNote,
          author: 'Irfan Sheikh',
          time: 'Just now'
      };
      setNotes([note as any, ...notes]);
      setNewNote('');
  };

  const toggleTalkingPointStatus = (id: number, newStatus: any) => {
    setAiTalkingPoints(points => points.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    ));
  };
  
  const toggleTaskStatus = (id: number) => {
      setAiTasks(tasks => tasks.map(t =>
        t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
      ));
  }

  const togglePanel = (panelName: string) => {
      setActivePanel(activePanel === panelName ? null : panelName);
  };

  const TABS = [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'sell-now', label: 'Sell Now', icon: Zap }, // New Sell Now Tab
      { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
      { id: 'profile', label: 'Partner Profile', icon: User },
      { id: 'marketing', label: 'Marketing Support', icon: Megaphone },
      { id: 'business', label: 'Business', icon: Briefcase },
      { id: 'commissions', label: 'Payout/Commission', icon: DollarSign },
      { id: 'tickets', label: 'Tickets', icon: AlertTriangle },
      { id: 'claims', label: 'Claims', icon: LifeBuoy },
      { id: 'customers', label: 'Customer Base', icon: Users },
  ];

  const renderSellNowContent = () => {
      if (sellNowProduct) {
          return (
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-right">
                  <button onClick={() => setSellNowProduct(null)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors">
                      <ChevronLeft size={16} /> Back to Products
                  </button>
                  
                  <div className="flex items-center gap-4 mb-8">
                      <div className={`p-4 rounded-xl ${
                          sellNowProduct === 'Motor' ? 'bg-blue-100 text-blue-600' :
                          sellNowProduct === 'Health' ? 'bg-green-100 text-green-600' :
                          sellNowProduct === 'Life' ? 'bg-indigo-100 text-indigo-600' :
                          'bg-amber-100 text-amber-600'
                      }`}>
                          {sellNowProduct === 'Motor' && <Car size={32} />}
                          {sellNowProduct === 'Health' && <Heart size={32} />}
                          {sellNowProduct === 'Life' && <Umbrella size={32} />}
                          {sellNowProduct === 'SME' && <Building2 size={32} />}
                      </div>
                      <div>
                          <h2 className="text-2xl font-bold text-slate-800">{sellNowProduct} Quick Quote</h2>
                          <p className="text-slate-500 text-sm">Enter details below to generate an instant quote link for the partner.</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                      {sellNowProduct === 'Motor' && (
                          <>
                              <div className="col-span-2 md:col-span-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Registration Number</label>
                                  <input type="text" placeholder="MH-02-AB-1234" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
                              </div>
                              <div className="col-span-2 md:col-span-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                                  <input type="tel" placeholder="9876543210" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                              </div>
                          </>
                      )}
                      {sellNowProduct === 'Health' && (
                          <>
                              <div className="col-span-2 md:col-span-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Members to Insure</label>
                                  <select className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                      <option>Self</option>
                                      <option>Self + Spouse</option>
                                      <option>Self + Spouse + 1 Kid</option>
                                      <option>Self + Spouse + 2 Kids</option>
                                  </select>
                              </div>
                              <div className="col-span-2 md:col-span-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                                  <input type="text" placeholder="400001" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                              </div>
                          </>
                      )}
                      {sellNowProduct === 'Life' && (
                          <>
                              <div className="col-span-2 md:col-span-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Annual Income</label>
                                  <select className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                      <option>5L - 10L</option>
                                      <option>10L - 15L</option>
                                      <option>15L+</option>
                                  </select>
                              </div>
                              <div className="col-span-2 md:col-span-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                                  <input type="date" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                              </div>
                          </>
                      )}
                      {sellNowProduct === 'SME' && (
                          <>
                              <div className="col-span-2 md:col-span-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Occupancy Type</label>
                                  <select className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                                      <option>Office</option>
                                      <option>Shop</option>
                                      <option>Warehouse</option>
                                      <option>Manufacturing</option>
                                  </select>
                              </div>
                              <div className="col-span-2 md:col-span-1">
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Sum Insured Required</label>
                                  <input type="text" placeholder="₹ 50,00,000" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                              </div>
                          </>
                      )}
                  </div>

                  <div className="mt-8 flex gap-4">
                      <button className={`px-6 py-3 rounded-lg text-white font-bold shadow-md transition-all flex items-center gap-2 ${
                          sellNowProduct === 'Motor' ? 'bg-blue-600 hover:bg-blue-700' :
                          sellNowProduct === 'Health' ? 'bg-green-600 hover:bg-green-700' :
                          sellNowProduct === 'Life' ? 'bg-indigo-600 hover:bg-indigo-700' :
                          'bg-amber-600 hover:bg-amber-700'
                      }`}>
                          <Zap size={18} fill="currentColor" /> Generate Quote
                      </button>
                      <button className="px-6 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-all">
                          Save as Lead
                      </button>
                  </div>
              </div>
          );
      }

      return (
          <div className="space-y-6 animate-in fade-in">
              <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Start a Quick Quote Journey</h2>
                  <p className="text-slate-500 mt-2">Select a partner to view their comprehensive 360° profile, business, and support details.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                      { id: 'Motor', icon: Car, color: 'blue', desc: 'Car, Bike, CV' },
                      { id: 'Health', icon: Heart, color: 'green', desc: 'Individual, Family Floater' },
                      { id: 'Life', icon: Umbrella, color: 'indigo', desc: 'Term, Investment' },
                      { id: 'SME', icon: Building2, color: 'amber', desc: 'Shop, Office, Fire' }
                  ].map((prod) => (
                      <div 
                          key={prod.id} 
                          onClick={() => setSellNowProduct(prod.id)}
                          className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg cursor-pointer transition-all group flex flex-col items-center text-center hover:border-${prod.color}-300`}
                      >
                          <div className={`w-16 h-16 rounded-full bg-${prod.color}-50 flex items-center justify-center text-${prod.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                              <prod.icon size={32} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 mb-1">{prod.id} Insurance</h3>
                          <p className="text-xs text-slate-500">{prod.desc}</p>
                          <div className={`mt-6 w-full py-2 rounded-lg bg-${prod.color}-50 text-${prod.color}-700 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity`}>
                              Proceed &rarr;
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  const renderBusinessContent = () => {
    switch(businessSubTab) {
        case 'leads': return (
            <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <User size={32} className="mx-auto mb-2 opacity-50" />
                <p>Leads Management Module</p>
                <p className="text-xs mt-1">Track and assign new leads here.</p>
            </div>
        );
        case 'booking': return (
            <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                <p>Booking Management Module</p>
                <p className="text-xs mt-1">View recent policy bookings.</p>
            </div>
        );
        case 'renewals': return (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Upcoming Renewals</h3>
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">3 Soon</span>
                </div>
                <div className="space-y-3">
                    {[1,2,3].map((r) => (
                    <div key={r} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer group">
                        <div>
                            <p className="text-sm font-bold text-slate-800">Policy #9928{r}</p>
                            <p className="text-xs text-slate-500">Exp: in {r*5} days • Health</p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all">
                            <Bell size={16} />
                        </button>
                    </div>
                    ))}
                </div>
            </div>
        );
        default: return null;
    }
  }

  const renderTicketContent = () => {
      switch(ticketSubTab) {
          case 'pending quotes': return (
            <div className="space-y-4 animate-in fade-in">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold text-slate-800">Live Quote: Q-99281 (Motor)</h3>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Drop-off: Payment</span>
                    </div>
                    <div className="flex items-center gap-2 relative">
                        <div className="absolute top-3 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
                        {['Vehicle Details', 'Plan Selection', 'Add-ons', 'Payment', 'Policy Issued'].map((s, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 ${i<3?'bg-green-500 border-green-500 text-white':i===3?'bg-white border-red-500 text-red-500':'bg-white border-slate-300'}`}>
                                    {i<3?<Check size={12}/>:i===3?<X size={12}/>:i+1}
                                </div>
                                <span className={`text-[10px] ${i===3?'text-red-600 font-bold':'text-slate-500'}`}>{s}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <button className="text-xs bg-slate-100 px-3 py-2 rounded hover:bg-slate-200">View Details</button>
                        <button className="text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center gap-1"><MessageCircle size={12}/> Send Link</button>
                    </div>
                </div>
            </div>
          );
          case 'offline mapping': return (
            <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <FileCheck size={32} className="mx-auto mb-2 opacity-50" />
                <p>Offline Mapping Requests</p>
            </div>
          );
          case 'tech issues': return (
            <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <Settings size={32} className="mx-auto mb-2 opacity-50" />
                <p>Technical Issues Log</p>
            </div>
          );
          case 'endorsement': return (
            <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <FileText size={32} className="mx-auto mb-2 opacity-50" />
                <p>Endorsement Requests</p>
            </div>
          );
          default: return null;
      }
  }

  const renderTabContent = () => {
      switch(activeTab) {
          case 'overview': return (
              <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business MTD (YoY)</span>
                                <TrendingUp size={16} className={detailedStats.currMonthBiz >= detailedStats.prevMonthBiz ? 'text-green-500' : 'text-red-500'} />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-slate-800">{formatCompactCurrency(detailedStats.currMonthBiz)}</span>
                                <span className="text-xs font-medium text-slate-400">vs {formatCompactCurrency(detailedStats.prevMonthBiz)}</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Connectivity</span>
                                <PhoneCall size={16} className="text-blue-500" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-slate-800">{detailedStats.connects}/{detailedStats.attempts}</span>
                                <span className="text-xs font-medium text-slate-400">({Math.round((detailedStats.connects/detailedStats.attempts)*100)}%)</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Pipeline</span>
                                <AlertCircle size={16} className="text-amber-500" />
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div className="flex-1 bg-amber-50 rounded-lg p-2 border border-amber-100 text-center">
                                    <span className="block font-bold text-slate-800 text-lg">{detailedStats.pendingLeads}</span> 
                                    <span className="text-slate-500 text-xs">Leads</span>
                                </div>
                                <div className="flex-1 bg-blue-50 rounded-lg p-2 border border-blue-100 text-center">
                                    <span className="block font-bold text-slate-800 text-lg">{detailedStats.pendingQuotes}</span> 
                                    <span className="text-slate-500 text-xs">Quotes</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contest Achv.</span>
                                <Trophy size={16} className="text-purple-500" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{width: `${detailedStats.contestAchievement}%`}}></div>
                                </div>
                                <span className="text-sm font-bold text-slate-700">{detailedStats.contestAchievement}%</span>
                            </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Policies (New/Ren)</span>
                                <FileText size={16} className="text-indigo-500" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-800">{detailedStats.newPolicies}</span>
                                <span className="text-sm text-slate-400 mx-1">/</span>
                                <span className="text-xl font-bold text-slate-800">{detailedStats.renewalPolicies}</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Renewal Pending</span>
                                <RefreshCw size={16} className="text-orange-500" />
                            </div>
                            <div className="text-xl font-bold text-slate-800">{detailedStats.renewalPending} <span className="text-xs font-medium text-slate-400">Policies</span></div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Customers</span>
                                <Users size={16} className="text-teal-500" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-slate-800">{detailedStats.customerBase}</span>
                                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                    <ArrowUp size={10} className="text-green-500"/> +12 this month
                                </span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Potential vs MTD Business</span>
                                <Zap size={16} className="text-yellow-500" />
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">MTD Achievement</span>
                                        <span className="font-bold text-slate-700">{formatCompactCurrency(detailedStats.mtdBiz)}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{width: `${Math.min((detailedStats.mtdBiz/detailedStats.potential)*100, 100)}%`}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">Total Potential</span>
                                        <span className="font-bold text-slate-700">{formatCompactCurrency(detailedStats.potential)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-4">Business Mix</h3>
                          <div className="flex items-center justify-center py-4">
                              <DonutChart data={[{value:60, fill:'#3b82f6'}, {value:30, fill:'#10b981'}, {value:10, fill:'#f59e0b'}]} />
                          </div>
                          <div className="flex justify-center gap-4 text-xs text-slate-500 mt-2">
                              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Health</span>
                              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Motor</span>
                              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> Life</span>
                          </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-4">Performance Trend</h3>
                          <SimpleTrendChart data={ANALYTICS_DATA.trend} />
                      </div>
                  </div>
              </div>
          );
          case 'sell-now': return renderSellNowContent();
          case 'ai-insights': return (
            <div className="space-y-6 animate-in fade-in">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                        <Brain size={250} />
                    </div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                            <Sparkles size={24} className="text-yellow-300" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Partner Intelligence Briefing</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed max-w-4xl">{AI_BRIEFING.summary}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <CheckSquare size={18} className="text-blue-500"/> Recommended Actions
                        </h3>
                        <div className="space-y-3">
                            {aiTasks.map((task) => (
                                <div key={task.id} className={`p-3 rounded-lg border transition-all ${task.status === 'completed' ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}>
                                    <div className="flex items-start gap-3">
                                        <button onClick={() => toggleTaskStatus(task.id)} className={`mt-0.5 flex-shrink-0 transition-colors ${task.status === 'completed' ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'}`}>
                                            <CheckCircle2 size={18} className={task.status === 'completed' ? 'fill-current' : ''}/>
                                        </button>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{task.text}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                                    task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                                                    task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                                }`}>{task.priority}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <MessageCircle size={18} className="text-green-500"/> Talking Points & Scripts
                            </h3>
                            <div className="text-xs text-slate-500">
                                {aiTalkingPoints.filter(p => p.status === 'completed').length}/{aiTalkingPoints.length} Completed
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {aiTalkingPoints.map((point) => (
                                <div key={point.id} className={`border rounded-xl transition-all ${
                                    point.status === 'completed' ? 'bg-slate-50 border-slate-200' : 
                                    point.status === 'pending' ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                                }`}>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                                    point.category === 'Appreciation' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    point.category === 'Cross-sell' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>{point.category}</span>
                                                <h4 className={`font-bold text-sm ${point.status === 'completed' ? 'text-slate-500' : 'text-slate-800'}`}>{point.topic}</h4>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    onClick={() => toggleTalkingPointStatus(point.id, 'pending')}
                                                    className={`p-1.5 rounded-lg transition-colors ${point.status === 'pending' ? 'bg-amber-200 text-amber-800' : 'text-slate-400 hover:bg-amber-100 hover:text-amber-600'}`}
                                                    title="Mark as Pending/Defer"
                                                >
                                                    <Clock size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => toggleTalkingPointStatus(point.id, point.status === 'completed' ? 'new' : 'completed')}
                                                    className={`p-1.5 rounded-lg transition-colors ${point.status === 'completed' ? 'bg-green-200 text-green-800' : 'text-slate-400 hover:bg-green-100 hover:text-green-600'}`}
                                                    title="Mark as Complete"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className={`mt-3 p-3 rounded-lg text-sm italic text-slate-600 border-l-2 ${
                                            point.status === 'completed' ? 'border-slate-300 bg-slate-100 text-slate-400' : 'border-indigo-400 bg-indigo-50/50'
                                        }`}>
                                            "{point.script}"
                                        </div>

                                        {point.status === 'pending' && (
                                            <p className="mt-2 text-xs font-medium text-amber-700 flex items-center gap-1">
                                                <AlertCircle size={12}/> Deferred for later in the conversation
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          );
          case 'profile': return (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in">
               <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-800 text-lg">Partner Profile & Social Media</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Save Changes</button>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Contact Information</h4>
                      <div className="space-y-4">
                        <div><label className="block text-xs font-medium text-slate-500 mb-1">Phone Number</label><input className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50" value={partner.phone} readOnly /></div>
                        <div><label className="block text-xs font-medium text-slate-500 mb-1">Email Address</label><input className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50" value={partner.email} readOnly /></div>
                        <div><label className="block text-xs font-medium text-slate-500 mb-1">Location</label><input className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50" value={partner.location} readOnly /></div>
                      </div>
                  </div>
                  <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Social Media Presence</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <Linkedin size={20} className="text-blue-700" />
                           <input className="flex-1 p-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="LinkedIn Profile URL" value={socialMedia.linkedin} onChange={(e) => setSocialMedia({...socialMedia, linkedin: e.target.value})} />
                        </div>
                        <div className="flex items-center gap-3">
                           <Facebook size={20} className="text-blue-600" />
                           <input className="flex-1 p-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Facebook Page URL" value={socialMedia.facebook} onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})} />
                        </div>
                        <div className="flex items-center gap-3">
                           <Twitter size={20} className="text-sky-500" />
                           <input className="flex-1 p-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Twitter Handle" value={socialMedia.twitter} onChange={(e) => setSocialMedia({...socialMedia, twitter: e.target.value})} />
                        </div>
                        <div className="flex items-center gap-3">
                           <Instagram size={20} className="text-pink-600" />
                           <input className="flex-1 p-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Instagram Profile" value={socialMedia.instagram} onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})} />
                        </div>
                      </div>
                  </div>
               </div>
            </div>
          );
          case 'marketing': return (
            <div className="space-y-6 animate-in fade-in">
               <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 rounded-xl text-white shadow-lg">
                  <h3 className="font-bold text-xl mb-2">Marketing Enablement</h3>
                  <p className="text-indigo-100 text-sm max-w-xl">Share high-quality, co-branded marketing assets with your partner to help them engage customers and boost sales.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_MARKETING_ASSETS.map((asset) => (
                      <div key={asset.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                         <div className="h-32 bg-slate-100 flex items-center justify-center text-4xl">
                            {asset.thumbnail}
                         </div>
                         <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                               <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-100">{asset.category}</span>
                               <span className="text-xs text-slate-400 flex items-center gap-1">
                                   {asset.type === 'Image' ? <ImageIcon size={12}/> : <FileType size={12}/>} {asset.type}
                               </span>
                            </div>
                            <h4 className="font-bold text-slate-800 mb-1">{asset.title}</h4>
                            <p className="text-xs text-slate-500 mb-4 line-clamp-2">{asset.description}</p>
                            <button className="w-full py-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2" onClick={() => alert(`Shared "${asset.title}" with partner!`)}>
                               <Share2 size={16}/> Share with Partner
                            </button>
                         </div>
                      </div>
                  ))}
               </div>
            </div>
          );
          case 'business': return (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex gap-2 bg-white p-1.5 rounded-lg border border-slate-200 w-fit">
                    {['leads', 'booking', 'renewals'].map(st => (
                        <button 
                            key={st}
                            onClick={() => setBusinessSubTab(st)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                                businessSubTab === st ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>
                {renderBusinessContent()}
            </div>
          );
          case 'commissions': return (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Month</th><th className="p-4">GWP</th><th className="p-4">Rate</th><th className="p-4">Payout</th><th className="p-4">Status</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                          {['September', 'August', 'July'].map((m,i) => (
                              <tr key={m} className="hover:bg-slate-50">
                                  <td className="p-4 font-medium">{m} 2023</td>
                                  <td className="p-4">₹12,50,000</td>
                                  <td className="p-4">12%</td>
                                  <td className="p-4 font-bold text-green-700">₹1,50,000</td>
                                  <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">PAID</span></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
          case 'tickets': return (
            <div className="space-y-6 animate-in fade-in">
                  <div className="flex gap-2 bg-white p-1.5 rounded-lg border border-slate-200 w-fit overflow-x-auto">
                     {['pending quotes', 'offline mapping', 'tech issues', 'endorsement'].map(st => (
                         <button 
                             key={st}
                             onClick={() => setTicketSubTab(st)}
                             className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize whitespace-nowrap ${
                                 ticketSubTab === st ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                             }`}
                         >
                             {st}
                         </button>
                     ))}
                 </div>
                 {renderTicketContent()}
            </div>
          );
          default: return (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-in fade-in border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <Settings size={32} className="text-slate-300" />
                  </div>
                  <p className="text-lg font-medium text-slate-600 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</p>
                  <p className="text-sm">Specific data for {activeTab} is not yet connected.</p>
              </div>
          );
      }
  }

  const renderStatsPanel = () => (
      <div className="flex flex-col h-full bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 bg-white">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metrics Snapshot</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 overflow-y-auto">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business MTD (YoY)</span>
                        <TrendingUp size={16} className={detailedStats.currMonthBiz >= detailedStats.prevMonthBiz ? 'text-green-500' : 'text-red-500'} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-slate-800">{formatCompactCurrency(detailedStats.currMonthBiz)}</span>
                        <span className="text-xs font-medium text-slate-400">vs {formatCompactCurrency(detailedStats.prevMonthBiz)}</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Connectivity</span>
                        <PhoneCall size={16} className="text-blue-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-slate-800">{detailedStats.connects}/{detailedStats.attempts}</span>
                        <span className="text-xs font-medium text-slate-400">({Math.round((detailedStats.connects/detailedStats.attempts)*100)}%)</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Pipeline</span>
                        <AlertCircle size={16} className="text-amber-500" />
                    </div>
                    <div className="flex gap-4 text-sm">
                        <div className="flex-1 bg-amber-50 rounded-lg p-2 border border-amber-100 text-center">
                            <span className="block font-bold text-slate-800 text-lg">{detailedStats.pendingLeads}</span> 
                            <span className="text-slate-500 text-xs">Leads</span>
                        </div>
                        <div className="flex-1 bg-blue-50 rounded-lg p-2 border border-blue-100 text-center">
                            <span className="block font-bold text-slate-800 text-lg">{detailedStats.pendingQuotes}</span> 
                            <span className="text-slate-500 text-xs">Quotes</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contest Achv.</span>
                        <Trophy size={16} className="text-purple-500" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{width: `${detailedStats.contestAchievement}%`}}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{detailedStats.contestAchievement}%</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Policies (New/Ren)</span>
                        <FileText size={16} className="text-indigo-500" />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-slate-800">{detailedStats.newPolicies}</span>
                        <span className="text-sm text-slate-400 mx-1">/</span>
                        <span className="text-xl font-bold text-slate-800">{detailedStats.renewalPolicies}</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Renewal Pending</span>
                        <RefreshCw size={16} className="text-orange-500" />
                    </div>
                    <div className="text-xl font-bold text-slate-800">{detailedStats.renewalPending} <span className="text-xs font-medium text-slate-400">Policies</span></div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Potential vs MTD Business</span>
                        <Zap size={16} className="text-yellow-500" />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">MTD Achievement</span>
                                <span className="font-bold text-slate-700">{formatCompactCurrency(detailedStats.mtdBiz)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{width: `${Math.min((detailedStats.mtdBiz/detailedStats.potential)*100, 100)}%`}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">Total Potential</span>
                                <span className="font-bold text-slate-700">{formatCompactCurrency(detailedStats.potential)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
  )

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500 bg-slate-50/30">
      <div className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0 z-20">
         <div className="px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
                 <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                   <ChevronLeft size={20} />
                 </button>
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-slate-200 shadow-sm flex items-center justify-center text-lg font-bold text-blue-700">
                        {partner.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 leading-tight">{partner.name}</h1>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">{partner.code}</span>
                            <span>•</span>
                            <span className={`uppercase font-bold text-[10px] px-1.5 py-0.5 rounded border ${partner.tier === 'Platinum' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{partner.tier}</span>
                        </div>
                    </div>
                 </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-6 mr-6 border-r border-slate-200 pr-6">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">GWP (MTD)</p>
                        <p className="text-base font-bold text-slate-800">{formatCompactCurrency(detailedStats.currMonthBiz)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Pending</p>
                        <p className="text-base font-bold text-amber-600">{detailedStats.pendingQuotes} Quotes</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-xs shadow-sm transition-all">
                        <Mail size={16} /> <span className="hidden sm:inline">Email</span>
                    </button>
                    <button onClick={onRaiseTicket} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-xs shadow-sm transition-all">
                        <AlertTriangle size={16} /> <span className="hidden sm:inline">Ticket</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs shadow-md transition-all">
                        <PhoneCall size={16} /> <span className="hidden sm:inline">Call</span>
                    </button>
                </div>
            </div>
         </div>

         <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs">
            <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Onboarding:</span>
                <span className="flex items-center gap-1 font-bold text-green-700">
                    <CheckCircle2 size={14} className="fill-green-100"/> {detailedStats.onboardingStatus}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Status:</span>
                <span className={`flex items-center gap-1.5 font-bold ${partner.status === 'Active' ? 'text-green-600' : 'text-slate-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${partner.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                    {partner.status}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Last Login:</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1"><Clock size={12} className="text-slate-400"/> {detailedStats.lastLogin}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Last Activity:</span>
                <span className="font-semibold text-slate-700">{detailedStats.lastActivity}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Customer Base:</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1"><Users size={12} className="text-slate-400"/> {detailedStats.customerBase}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
                <span className="text-slate-400 font-medium">Last Disposition:</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 text-[10px] uppercase tracking-wide">
                    {partner.lastDisposition}
                </span>
                <span className="text-slate-400 text-[10px]">({partner.dispositionDate})</span>
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
          
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
                <div className="px-8 py-4 flex items-center text-sm">
                    <span className="text-slate-400 font-medium">Cockpit</span>
                    <ChevronRight size={14} className="mx-2 text-slate-300" />
                    <span className="font-bold text-slate-800">{TABS.find(t => t.id === activeTab)?.label}</span>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-8">
                    {renderTabContent()}
                </div>
          </div>

          <div className={`${activePanel ? 'w-96 opacity-100 border-l' : 'w-0 opacity-0 border-l-0'} transition-all duration-300 ease-in-out bg-white border-slate-200 flex flex-col overflow-hidden shadow-xl z-30`}>
                <div className="h-full flex flex-col w-96"> 
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 whitespace-nowrap">
                            {activePanel === 'metrics' && <><BarChart2 size={18} className="text-blue-500"/> Performance & Profile</>}
                            {activePanel === 'menu' && <><Grid size={18} className="text-blue-500"/> Module Navigation</>}
                            {activePanel === 'notes' && <><Activity size={18} className="text-blue-500"/> Activity & Notes</>}
                            {activePanel === 'profile' && <><User size={18} className="text-blue-500"/> Full Profile</>}
                        </h3>
                        <button onClick={() => setActivePanel(null)} className="text-slate-400 hover:text-slate-600">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {activePanel === 'metrics' && renderStatsPanel()}
                        
                        {activePanel === 'menu' && (
                            <div className="p-2 space-y-1">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            setActivePanel(null);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                                            activeTab === tab.id 
                                            ? 'bg-blue-50 text-blue-700 font-medium' 
                                            : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}/>
                                        <span>{tab.label}</span>
                                        {activeTab === tab.id && <ChevronRight size={14} className="ml-auto text-blue-400"/>}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activePanel === 'notes' && (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                    <div className="relative pl-4 border-l-2 border-slate-200 ml-1 space-y-8">
                                        {notes.map((item: any) => (
                                            <div key={item.id} className="relative group">
                                                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                                                    item.type === 'note' ? 'bg-blue-500' : item.type === 'call' ? 'bg-green-500' : 'bg-amber-500'
                                                }`}></div>
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.type}</span>
                                                        <span className="text-[10px] text-slate-400">{item.time}</span>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-700">{item.content}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 border-t border-slate-200 bg-slate-50">
                                    <textarea 
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm mb-2" 
                                        rows={2} placeholder="Add note..."
                                        value={newNote} onChange={(e) => setNewNote(e.target.value)}
                                    />
                                    <button onClick={handleAddNote} disabled={!newNote.trim()} className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-xs font-medium">Add Note</button>
                                </div>
                            </div>
                        )}

                        {activePanel === 'profile' && (
                            <div className="p-6 space-y-6">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400 mb-3">{partner.name.substring(0,2)}</div>
                                    <h3 className="font-bold text-slate-800">{partner.name}</h3>
                                    <p className="text-sm text-slate-500">{partner.code}</p>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div><label className="text-xs text-slate-400 uppercase font-bold">Email</label><p className="text-sm text-slate-700">{partner.email}</p></div>
                                    <div><label className="text-xs text-slate-400 uppercase font-bold">Phone</label><p className="text-sm text-slate-700">{partner.phone}</p></div>
                                    <div><label className="text-xs text-slate-400 uppercase font-bold">Location</label><p className="text-sm text-slate-700">{partner.location || 'Mumbai, India'}</p></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
          </div>

          <div className="w-16 bg-white border-l border-slate-200 z-40 flex flex-col items-center py-6 gap-6 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] flex-shrink-0">
              <button 
                onClick={() => togglePanel('menu')}
                className={`p-3 rounded-xl transition-all duration-300 group relative ${activePanel === 'menu' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
                title="Modules"
              >
                  <Grid size={20} />
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Modules</span>
              </button>

              <div className="w-8 h-px bg-slate-100"></div>

              <button 
                onClick={() => togglePanel('metrics')}
                className={`p-3 rounded-xl transition-all duration-300 group relative ${activePanel === 'metrics' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
                title="Performance"
              >
                  <BarChart2 size={20} />
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Stats & Profile</span>
              </button>

              <button 
                onClick={() => togglePanel('notes')}
                className={`p-3 rounded-xl transition-all duration-300 group relative ${activePanel === 'notes' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
                title="Activity"
              >
                  <Activity size={20} />
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Activity & Notes</span>
              </button>

              <button 
                onClick={() => togglePanel('profile')}
                className={`p-3 rounded-xl transition-all duration-300 group relative ${activePanel === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
                title="Profile"
              >
                  <User size={20} />
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Full Profile</span>
              </button>
          </div>

      </div>
    </div>
  );
};

const CampaignList = ({ onSelectCampaign }: any) => (
  <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Campaigns', val: '2', icon: Megaphone, col: 'blue' },
          { label: 'Premium Achieved (MTD)', val: '₹1.65 Cr', icon: TrendingUp, col: 'green' },
          { label: 'Enrolled Partners', val: '350', icon: Users, col: 'purple' },
          { label: 'Overall ROI', val: '12.5x', icon: Target, col: 'amber' },
        ].map((m, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className={`p-3 rounded-lg bg-${m.col}-50 text-${m.col}-600`}><m.icon size={24} /></div>
             <div><p className="text-xs font-bold text-slate-500 uppercase">{m.label}</p><p className="text-xl font-bold text-slate-800">{m.val}</p></div>
          </div>
        ))}
      </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {MOCK_CAMPAIGNS.map(camp => (
      <div key={camp.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-${camp.color}-100 text-${camp.color}-700`}>{camp.status}</span></div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">{camp.name}</h3>
          <p className="text-xs text-slate-500 mb-4">{camp.product} • {camp.startDate} to {camp.endDate}</p>
          <div className="space-y-4">
            <div><div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Achieved</span><span className="font-bold text-slate-800">{Math.round((camp.achieved/camp.target)*100)}%</span></div><div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className={`h-full bg-${camp.color}-500`} style={{width: `${(camp.achieved/camp.target)*100}%`}}></div></div></div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button onClick={() => onSelectCampaign(camp)} className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100">View Dashboard</button>
        </div>
      </div>
    ))}
    </div>
  </div>
);

const CampaignDetail = ({ campaign, onBack }: any) => {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between mb-4">
                    <p className="text-sm font-bold text-slate-500 uppercase">Premium Achieved</p>
                    <TrendingUp size={20} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{formatCompactCurrency(campaign.achieved)}</h3>
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">{Math.round((campaign.achieved/campaign.target)*100)}% of Target</span>
                    <span className="font-medium text-slate-700">{formatCompactCurrency(campaign.target)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[67%]"></div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between mb-4">
                    <p className="text-sm font-bold text-slate-500 uppercase">Policies Issued</p>
                    <FileText size={20} className="text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{campaign.policies}</h3>
                <p className="text-sm text-slate-500 mt-2">Avg Ticket Size: <span className="font-medium text-slate-800">₹19,200</span></p>
                <div className="mt-4 flex gap-1 h-2 w-full rounded-full overflow-hidden">
                    <div className="bg-blue-500 w-[70%]" title="New Business"></div>
                    <div className="bg-indigo-400 w-[30%]" title="Renewal"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>70% New</span>
                    <span>30% Renewal</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between mb-4">
                    <p className="text-sm font-bold text-slate-500 uppercase">Partner Activation</p>
                    <Users size={20} className="text-purple-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{campaign.activePartners} <span className="text-lg text-slate-400 font-normal">/ {campaign.enrolled}</span></h3>
                <p className="text-sm text-slate-500 mt-2">Activation Rate: <span className="font-medium text-green-600">59%</span></p>
                <div className="mt-4 flex items-center gap-2 text-sm bg-amber-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-100">
                    <AlertTriangle size={16} />
                    <span>61 Partners dormant (0 sales)</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Conversion Funnel</h3>
                <div className="space-y-4">
                    {[
                    { label: 'Partners Enrolled', val: 150, w: '100%', col: 'bg-blue-100 text-blue-900' },
                    { label: 'Contacted', val: 120, w: '80%', col: 'bg-blue-200 text-blue-900' },
                    { label: 'Quotes Generated', val: 500, w: '65%', col: 'bg-blue-400 text-white' },
                    { label: 'Policies Issued', val: 234, w: '45%', col: 'bg-teal-500 text-white' }
                    ].map((step, i) => (
                    <div key={i} className="group relative">
                        <div 
                            className={`h-10 rounded-r-lg flex items-center px-4 text-sm font-medium transition-all ${step.col}`} 
                            style={{width: step.w}}
                        >
                            <span className="flex-1">{step.label}</span>
                            <span className="font-bold">{step.val}</span>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Pacing vs Target</h3>
                <SimpleTrendChart data={ANALYTICS_DATA.trend} />
                <div className="flex justify-center gap-6 mt-4 text-xs font-medium">
                    <span className="flex items-center gap-1"><div className="w-3 h-1 bg-blue-500"></div> Actual</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-1 bg-slate-300 border-t border-dashed border-slate-500"></div> Target Trajectory</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-1 bg-blue-300 border-t border-dashed border-blue-500"></div> Forecast</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Quick Insights</h3>
                <div className="space-y-3">
                   {CAMPAIGN_INSIGHTS.map((ins, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                            ins.type === 'success' ? 'bg-green-50 text-green-800' :
                            ins.type === 'warning' ? 'bg-amber-50 text-amber-800' :
                            ins.type === 'danger' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'
                        }`}>
                            {ins.type === 'success' ? <CheckCircle size={18} className="mt-0.5"/> :
                             ins.type === 'warning' ? <AlertTriangle size={18} className="mt-0.5"/> :
                             ins.type === 'danger' ? <AlertCircle size={18} className="mt-0.5"/> : <Activity size={18} className="mt-0.5"/>}
                            <p className="text-sm font-medium">{ins.text}</p>
                        </div>
                   ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Recent Activity</h3>
                    <button className="text-xs text-blue-600 hover:underline">View All</button>
                </div>
                <div className="space-y-4 relative pl-4 border-l border-slate-100">
                   {CAMPAIGN_ACTIVITY.map((act, i) => (
                        <div key={i} className="relative">
                            <div className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-${act.col}-500 ring-4 ring-white`}></div>
                            <p className="text-xs text-slate-400 mb-0.5">{act.time}</p>
                            <p className="text-sm text-slate-700">{act.text}</p>
                        </div>
                   ))}
                </div>
            </div>
        </div>
    </div>
  );

  const renderPartners = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col animate-in fade-in">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex gap-2">
                {['All Enrolled', 'Active Contributors', 'Zero Business', 'High Potential'].map(f => (
                    <button key={f} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">{f}</button>
                ))}
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                <PhoneCall size={16} /> Start Calling Campaign Queue
            </button>
        </div>
        <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                        {['Partner', 'Tier', 'Target vs Achieved', 'Policies', 'Status', 'Last Contact', 'Action'].map(h => (
                            <th key={h} className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {CAMPAIGN_PARTNERS_DETAIL.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 group">
                            <td className="px-6 py-4 text-sm font-medium text-slate-800">{p.name}</td>
                            <td className="px-6 py-4"><span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">{p.tier}</span></td>
                            <td className="px-6 py-4 w-64">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-slate-700">{formatCompactCurrency(p.achieved)}</span>
                                    <span className="text-slate-400">{formatCompactCurrency(p.target)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${p.achieved >= p.target ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${Math.min((p.achieved/p.target)*100, 100)}%`}}></div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{p.policies}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    p.status === 'On Track' ? 'bg-green-100 text-green-700' :
                                    p.status === 'At Risk' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                }`}>{p.status}</span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">{p.lastContact}</td>
                            <td className="px-6 py-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700" title="Call"><Phone size={14}/></button>
                                <button className="p-1.5 border border-slate-300 rounded hover:bg-slate-50" title="Message"><MessageCircle size={14}/></button>
                            </td>
                        </tr>
                   ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderCalling = () => (
    <div className="h-full flex gap-6 animate-in fade-in">
        <div className="w-2/3 space-y-6">
            <div className="grid grid-cols-4 gap-4">
               {[{l:'Calls',v:'456'},{l:'Connects',v:'68%'},{l:'Avg Time',v:'3m 12s'},{l:'Pol/Call',v:'0.2'}].map((m,i)=>(
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                        <p className="text-xs text-slate-500 uppercase font-bold">{m.l}</p>
                        <p className="text-xl font-bold text-slate-800 mt-1">{m.v}</p>
                    </div>
               ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Recent Call Logs</div>
                <div className="overflow-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr><th className="px-4 py-3">Partner</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">Duration</th><th className="px-4 py-3">Outcome</th><th className="px-4 py-3">Note</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                           {CAMPAIGN_CALL_LOGS.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium">{log.partner}</td>
                                    <td className="px-4 py-3 text-slate-500">{log.time}</td>
                                    <td className="px-4 py-3 text-slate-500">{log.duration}</td>
                                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-medium">{log.outcome}</span></td>
                                    <td className="px-4 py-3 text-slate-600 truncate max-w-xs">{log.note}</td>
                                </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div className="w-1/3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h3 className="font-bold text-slate-800 mb-4">Call Outcomes</h3>
            <div className="relative h-48 w-full flex items-center justify-center">
                <DonutChart data={[
                    { value: 35, colorHex: '#22c55e' }, // Interested
                    { value: 25, colorHex: '#3b82f6' }, // Callback
                    { value: 20, colorHex: '#f59e0b' }, // Needs Support
                    { value: 20, colorHex: '#ef4444' }, // Not Interested
                ]} centerValue="456" centerLabel="Total" />
            </div>
            <div className="mt-6 space-y-2">
                {['Interested (35%)', 'Callback (25%)', 'Support (20%)', 'No Interest (20%)'].map((l,i)=>(
                    <div key={i} className="flex items-center text-sm">
                        <div className={`w-3 h-3 rounded-full mr-2 ${['bg-green-500','bg-blue-500','bg-amber-500','bg-red-500'][i]}`}></div>
                        <span className="text-slate-600">{l}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderPerformance = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin size={18}/> Geographic Split</h3>
                  <div className="space-y-3">
                      {[
                          { region: 'Maharashtra', val: 40, col: 'bg-blue-500' },
                          { region: 'Delhi NCR', val: 25, col: 'bg-teal-500' },
                          { region: 'Karnataka', val: 15, col: 'bg-purple-500' },
                          { region: 'Gujarat', val: 10, col: 'bg-orange-500' },
                          { region: 'Other', val: 10, col: 'bg-slate-400' }
                      ].map((r,i) => (
                          <div key={i}>
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="text-slate-600">{r.region}</span>
                                  <span className="font-bold">{r.val}%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${r.col}`} style={{width: `${r.val}%`}}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Layers size={18}/> Tier Analysis</h3>
                  <div className="h-48 flex items-end justify-around gap-2 px-4 pb-2 border-b border-slate-100">
                      {[
                          { tier: 'Platinum', h: '80%', val: '120%' },
                          { tier: 'Gold', h: '60%', val: '95%' },
                          { tier: 'Silver', h: '40%', val: '70%' },
                          { tier: 'Bronze', h: '20%', val: '40%' }
                      ].map((t,i) => (
                          <div key={i} className="flex flex-col items-center gap-2 group w-16">
                              <div className="text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{t.val}</div>
                              <div className="w-full bg-blue-100 rounded-t-lg relative h-40">
                                  <div className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg transition-all duration-500" style={{height: t.h}}></div>
                              </div>
                              <span className="text-xs font-medium text-slate-500">{t.tier}</span>
                          </div>
                      ))}
                  </div>
                  <p className="text-xs text-center text-slate-400 mt-4">Achievement % by Partner Tier</p>
              </div>
          </div>
      </div>
  );

  const renderCommunication = () => (
    <div className="h-full flex flex-col gap-6 animate-in fade-in">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Message Center</h3>
                    <p className="text-sm text-slate-500">Broadcast updates to enrolled partners</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Send size={16} /> Send New Broadcast
                </button>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                    <tr><th className="px-6 py-3">Subject</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Channel</th><th className="px-6 py-3">Audience</th><th className="px-6 py-3">Open Rate</th><th className="px-6 py-3">Clicks</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                    {CAMPAIGN_MESSAGES.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-medium text-slate-800">{m.subject}</td>
                            <td className="px-6 py-3 text-slate-500">{m.sent}</td>
                            <td className="px-6 py-3"><span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{m.channel}</span></td>
                            <td className="px-6 py-3">{m.audience}</td>
                            <td className="px-6 py-3 text-green-600 font-medium">{m.openRate}</td>
                            <td className="px-6 py-3 text-blue-600 font-medium">{m.clicks}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
            <h3 className="font-bold text-slate-800 mb-4">Recent Inbound Queries</h3>
            <div className="space-y-4">
                {[1,2].map(i => (
                    <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-lg hover:bg-slate-50">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">P{i}</div>
                        <div>
                            <div className="flex justify-between w-full">
                                <p className="font-bold text-slate-800">Partner Name</p>
                                <span className="text-xs text-slate-400">2h ago</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">Is the incentive slab applicable for renewals as well? Please clarify.</p>
                            <button className="text-xs text-blue-600 font-medium mt-2 hover:underline">Reply</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-8 animate-in fade-in">
        <div className="flex justify-center items-end gap-4 py-8">
            {[
                { ...CAMPAIGN_LEADERBOARD[1], h: 'h-32', col: 'bg-slate-200', icon: '🥈' }, // 2nd
                { ...CAMPAIGN_LEADERBOARD[0], h: 'h-40', col: 'bg-yellow-100 border-yellow-300', icon: '🥇' }, // 1st
                { ...CAMPAIGN_LEADERBOARD[2], h: 'h-24', col: 'bg-orange-100', icon: '🥉' }  // 3rd
            ].map((p, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md z-10 mb-[-20px] flex items-center justify-center text-2xl">
                    {p.icon}
                    </div>
                    <div className={`${p.h} w-32 ${p.col} rounded-t-lg shadow-sm flex flex-col justify-end items-center p-4 border-t`}>
                    <p className="font-bold text-slate-800 text-center leading-tight mb-1">{p.name}</p>
                    <p className="text-xs font-medium text-slate-600">{formatCompactCurrency(p.premium)}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                    <tr><th className="px-6 py-4">Rank</th><th className="px-6 py-4">Partner</th><th className="px-6 py-4">Premium Achieved</th><th className="px-6 py-4">Policies</th><th className="px-6 py-4">Current Slab</th><th className="px-6 py-4">Gap to Next</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                   {CAMPAIGN_LEADERBOARD.map((p) => (
                    <tr key={p.rank} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-400">#{p.rank}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">{p.name}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{formatCurrency(p.premium)}</td>
                        <td className="px-6 py-4 text-slate-600">{p.policies}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-bold uppercase border bg-slate-50">{p.slab}</span></td>
                        <td className="px-6 py-4">
                            {p.gap > 0 ? (
                                <div className="w-32">
                                <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Gap</span><span className="font-medium text-slate-700">{formatCompactCurrency(p.gap)}</span></div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[70%]"></div></div>
                                </div>
                            ) : <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Max Slab</span>}
                        </td>
                    </tr>
                   ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderSettings = () => (
      <div className="grid grid-cols-3 gap-6 animate-in fade-in">
          <div className="col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Settings size={18}/> General Configuration</h3>
                  <div className="grid grid-cols-2 gap-6">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Campaign Name</label>
                          <input type="text" value={campaign.name} className="w-full p-2 border border-slate-200 rounded text-sm" readOnly />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Product Focus</label>
                          <input type="text" value={campaign.product} className="w-full p-2 border border-slate-200 rounded text-sm" readOnly />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Start Date</label>
                          <input type="date" value={campaign.startDate} className="w-full p-2 border border-slate-200 rounded text-sm" readOnly />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">End Date</label>
                          <input type="date" value={campaign.endDate} className="w-full p-2 border border-slate-200 rounded text-sm" readOnly />
                      </div>
                  </div>
                  <div className="mt-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                      <textarea className="w-full p-2 border border-slate-200 rounded text-sm" rows="3" value={campaign.description} readOnly></textarea>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><DollarSign size={18}/> Incentive Structure</h3>
                  <div className="space-y-4">
                      {['Bronze Slab (₹5L - ₹10L)', 'Silver Slab (₹10L - ₹25L)', 'Gold Slab (₹25L+)'].map((s, i) => (
                          <div key={i} className="flex items-center gap-4 p-3 border border-slate-100 rounded bg-slate-50">
                              <div className={`w-2 h-8 rounded ${i===0?'bg-orange-400':i===1?'bg-slate-400':'bg-yellow-400'}`}></div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-700">{s}</p>
                                  <p className="text-xs text-slate-500">Payout: {i===0?'1%':i===1?'1.5%':'2.5%'} of GWP</p>
                              </div>
                              <button className="text-blue-600 text-xs font-medium">Edit</button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Target size={18}/> Targets</h3>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Total GWP Target</span>
                          <span className="font-bold text-slate-800">{formatCompactCurrency(campaign.target)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Min. Active Partners</span>
                          <span className="font-bold text-slate-800">200</span>
                      </div>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Briefcase size={18}/> Team Access</h3>
                  <div className="space-y-2">
                      {['Irfan Sheikh (Owner)', 'Sarah Jones', 'Mike Chen'].map((u,i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                              <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold">{u.charAt(0)}</div>
                              {u}
                          </div>
                      ))}
                  </div>
                  <button className="mt-4 w-full py-2 border border-dashed border-slate-300 rounded text-xs font-medium text-slate-500 hover:bg-slate-50">+ Add Member</button>
              </div>
              <button className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-100">Close Campaign Early</button>
          </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right duration-300 bg-white/50">
       <div className="bg-white border-b border-slate-200 sticky top-0 z-20 -mx-8 -mt-8 px-8 pt-8 pb-0 mb-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                   <ChevronLeft size={24} />
                </button>
                <div>
                   <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-slate-800">{campaign.name}</h1>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase bg-${campaign.color}-100 text-${campaign.color}-700`}>{campaign.status}</span>
                   </div>
                   <p className="text-sm text-slate-500 mt-1">
                      ID: {campaign.id} • {campaign.startDate} to {campaign.endDate} • <span className="text-amber-600 font-medium">12 Days Remaining</span>
                   </p>
                </div>
             </div>
             <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                   <Megaphone size={16} /> Broadcast
                </button>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                   <Download size={16} /> Report
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                   <Edit size={16} /> Edit Config
                </button>
             </div>
          </div>

          <div className="flex gap-8">
             {['Overview', 'Partners', 'Calling Activity', 'Performance Analytics', 'Leaderboard', 'Communication', 'Settings'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveSubTab(tab.toLowerCase())}
                  className={`pb-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                     activeSubTab === tab.toLowerCase() ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                   {tab}
                </button>
             ))}
          </div>
       </div>

       <div className="flex-1 overflow-y-auto pb-12 px-2">
          {activeSubTab === 'overview' && renderOverview()}
          {activeSubTab === 'partners' && renderPartners()}
          {activeSubTab === 'calling activity' && renderCalling()}
          {activeSubTab === 'performance analytics' && renderPerformance()}
          {activeSubTab === 'leaderboard' && renderLeaderboard()}
          {activeSubTab === 'communication' && renderCommunication()}
          {activeSubTab === 'settings' && renderSettings()}
       </div>
    </div>
  );
};

const CampaignsTab = () => {
  const [selected, setSelected] = useState(null);
  return selected ? <CampaignDetail campaign={selected} onBack={() => setSelected(null)} /> : <CampaignList onSelectCampaign={setSelected} />;
};

// --- Analytics ---
const AnalyticsTab = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><BarChart2 className="text-blue-500" /> Performance Analytics</h2>
      <div className="flex gap-2"><button className="px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-600"><Download size={16} /> Export</button></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Gross Written Premium vs Policy Count</h3>
        <DualAxisBarChart data={ANALYTICS_DATA.trend} xAxisKey="month" barKey="premium" lineKey="policies" formatYAxis={(val: number) => `₹${val.toFixed(1)} Cr`} tooltipFormat={{ bar: 'GWP (Cr)', line: 'Policies' }} />
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
        <h3 className="font-bold text-slate-800 self-start w-full mb-4">Portfolio Mix (YTD)</h3>
        <div className="py-4"><DonutChart data={ANALYTICS_DATA.mix} size={180} strokeWidth={20} centerValue="100%" centerLabel="Total Mix" /></div>
        <div className="w-full grid grid-cols-2 gap-3 mt-6">
          {ANALYTICS_DATA.mix.map((item, i) => (
            <div key={i} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${item.tailwindClass}`}></div><div className="flex-1"><p className="text-xs text-slate-500">{item.name}</p><p className="text-sm font-bold text-slate-800">{item.value}%</p></div></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- Comm Hub ---
const CommunicationHub = () => {
  const [activeView, setActiveView] = useState('logs'); // 'logs' or 'messages'
  const [selectedComm, setSelectedComm] = useState<any>(MOCK_COMMS[0]);
  const [logFilter, setLogFilter] = useState('All');

  const filteredLogs = MOCK_CALL_LOGS_DETAILED.filter(log => logFilter === 'All' || log.type === logFilter);

  const renderCallLogs = () => (
    <div className="h-full flex flex-col gap-6 animate-in fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
            {COMM_HUB_KPIS.map((kpi, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-2xl font-bold text-slate-800">{kpi.value}</h3>
                            <span className={`text-xs font-bold ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {kpi.change}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{kpi.subtext}</p>
                    </div>
                    <div className={`p-2.5 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600`}>
                        <kpi.icon size={20} />
                    </div>
                </div>
            ))}
        </div>

        {/* Filters & Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex gap-2">
                    {['All', 'Incoming', 'Outgoing', 'Abandon'].map(f => (
                        <button 
                            key={f} 
                            onClick={() => setLogFilter(f)} 
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                logFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                        <Download size={14}/> Export Logs
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Partner</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Type / Status</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Date & Time</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Disposition</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Talk Time / Duration</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">MTD Connect / Attempt</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredLogs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-slate-800">{log.partner}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`flex items-center gap-1.5 text-xs font-bold ${
                                            log.type === 'Incoming' ? 'text-green-600' : 
                                            log.type === 'Outgoing' ? 'text-blue-600' : 'text-red-500'
                                        }`}>
                                            {log.type === 'Incoming' ? <ArrowDown size={12}/> : 
                                            log.type === 'Outgoing' ? <ArrowUp size={12}/> : <X size={12}/>}
                                            {log.type}
                                        </span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{log.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{log.dateTime}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700">{log.disposition}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-700">{log.talkTime}</span>
                                        <span className="text-xs text-slate-400">Total: {log.duration}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-700">{log.mtdConnects}</span>
                                        <span className="text-slate-400">/</span>
                                        <span className="text-slate-600">{log.mtdAttempts}</span>
                                        <div className="h-1 w-12 bg-slate-100 rounded-full ml-2 overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500" 
                                                style={{width: `${Math.min((log.mtdConnects/(log.mtdAttempts||1))*100, 100)}%`}}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600">
                                        <PlayCircle size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Phone className="text-blue-500" /> Communication Hub
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveView('logs')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeView === 'logs' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                  Call Logs
              </button>
              <button 
                onClick={() => setActiveView('messages')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeView === 'messages' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                  Messages
              </button>
          </div>
      </div>

      <div className="flex-1 overflow-hidden">
          {activeView === 'logs' ? renderCallLogs() : (
            <div className="flex h-full gap-6">
                <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50"><h3 className="font-bold text-slate-700">Inbox</h3></div>
                    <div className="flex-1 overflow-y-auto">
                    {MOCK_COMMS.map(comm => (
                        <div key={comm.id} onClick={() => setSelectedComm(comm)} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${selectedComm.id === comm.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
                        <div className="flex justify-between items-start mb-1"><span className="font-bold text-sm text-slate-700">{comm.partner}</span><span className="text-[10px] text-slate-400">{comm.time}</span></div>
                        <p className="text-xs font-medium text-slate-800 mb-1">{comm.subject}</p>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
                    {selectedComm ? (
                    <>
                        <div className="p-6 border-b border-slate-100"><h2 className="text-xl font-bold text-slate-800">{selectedComm.subject}</h2><div className="flex items-center gap-2 text-sm text-slate-500 mt-1"><span className="font-medium">{selectedComm.partner}</span> • <span>{selectedComm.time}</span></div></div>
                        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30"><div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"><p className="text-slate-800 text-sm whitespace-pre-line">{selectedComm.content}</p></div></div>
                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3"><button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"><Send size={16} /> Reply</button></div>
                    </>
                    ) : <div className="flex-1 flex items-center justify-center text-slate-400"><Inbox size={48} className="mb-4 opacity-20"/><p>Select a message</p></div>}
                </div>
            </div>
          )}
      </div>
    </div>
  );
};

// --- Tasks ---
const TasksView = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const toggleTask = (id: number) => setTasks(tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-slate-800">Task Board</h2><button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} /> New Task</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden">
        {['Overdue', 'Today', 'Upcoming'].map((status) => (
          <div key={status} className="bg-slate-50 rounded-xl p-4 flex flex-col h-full border border-slate-200/60">
             <h3 className="font-bold flex items-center gap-2 text-slate-700 mb-4">{status}</h3>
             <div className="space-y-3 overflow-y-auto flex-1 pr-1">
               {tasks.filter(t => (status === 'Overdue' && t.due === 'Overdue') || (status === 'Today' && t.due === 'Today') || (status === 'Upcoming' && (t.due !== 'Today' && t.due !== 'Overdue'))).map(task => (
                 <div key={task.id} className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 ${task.completed ? 'opacity-60 grayscale' : ''}`}>
                   <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-blue-100 text-blue-700">{task.type}</span>
                   <p className="text-sm font-semibold text-slate-800 mt-2">{task.title}</p>
                   <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50"><span className="flex items-center gap-1 text-slate-400 text-xs"><Clock size={12}/> {task.time}</span><button onClick={() => toggleTask(task.id)}><CheckCircle size={20} className={task.completed ? 'text-green-500 fill-current' : 'text-slate-300'}/></button></div>
                 </div>
               ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Tickets Components ---
const TicketList = ({ onSelectTicket }: any) => {
    const [statusFilter, setStatusFilter] = useState('All');
    const filteredTickets = MOCK_TICKETS.filter(t => statusFilter === 'All' || t.status === statusFilter);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex flex-col gap-4">
                 <div className="flex gap-2 overflow-x-auto pb-1">{['All', 'Open', 'In Progress', 'Resolved'].map(s => (<button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${statusFilter === s ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200'}`}>{s}</button>))}</div>
             </div>
             <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm"><tr><th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">ID</th><th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Subject</th><th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Partner</th><th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">{filteredTickets.map(t => (<tr key={t.id} onClick={() => onSelectTicket(t)} className="hover:bg-slate-50 cursor-pointer"><td className="px-6 py-4 text-xs font-mono">{t.id}</td><td className="px-6 py-4 text-sm font-medium text-slate-800">{t.subject}</td><td className="px-6 py-4 text-sm text-slate-700">{t.partner}</td><td className="px-6 py-4"><span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">{t.status}</span></td></tr>))}</tbody>
                </table>
             </div>
        </div>
    );
};

const CreateTicketForm = ({ preFillData, onClose, onSubmit }: any) => {
    const [formData, setFormData] = useState({ partner: preFillData?.name || '', type: 'Technical/system issue', priority: 'Normal', subject: '' });
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"><h2 className="text-lg font-bold text-slate-800">Raise New Ticket</h2><button onClick={onClose}><X size={20} className="text-slate-500"/></button></div>
            <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                <div><label className="text-xs font-bold text-slate-500 uppercase">Partner</label><input type="text" value={formData.partner} onChange={e=>setFormData({...formData, partner: e.target.value})} className="w-full p-2 border rounded-lg mt-1"/></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase">Subject</label><input type="text" className="w-full p-2 border rounded-lg mt-1"/></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase">Description</label><textarea className="w-full p-2 border rounded-lg mt-1" rows={4}/></div>
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3"><button onClick={onClose} className="px-6 py-2 border rounded-lg">Cancel</button><button onClick={() => onSubmit(formData)} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Submit</button></div>
        </div>
    );
};

const TicketDetail = ({ ticket, onBack }: any) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
            <div className="flex items-start gap-4"><button onClick={onBack}><ChevronLeft size={20} /></button><div><h2 className="text-xl font-bold text-slate-800">{ticket.id}: {ticket.subject}</h2><p className="text-sm text-slate-500">{ticket.partner} • {ticket.created}</p></div></div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-8"><p className="text-sm text-slate-700">Detailed description placeholder...</p></div>
            <h3 className="font-bold text-slate-800 mb-4">Activity Timeline</h3>
            <div className="border-l-2 border-slate-200 ml-2 space-y-8 pl-6 relative">
               {MOCK_TICKET_HISTORY.map((event, i) => (
                    <div key={i} className="relative"><div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-sm"></div><div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm"><p className="text-xs font-bold text-slate-700 mb-1">{event.author} <span className="text-slate-400 font-normal">• {event.time}</span></p><p className="text-sm text-slate-600">{event.text}</p></div></div>
                ))}
            </div>
        </div>
    </div>
);

const TicketAnalytics = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full p-6 overflow-y-auto">
         <h2 className="text-lg font-bold text-slate-800 mb-6">Support Analytics</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100"><p className="text-xs font-bold text-blue-600 uppercase">Avg Resolution Time</p><p className="text-2xl font-bold text-slate-800 mt-1">4.2 Hours</p></div>
            <div className="p-4 rounded-xl bg-green-50 border border-green-100"><p className="text-xs font-bold text-green-600 uppercase">SLA Compliance</p><p className="text-2xl font-bold text-slate-800 mt-1">94.5%</p></div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100"><p className="text-xs font-bold text-amber-600 uppercase">Pending Escalations</p><p className="text-2xl font-bold text-slate-800 mt-1">3</p></div>
         </div>
    </div>
);

const TicketsTab = ({ preFillPartner, clearPreFill }: any) => {
    const [view, setView] = useState('list'); 
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    useEffect(() => { if (preFillPartner) setView('create'); }, [preFillPartner]);

    const handleCreateSubmit = () => { alert('Ticket Created!'); setView('list'); if(clearPreFill) clearPreFill(); };
    const handleBack = () => { setView('list'); setSelectedTicket(null); if(clearPreFill) clearPreFill(); };

    return (
        <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500">
            {view !== 'create' && view !== 'detail' && (
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><FileText className="text-blue-500" /> Support Tickets</h2></div>
                    <div className="flex gap-2">
                        <button onClick={() => setView('list')} className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-800">All Tickets</button>
                        <button onClick={() => setView('analytics')} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800">Analytics</button>
                        <button onClick={() => setView('create')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ml-2"><Plus size={16} /> Raise Ticket</button>
                    </div>
                </div>
            )}
            <div className="flex-1 overflow-hidden">
                {view === 'list' && <TicketList onSelectTicket={(t: Ticket) => { setSelectedTicket(t); setView('detail'); }} />}
                {view === 'create' && <CreateTicketForm preFillData={preFillPartner} onClose={handleBack} onSubmit={handleCreateSubmit} />}
                {view === 'detail' && selectedTicket && <TicketDetail ticket={selectedTicket} onBack={handleBack} />}
                {view === 'analytics' && <TicketAnalytics />}
            </div>
        </div>
    );
};

const ReportsTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full p-6 animate-in fade-in">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><FileBarChart className="text-blue-500"/> Reports Center</h2>
        <div className="grid grid-cols-3 gap-6">
            {['Sales Register', 'Commission Statement', 'Campaign Performance', 'Renewal Lapse List', 'Ticket Summary'].map((r,i) => (
                <div key={i} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"><FileText size={24}/></div>
                        <Download size={20} className="text-slate-300 group-hover:text-blue-500"/>
                    </div>
                    <h3 className="font-bold text-slate-800">{r}</h3>
                    <p className="text-xs text-slate-500 mt-1">Last generated: Yesterday</p>
                </div>
            ))}
        </div>
    </div>
);

const SettingsTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full p-6 animate-in fade-in">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Settings className="text-slate-500"/> Preferences</h2>
        <div className="max-w-2xl space-y-8">
            <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase border-b border-slate-100 pb-2 mb-4">Profile Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label><input type="text" defaultValue="Irfan Sheikh" className="w-full p-2 border border-slate-300 rounded"/></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" defaultValue="alex.m@insure.com" className="w-full p-2 border border-slate-300 rounded" disabled/></div>
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase border-b border-slate-100 pb-2 mb-4">Notifications</h3>
                <div className="space-y-3">
                    {['Email Alerts for New Tickets', 'Daily Performance Digest', 'Campaign Milestone Alerts'].map((n,i) => (
                        <label key={i} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded"/>
                            <span className="text-sm text-slate-700">{n}</span>
                        </label>
                    ))}
                </div>
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Changes</button>
        </div>
    </div>
);

// ==========================================
// 5. MAIN APPLICATION
// ==========================================

export default function PartnerApp() {
  const [activeTab, setActiveTab] = useState('cockpit'); // Default to Cockpit
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(MOCK_PARTNERS[0]); // Default to first partner
  const [ticketPreFill, setTicketPreFill] = useState<Partner | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handlePartnerSelect = (partner: Partner) => {
    setSelectedPartner(partner);
    setActiveTab('cockpit');
  };

  const handleRaiseTicketFrom360 = (partner: Partner) => {
      setTicketPreFill(partner);
      setActiveTab('tickets');
  };

  const renderContent = () => {
    if (activeTab === 'cockpit') {
        if (selectedPartner) {
            return <Partner360 partner={selectedPartner} onBack={() => setSelectedPartner(null)} onRaiseTicket={() => handleRaiseTicketFrom360(selectedPartner)} />;
        } else {
            return (
                <div className="flex flex-col h-full animate-in fade-in">
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Partner 360 Cockpit</h1>
                            <p className="text-slate-500 text-sm mt-1">Select a partner to view their comprehensive 360° profile, business, and support details.</p>
                        </div>
                    </div>
                    <PartnersTab setPartnerView={handlePartnerSelect} />
                </div>
            );
        }
    }

    switch (activeTab) {
      case 'dashboard': return <DashboardTab setPartnerView={handlePartnerSelect} />;
      case 'partners': return <PartnersTab setPartnerView={handlePartnerSelect} />;
      case 'analytics': return <AnalyticsTab />;
      case 'comm': return <CommunicationHub />;
      case 'tasks': return <TasksView />;
      case 'campaigns': return <CampaignsTab />;
      case 'tickets': return <TicketsTab preFillPartner={ticketPreFill} clearPreFill={() => setTicketPreFill(null)} />;
      case 'reports': return <ReportsTab />;
      case 'settings': return <SettingsTab />;
      default: return <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-in fade-in"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-sm"><Settings size={32} className="text-slate-300" /></div><p className="text-lg font-medium text-slate-600">Module Under Construction</p></div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F7F9] font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className={`flex-1 flex flex-col h-screen overflow-hidden relative transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header isCollapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">{renderContent()}</main>
      </div>
    </div>
  );
}