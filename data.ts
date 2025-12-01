import { Partner, Note, Campaign, Ticket, CallLog, MarketingAsset, Task, Communication, AiTask, AiTalkingPoint, AnalyticsTrend } from './types';
import { CheckCircle, PhoneCall, Award, Phone, Activity, Clock } from 'lucide-react';

export const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
export const formatCompactCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return formatCurrency(amount);
};

export const MOCK_PARTNERS: Partner[] = [
  { 
    id: 'P001', name: 'Rajesh Kumar', code: 'IP88215', tier: 'Platinum', status: 'Active', 
    gwp: 12500000, policies: 1204, trend: 'up', phone: '+91 98765-43210', email: 'rajesh.k@example.com', score: 92, 
    lastContact: '2 days ago', lastDisposition: 'Interested', dispositionDate: '26 Oct 2023',
    potential: 2500000, mtdAchievement: 1800000, prevYearMTD: 1500000, currYearMTD: 1800000, mtdAttempts: 45, mtdConnects: 32, location: 'Mumbai'
  },
  { 
    id: 'P002', name: 'Priya Sharma', code: 'IP99321', tier: 'Gold', status: 'Active', 
    gwp: 8500000, policies: 850, trend: 'down', phone: '+91 98989-12345', email: 'priya.s@example.com', score: 78, 
    lastContact: '1 week ago', lastDisposition: 'Callback', dispositionDate: '20 Oct 2023',
    potential: 1500000, mtdAchievement: 600000, prevYearMTD: 800000, currYearMTD: 600000, mtdAttempts: 20, mtdConnects: 8, location: 'Pune'
  },
  { 
    id: 'P003', name: 'Amit Patel', code: 'IP77419', tier: 'Silver', status: 'NOC Shared', 
    gwp: 4200000, policies: 310, trend: 'flat', phone: '+91 99887-76655', email: 'amit.patel@example.com', score: 45, 
    lastContact: '3 weeks ago', lastDisposition: 'Not Reachable', dispositionDate: '05 Oct 2023',
    potential: 800000, mtdAchievement: 100000, prevYearMTD: 200000, currYearMTD: 100000, mtdAttempts: 15, mtdConnects: 2, location: 'Ahmedabad'
  },
  { 
    id: 'P004', name: 'Sneha Reddy', code: 'IP33214', tier: 'Gold', status: 'Active', 
    gwp: 9100000, policies: 920, trend: 'up', phone: '+91 91234-56789', email: 'sneha.r@example.com', score: 88, 
    lastContact: 'Yesterday', lastDisposition: 'Promise to Pay', dispositionDate: 'Yesterday',
    potential: 2000000, mtdAchievement: 1900000, prevYearMTD: 1200000, currYearMTD: 1900000, mtdAttempts: 50, mtdConnects: 45, location: 'Hyderabad'
  },
  { 
    id: 'P005', name: 'Vikram Singh', code: 'IP11293', tier: 'Bronze', status: 'Inactive', 
    gwp: 500000, policies: 45, trend: 'down', phone: '+91 98765-09876', email: 'vikram.s@example.com', score: 20, 
    lastContact: '2 months ago', lastDisposition: 'RNR', dispositionDate: '12 Aug 2023',
    potential: 500000, mtdAchievement: 0, prevYearMTD: 100000, currYearMTD: 0, mtdAttempts: 5, mtdConnects: 0, location: 'Delhi'
  },
  { 
    id: 'P006', name: 'Anjali Gupta', code: 'IP22318', tier: 'Platinum', status: 'Active', 
    gwp: 18000000, policies: 1500, trend: 'up', phone: '+91 99000-11223', email: 'anjali.g@example.com', score: 96, 
    lastContact: 'Today', lastDisposition: 'Service Query', dispositionDate: 'Today',
    potential: 3500000, mtdAchievement: 3100000, prevYearMTD: 2800000, currYearMTD: 3100000, mtdAttempts: 60, mtdConnects: 55, location: 'Bangalore'
  },
];

