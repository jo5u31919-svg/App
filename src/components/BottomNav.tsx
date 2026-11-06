import React from 'react';
import { Clock, Tag as TagIcon, Shield, Crown, BarChart3, Quote } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type TabType = 'day' | 'tags' | 'system' | 'shadows' | 'stats';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unclaimedQuestsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  unclaimedQuestsCount,
}) => {
  const tabs = [
    { id: 'day' as TabType, label: 'Día', icon: Clock },
    { id: 'tags' as TabType, label: 'Etiquetas', icon: TagIcon },
    { id: 'system' as TabType, label: 'Sistema', icon: Shield, badge: unclaimedQuestsCount },
    { id: 'shadows' as TabType, label: 'Frases & Sombras', icon: Quote },
    { id: 'stats' as TabType, label: 'Stats', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-cyan-950/80 px-2 py-1 pb-safe shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClickSound();
                onChangeTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] relative transition-all cursor-pointer ${
                isActive
                  ? 'text-cyan-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_#06b6d4]' : ''}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-purple-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-tight mt-1 font-system">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-4 h-0.5 bg-cyan-400 rounded-full mt-0.5 shadow-[0_0_6px_#06b6d4]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
