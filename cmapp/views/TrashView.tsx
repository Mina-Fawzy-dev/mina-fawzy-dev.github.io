
import React from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { ChevronLeft, RotateCcw, Trash2 } from 'lucide-react';

interface TrashViewProps {
  onBack: () => void;
}

const TrashView: React.FC<TrashViewProps> = ({ onBack }) => {
  const { state, restorePeople, deletePermanently } = useStore();
  const t = translations[state.settings.language];
  const archivedPeople = state.people.filter(p => p.isArchived);

  return (
    <div className="flex flex-col min-h-screen animate-in slide-in-from-bottom duration-300">
      <div className="p-4 pt-6 flex items-center gap-2 sticky top-0 app-bg z-20">
        <button onClick={onBack} className="p-3 -ml-2 app-text-muted active:scale-90 transition-all">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-3xl font-black tracking-tight">{t.trash}</h1>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {archivedPeople.length === 0 ? (
          <div className="text-center py-32 app-text-muted space-y-6">
            <div className="w-24 h-24 rounded-[2.5rem] app-surface border app-border flex items-center justify-center mx-auto opacity-40 shadow-inner">
               <Trash2 size={48} />
            </div>
            <p className="font-black uppercase text-xs tracking-widest opacity-60">Your trash bin is empty</p>
          </div>
        ) : (
          archivedPeople.map(person => (
            <div key={person.id} className="p-5 rounded-[2rem] border app-border flex items-center gap-4 app-surface shadow-sm">
              <div className="w-14 h-14 rounded-2xl app-bg border app-border app-text-muted flex items-center justify-center font-black text-xl shadow-inner">
                {person.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black truncate text-lg tracking-tight">{person.name}</p>
                <p className="text-[10px] app-text-muted font-black uppercase tracking-widest">{person.church || 'No Church'}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => restorePeople([person.id])}
                  className="p-4 app-bg app-primary rounded-2xl border app-border active:scale-90 transition-all shadow-sm"
                  title={t.restore}
                >
                  <RotateCcw size={20} />
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Delete permanently? This cannot be undone.')) {
                      deletePermanently([person.id]);
                    }
                  }}
                  className="p-4 bg-red-500/10 text-red-500 rounded-2xl border app-border active:scale-90 transition-all shadow-sm"
                  title={t.deletePermanently}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrashView;
