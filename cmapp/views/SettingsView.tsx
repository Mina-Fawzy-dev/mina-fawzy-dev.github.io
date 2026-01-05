
import React, { useState } from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { Download, Upload, FileText, Moon, Sun, BookOpen, Languages, User, RefreshCw, Bell, Clock, Plus, Trash2, Tag, X, Check, Edit3, ExternalLink, Github, AlertCircle } from 'lucide-react';
import Button from '../components/Button';

const SettingsView: React.FC = () => {
  const { state, setTheme, setLanguage, updateSettings, importData, addCategory, removeCategory, renameCategory, addToast } = useStore();
  const t = translations[state.settings.language];
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');
  const [newCatName, setNewCatName] = useState('');

  // Renaming state
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editCatValue, setEditCatValue] = useState('');

  const handleUpdateCheck = async () => {
    setCheckingUpdate(true);
    try {
      // Check for updates from GitHub repo
      const response = await fetch('https://raw.githubusercontent.com/mina-fawzy-dev/confession-manager/main/version.json');
      if (response.ok) {
        const versionData = await response.json();
        const currentVersion = parseFloat(state.version);
        const remoteVersion = parseFloat(versionData.version);

        if (remoteVersion > currentVersion) {
          setUpdateAvailable(true);
          setLatestVersion(versionData.version);
          addToast(`New version ${versionData.version} available!`, 'info');
        } else {
          setUpdateAvailable(false);
          addToast(t.upToDate, 'success');
        }
      } else {
        throw new Error('Failed to fetch version info');
      }
    } catch (error) {
      console.error('Update check failed:', error);
      addToast('Unable to check for updates', 'error');
    } finally {
      setCheckingUpdate(false);
    }
  };

  const handleDownloadUpdate = () => {
    window.open('https://main-fawzy-dev.github.com/CMApp', '_blank');
  };

  const handleAddCat = () => {
    if (addCategory(newCatName)) {
      setNewCatName('');
    }
  };

  const handleRemoveCat = (cat: string) => {
    if (confirm(`Are you sure you want to delete the category "${cat}"?`)) {
      removeCategory(cat);
    }
  };

  const handleRenameCat = () => {
    if (editingCat && editCatValue.trim()) {
      renameCategory(editingCat, editCatValue);
      setEditingCat(null);
    }
  };

  const handleToggleNotifications = async () => {
    if (!state.settings.notificationsEnabled) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          updateSettings({ notificationsEnabled: true });
          addToast('Notifications enabled!', 'success');
        } else {
          addToast(t.notificationPermissionDenied, 'error');
        }
      } else {
        addToast('Notifications not supported in this browser', 'error');
      }
    } else {
      updateSettings({ notificationsEnabled: false });
      addToast('Notifications disabled', 'info');
    }
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `confession_manager_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = JSON.parse(event.target?.result as string);
          if (confirm(t.restoreConfirm)) {
            importData(content);
          }
        } catch (err) {
          alert(t.invalidFile);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Church', 'Phone', 'Gender', 'Birth Year', 'Next Session', 'Last Session', 'Notes'];
    const rows = state.people.filter(p => !p.isArchived).map(p => [
      p.id, p.name, p.category, p.church, p.phone, p.gender, p.birthYear || '', p.nextAppointmentDate || '', p.lastConfessionDate || '', (p.notes || '').replace(/,/g, ';')
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `people_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-6 pt-10 space-y-10">
      <h1 className="text-4xl font-black tracking-tight">{t.settings}</h1>

      {/* Category Management */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black app-text-muted uppercase tracking-[0.2em] px-2">{t.manageCategories}</h3>
        <div className="rounded-[2.5rem] border app-border app-surface shadow-lg overflow-hidden p-6 space-y-6">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder={t.addCategory} 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              className="flex-1 p-4 rounded-2xl border app-border app-bg app-text outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            />
            <button 
              onClick={handleAddCat}
              className="p-4 app-bg-primary text-white rounded-2xl active:scale-90 transition-all shadow-lg"
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {state.settings.categories.map(cat => (
              <div key={cat} className="flex items-center gap-2 px-4 py-2 app-bg border app-border rounded-full group">
                <Tag size={12} className="app-primary" />
                <span 
                  className="text-[11px] font-black uppercase tracking-tight cursor-pointer hover:app-primary transition-colors"
                  onClick={() => { setEditingCat(cat); setEditCatValue(cat); }}
                >
                  {cat}
                </span>
                <button 
                  onClick={() => handleRemoveCat(cat)}
                  className="p-1 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalization */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black app-text-muted uppercase tracking-[0.2em] px-2">{t.personalization}</h3>
        <div className="flex gap-3">
          {[
            { id: 'light', icon: Sun, label: t.light },
            { id: 'dark', icon: Moon, label: t.dark },
            { id: 'sepia', icon: BookOpen, label: t.sepia }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTheme(item.id as any)}
              className={`flex-1 p-5 rounded-[2rem] border flex flex-col items-center gap-2 transition-all active:scale-95 ${
                state.settings.theme === item.id 
                  ? 'app-bg-primary text-white border-transparent shadow-xl' 
                  : 'app-surface app-border app-text-muted'
              }`}
            >
              <item.icon size={28} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black app-text-muted uppercase tracking-[0.2em] px-2">{t.language}</h3>
        <div className="flex gap-3">
          {[
            { id: 'en', label: t.english },
            { id: 'ar', label: t.arabic, disabled: true }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => !item.disabled && setLanguage(item.id as any)}
              disabled={item.disabled}
              className={`flex-1 p-5 rounded-[2rem] border flex items-center justify-center gap-3 transition-all font-black uppercase text-xs tracking-tight ${
                item.disabled
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : state.settings.language === item.id
                    ? 'app-bg-primary text-white border-transparent shadow-xl'
                    : 'app-surface app-border app-text-muted'
              }`}
            >
              <Languages size={20} />
              <span>{item.label}</span>
              {item.disabled && (
                <span className="text-[8px] bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full ml-2">Soon</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications - Coming Soon */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black app-text-muted uppercase tracking-[0.2em] px-2">{t.notifications}</h3>
        <div className="rounded-[2.5rem] border app-border overflow-hidden app-surface shadow-lg relative">
          {/* Overlay to disable interactions */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg border app-border">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Coming Soon</span>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between opacity-40">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gray-500/10 text-gray-400 flex items-center justify-center shrink-0">
                <Bell size={24} />
              </div>
              <div className="flex-1">
                <p className="font-black text-sm tracking-tight text-gray-400">{t.enableNotifications}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                  Daily alerts • Coming Soon
                </p>
              </div>
            </div>
            <div className="w-14 h-8 rounded-full bg-gray-300 relative">
              <div className="absolute top-1 left-1 w-6 h-6 bg-gray-400 rounded-full shadow-sm" />
            </div>
          </div>
          <div className="h-px bg-gray-200 mx-6" />
          <div className="p-6 flex items-center gap-5 opacity-40">
            <div className="w-12 h-12 rounded-2xl bg-gray-500/10 text-gray-400 flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm tracking-tight text-gray-400">Daily Reminder Time</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mb-2">Smart notifications</p>
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-2">
                <span className="text-gray-400 font-bold">09:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black app-text-muted uppercase tracking-[0.2em] px-2">Data & Stability</h3>
        <div className="rounded-[2.5rem] border app-border overflow-hidden app-surface shadow-lg">
          <button onClick={handleBackup} className="w-full p-6 flex items-center gap-5 hover:brightness-95 transition-all text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 app-primary flex items-center justify-center shrink-0">
              <Download size={24} />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm tracking-tight">{t.backup}</p>
              <p className="text-[10px] app-text-muted font-bold uppercase tracking-tight">Export your records</p>
            </div>
          </button>
          <div className="h-px app-border mx-6" />
          <button onClick={handleRestore} className="w-full p-6 flex items-center gap-5 hover:brightness-95 transition-all text-left">
             <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <Upload size={24} />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm tracking-tight">{t.restoreData}</p>
              <p className="text-[10px] app-text-muted font-bold uppercase tracking-tight">Import from backup</p>
            </div>
          </button>
          <div className="h-px app-border mx-6" />
          <button onClick={handleExportCSV} className="w-full p-6 flex items-center gap-5 hover:brightness-95 transition-all text-left">
             <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm tracking-tight">{t.exportCsv}</p>
              <p className="text-[10px] app-text-muted font-bold uppercase tracking-tight">Spreadsheet format</p>
            </div>
          </button>
          <div className="h-px app-border mx-6" />
          <button onClick={handleUpdateCheck} className="w-full p-6 flex items-center gap-5 hover:brightness-95 transition-all text-left">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
               updateAvailable ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 app-text-muted'
             }`}>
              <RefreshCw size={24} className={checkingUpdate ? 'animate-spin' : ''} />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm tracking-tight">{t.checkForUpdates}</p>
              <p className="text-[10px] app-text-muted font-bold uppercase tracking-tight">
                {updateAvailable ? `New version ${latestVersion} available!` : 'Check for stability patches'}
              </p>
            </div>
            {updateAvailable && (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">!</span>
              </div>
            )}
          </button>
        </div>
      </section>

      {/* Feedback & Support */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black app-text-muted uppercase tracking-[0.2em] px-2">Feedback & Support</h3>
        <div className="rounded-[2.5rem] border app-border overflow-hidden app-surface shadow-lg">
          <button
            onClick={() => window.open('https://github.com/mina-fawzy-dev/confession-manager/issues', '_blank')}
            className="w-full p-6 flex items-center gap-5 hover:brightness-95 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm tracking-tight">Report Issue</p>
              <p className="text-[10px] app-text-muted font-bold uppercase tracking-tight">Help improve the app</p>
            </div>
          </button>
          <div className="h-px app-border mx-6" />
          <button
            onClick={() => window.open('mailto:mina.fawzy@example.com?subject=Confession Manager Feedback', '_blank')}
            className="w-full p-6 flex items-center gap-5 hover:brightness-95 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <User size={24} />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm tracking-tight">Send Feedback</p>
              <p className="text-[10px] app-text-muted font-bold uppercase tracking-tight">Share your thoughts</p>
            </div>
          </button>
        </div>
      </section>

      {/* Advanced Features - Coming Soon */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black app-text-muted uppercase tracking-[0.2em] px-2">Advanced Features</h3>
        <div className="rounded-[2.5rem] border app-border overflow-hidden app-surface shadow-lg">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <p className="font-black text-sm tracking-tight">Advanced Reports</p>
                <p className="text-[10px] app-text-muted font-bold uppercase tracking-tight">Detailed analytics & charts</p>
              </div>
              <span className="text-[8px] bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">Coming Soon</span>
            </div>
          </div>
          <div className="h-px app-border mx-6" />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
                <RefreshCw size={24} />
              </div>
              <div className="flex-1">
                <p className="font-black text-sm tracking-tight">Auto Backup</p>
                <p className="text-[10px] app-text-muted font-bold uppercase tracking-tight">Cloud synchronization</p>
              </div>
              <span className="text-[8px] bg-green-100 text-green-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      <section className="p-8 rounded-[3rem] border app-border text-center space-y-4 app-surface shadow-inner">
        <div className="w-20 h-20 rounded-[2rem] app-bg-primary-muted app-primary flex items-center justify-center mx-auto shadow-xl">
           <User size={40} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[10px] font-black app-text-muted uppercase tracking-[0.4em]">{t.developer}</p>
          <p className="text-2xl font-black tracking-tight">Mina Fawzy</p>
          <p className="text-[10px] font-black app-primary uppercase mt-2 tracking-widest">v{state.version} Build Stable</p>

          {updateAvailable && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Update Available</p>
              <p className="text-sm font-bold text-green-600 mt-1">Version {latestVersion}</p>
              <button
                onClick={handleDownloadUpdate}
                className="mt-3 w-full py-2 px-4 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-colors"
              >
                Download Update
              </button>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => window.open('https://github.com/mina-fawzy-dev', '_blank')}
              className="flex-1 py-3 px-4 bg-gray-800 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-colors"
            >
              <Github size={16} />
              GitHub
            </button>
            <button
              onClick={() => window.open('https://main-fawzy-dev.github.com/CMApp', '_blank')}
              className="flex-1 py-3 px-4 app-bg-primary text-white rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:brightness-110 transition-colors"
            >
              <ExternalLink size={16} />
              Website
            </button>
          </div>
        </div>
      </section>

      {/* Rename Category Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs app-bg rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl app-bg-primary-muted app-primary flex items-center justify-center">
                <Edit3 size={24} />
              </div>
              <h3 className="text-xl font-black text-center tracking-tight">Rename Category</h3>
              <p className="text-[10px] app-text-muted font-black uppercase tracking-widest">From: {editingCat}</p>
            </div>
            
            <input 
              type="text" 
              autoFocus
              className="w-full p-4 rounded-2xl border app-border app-surface app-text font-black outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner" 
              value={editCatValue}
              onChange={e => setEditCatValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRenameCat()}
            />
            
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setEditingCat(null)}>{t.cancel}</Button>
              <Button fullWidth onClick={handleRenameCat} className="shadow-lg">
                <Check size={18} /> {t.save}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
