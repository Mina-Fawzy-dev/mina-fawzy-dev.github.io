
import React, { useState, useEffect, useRef } from 'react';
import { StoreProvider, useStore } from './store';
import { translations } from './translations';
import { Users, Calendar, BarChart3, Settings, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import DirectoryView from './views/DirectoryView';
import AgendaView from './views/AgendaView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import TrashView from './views/TrashView';
import PersonProfileView from './views/PersonProfileView';
import { format, isSameDay, parseISO } from 'date-fns';

const ComingSoonView: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-32 h-32 rounded-[3rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-8 shadow-inner">
        <div className="w-24 h-24 rounded-[2rem] app-bg border app-border flex items-center justify-center shadow-lg">
          <BarChart3 size={48} className="app-primary" />
        </div>
      </div>
      <h2 className="text-3xl font-black tracking-tight mb-4">{title}</h2>
      <p className="text-lg font-bold app-text-muted mb-8">Coming Soon</p>
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-[2rem] p-8 border app-border shadow-xl">
        <p className="text-base font-medium app-text leading-relaxed">
          Advanced analytics and detailed reports are being prepared for you.
          <br />
          <span className="text-sm app-text-muted font-bold mt-2 block">Stay tuned for updates!</span>
        </p>
      </div>
    </div>
  );
};

const ToastManager: React.FC = () => {
  const { state, removeToast } = useStore();
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] space-y-3 w-[90%] max-w-sm pointer-events-none">
      {state.ui.toasts.map(toast => (
        <div 
          key={toast.id}
          className={`p-4 rounded-[1.5rem] shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 pointer-events-auto cursor-pointer ${
            toast.type === 'error' ? 'bg-red-500 text-white' :
            toast.type === 'success' ? 'bg-emerald-500 text-white' :
            'app-bg-primary text-white'
          }`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.type === 'error' && <AlertCircle size={20} />}
          {toast.type === 'success' && <CheckCircle2 size={20} />}
          {toast.type === 'info' && <Info size={20} />}
          <p className="text-xs font-black uppercase tracking-tight">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};

const Navigation: React.FC<{ activeTab: string; setActiveTab: (t: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { state } = useStore();
  const t = translations[state.settings.language];
  
  const tabs = [
    { id: 'directory', label: t.directory, icon: Users },
    { id: 'agenda', label: t.agenda, icon: Calendar },
    { id: 'reports', label: t.reports, icon: BarChart3, disabled: false },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 app-bg border-t app-border z-50 px-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-lg mx-auto py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;
          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && setActiveTab(tab.id)}
              disabled={isDisabled}
              className={`flex-1 flex flex-col items-center p-2 transition-all ${
                isDisabled ? 'opacity-40 cursor-not-allowed' :
                isActive ? 'app-primary' : 'app-text-muted active:scale-90'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'scale-110' : ''} />
              <span className={`text-[10px] mt-1 font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {tab.label}
                {isDisabled && <span className="text-[6px] block -mt-1 opacity-60">SOON</span>}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const MainContent: React.FC = () => {
  const { state } = useStore();
  const [activeTab, setActiveTab] = useState('directory');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showTrash, setShowTrash] = useState(false);
  const isRTL = state.settings.language === 'ar';
  const lastNotifiedDate = useRef<string | null>(null);
  
  const themeClass = `theme-${state.settings.theme}`;
  const t = translations[state.settings.language];

  // Notification Logic - DISABLED (Coming Soon)
  // useEffect(() => {
  //   if (!state.settings.notificationsEnabled) return;
  //
  //   const checkReminders = () => {
  //     const now = new Date();
  //     const currentDay = format(now, 'yyyy-MM-dd');
  //     const currentTime = format(now, 'HH:mm');
  //
  //     if (currentTime === state.settings.reminderTime && lastNotifiedDate.current !== currentDay) {
  //       const todayAppointments = state.appointments.filter(app =>
  //         isSameDay(parseISO(app.date), now) && app.status === 'Upcoming'
  //       );
  //
  //       if (todayAppointments.length > 0) {
  //         if (Notification.permission === 'granted') {
  //           new Notification(t.notificationTitle, {
  //             body: t.notificationBody.replace('{count}', todayAppointments.length.toString()),
  //             icon: '/icon.png'
  //           });
  //           lastNotifiedDate.current = currentDay;
  //         }
  //       }
  //     }
  //   };
  //
  //   const interval = setInterval(checkReminders, 60000);
  //   checkReminders();
  //   return () => clearInterval(interval);
  // }, [state.settings.notificationsEnabled, state.settings.reminderTime, state.appointments, t]);

  const viewWrapperClass = `min-h-screen app-bg app-text transition-colors duration-300 relative`;

  return (
    <div className={`${themeClass} ${viewWrapperClass}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {selectedPersonId ? (
        <PersonProfileView
          personId={selectedPersonId}
          onBack={() => setSelectedPersonId(null)}
        />
      ) : showTrash ? (
        <TrashView onBack={() => setShowTrash(false)} />
      ) : (
        <>
          <main className="pb-32">
            {activeTab === 'directory' && <DirectoryView onPersonClick={setSelectedPersonId} onTrashClick={() => setShowTrash(true)} />}
            {activeTab === 'agenda' && <AgendaView />}
            {activeTab === 'reports' && <ComingSoonView title="Advanced Reports" />}
            {activeTab === 'settings' && <SettingsView />}
          </main>
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}
      <ToastManager />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
};

export default App;
