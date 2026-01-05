
import React, { useState } from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { Calendar as CalendarIcon, List, Check, X, Clock, Plus, ChevronLeft, ChevronRight, User, Users, RotateCcw, AlertCircle, Sun, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';

const AgendaView: React.FC = () => {
  const { state, finalizeAppointment, unfinalizeAppointment, updateAppointmentAttendance, addAppointment, deleteAppointment, addToast } = useStore();
  const t = translations[state.settings.language];
  const isRTL = state.settings.language === 'ar';
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAppDate, setNewAppDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newAppTime, setNewAppTime] = useState('10:00');
  const [useSpecificTime, setUseSpecificTime] = useState(false);
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const inputClasses = `w-full p-4 rounded-xl border transition-all duration-200 outline-none app-bg app-text font-medium text-sm focus:ring-2 focus:ring-indigo-500/20`;

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getAppointmentsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return state.appointments.filter(app => app.date === dayStr);
  };

  const handleRevert = (appId: string) => {
    if (window.confirm(t.revertConfirm)) {
      unfinalizeAppointment(appId);
    }
  };

  const AppointmentCard = ({ app, key }: { app: any; key?: string }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.deleteConfirm || 'Are you sure you want to delete this appointment?')) {
      deleteAppointment(app.id);
    }
  };

  return (
    <div key={app.id} className="p-6 rounded-[2.2rem] border app-border app-surface shadow-lg animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 app-primary font-black text-xl tracking-tight">
            {app.time ? <Clock size={20} /> : <Sun size={20} />}
            {app.time || t.allDay}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black app-text-muted uppercase tracking-widest">
              {app.type === 'Group' ? t.group : t.individual} Session
            </span>
            <span className="text-[10px] app-text-muted font-bold opacity-50">• {app.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button
             onClick={handleDelete}
             className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500/20 transition-all active:scale-90 flex items-center justify-center shadow-sm"
             title="Delete appointment"
           >
             <Trash2 size={20} />
           </button>
           {app.status === 'Completed' && (
             <button
               onClick={(e) => { e.stopPropagation(); handleRevert(app.id); }}
               className="w-12 h-12 app-surface border app-border rounded-2xl app-text-muted hover:app-primary transition-all active:scale-90 flex items-center justify-center shadow-sm"
               title={t.revertSession}
             >
               <RotateCcw size={22} />
             </button>
           )}
           <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm ${
             app.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
           }`}>
             {t[app.status.toLowerCase() as keyof typeof t]}
           </span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {app.attendees.map((att: any) => {
          const person = state.people.find(p => p.id === att.personId);
          return (
            <div key={att.personId} className="flex items-center justify-between p-4 rounded-2xl app-bg border app-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black ${person?.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'app-bg-primary-muted app-primary'}`}>
                  {person?.name[0].toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm truncate max-w-[150px]">{person?.name || 'Unknown'}</span>
                  <span className="text-[8px] font-black app-text-muted uppercase tracking-widest">{person?.church}</span>
                </div>
              </div>
              {app.status !== 'Completed' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateAppointmentAttendance(app.id, att.personId, 'Attended')}
                    className={`p-2 rounded-xl border transition-all ${att.status === 'Attended' ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'app-border app-text-muted hover:app-primary'}`}
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    onClick={() => updateAppointmentAttendance(app.id, att.personId, 'Missed')}
                    className={`p-2 rounded-xl border transition-all ${att.status === 'Missed' ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'app-border app-text-muted hover:text-red-500'}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <span className={att.status === 'Attended' ? 'text-emerald-500' : 'text-rose-500'}>
                  {att.status === 'Attended' ? <Check size={24} strokeWidth={4}/> : <X size={24} strokeWidth={4}/>}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {app.status !== 'Completed' && (
        <Button fullWidth onClick={() => finalizeAppointment(app.id)} className="shadow-xl py-4">
          {t.markCompleted}
        </Button>
      )}
    </div>
  );
};


  return (
    <div className="p-4 pt-6">
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-3xl font-black tracking-tight">{t.agenda}</h1>
        <div className="app-surface p-1.5 rounded-[1.8rem] flex border app-border shadow-inner">
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-3 rounded-2xl transition-all ${viewMode === 'calendar' ? 'app-bg shadow-md app-primary' : 'app-text-muted'}`}
          >
            <CalendarIcon size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-2xl transition-all ${viewMode === 'list' ? 'app-bg shadow-md app-primary' : 'app-text-muted'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-[2.5rem] border app-border app-surface shadow-xl">
            <div className="flex justify-between items-center mb-8 px-2">
              <h2 className="text-xl font-black capitalize tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h2>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-3 app-text-muted hover:app-primary active:scale-90 transition-all"><ChevronLeft size={24} className={isRTL ? 'rotate-180' : ''}/></button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-3 app-text-muted hover:app-primary active:scale-90 transition-all"><ChevronRight size={24} className={isRTL ? 'rotate-180' : ''}/></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] font-black app-text-muted uppercase tracking-widest">{d}</div>)}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => <div key={i} />)}
              {monthDays.map(day => {
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDay);
                const dayApps = getAppointmentsForDay(day);
                const hasApps = dayApps.length > 0;
                
                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all relative ${
                      isSelected ? 'app-bg-primary text-white font-black scale-105 shadow-xl' : (isToday ? 'app-primary font-black ring-2 ring-indigo-500/20' : 'app-text font-bold hover:app-surface')
                    }`}
                  >
                    {format(day, 'd')}
                    {hasApps && !isSelected && (
                      <div className="absolute bottom-1.5 flex gap-0.5">
                        {dayApps.map((a, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${a.status === 'Completed' ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
             {getAppointmentsForDay(selectedDay).length === 0 ? (
                <div className="text-center py-16 app-text-muted app-surface rounded-[2.5rem] border-2 border-dashed app-border font-bold">
                  No sessions for {format(selectedDay, 'MMM d')}.
                </div>
             ) : (
                getAppointmentsForDay(selectedDay).map(app => <AppointmentCard app={app} key={app.id} />)
             )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300 pb-20">
          {state.appointments.length === 0 ? (
            <div className="text-center py-32 app-text-muted font-bold opacity-50 uppercase tracking-widest">No sessions yet.</div>
          ) : (
            [...state.appointments]
              .sort((a,b) => b.date.localeCompare(a.date))
              .map(app => <AppointmentCard app={app} key={app.id} />)
          )}
        </div>
      )}

      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-16 h-16 app-bg-primary text-white rounded-[2rem] shadow-2xl flex items-center justify-center active:scale-90 transition-all z-[60]"
      >
        <Plus size={32} />
      </button>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-bottom duration-300 app-bg shadow-2xl border app-border max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-3xl font-black tracking-tight">{t.newAppointment}</h2>
              <button onClick={() => setShowAddModal(false)} className="app-text-muted p-2"><X size={24} /></button>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black app-text-muted uppercase tracking-widest ml-1">Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  className={`${inputClasses} ${formErrors.includes('date') ? 'border-red-500' : ''}`}
                  value={newAppDate}
                  onChange={e => { setNewAppDate(e.target.value); setFormErrors(formErrors.filter(err => err !== 'date')); }}
                />
              </div>

              <div className="flex items-center justify-between px-3 py-3 bg-indigo-500/5 rounded-2xl border app-border">
                <div className="flex items-center gap-3">
                   <Clock size={18} className="app-primary" />
                   <span className="text-xs font-black uppercase tracking-tight">{t.setTime}</span>
                </div>
                <button 
                  onClick={() => setUseSpecificTime(!useSpecificTime)}
                  className={`w-14 h-8 rounded-full relative transition-all ${useSpecificTime ? 'app-bg-primary' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${useSpecificTime ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {useSpecificTime && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-[11px] font-black app-text-muted uppercase tracking-widest ml-1">Time</label>
                  <input 
                    type="time" 
                    className={inputClasses} 
                    value={newAppTime}
                    onChange={e => setNewAppTime(e.target.value)}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <label className={`block text-[11px] font-black uppercase tracking-widest ml-1 ${formErrors.includes('attendees') ? 'text-red-500' : 'app-text-muted'}`}>
                Select Attendees <span className="text-red-500">*</span>
              </label>
              <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar p-1 border rounded-2xl bg-white/5">
                {state.people.filter(p => !p.isArchived).length === 0 ? (
                  <p className="p-6 text-center text-xs font-bold opacity-30">No people in directory.</p>
                ) : (
                  state.people.filter(p => !p.isArchived).map(p => {
                    const isSelected = selectedAttendeeIds.includes(p.id);
                    return (
                      <label key={p.id} className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border transition-all ${isSelected ? 'border-indigo-500 bg-indigo-500/10' : 'app-bg app-border'} hover:brightness-95`}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isSelected}
                          onChange={() => {
                            setSelectedAttendeeIds(prev => prev.includes(p.id) ? prev.filter(i => i !== p.id) : [...prev, p.id]);
                            setFormErrors(formErrors.filter(err => err !== 'attendees'));
                          }}
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 shadow-md' : 'border-gray-300'}`}>
                          {isSelected && <Check size={16} className="text-white" strokeWidth={4} />}
                        </div>
                        <div className="flex flex-col flex-1 truncate">
                          <span className={`font-bold text-sm truncate ${isSelected ? 'app-primary' : 'app-text'}`}>{p.name}</span>
                          <span className="text-[8px] font-black app-text-muted uppercase tracking-widest truncate">{p.church}</span>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button variant="secondary" className="flex-1 py-4" onClick={() => setShowAddModal(false)}>{t.cancel}</Button>
              <Button className="flex-1 py-4 shadow-xl" onClick={() => {
                const errors = [];
                if (!newAppDate) errors.push('date');
                if (selectedAttendeeIds.length === 0) errors.push('attendees');

                // Date validation
                if (newAppDate) {
                  const selectedDate = new Date(newAppDate);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (selectedDate < today) {
                    errors.push('Cannot schedule appointments in the past');
                  }
                }

                if (errors.length > 0) {
                  setFormErrors(errors);
                  addToast(errors.join(', '), "error");
                  return;
                }

                try {
                  addAppointment({
                    date: newAppDate,
                    time: useSpecificTime ? newAppTime : "",
                    status: 'Upcoming',
                    type: selectedAttendeeIds.length > 1 ? 'Group' : 'Individual',
                    attendees: selectedAttendeeIds.map(id => ({ personId: id, status: 'Pending' }))
                  });
                  setShowAddModal(false);
                  setSelectedAttendeeIds([]);
                  setFormErrors([]);
                } catch (error) {
                  addToast("Failed to create appointment", "error");
                }
              }}>{t.save}</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

};

export default AgendaView;