export const MOCK_PARTNER_NOTES: Note[] = [
    { id: 1, type: 'note', content: 'Discussed Q3 targets. Agreed to push Health products this week.', author: 'Irfan Sheikh', time: 'Today, 10:30 AM' },
    { id: 2, type: 'call', content: 'Outgoing Call: Connection successful. Discussed renewal list. Partner mentioned high volume of claims in last month.', author: 'Irfan Sheikh', time: 'Yesterday, 4:15 PM' },
    { id: 3, type: 'note', content: 'Partner requested marketing collateral for the new Monsoon campaign.', author: 'Irfan Sheikh', time: '2 days ago' },
    { id: 4, type: 'email', content: 'Incoming Email: Re: Commission discrepancy. Forwarded to finance.', author: 'Partner', time: '3 days ago' },
];

export const MOCK_MARKETING_ASSETS: MarketingAsset[] = [
  { id: 1, title: 'Monsoon Safety Tips', type: 'Image', thumbnail: '🌧️', description: 'Shareable infographic about car safety during heavy rains.', category: 'Motor' },
  { id: 2, title: 'Health Checkup Drive', type: 'Post', thumbnail: '🏥', description: 'Text template for announcing free health checkup camps.', category: 'Health' },
  { id: 3, title: 'Retirement Planning 101', type: 'Article', thumbnail: '👴', description: 'Educational article link for customers planning retirement.', category: 'Life' },
  { id: 4, title: 'Diwali Bonanza Offer', type: 'Image', thumbnail: '🪔', description: 'Festive greeting card with discount codes.', category: 'General' },
  { id: 5, title: 'Claim Settlement Ratio', type: 'Infographic', thumbnail: '📊', description: 'Visual chart showing our 98% claim settlement ratio.', category: 'General' },
];

export const ANALYTICS_DATA = {
  trend: [
    { month: 'Apr', premium: 1.2, policies: 400 },
    { month: 'May', premium: 1.4, policies: 450 },
    { month: 'Jun', premium: 1.3, policies: 420 },
    { month: 'Jul', premium: 1.8, policies: 580 },
    { month: 'Aug', premium: 1.6, policies: 510 },
    { month: 'Sep', premium: 2.1, policies: 650 },
  ],
  mix: [
    { name: 'Health', value: 45, tailwindClass: 'bg-blue-500', colorHex: '#3b82f6' },
    { name: 'Motor', value: 30, tailwindClass: 'bg-teal-400', colorHex: '#2dd4bf' },
    { name: 'Life', value: 15, tailwindClass: 'bg-indigo-500', colorHex: '#6366f1' },
    { name: 'SME/Comm', value: 10, tailwindClass: 'bg-orange-400', colorHex: '#fb923c' },
  ]
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  { 
    id: 'CAM-2023-001', name: 'Monsoon Safety Drive', status: 'Active', product: 'Motor', 
    startDate: '2023-09-01', endDate: '2023-10-31', 
    achieved: 4500000, target: 6700000, 
    policies: 234, enrolled: 150, activePartners: 89, 
    description: 'Push for Motor OD policies during monsoon season.',
    color: 'blue'
  },
  { 
    id: 'CAM-2023-002', name: 'Health Wealth Q3', status: 'Active', product: 'Health', 
    startDate: '2023-10-01', endDate: '2023-12-31', 
    achieved: 12000000, target: 15000000, 
    policies: 560, enrolled: 200, activePartners: 145,
    description: 'Strategic push for comprehensive health covers.',
    color: 'teal'
  },
];

export const CAMPAIGN_LEADERBOARD = [
  { rank: 1, name: 'Rajesh Kumar', premium: 1250000, policies: 45, slab: 'Platinum', gap: 0 },
  { rank: 2, name: 'Anjali Gupta', premium: 980000, policies: 32, slab: 'Gold', gap: 220000 },
  { rank: 3, name: 'Sneha Reddy', premium: 850000, policies: 28, slab: 'Gold', gap: 350000 },
  { rank: 4, name: 'Priya Sharma', premium: 620000, policies: 20, slab: 'Silver', gap: 130000 },
  { rank: 5, name: 'Amit Patel', premium: 410000, policies: 15, slab: 'Bronze', gap: 90000 },
];

