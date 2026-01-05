
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { 
  ChevronLeft, 
  Phone, 
  MessageCircle, 
  History, 
  Info, 
  Calculator, 
  Edit2, 
  Check, 
  X,
  Plus,
  Copy,
  Calendar as CalendarIcon,
  Trash2,
  Zap,
  MapPin,
  Clock,
  FileText
} from 'lucide-react';
import Button from '../components/Button';
import { addMonths, addDays, addWeeks, format, startOfToday } from 'date-fns';
import { Person, HistoryEntry, Gender } from '../types';

interface PersonProfileViewProps {
  personId: string;
  onBack: () => void;
}

const PersonProfileView: React.FC<PersonProfileViewProps> = ({ personId, onBack }) => {
  const { state, updatePerson, archivePeople, addToast } = useStore();
  const person = state.people.find(p => p.id === personId);
  const t = translations[state.settings.language];
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState<Partial<Person>>({});
  
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [tempHistoryNotes, setTempHistoryNotes] = useState('');
  
  const [showAddHistoryModal, setShowAddHistoryModal] = useState(false);
  const [quickAddEntry, setQuickAddEntry] = useState<Partial<HistoryEntry>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Attended',
    notes: ''
  });

  useEffect(() => {
    if (person && isEditingProfile) {
      setEditData({
        name: person.name || '',
        phone: person.phone || '',
        birthYear: person.birthYear,
        church: person.church || '',
        serviceGroup: person.serviceGroup || '',
        address: person.address || '',
        notes: person.notes || '',
        category: person.category,
        nextAppointmentDate: person.nextAppointmentDate,
        gender: person.gender
      });
    }
  }, [person, isEditingProfile]);

  if (!person) return null;

  const isRTL = state.settings.language === 'ar';

  const handleBackAction = () => {
    if (isEditingProfile) {
      setIsEditingProfile(false);
    } else {
      onBack();
    }
  };

  const handleCall = () => {
    if (!person.phone) return addToast("No phone number found", "error");
    window.open(`tel:${person.phone}`);
  };
  
  const handleWhatsapp = () => {
    if (!person.phone) return addToast("No phone number found", "error");
    window.open(`https://wa.me/${person.phone}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.multiDeleteConfirm)) {
      archivePeople([person.id]);
      setTimeout(() => onBack(), 50);
    }
  };

  const copyToClipboard = async () => {
    if (!person.phone) return;
    try {
      await navigator.clipboard.writeText(person.phone);
      addToast(t.copied, "success");
    } catch (err) {
      addToast("Failed to copy", "error");
    }
  };

  const handleCalculateNextDate = (amount: number, unit: 'days' | 'weeks' | 'months') => {
    let baseDate = startOfToday();
    if (person.lastConfessionDate) {
      try {
        baseDate = new Date(person.lastConfessionDate);
      } catch(e) {}
    }

    let nextDate;
    if (unit === 'days') nextDate = addDays(baseDate, amount);
    else if (unit === 'weeks') nextDate = addWeeks(baseDate, amount);
    else nextDate = addMonths(baseDate, amount);

    const formatted = format(nextDate, 'yyyy-MM-dd');
    
    updatePerson(person.id, { nextAppointmentDate: formatted });
    addToast(t.successSaving, "success");
  };

  const handleSaveProfile = () => {
    if (!editData.name?.trim()) {
      addToast("Full Name is required", "error");
      return;
    }
    updatePerson(person.id, editData);
    setIsEditingProfile(false);
  };

  const handleQuickAdd = () => {
    if (!quickAddEntry.date) {
      addToast("Date is required", "error");
      return;
    }
    const entry: HistoryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: quickAddEntry.date,
      status: (quickAddEntry.status as 'Attended' | 'Missed') || 'Attended',
      notes: quickAddEntry.notes
    };
    updatePerson(person.id, {
      history: [...person.history, entry],
      lastConfessionDate: entry.status === 'Attended' ? entry.date : person.lastConfessionDate
    });
    setShowAddHistoryModal(false);
    setQuickAddEntry({ date: format(new Date(), 'yyyy-MM-dd'), status: 'Attended', notes: '' });
  };

  const themeInputClass = `w-full p-4 rounded-xl border app-border outline-none transition-all app-bg app-text focus:ring-2 focus:ring-indigo-500 font-medium text-sm`;

  return (
    <div className="flex flex-col min-h-screen app-bg" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 app-bg z-30 border-b app-border shadow-sm">
        <button onClick={handleBackAction} className="p-3 app-text-muted active:scale-95 transition-all rounded-xl hover:app-surface">
          {isEditingProfile ? <X size={24} /> : <ChevronLeft size={24} className={isRTL ? 'rotate-180' : ''} />}
        </button>
        <h2 className="font-black text-[10px] uppercase tracking-[0.2em]">{isEditingProfile ? "Editing Profile" : t.profile}</h2>
        <div className="flex gap-1">
          {!isEditingProfile && (
            <button onClick={handleDelete} className="p-3 text-red-500 active:scale-95 transition-all rounded-xl hover:app-surface">
              <Trash2 size={22} />
            </button>
          )}
          {isEditingProfile ? (
            <button onClick={handleSaveProfile} className="p-3 app-primary active:scale-95 transition-all rounded-xl hover:app-surface">
              <Check size={26} strokeWidth={3} />
            </button>
          ) : (
            <button onClick={() => setIsEditingProfile(true)} className="p-3 app-text-muted active:scale-95 transition-all rounded-xl hover:app-surface">
              <Edit2 size={22} />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-8 flex items-start gap-6 border-b app-border app-surface shadow-sm">
        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-black shrink-0 shadow-lg border-2 border-white/20 ${person.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'app-bg-primary-muted app-primary'}`}>
          {person.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        
        <div className="flex-1 min-w-0 pt-1">
          {isEditingProfile ? (
            <div className="space-y-3">
              <input 
                className={`${themeInputClass} h-12 text-xl font-bold p-3 rounded-2xl shadow-sm`}
                value={editData.name || ''}
                onChange={e => setEditData({...editData, name: e.target.value})}
                placeholder="Full Name"
              />
              <div className="flex gap-2">
                <select 
                  className="p-2 text-[10px] font-black uppercase tracking-widest rounded-lg border app-border app-bg outline-none"
                  value={editData.category}
                  onChange={e => setEditData({...editData, category: e.target.value})}
                >
                  {state.settings.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select 
                  className="p-2 text-[10px] font-black uppercase tracking-widest rounded-lg border app-border app-bg outline-none"
                  value={editData.gender}
                  onChange={e => setEditData({...editData, gender: e.target.value as Gender})}
                >
                  <option value="Male">{t.male}</option>
                  <option value="Female">{t.female}</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight truncate leading-tight mb-1">{person.name}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 app-bg-primary-muted app-primary rounded-lg text-[9px] font-black uppercase tracking-wider border app-border">
                  {person.category}
                </span>
                <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border app-border ${person.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'app-bg-primary-muted app-primary'}`}>
                  {person.gender === 'Female' ? t.female : t.male}
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                 <button onClick={handleCall} className={`flex-1 py-3 bg-indigo-500 text-white rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase ${!person.phone ? 'opacity-30' : ''}`}>
                   <Phone size={16}/> {t.call}
                 </button>
                 <button onClick={handleWhatsapp} className={`flex-1 py-3 bg-emerald-500 text-white rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase ${!person.phone ? 'opacity-30' : ''}`}>
                   <MessageCircle size={16}/> {t.whatsapp}
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="flex border-b app-border">
          <button onClick={() => setActiveTab('info')} className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'info' ? 'app-primary' : 'app-text-muted opacity-40'}`}>
            {t.profile}
            {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 app-bg-primary rounded-t-full" />}
          </button>
          <button onClick={() => setActiveTab('history')} className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'history' ? 'app-primary' : 'app-text-muted opacity-40'}`}>
            {t.history}
            {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-1 app-bg-primary rounded-t-full" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {activeTab === 'info' ? (
          <div className="p-6 space-y-8 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Calculator size={18} className="app-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">{t.nextConfession}</h3>
              </div>
              
              <div className="p-6 rounded-[2rem] border app-border app-surface space-y-5 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black app-text-muted uppercase opacity-60">Session Date</p>
                    <CalendarIcon size={20} className="app-primary opacity-30" />
                  </div>
                  <input 
                    type="date" 
                    className={themeInputClass + " h-14 rounded-2xl border-2"}
                    value={person.nextAppointmentDate || ''}
                    onChange={e => updatePerson(person.id, { nextAppointmentDate: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button onClick={() => handleCalculateNextDate(3, 'months')} className="p-4 rounded-xl app-bg border app-border text-indigo-600 font-black text-[9px] uppercase tracking-widest shadow-sm active:scale-95 hover:app-surface transition-all">
                      {t.every3Months}
                    </button>
                    <button onClick={() => handleCalculateNextDate(6, 'months')} className="p-4 rounded-xl app-bg border app-border text-indigo-600 font-black text-[9px] uppercase tracking-widest shadow-sm active:scale-95 hover:app-surface transition-all">
                      {t.every6Months}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: Phone, label: t.phone, value: person.phone || '---', field: 'phone', editable: true },
                { icon: Clock, label: t.birthYear, value: person.birthYear || '---', field: 'birthYear', type: 'number', editable: true },
                { icon: Zap, label: t.serviceGroup, value: person.serviceGroup || '---', field: 'serviceGroup', editable: true },
                { icon: MapPin, label: t.church, value: person.church || '---', field: 'church', editable: true },
                { icon: MapPin, label: t.address, value: person.address || '---', field: 'address', editable: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-[1.5rem] app-surface border app-border shadow-sm">
                  <div className="w-10 h-10 rounded-xl app-bg border app-border flex items-center justify-center shrink-0 shadow-inner">
                    <item.icon size={18} className="app-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[9px] font-black app-text-muted uppercase tracking-[0.1em] mb-1.5 opacity-60">{item.label}</label>
                    {isEditingProfile && item.editable ? (
                      <input 
                        type={item.type || 'text'}
                        className="w-full bg-transparent border-b border-indigo-500/40 app-text outline-none text-base font-bold pb-1"
                        value={(editData as any)[item.field] || ''}
                        onChange={e => setEditData({...editData, [item.field]: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base app-text truncate">{item.value}</span>
                        {item.field === 'phone' && item.value !== '---' && (
                          <button onClick={copyToClipboard} className="p-2 app-text-muted hover:app-primary transition-all active:scale-90"><Copy size={12}/></button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <FileText size={18} className="app-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">{t.notes}</h3>
              </div>
              <textarea 
                className="w-full p-6 rounded-[2rem] border app-border app-surface app-text min-h-[200px] outline-none shadow-inner text-sm leading-relaxed font-medium transition-all focus:ring-2 focus:ring-indigo-500/10"
                value={isEditingProfile ? editData.notes : person.notes}
                readOnly={!isEditingProfile}
                onChange={(e) => isEditingProfile && setEditData({...editData, notes: e.target.value})}
                placeholder="Private spiritual notes for the shepherd..."
              />
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <button 
              onClick={() => setShowAddHistoryModal(true)}
              className="w-full py-6 rounded-2xl border-2 border-dashed app-border app-text-muted hover:app-primary hover:border-indigo-500 transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] bg-white/5"
            >
              <Plus size={24} /> {t.addHistoryEntry}
            </button>

            <div className="space-y-4">
              {person.history.length === 0 ? (
                <div className="text-center py-20 opacity-30 font-black uppercase text-[10px] tracking-widest">No history records found</div>
              ) : (
                person.history.sort((a,b) => b.date.localeCompare(a.date)).map(entry => (
                  <div key={entry.id} className="p-6 rounded-[1.5rem] border app-border app-surface shadow-sm relative group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${entry.status === 'Attended' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {entry.status === 'Attended' ? <Check size={20} strokeWidth={3}/> : <X size={20} strokeWidth={3}/>}
                        </div>
                        <div>
                          <p className="font-black text-lg tracking-tight leading-none mb-1">{entry.date}</p>
                          <span className={`text-[8px] font-black uppercase tracking-widest ${entry.status === 'Attended' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {entry.status === 'Attended' ? t.attended : t.missed}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setEditingHistoryId(entry.id); setTempHistoryNotes(entry.notes || ''); }}
                        className="p-3 app-text-muted hover:app-primary opacity-0 group-hover:opacity-100 transition-all rounded-xl hover:app-bg"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>

                    {editingHistoryId === entry.id ? (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <textarea 
                          autoFocus 
                          className={themeInputClass + " min-h-[140px] shadow-inner rounded-[1.5rem]"} 
                          value={tempHistoryNotes} 
                          onChange={(e) => setTempHistoryNotes(e.target.value)} 
                        />
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setEditingHistoryId(null)} className="px-5 py-2.5 rounded-xl app-surface border app-border text-[9px] font-black uppercase tracking-widest">{t.cancel}</button>
                          <button onClick={() => {
                            const newHist = person.history.map(h => h.id === entry.id ? { ...h, notes: tempHistoryNotes } : h);
                            updatePerson(person.id, { history: newHist });
                            setEditingHistoryId(null);
                          }} className="px-5 py-2.5 rounded-xl app-bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg">Save Note</button>
                        </div>
                      </div>
                    ) : (
                      entry.notes && (
                        <div className="mt-3 p-4 rounded-xl bg-black/5 italic app-text-muted text-xs font-medium leading-relaxed border-l-4 border-indigo-500/30">
                          {entry.notes}
                        </div>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showAddHistoryModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-bottom duration-300 app-bg shadow-2xl border app-border">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-2xl font-black tracking-tight">{t.addHistoryEntry}</h2>
              <button onClick={() => setShowAddHistoryModal(false)} className="p-2 app-text-muted"><X size={24}/></button>
            </div>
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black app-text-muted uppercase tracking-widest ml-1 opacity-50">{t.date}</label>
                <input type="date" className={themeInputClass + " h-14"} value={quickAddEntry.date} onChange={e => setQuickAddEntry({...quickAddEntry, date: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black app-text-muted uppercase tracking-widest ml-1 opacity-50">{t.status}</label>
                <div className="flex gap-4">
                  <button onClick={() => setQuickAddEntry({...quickAddEntry, status: 'Attended'})} className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 transition-all ${quickAddEntry.status === 'Attended' ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl' : 'app-surface app-border app-text-muted'}`}>
                    {t.attended}
                  </button>
                  <button onClick={() => setQuickAddEntry({...quickAddEntry, status: 'Missed'})} className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 transition-all ${quickAddEntry.status === 'Missed' ? 'bg-red-500 border-red-500 text-white shadow-xl' : 'app-surface app-border app-text-muted'}`}>
                    {t.missed}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black app-text-muted uppercase tracking-widest ml-1 opacity-50">{t.notes}</label>
                <textarea className={themeInputClass + " min-h-[160px] shadow-inner font-medium leading-relaxed rounded-[1.5rem]"} value={quickAddEntry.notes} onChange={e => setQuickAddEntry({...quickAddEntry, notes: e.target.value})} placeholder="Session summary..." />
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <Button variant="secondary" className="flex-1 py-4" onClick={() => setShowAddHistoryModal(false)}>{t.cancel}</Button>
              <Button className="flex-1 py-4 shadow-xl shadow-indigo-500/20" onClick={handleQuickAdd}>{t.save}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonProfileView;
