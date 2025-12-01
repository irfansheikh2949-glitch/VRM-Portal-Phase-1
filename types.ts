export interface Partner {
  id: string;
  name: string;
  code: string;
  tier: string;
  status: string;
  gwp: number;
  policies: number;
  trend: string;
  phone: string;
  email: string;
  score: number;
  lastContact: string;
  lastDisposition: string;
  dispositionDate: string;
  potential: number;
  mtdAchievement: number;
  prevYearMTD: number;
  currYearMTD: number;
  mtdAttempts: number;
  mtdConnects: number;
  location?: string;
}

export interface Note {
  id: number;
  type: 'note' | 'call' | 'email';
  content: string;
  author: string;
  time: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  product: string;
  startDate: string;
  endDate: string;
  achieved: number;
  target: number;
  policies: number;
  enrolled: number;
  activePartners: number;
  description: string;
  color: string;
}

export interface Ticket {
  id: string;
  partner: string;
  subject: string;
  type: string;
  priority: string;
  status: string;
  created: string;
  lastUpdate: string;
  slaHours: number;
  assignedTo: string;
}

export interface CallLog {
  id: string;
  partner: string;
  type: string;
  dateTime: string;
  disposition: string;
  talkTime: string;
  duration: string;
  mtdAttempts: number;
  mtdConnects: number;
  status: string;
}

export interface MarketingAsset {
  id: number;
  title: string;
  type: string;
  thumbnail: string;
  description: string;
  category: string;
}

export interface Task {
  id: number;
  title: string;
  type: string;
  due: string;
  priority: string;
  completed: boolean;
  time: string;
}

export interface Communication {
  id: number;
  partner: string;
  type: string;
  direction: string;
  status: string;
  time: string;
  subject: string;
  content: string;
  avatar: string;
}

export interface AiTask {
  id: number;
  text: string;
  priority: string;
  status: 'pending' | 'completed';
}

export interface AiTalkingPoint {
  id: number;
  category: string;
  topic: string;
  script: string;
  status: 'new' | 'completed' | 'pending';
}

export interface AnalyticsTrend {
  month: string;
  premium: number;
  policies: number;
}