export const CAMPAIGN_PARTNERS_DETAIL = [
    { id: 1, name: 'Rajesh Kumar', tier: 'Platinum', target: 500000, achieved: 450000, policies: 12, status: 'On Track', lastContact: 'Yesterday', rank: 1 },
    { id: 2, name: 'Anjali Gupta', tier: 'Gold', target: 300000, achieved: 280000, policies: 8, status: 'On Track', lastContact: '2 days ago', rank: 2 },
    { id: 3, name: 'Amit Patel', tier: 'Silver', target: 150000, achieved: 20000, policies: 1, status: 'At Risk', lastContact: '5 days ago', rank: 45 },
    { id: 4, name: 'Priya Sharma', tier: 'Gold', target: 300000, achieved: 150000, policies: 5, status: 'Lagging', lastContact: '1 week ago', rank: 12 },
    { id: 5, name: 'Vikram Singh', tier: 'Bronze', target: 50000, achieved: 0, policies: 0, status: 'Dormant', lastContact: 'Never', rank: '-' },
];

export const CAMPAIGN_CALL_LOGS = [
    { id: 1, partner: 'Rajesh Kumar', time: 'Today, 10:30 AM', duration: '4m 12s', outcome: 'Interested', note: 'Agreed to push 3 more policies by Friday.' },
    { id: 2, partner: 'Amit Patel', time: 'Yesterday, 2:15 PM', duration: '1m 05s', outcome: 'Callback', note: 'Busy, requested callback tomorrow.' },
    { id: 3, partner: 'Vikram Singh', time: 'Yesterday, 11:00 AM', duration: '0m 45s', outcome: 'Not Reachable', note: 'Voicemail left.' },
    { id: 4, partner: 'Priya Sharma', time: '2 Oct, 4:00 PM', duration: '12m 30s', outcome: 'Objection', note: 'Complained about claim settlement delay. Raised ticket.' },
];

export const CAMPAIGN_MESSAGES = [
    { id: 1, subject: 'Monsoon Drive: 10 Days Left!', sent: '2023-10-20', channel: 'WhatsApp', audience: 145, openRate: '88%', clicks: '45%' },
    { id: 2, subject: 'Double Commission Weekend', sent: '2023-10-15', channel: 'Email', audience: 150, openRate: '42%', clicks: '12%' },
    { id: 3, subject: 'Campaign Launch Details', sent: '2023-09-01', channel: 'All', audience: 150, openRate: '95%', clicks: '70%' },
];

export const CAMPAIGN_INSIGHTS = [
    { type: 'success', text: 'Campaign pacing well, 67% target with 12 days left.' },
    { type: 'warning', text: '15 partners contacted but no business - need support?' },
    { type: 'info', text: 'Top product: Health (₹30L), Motor lagging (₹8L).' },
    { type: 'danger', text: 'Call connect rate dropped to 65% this week vs 78% last week.' },
];

export const CAMPAIGN_ACTIVITY = [
    { time: 'Today 11:30 AM', text: 'Partner Rajesh closed ₹50K Health policy.', icon: CheckCircle, col: 'green' },
    { time: 'Today 9:15 AM', text: 'RM Alex completed call with Partner Amit - Follow-up scheduled.', icon: PhoneCall, col: 'blue' },
    { time: 'Yesterday', text: '5 partners crossed Silver slab.', icon: Award, col: 'amber' },
];

