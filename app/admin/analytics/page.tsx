// admin/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Calendar, Download, Filter,
  BarChart3, LineChart, PieChart, Activity, Users,
  Stethoscope, FlaskConical, Calendar as CalendarIcon,
  ArrowUpRight, ArrowDownRight, Eye, ChevronDown,
  DollarSign, Clock, CheckCircle2, XCircle, AlertCircle,
  Printer, Mail, Share2,
  Heart
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueChange: number;
    totalPatients: number;
    patientsChange: number;
    avgWaitTime: number;
    waitTimeChange: number;
    satisfactionRate: number;
    satisfactionChange: number;
  };
  revenueData: {
    month: string;
    revenue: number;
    appointments: number;
  }[];
  departmentData: {
    name: string;
    patients: number;
    revenue: number;
    occupancy: number;
  }[];
  doctorPerformance: {
    name: string;
    patients: number;
    revenue: number;
    rating: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  appointmentTrends: {
    date: string;
    completed: number;
    cancelled: number;
    noShow: number;
  }[];
  patientDemographics: {
    ageGroups: { group: string; count: number }[];
    gender: { male: number; female: number; other: number };
    topConditions: { condition: string; count: number }[];
  };
  operationalMetrics: {
    bedOccupancy: number;
    avgLengthOfStay: number;
    readmissionRate: number;
    emergencyWaitTime: number;
  };
}

// ─── Mock Data Generator ──────────────────────────────────────────────────
const generateMockData = (timeframe: string): AnalyticsData => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  let monthsToShow = 12;
  if (timeframe === '6M') monthsToShow = 6;
  if (timeframe === '3M') monthsToShow = 3;
  
  const displayMonths = months.slice(currentMonth - monthsToShow + 1, currentMonth + 1);
  
  return {
    overview: {
      totalRevenue: 2847500,
      revenueChange: 18.5,
      totalPatients: 12458,
      patientsChange: 12.3,
      avgWaitTime: 12.4,
      waitTimeChange: -8.2,
      satisfactionRate: 94.2,
      satisfactionChange: 3.1,
    },
    revenueData: displayMonths.map((month, i) => ({
      month,
      revenue: 180000 + Math.random() * 120000,
      appointments: 800 + Math.random() * 400,
    })),
    departmentData: [
      { name: 'Cardiology', patients: 2840, revenue: 892000, occupancy: 85 },
      { name: 'Neurology', patients: 1950, revenue: 624000, occupancy: 78 },
      { name: 'Orthopedics', patients: 2340, revenue: 715000, occupancy: 82 },
      { name: 'Pediatrics', patients: 3120, revenue: 468000, occupancy: 74 },
      { name: 'Radiology', patients: 1680, revenue: 532000, occupancy: 68 },
      { name: 'Emergency', patients: 4520, revenue: 1125000, occupancy: 92 },
    ],
    doctorPerformance: [
      { name: 'Dr. Rajesh Kumar', patients: 284, revenue: 89200, rating: 4.8, trend: 'up' },
      { name: 'Dr. Priya Singh', patients: 312, revenue: 96700, rating: 4.9, trend: 'up' },
      { name: 'Dr. Amit Patel', patients: 245, revenue: 76400, rating: 4.7, trend: 'stable' },
      { name: 'Dr. Sarah Johnson', patients: 278, revenue: 87100, rating: 4.8, trend: 'up' },
      { name: 'Dr. Michael Chen', patients: 198, revenue: 62300, rating: 4.5, trend: 'down' },
    ],
    appointmentTrends: displayMonths.map((_, i) => ({
      date: `Week ${i + 1}`,
      completed: 180 + Math.random() * 60,
      cancelled: 20 + Math.random() * 15,
      noShow: 8 + Math.random() * 10,
    })),
    patientDemographics: {
      ageGroups: [
        { group: '0-18', count: 2450 },
        { group: '19-35', count: 4120 },
        { group: '36-50', count: 3680 },
        { group: '51-65', count: 2840 },
        { group: '65+', count: 2368 },
      ],
      gender: { male: 6240, female: 5890, other: 328 },
      topConditions: [
        { condition: 'Hypertension', count: 2840 },
        { condition: 'Diabetes', count: 2450 },
        { condition: 'Arthritis', count: 1980 },
        { condition: 'Asthma', count: 1560 },
        { condition: 'Depression', count: 1240 },
      ],
    },
    operationalMetrics: {
      bedOccupancy: 78.5,
      avgLengthOfStay: 4.2,
      readmissionRate: 8.5,
      emergencyWaitTime: 24,
    },
  };
};

