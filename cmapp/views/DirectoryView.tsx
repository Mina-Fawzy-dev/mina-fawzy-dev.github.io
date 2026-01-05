
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { Search, Filter, Trash2, Plus, CheckCircle2, Circle, MoreHorizontal, CalendarPlus, X, User, Edit2, Phone, AlertCircle, Eye, Trash, Info, Church, History, CalendarDays, Clock, Users, CheckSquare, Square } from 'lucide-react';
import Button from '../components/Button';
import { PersonStatus, Gender } from '../types';
import { isAfter, parseISO, startOfToday, format } from 'date-fns';

interface DirectoryViewProps {
  onPersonClick: (id: string) => void;
  onTrashClick: () => void;
}

const DirectoryView: React.FC<DirectoryViewProps> = ({ onPersonClick, onTrashClick }) => {
  const { state, archivePeople, addPerson, updatePerson, addAppointment, addToast } = useStore();
  const t = translations[state.settings.language];
  const isRTL = state.settings.language === 'ar';
  
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<PersonStatus | 'All'>('All');
  const [churchFilter, setChurchFilter] = useState<string>('All');
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  
  const [selectedPersonForActions, setSelectedPersonForActions] = useState<string | null>(null);
  const [showQuickDateModal, setShowQuickDateModal] = useState<string | null>(null);
  const [quickDate, setQuickDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const [showScheduleModal, setShowScheduleModal] = useState<string | null>(null);
  const [schedDate, setSchedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [schedTime, setSchedTime] = useState('10:00');
  const [useTime, setUseTime] = useState(false);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formChurch, setFormChurch] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formBirthYear, setFormBirthYear] = useState('');
  const [lastConfession, setLastConfession] = useState('');
  const [formGender, setFormGender] = useState<Gender>('Male');
  const [formCategory, setFormCategory] = useState(state.settings.categories[0] || 'Youth');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const churches = useMemo(() => {
    const list = Array.from(new Set(state.people.map(p => p.church).filter(Boolean)));
    return ['All', ...list];
  }, [state.people]);

  const filteredPeople = useMemo(() => {
    const today = startOfToday();
    return state.people.filter(p => {
      if (p.isArchived) return false;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
      const matchesCat = catFilter === 'All' || p.category === catFilter;
      const matchesChurch = churchFilter === 'All' || p.church === churchFilter;
      let pStatus: PersonStatus = 'Active';
      if (p.nextAppointmentDate && isAfter(today, parseISO(p.nextAppointmentDate))) {
        pStatus = 'Overdue';
      }
      const matchesStatus = statusFilter === 'All' || pStatus === statusFilter;
      return matchesSearch && matchesCat && matchesChurch && matchesStatus;
    });
  }, [state.people, search, catFilter, statusFilter, churchFilter]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSaveQuickDate = () => {
    if (showQuickDateModal) {
      updatePerson(showQuickDateModal, { nextAppointmentDate: quickDate });
      setShowQuickDateModal(null);
      addToast(t.successSaving, "success");
    }
  };

  const handleCreateAppointment = () => {
    if (showScheduleModal === 'bulk') {
      addAppointment({
        date: schedDate,
        time: useTime ? schedTime : "",
        status: 'Upcoming',
        type: selectedIds.length > 1 ? 'Group' : 'Individual',
        attendees: selectedIds.map(id => ({ personId: id, status: 'Pending' }))
      });
      setShowScheduleModal(null);
      setSelectedIds([]);
      setIsSelectionMode(false);
    } else if (showScheduleModal) {
      addAppointment({
        date: schedDate,
        time: useTime ? schedTime : "",
        status: 'Upcoming',
        type: 'Individual',
        attendees: [{ personId: showScheduleModal, status: 'Pending' }]
      });
      setShowScheduleModal(null);
    }
  };

  const handleAgeChange = (age: string) => {
    setFormAge(age);
    if (age) {
      const year = new Date().getFullYear() - parseInt(age);
      setFormBirthYear(year.toString());
    } else {
      setFormBirthYear('');
    }
  };

  const handleBirthYearChange = (year: string) => {
    setFormBirthYear(year);
    if (year && year.length === 4) {
      const age = new Date().getFullYear() - parseInt(year);
      setFormAge(age.toString());
    } else {
      setFormAge('');
    }
  };

  const validateAndAdd = () => {
    const errors: string[] = [];

    // Name validation
    if (!formName.trim()) errors.push("Name");
    else if (formName.trim().length < 2) errors.push("Name must be at least 2 characters");

    // Phone validation (optional but if provided, should be valid)
    if (formPhone && !/^\+?[\d\s\-\(\)]{7,}$/.test(formPhone.replace(/\s/g, ''))) {
      errors.push("Invalid phone number format");
    }

    // Birth year validation
    if (formBirthYear) {
      const year = parseInt(formBirthYear);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        errors.push("Invalid birth year");
      }
    }

    // Age validation
    if (formAge) {
      const age = parseInt(formAge);
      if (age < 0 || age > 150) {
        errors.push("Invalid age");
      }
    }

    // Last confession date validation
    if (lastConfession) {
      const confessionDate = new Date(lastConfession);
      const today = new Date();
      if (confessionDate > today) {
        errors.push("Last confession date cannot be in the future");
      }
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      addToast(`Validation errors: ${errors.join(', ')}`, "error");
      return;
    }

    addPerson({
      name: formName.trim(),
      phone: formPhone.trim(),
      church: formChurch.trim(),
      category: formCategory,
      address: formAddress.trim(),
      gender: formGender,
      lastConfessionDate: lastConfession || undefined,
      birthYear: formBirthYear ? parseInt(formBirthYear) : undefined
    });

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormChurch('');
    setFormAddress('');
    setFormAge('');
    setFormBirthYear('');
    setLastConfession('');
    setFormGender('Male');
    setFormErrors([]);
  };

  const handleDeletePerson = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const person = state.people.find(p => p.id === id);
    if (window.confirm(`Move "${person?.name}" to trash? This can be undone.`)) {
      try {
        archivePeople([id]);
        setSelectedPersonForActions(null);
      } catch (error) {
        addToast("Failed to delete person", "error");
      }
    }
  };

  const activePerson = state.people.find(p => p.id === selectedPersonForActions);

  const inputClasses = `w-full p-4 rounded-xl border transition-all duration-200 outline-none app-bg app-text font-medium text-sm focus:ring-2 focus:ring-indigo-500/20`;

  return (
    <div className="p-4 pt-6">
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-3xl font-black tracking-tight">{t.directory}</h1>
        <div className="flex gap-1">
          {isSelectionMode && (
            <button
              onClick={() => setSelectedIds(filteredPeople.map(p => p.id))}
              className="p-3 app-text-muted hover:app-primary transition-all rounded-xl hover:app-surface"
              title="Select all"
            >
              <CheckSquare size={24} />
            </button>
          )}
          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              if (isSelectionMode) setSelectedIds([]);
            }}
            className={`p-3 transition-all rounded-xl ${isSelectionMode ? 'app-primary bg-indigo-500/10' : 'app-text-muted hover:app-surface'}`}
            title={isSelectionMode ? "Exit selection" : "Select multiple"}
          >
            {isSelectionMode ? <X size={24} /> : <CheckSquare size={24} />}
          </button>
          <button onClick={onTrashClick} className="p-3 app-text-muted hover:text-red-500 transition-all rounded-xl hover:app-surface">
            <Trash2 size={24} />
          </button>
          <button onClick={() => setShowFilterDrawer(!showFilterDrawer)} className={`p-3 transition-all rounded-xl ${showFilterDrawer ? 'app-primary bg-indigo-500/10' : 'app-text-muted hover:app-surface'}`}>
            <Filter size={24} />
          </button>
        </div>
      </div>

      <div className="sticky top-0 z-[40] app-bg space-y-3 pb-4">
        <div className="relative">
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 app-text-muted`} size={20} />
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            className={`w-full py-4 ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} rounded-[1.5rem] border app-border app-surface app-text focus:ring-2 focus:ring-indigo-500 outline-none font-medium shadow-sm transition-all`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {showFilterDrawer && (
          <div className="p-5 rounded-[2rem] border app-border app-surface mb-4 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300 shadow-xl">
            <div className="space-y-2">
              <label className="text-[10px] font-black app-text-muted uppercase tracking-widest ml-1">{t.category}</label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {['All', ...state.settings.categories].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setCatFilter(cat)} 
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase transition-all ${
                      catFilter === cat ? 'app-bg-primary text-white shadow-md' : 'app-bg app-text-muted border app-border'
                    }`}
                  >
                    {cat === 'All' ? t.all : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black app-text-muted uppercase tracking-widest ml-1">{t.church}</label>
                <select className="w-full p-3 text-xs rounded-xl app-bg border app-border app-text outline-none font-bold" value={churchFilter} onChange={e => setChurchFilter(e.target.value)}>
                  {churches.map(c => <option key={c} value={c}>{c === 'All' ? t.all : c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black app-text-muted uppercase tracking-widest ml-1">{t.status}</label>
                <select className="w-full p-3 text-xs rounded-xl app-bg border app-border app-text outline-none font-bold" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                  <option value="All">{t.all}</option>
                  <option value="Active">{t.active}</option>
                  <option value="Overdue">{t.overdue}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {isSelectionMode && selectedIds.length > 0 && (
        <div className="p-4 rounded-[2rem] border app-border app-surface shadow-lg animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center">
            <span className="font-black text-sm">{selectedIds.length} selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowScheduleModal('bulk');
                  setSelectedPersonForActions(null);
                }}
                className="px-4 py-2 rounded-xl app-bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                <CalendarDays size={14} className="inline mr-1" />
                Schedule
              </button>
              <button
                onClick={() => {
                  if (window.confirm(t.multiDeleteConfirm)) {
                    archivePeople(selectedIds);
                    setSelectedIds([]);
                    setIsSelectionMode(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                <Trash size={14} className="inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredPeople.length === 0 ? (
          <div className="text-center py-20 app-text-muted font-bold opacity-30 uppercase text-[10px] tracking-widest">No matching records</div>
        ) : (
          filteredPeople.map(person => {
            const isSelected = selectedIds.includes(person.id);
            const isOverdue = person.nextAppointmentDate && isAfter(startOfToday(), parseISO(person.nextAppointmentDate));
            
            return (
              <div 
                key={person.id}
                onClick={() => isSelectionMode ? toggleSelection(person.id) : onPersonClick(person.id)}
                className={`p-5 rounded-[1.5rem] border transition-all flex items-center gap-4 cursor-pointer relative active:scale-[0.98] ${
                  isSelected ? 'border-indigo-500 bg-indigo-500/5' : 'app-surface app-border shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 shadow-inner ${person.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'app-bg-primary-muted app-primary'}`}>
                  {person.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-lg truncate leading-tight tracking-tight">{person.name}</h3>
                    {isOverdue && <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black ml-2 animate-pulse">{t.overdue}</span>}
                  </div>
                  <p className="app-text-muted text-xs font-bold mt-0.5">{person.church || 'No Church'}</p>
                </div>
                {isSelectionMode ? (
                  <div className="app-primary scale-110">
                    {isSelected ? <CheckCircle2 size={26} fill="currentColor" className="text-white" /> : <Circle size={26} />}
                  </div>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedPersonForActions(person.id); }}
                    className="p-3 app-text-muted hover:app-primary transition-all rounded-full hover:app-surface"
                  >
                    <MoreHorizontal size={24} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {selectedPersonForActions && activePerson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPersonForActions(null)}>
          <div className="w-full max-w-sm app-bg rounded-[2.5rem] p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 border app-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${activePerson.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'app-bg-primary-muted app-primary'}`}>
                {activePerson.name[0]}
              </div>
              <div className="flex-1 truncate">
                <h3 className="font-black text-lg truncate">{activePerson.name}</h3>
                <p className="text-[10px] app-text-muted font-black uppercase tracking-widest">{activePerson.category}</p>
              </div>
              <button onClick={() => setSelectedPersonForActions(null)} className="app-text-muted p-2 hover:app-surface rounded-lg transition-colors"><X size={20}/></button>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => { onPersonClick(activePerson.id); setSelectedPersonForActions(null); }}
                className="flex items-center gap-4 p-5 rounded-2xl app-surface border app-border hover:border-indigo-500/50 hover:brightness-95 transition-all group active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 app-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye size={20} />
                </div>
                <span className="font-black text-sm uppercase tracking-tight">{t.profile}</span>
              </button>
              
              <button 
                onClick={() => { setShowScheduleModal(activePerson.id); setSelectedPersonForActions(null); }}
                className="flex items-center gap-4 p-5 rounded-2xl app-surface border app-border hover:border-indigo-500/50 hover:brightness-95 transition-all group active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 app-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarDays size={20} />
                </div>
                <span className="font-black text-sm uppercase tracking-tight">{t.addNextSession}</span>
              </button>

              <button 
                onClick={(e) => handleDeletePerson(e, activePerson.id)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all group active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trash size={20} />
                </div>
                <span className="font-black text-sm uppercase tracking-tight">{t.delete}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuickDateModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs app-bg rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-center tracking-tight">{t.nextConfession}</h3>
            <input 
              type="date" 
              className="w-full p-4 rounded-2xl border app-border app-surface app-text font-black outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner" 
              value={quickDate}
              onChange={e => setQuickDate(e.target.value)}
            />
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowQuickDateModal(null)}>{t.cancel}</Button>
              <Button fullWidth onClick={handleSaveQuickDate}>{t.save}</Button>
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm app-bg rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300 border app-border">
            <div className="text-center">
              <h3 className="text-xl font-black tracking-tight">{t.newAppointment}</h3>
              <p className="text-[9px] font-black app-text-muted uppercase tracking-[0.2em] mt-1">
                {showScheduleModal === 'bulk'
                  ? `For ${selectedIds.length} people`
                  : `For ${state.people.find(p => p.id === showScheduleModal)?.name}`
                }
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">{t.date}</label>
                <input 
                  type="date" 
                  className={inputClasses}
                  value={schedDate}
                  onChange={e => setSchedDate(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between px-3 py-3 bg-indigo-500/5 rounded-2xl border app-border">
                <div className="flex items-center gap-3">
                   <Clock size={16} className="app-primary" />
                   <span className="text-[10px] font-black uppercase tracking-tight">{t.setTime}</span>
                </div>
                <button 
                  onClick={() => setUseTime(!useTime)}
                  className={`w-12 h-7 rounded-full relative transition-all ${useTime ? 'app-bg-primary' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${useTime ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {useTime && (
                <input 
                  type="time" 
                  className={inputClasses} 
                  value={schedTime}
                  onChange={e => setSchedTime(e.target.value)}
                />
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowScheduleModal(null)}>{t.cancel}</Button>
              <Button fullWidth onClick={handleCreateAppointment}>{t.save}</Button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setShowAddModal(true)} 
        className="fixed bottom-24 right-6 w-16 h-16 app-bg-primary text-white rounded-[2rem] shadow-2xl flex items-center justify-center active:scale-90 transition-all z-30 ring-4 ring-indigo-500/10"
      >
        <Plus size={36} />
      </button>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[2.5rem] p-0 animate-in slide-in-from-bottom duration-300 app-bg shadow-2xl border app-border overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="sticky top-0 z-10 px-8 py-6 app-bg border-b app-border flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{t.addPerson}</h2>
                <p className="text-[10px] app-text-muted font-bold uppercase tracking-wider">New Stewardship Profile</p>
              </div>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 rounded-xl hover:app-surface transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="px-8 py-8 space-y-8">
              {formErrors.length > 0 && (
                <div className="bg-red-500/10 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-[11px] font-black uppercase tracking-tight animate-in fade-in">
                  <AlertCircle size={18} />
                  <span>Required fields: {formErrors.join(', ')}</span>
                </div>
              )}

              <section className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                   <Info size={14} className="app-primary" />
                   <h3 className="text-[10px] font-black app-text-muted uppercase tracking-[0.2em]">Personal Details</h3>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black app-text uppercase ml-1">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter name" 
                    className={`${inputClasses} ${formErrors.includes("Name") ? 'border-red-500 bg-red-50' : 'app-border'}`}
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black app-text uppercase ml-1">{t.gender}</label>
                    <div className="flex gap-2">
                      <button onClick={() => setFormGender('Male')} className={`flex-1 py-3.5 rounded-xl border text-[10px] font-black uppercase transition-all ${formGender === 'Male' ? 'app-bg-primary text-white border-transparent shadow-md' : 'app-surface app-border app-text-muted'}`}>
                        {t.male}
                      </button>
                      <button onClick={() => setFormGender('Female')} className={`flex-1 py-3.5 rounded-xl border text-[10px] font-black uppercase transition-all ${formGender === 'Female' ? 'bg-pink-500 text-white border-transparent shadow-md' : 'app-surface app-border app-text-muted'}`}>
                        {t.female}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black app-text uppercase ml-1">Category</label>
                    <select 
                      className={`${inputClasses} app-border h-[46px]`}
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value)}
                    >
                      {state.settings.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black app-text uppercase ml-1">{t.age}</label>
                    <input type="number" placeholder="Years" value={formAge} onChange={e => handleAgeChange(e.target.value)} className={`${inputClasses} app-border`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black app-text uppercase ml-1">{t.birthYear}</label>
                    <input type="number" placeholder="Year" value={formBirthYear} onChange={e => handleBirthYearChange(e.target.value)} className={`${inputClasses} app-border`} />
                  </div>
                </div>
              </section>

              <section className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                   <Church size={14} className="app-primary" />
                   <h3 className="text-[10px] font-black app-text-muted uppercase tracking-[0.2em]">Church & Contact</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black app-text uppercase ml-1">Phone</label>
                    <input 
                      type="tel" 
                      placeholder="Number" 
                      className={`${inputClasses} border app-border`}
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black app-text uppercase ml-1">{t.church}</label>
                    <input 
                      type="text" 
                      placeholder="Name" 
                      className={`${inputClasses} app-border`}
                      value={formChurch}
                      onChange={e => setFormChurch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black app-text uppercase ml-1">{t.address}</label>
                  <input 
                    type="text" 
                    placeholder="Physical address" 
                    className={`${inputClasses} app-border`}
                    value={formAddress}
                    onChange={e => setFormAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black app-text uppercase ml-1">{t.lastConfession}</label>
                  <div className="relative">
                    <History size={16} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 app-text-muted`} />
                    <input 
                      type="date" 
                      value={lastConfession} 
                      onChange={e => setLastConfession(e.target.value)} 
                      className={`${inputClasses} app-border ${isRTL ? 'pr-12' : 'pl-12'}`} 
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="p-8 app-surface border-t app-border flex gap-4">
              <Button variant="secondary" className="flex-1 py-4" onClick={() => { setShowAddModal(false); resetForm(); }}>{t.cancel}</Button>
              <Button className="flex-1 py-4 shadow-2xl" onClick={validateAndAdd}>{t.save}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectoryView;
