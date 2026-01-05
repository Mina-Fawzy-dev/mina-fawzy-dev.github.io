
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { Users, Calendar, Activity, Filter, Tag, Church, CheckCircle2, XCircle, Clock, UserCheck } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

interface ReportsViewProps {
  onPersonClick?: (id: string) => void;
}

const ReportsView: React.FC<ReportsViewProps> = ({ onPersonClick }) => {
  const { state } = useStore();
  const t = translations[state.settings.language];
  const [period, setPeriod] = useState<'month' | 'all'>('all');
  const [catFilter, setCatFilter] = useState<string>('All');
  const [churchFilter, setChurchFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const churches = useMemo(() => {
    const list = Array.from(new Set(state.people.map(p => p.church).filter(Boolean)));
    return ['All', ...list];
  }, [state.people]);

  const stats = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const filteredPeople = state.people.filter(p => {
      if (p.isArchived) return false;
      const matchesCat = catFilter === 'All' || p.category === catFilter;
      const matchesChurch = churchFilter === 'All' || p.church === churchFilter;
      return matchesCat && matchesChurch;
    });

    const filteredPeopleIds = new Set(filteredPeople.map(p => p.id));

    const filteredApps = state.appointments.filter(a => {
      if (period === 'month') {
        const appDate = parseISO(a.date);
        if (!isWithinInterval(appDate, { start: monthStart, end: monthEnd })) return false;
      }
      return true;
    });

    const totalSessions = filteredApps.length;
    const completedSessions = filteredApps.filter(a => a.status === 'Completed').length;
    const upcomingSessions = filteredApps.filter(a => a.status === 'Upcoming').length;

    const totalAttendance = filteredApps
      .filter(a => a.status === 'Completed')
      .reduce((acc, app) =>
        acc + app.attendees.filter(att => att.status === 'Attended' && filteredPeopleIds.has(att.personId)).length, 0
      );

    return {
      totalPeople: filteredPeople.length,
      totalSessions,
      completedSessions,
      upcomingSessions,
      totalAttendance,
      averageAttendance: completedSessions > 0 ? Math.round(totalAttendance / completedSessions) : 0
    };
  }, [state.people, state.appointments, period, catFilter, churchFilter]);

  return (
    <div className="p-4 pt-6 space-y-6">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-3xl font-black tracking-tight">{t.reports}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl border transition-all ${showFilters ? 'app-bg-primary text-white border-transparent shadow-lg' : 'app-surface app-border app-text-muted'}`}
          >
            <Filter size={22} />
          </button>
          <div className="flex gap-1 app-surface p-1 rounded-[1.5rem] border app-border shadow-inner">
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 text-[9px] font-black uppercase rounded-xl transition-all ${period === 'month' ? 'app-bg shadow-md app-primary' : 'app-text-muted'}`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-4 py-2 text-[9px] font-black uppercase rounded-xl transition-all ${period === 'all' ? 'app-bg shadow-md app-primary' : 'app-text-muted'}`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="p-6 rounded-[2.5rem] border app-border app-surface mb-4 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
               <Tag size={12} className="app-primary" />
               <label className="text-[10px] font-black app-text-muted uppercase tracking-widest">Filter by Category</label>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {['All', ...state.settings.categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase transition-all ${
                    catFilter === cat ? 'app-bg-primary text-white' : 'app-bg app-text-muted border app-border'
                  }`}
                >
                  {cat === 'All' ? t.all : cat}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
               <Church size={12} className="app-primary" />
               <label className="text-[10px] font-black app-text-muted uppercase tracking-widest">Filter by Church</label>
            </div>
            <select className="w-full p-4 rounded-2xl border app-border app-bg app-text outline-none font-bold text-xs" value={churchFilter} onChange={e => setChurchFilter(e.target.value)}>
              {churches.map(c => <option key={c} value={c}>{c === 'All' ? t.all : c}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Basic Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[2.5rem] border app-border flex flex-col items-center text-center app-surface shadow-md">
          <div className="w-12 h-12 app-bg-primary-muted app-primary rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <Users size={24} />
          </div>
          <p className="text-[9px] app-text-muted font-black uppercase tracking-widest">Total People</p>
          <p className="text-3xl font-black mt-1 tracking-tight">{stats.totalPeople}</p>
        </div>
        <div className="p-6 rounded-[2.5rem] border app-border flex flex-col items-center text-center app-surface shadow-md">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <Calendar size={24} />
          </div>
          <p className="text-[9px] app-text-muted font-black uppercase tracking-widest">Total Sessions</p>
          <p className="text-3xl font-black mt-1 tracking-tight">{stats.totalSessions}</p>
        </div>
        <div className="p-6 rounded-[2.5rem] border app-border flex flex-col items-center text-center app-surface shadow-md">
          <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-[9px] app-text-muted font-black uppercase tracking-widest">Completed</p>
          <p className="text-3xl font-black mt-1 tracking-tight">{stats.completedSessions}</p>
        </div>
        <div className="p-6 rounded-[2.5rem] border app-border flex flex-col items-center text-center app-surface shadow-md">
          <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <Clock size={24} />
          </div>
          <p className="text-[9px] app-text-muted font-black uppercase tracking-widest">Upcoming</p>
          <p className="text-3xl font-black mt-1 tracking-tight">{stats.upcomingSessions}</p>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="p-6 rounded-[2.5rem] border app-border app-surface shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <UserCheck size={20} className="app-primary" />
          <h3 className="text-lg font-black tracking-tight">Attendance Summary</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-4xl font-black app-primary mb-2">{stats.totalAttendance}</p>
            <p className="text-[10px] app-text-muted font-black uppercase tracking-widest">Total Attendees</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black app-primary mb-2">{stats.averageAttendance}</p>
            <p className="text-[10px] app-text-muted font-black uppercase tracking-widest">Avg per Session</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4 pb-4">
        <h3 className="text-xl font-black flex items-center gap-3 px-2">
          <Activity size={22} className="app-primary" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {state.appointments
            .filter(a => period === 'month' ?
              isWithinInterval(parseISO(a.date), { start: startOfMonth(new Date()), end: endOfMonth(new Date()) }) :
              true
            )
            .sort((a,b) => b.date.localeCompare(a.date))
            .slice(0, 5)
            .map(appointment => (
            <div key={appointment.id} className="p-4 rounded-[1.5rem] border app-border app-surface shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
                    appointment.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    appointment.status === 'Upcoming' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {appointment.status === 'Completed' ? <CheckCircle2 size={20} /> :
                     appointment.status === 'Upcoming' ? <Clock size={20} /> :
                     <XCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-black text-sm">{format(parseISO(appointment.date), 'MMM dd, yyyy')}</p>
                    <p className="text-[10px] app-text-muted uppercase font-black tracking-widest">
                      {appointment.attendees.length} {appointment.attendees.length === 1 ? 'person' : 'people'} • {appointment.status}
                    </p>
                  </div>
                </div>
                {appointment.time && (
                  <div className="text-right">
                    <p className="text-xs font-bold app-text-muted">{appointment.time}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {state.appointments.length === 0 && (
            <div className="text-center py-16 app-text-muted">
              <Activity size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-black uppercase text-xs tracking-widest">No sessions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