// ─── Chart Components ──────────────────────────────────────────────────────

function RevenueChart({ data }: { data: AnalyticsData['revenueData'] }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  return (
    <div className="mt-6">
      <div className="flex items-end gap-2 h-64">
        {data.map((item, i) => {
          const height = (item.revenue / maxRevenue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer group relative"
                style={{ height: `${height}%`, minHeight: '4px' }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ₹{(item.revenue / 1000).toFixed(1)}k
                </div>
              </div>
              <span className="text-xs text-slate-500 rotate-45 sm:rotate-0 origin-left">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DepartmentBarChart({ data }: { data: AnalyticsData['departmentData'] }) {
  const maxPatients = Math.max(...data.map(d => d.patients));
  
  return (
    <div className="space-y-3">
      {data.map((dept, i) => (
        <div key={i} className="group">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-700">{dept.name}</span>
            <span className="text-slate-500">{dept.patients} patients</span>
          </div>
          <div className="relative">
            <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg transition-all duration-500 flex items-center justify-end px-2"
                style={{ width: `${(dept.patients / maxPatients) * 100}%` }}
              >
                <span className="text-xs text-white font-medium">
                  ₹{(dept.revenue / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon,
  trend 
}: { 
  title: string; 
  value: string | number; 
  change: number; 
  icon: any;
  trend: 'up' | 'down';
}) {
  const isPositive = change > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
        }`}>
          <TrendIcon className="w-3 h-3" />
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: AnalyticsData['doctorPerformance'][0] }) {
  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-red-600 bg-red-50',
    stable: 'text-slate-600 bg-slate-50'
  };
  
  const trendIcons = {
    up: <TrendingUp className="w-3 h-3" />,
    down: <TrendingDown className="w-3 h-3" />,
    stable: <Activity className="w-3 h-3" />
  };
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-slate-900 text-sm">{doctor.name}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-slate-500">{doctor.patients} patients</span>
          <span className="text-xs text-slate-500">₹{(doctor.revenue / 1000).toFixed(0)}k</span>
          <div className="flex items-center gap-0.5">
            <span className="text-xs font-medium text-amber-500">★</span>
            <span className="text-xs text-slate-600">{doctor.rating}</span>
          </div>
        </div>
      </div>
      <div className={`p-1.5 rounded-lg ${trendColors[doctor.trend]}`}>
        {trendIcons[doctor.trend]}
      </div>
    </div>
  );
}

function AgeGroupChart({ data }: { data: { group: string; count: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  
  return (
    <div className="space-y-3">
      {data.map((group, i) => {
        const percentage = (group.count / total) * 100;
        return (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">{group.group}</span>
              <span className="text-slate-500">{group.count} ({percentage.toFixed(0)}%)</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Analytics Page ──────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'3M' | '6M' | '1Y'>('1Y');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setData(generateMockData(timeframe));
      setLoading(false);
    }, 500);
  }, [timeframe]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">Comprehensive insights into hospital performance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 rounded-lg p-1">
                {(['3M', '6M', '1Y'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      timeframe === period 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Revenue"
            value={`₹${(data.overview.totalRevenue / 100000).toFixed(1)}L`}
            change={data.overview.revenueChange}
            icon={DollarSign}
            trend={data.overview.revenueChange > 0 ? 'up' : 'down'}
          />
          <MetricCard 
            title="Total Patients"
            value={data.overview.totalPatients.toLocaleString()}
            change={data.overview.patientsChange}
            icon={Users}
            trend={data.overview.patientsChange > 0 ? 'up' : 'down'}
          />
          <MetricCard 
            title="Avg. Wait Time"
            value={`${data.overview.avgWaitTime} min`}
            change={Math.abs(data.overview.waitTimeChange)}
            icon={Clock}
            trend={data.overview.waitTimeChange < 0 ? 'up' : 'down'}
          />
          <MetricCard 
            title="Satisfaction Rate"
            value={`${data.overview.satisfactionRate}%`}
            change={data.overview.satisfactionChange}
            icon={Activity}
            trend={data.overview.satisfactionChange > 0 ? 'up' : 'down'}
          />
        </div>

        {/* Revenue & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Revenue Overview</h3>
                <p className="text-sm text-slate-500 mt-1">Monthly revenue and appointment trends</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-600">Revenue</span>
                </div>
              </div>
            </div>
            <RevenueChart data={data.revenueData} />
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Department Performance</h3>
            <DepartmentBarChart data={data.departmentData} />
          </div>
        </div>

        {/* Doctor Performance & Appointment Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Top Performing Doctors</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-1">
              {data.doctorPerformance.map((doctor, i) => (
                <DoctorCard key={i} doctor={doctor} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Appointment Status Trends</h3>
            <div className="space-y-4">
              {data.appointmentTrends.slice(-4).map((week, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">{week.date}</span>
                    <div className="flex gap-3">
                      <span className="text-emerald-600">✓ {week.completed}</span>
                      <span className="text-amber-600">✗ {week.cancelled}</span>
                      <span className="text-red-600">! {week.noShow}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-emerald-500"
                      style={{ width: `${(week.completed / (week.completed + week.cancelled + week.noShow)) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-amber-500"
                      style={{ width: `${(week.cancelled / (week.completed + week.cancelled + week.noShow)) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-red-500"
                      style={{ width: `${(week.noShow / (week.completed + week.cancelled + week.noShow)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Demographics & Operational Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Age Distribution</h3>
            <AgeGroupChart data={data.patientDemographics.ageGroups} />
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Gender Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Male</span>
                  <span className="font-medium text-slate-900">{data.patientDemographics.gender.male}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(data.patientDemographics.gender.male / data.overview.totalPatients) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Female</span>
                  <span className="font-medium text-slate-900">{data.patientDemographics.gender.female}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: `${(data.patientDemographics.gender.female / data.overview.totalPatients) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Other</span>
                  <span className="font-medium text-slate-900">{data.patientDemographics.gender.other}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${(data.patientDemographics.gender.other / data.overview.totalPatients) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Medical Conditions</h3>
            <div className="space-y-3">
              {data.patientDemographics.topConditions.map((condition, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{condition.condition}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{condition.count}</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(condition.count / data.patientDemographics.topConditions[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Operational Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Bed Occupancy</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{data.operationalMetrics.bedOccupancy}%</span>
                <span className="text-xs text-emerald-600">Target: 85%</span>
              </div>
              <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${data.operationalMetrics.bedOccupancy}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Avg Length of Stay</p>
              <p className="text-2xl font-bold text-slate-900">{data.operationalMetrics.avgLengthOfStay} days</p>
              <p className="text-xs text-slate-500 mt-1">↓ 0.3 days from last month</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Readmission Rate</p>
              <p className="text-2xl font-bold text-slate-900">{data.operationalMetrics.readmissionRate}%</p>
              <p className="text-xs text-emerald-600 mt-1">↓ 1.2% below national avg</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Emergency Wait Time</p>
              <p className="text-2xl font-bold text-slate-900">{data.operationalMetrics.emergencyWaitTime} min</p>
              <p className="text-xs text-amber-600 mt-1">↑ 4 min from target</p>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-white/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-700 mb-1">Patient Growth</p>
            <p className="text-2xl font-bold text-blue-900 mb-1">+12.5%</p>
            <p className="text-xs text-blue-600">vs previous period</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-white/50 rounded-lg">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm text-emerald-700 mb-1">Operational Efficiency</p>
            <p className="text-2xl font-bold text-emerald-900 mb-1">+8.3%</p>
            <p className="text-xs text-emerald-600">improvement in throughput</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-white/50 rounded-lg">
                <Heart className="w-5 h-5 text-amber-600" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm text-amber-700 mb-1">Patient Satisfaction</p>
            <p className="text-2xl font-bold text-amber-900 mb-1">94.2%</p>
            <p className="text-xs text-amber-600">↑ 3.1% from last quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
}