export const MOCK_TICKETS: Ticket[] = [
  { id: 'T-10234', partner: 'Rajesh Kumar', subject: 'Commission mismatch for Aug', type: 'Payout/commission query', priority: 'High', status: 'Open', created: '2023-10-25', lastUpdate: '2 hours ago', slaHours: 4, assignedTo: 'Irfan Sheikh' },
  { id: 'T-10235', partner: 'Anjali Gupta', subject: 'Login failing on mobile app', type: 'Technical/system issue', priority: 'Medium', status: 'In Progress', created: '2023-10-24', lastUpdate: '1 day ago', slaHours: -5, assignedTo: 'Tech Support' },
  { id: 'T-10236', partner: 'Amit Patel', subject: 'Policy #9981 not received', type: 'Offline policy mapping', priority: 'Low', status: 'Resolved', created: '2023-10-20', lastUpdate: '3 days ago', slaHours: 0, assignedTo: 'Ops Team' },
  { id: 'T-10237', partner: 'Priya Sharma', subject: 'Urgent: Quote Engine Timeout', type: 'Technical/system issue', priority: 'High', status: 'Open', created: '2023-10-26', lastUpdate: '30 mins ago', slaHours: 23, assignedTo: 'Tech Support' },
  { id: 'T-10238', partner: 'Sneha Reddy', subject: 'KYC Document Rejection Reason', type: 'Compliance/KYC issue', priority: 'Medium', status: 'Pending Info', created: '2023-10-23', lastUpdate: '2 days ago', slaHours: 12, assignedTo: 'Compliance' },
  { id: 'T-10239', partner: 'Vikram Singh', subject: 'Claim Status for Policy #7762', type: 'Customer complaint', priority: 'High', status: 'In Progress', created: '2023-10-26', lastUpdate: '4 hours ago', slaHours: 20, assignedTo: 'Claims Dept' },
];

export const MOCK_TICKET_HISTORY = [
    { id: 1, type: 'status', text: 'Status changed from Open to In Progress', time: 'Yesterday, 2:00 PM', author: 'Irfan Sheikh' },
    { id: 2, type: 'note', text: 'Internal Note: escalated to L2 support due to recurring error.', time: 'Yesterday, 2:05 PM', author: 'Irfan Sheikh' },
    { id: 3, type: 'comm', text: 'Email sent to Partner: "We are looking into the issue, please expect a resolution by EOD."', time: 'Yesterday, 2:10 PM', author: 'System' },
];

export const MOCK_CALL_LOGS_DETAILED: CallLog[] = [
  { id: 'CL-001', partner: 'Rajesh Kumar', type: 'Outgoing', dateTime: '26 Oct 2023, 10:30 AM', disposition: 'Interested', talkTime: '04m 12s', duration: '05m 00s', mtdAttempts: 5, mtdConnects: 3, status: 'Completed' },
  { id: 'CL-002', partner: 'Priya Sharma', type: 'Incoming', dateTime: '26 Oct 2023, 09:15 AM', disposition: 'Service Query', talkTime: '02m 30s', duration: '03m 15s', mtdAttempts: 2, mtdConnects: 2, status: 'Completed' },
  { id: 'CL-003', partner: 'Amit Patel', type: 'Outgoing', dateTime: '25 Oct 2023, 04:45 PM', disposition: 'Not Reachable', talkTime: '00m 00s', duration: '00m 45s', mtdAttempts: 8, mtdConnects: 1, status: 'No Answer' },
  { id: 'CL-004', partner: 'Sneha Reddy', type: 'Abandon', dateTime: '25 Oct 2023, 02:00 PM', disposition: '-', talkTime: '00m 00s', duration: '00m 10s', mtdAttempts: 1, mtdConnects: 0, status: 'Missed' },
  { id: 'CL-005', partner: 'Vikram Singh', type: 'Outgoing', dateTime: '24 Oct 2023, 11:20 AM', disposition: 'Callback', talkTime: '01m 05s', duration: '01m 30s', mtdAttempts: 3, mtdConnects: 1, status: 'Scheduled' },
  { id: 'CL-006', partner: 'Anjali Gupta', type: 'Incoming', dateTime: '24 Oct 2023, 10:00 AM', disposition: 'Endorsement', talkTime: '05m 20s', duration: '06m 10s', mtdAttempts: 4, mtdConnects: 4, status: 'Completed' },
];

export const COMM_HUB_KPIS = [
    { label: 'Total Calls (Today)', value: '42', change: '+12%', subtext: 'vs yesterday', icon: Phone, color: 'blue' },
    { label: 'Connect Rate', value: '68%', change: '-2.5%', subtext: 'vs target 70%', icon: Activity, color: 'green' },
    { label: 'Avg Talk Time', value: '3m 45s', change: '+15s', subtext: 'efficient', icon: Clock, color: 'amber' },
    { label: 'Positive Outcomes', value: '18', change: '+4', subtext: 'leads generated', icon: CheckCircle, color: 'purple' },
];

export const RECENT_ALERTS = [
  { id: 1, msg: 'Rajesh Kumar reached Platinum Incentive Slab', type: 'success', time: '2h ago' },
  { id: 2, msg: '3 Tickets unresolved for >48 hours', type: 'danger', time: '5h ago' },
  { id: 3, msg: 'Amit Patel activity dropped by 40%', type: 'warning', time: '1d ago' },
];

export const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'Renewal Call - Rajesh Kumar', type: 'Call', due: 'Today', priority: 'High', completed: false, time: '2:00 PM' },
  { id: 2, title: 'Approve Commission - Priya Sharma', type: 'Admin', due: 'Today', priority: 'Medium', completed: false, time: '4:30 PM' },
  { id: 3, title: 'Campaign Briefing - Amit Patel', type: 'Meeting', due: 'Tomorrow', priority: 'Low', completed: false, time: '10:00 AM' },
];

export const MOCK_COMMS: Communication[] = [
  { id: 1, partner: 'Rajesh Kumar', type: 'Call', direction: 'Inbound', status: 'Missed', time: '10:30 AM', subject: 'Urgent: Policy Issuance', content: 'Tried to call regarding pending policy issuance for client Sharma. Please call back ASAP.', avatar: 'RK' },
  { id: 2, partner: 'Anjali Gupta', type: 'Email', direction: 'Inbound', status: 'Pending', time: '09:15 AM', subject: 'Commission Statement Inquiry', content: 'Hi Alex,\n\nI noticed a discrepancy in the August commission statement. Can we review this? Attached is the ledger I have on file.\n\nRegards,\nAnjali', avatar: 'AG' },
  { id: 3, partner: 'Priya Sharma', type: 'WhatsApp', direction: 'Outbound', status: 'Read', time: 'Yesterday', subject: 'Campaign Update', content: 'Hi Priya, just a reminder that the Monsoon Safety campaign ends in 12 days. You are very close to the next slab! Let me know if you need help with the leads.', avatar: 'PS' },
];

export const AI_BRIEFING = {
    summary: "Rajesh is trending upwards with a 15% MoM growth in Health GWP, showing strong retention in this segment. However, his Motor portfolio is stagnant. He recently raised a ticket regarding commission delays which was resolved yesterday, but sentiment might still be fragile. Focus on cross-selling Motor products to his existing Health customer base and reassuring him on the payout process.",
    tasks: [
      { id: 1, text: "Share 'Monsoon Safety' collateral for Motor cross-sell opportunities.", priority: 'High', status: 'pending' },
      { id: 2, text: "Confirm personal satisfaction regarding the resolution of Commission Ticket #T-10234.", priority: 'Medium', status: 'pending' },
      { id: 3, text: "Invite to next week's 'Health Wealth' exclusive webinar series.", priority: 'Low', status: 'pending' }
    ] as AiTask[],
    talkingPoints: [
      { 
        id: 1, 
        category: 'Appreciation', 
        topic: 'Health Portfolio Growth', 
        script: "I noticed the fantastic growth in your Health book this month—15% up! That's impressive. What's working well for you there?", 
        status: 'new'
      },
      { 
        id: 2, 
        category: 'Cross-sell', 
        topic: 'Motor Opportunity', 
        script: "Since you have strong relationships with these Health customers, have you pitched our new 'Pay-As-You-Drive' Motor add-on? It could be a great value-add for them.", 
        status: 'new' 
      },
      { 
        id: 3, 
        category: 'Service', 
        topic: 'Commission Issue Follow-up', 
        script: "I saw the finance team closed your commission query yesterday. Just wanted to personally check—are you satisfied with the explanation provided?", 
        status: 'new' 
      }
    ] as AiTalkingPoint[]
};
