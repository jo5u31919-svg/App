import React, { useState, useEffect, useRef } from 'react';
import { 
  Tag, 
  TimerPreset, 
  TimerSession, 
  DailyQuest, 
  ShadowArmy, 
  Achievement, 
  PlayerProfile, 
  DayRecap,
  TimerType,
  MotivationalQuote,
  BubbleConfig,
  AppThemeId
} from './types';
import { getDayTimeStats, DayTimeStats } from './utils/dayTimer';
import { soundManager } from './utils/audio';
import { loadAppTheme, saveAppTheme, applyAppTheme } from './utils/theme';
import { 
  loadTags, saveTags,
  loadPresets, savePresets,
  loadSessions, saveSessions,
  loadProfile, saveProfile,
  loadQuests, saveQuests,
  loadShadows, saveShadows,
  loadAchievements, saveAchievements,
  loadRecaps, saveRecaps,
  loadDayTitle, saveDayTitle,
  loadQuotes, saveQuotes,
  loadBubbleConfig, saveBubbleConfig,
  loadAppName, saveAppName
} from './utils/storage';

import { Header } from './components/Header';
import { DayTimerWidget } from './components/DayTimerWidget';
import { TagsAndTimersTab } from './components/TagsAndTimersTab';
import { SoloLevelingTab } from './components/SoloLevelingTab';
import { ShadowsTab } from './components/ShadowsTab';
import { WeeklyStatsTab } from './components/WeeklyStatsTab';
import { BottomNav, TabType } from './components/BottomNav';
import { HighValueModal } from './components/HighValueModal';
import { MidnightResetModal } from './components/MidnightResetModal';
import { SystemAIModal } from './components/SystemAIModal';
import { FloatingBubbleWidget } from './components/FloatingBubbleWidget';
import { BubbleSettingsModal } from './components/BubbleSettingsModal';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { SystemStartupOverlay } from './components/SystemStartupOverlay';
import { ambientAudioEngine } from './utils/ambientAudio';
import confetti from 'canvas-confetti';

export default function App() {
  // State from LocalStorage
  const [tags, setTags] = useState<Tag[]>(loadTags);
  const [presets, setPresets] = useState<TimerPreset[]>(loadPresets);
  const [sessions, setSessions] = useState<TimerSession[]>(loadSessions);
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [quests, setQuests] = useState<DailyQuest[]>(loadQuests);
  const [shadows, setShadows] = useState<ShadowArmy[]>(loadShadows);
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);
  const [recaps, setRecaps] = useState<DayRecap[]>(loadRecaps);
  const [dayTitle, setDayTitle] = useState<string>(loadDayTitle);
  const [quotes, setQuotes] = useState<MotivationalQuote[]>(loadQuotes);
  const [bubbleConfig, setBubbleConfig] = useState<BubbleConfig>(loadBubbleConfig);
  const [appName, setAppName] = useState<string>(loadAppName);
  const [currentTheme, setCurrentTheme] = useState<AppThemeId>(loadAppTheme);

  // System Boot Sequence
  const [showStartupOverlay, setShowStartupOverlay] = useState<boolean>(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('day');

  // Modals
  const [showHighValueModal, setShowHighValueModal] = useState(false);
  const [showMidnightModal, setShowMidnightModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showBubbleSettingsModal, setShowBubbleSettingsModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);

  // Real-time Day Timer Stats
  const [dayStats, setDayStats] = useState<DayTimeStats>(getDayTimeStats());
  const prevDateKeyRef = useRef<string>(dayStats.dateKey);

  // Active Timer Session State
  const [activeSession, setActiveSession] = useState<{
    title: string;
    tagId: string;
    durationSeconds: number;
    elapsedSeconds: number;
    isRunning: boolean;
    timerType: TimerType;
    isHighValue: boolean;
    xpEarned: number;
  } | null>(null);

  // Sync Audio Setting
  useEffect(() => {
    soundManager.setEnabled(profile.soundEnabled);
  }, [profile.soundEnabled]);

  // Sync Ambient Audio during active timers
  useEffect(() => {
    if (activeSession && activeSession.isRunning && profile.ambientSound !== 'none') {
      ambientAudioEngine.play(profile.ambientSound, profile.ambientVolume);
    } else {
      ambientAudioEngine.stop();
    }
  }, [activeSession?.isRunning, profile.ambientSound, profile.ambientVolume]);

  // Sync App Theme
  useEffect(() => {
    applyAppTheme(currentTheme);
  }, [currentTheme]);

  // 1. Tick Day Timer (24h clock) every second & Detect Midnight Reset
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = getDayTimeStats();
      setDayStats(stats);

      // Midnight event check: past 00:00:00
      if (stats.dateKey !== prevDateKeyRef.current) {
        prevDateKeyRef.current = stats.dateKey;
        handleMidnightReset(stats.dateKey);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2. Tick Active Timer Session
  useEffect(() => {
    if (!activeSession || !activeSession.isRunning) return;

    const timer = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev || !prev.isRunning) return prev;

        const newElapsed = prev.elapsedSeconds + 1;
        
        // Calculate incremental XP (e.g. 1 base XP per minute * multiplier)
        const tag = tags.find((t) => t.id === prev.tagId);
        const multiplier = prev.isHighValue ? (tag?.xpMultiplier || 2.0) : 1.0;
        const currentXp = Math.floor((newElapsed / 60) * 5 * multiplier);

        // Check if countdown completed
        if (prev.timerType !== 'stopwatch' && newElapsed >= prev.durationSeconds) {
          clearInterval(timer);
          // Auto complete timer session
          setTimeout(() => {
            finishTimerSession(prev.title, prev.tagId, prev.durationSeconds, prev.isHighValue, currentXp);
          }, 50);
          return null;
        }

        return {
          ...prev,
          elapsedSeconds: newElapsed,
          xpEarned: currentXp,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession?.isRunning, tags]);

  // Save updates to LocalStorage
  useEffect(() => {
    saveTags(tags);
  }, [tags]);

  useEffect(() => {
    savePresets(presets);
  }, [presets]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveQuests(quests);
  }, [quests]);

  useEffect(() => {
    saveShadows(shadows);
  }, [shadows]);

  useEffect(() => {
    saveAchievements(achievements);
  }, [achievements]);

  useEffect(() => {
    saveRecaps(recaps);
  }, [recaps]);

  useEffect(() => {
    saveDayTitle(dayTitle);
  }, [dayTitle]);

  useEffect(() => {
    saveQuotes(quotes);
  }, [quotes]);

  useEffect(() => {
    saveBubbleConfig(bubbleConfig);
  }, [bubbleConfig]);

  useEffect(() => {
    saveAppName(appName);
  }, [appName]);

  const activeQuote = quotes.find((q) => q.active) || null;

  const handleUnlockQuote = (quoteId: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, unlocked: true } : q))
    );
  };

  const handleSelectActiveQuote = (quoteId: string) => {
    setQuotes((prev) =>
      prev.map((q) => ({ ...q, active: q.id === quoteId }))
    );
  };

  const handleCreateCustomQuote = (quoteText: string, authorText: string) => {
    const newQuote: MotivationalQuote = {
      id: `quote-${Date.now()}`,
      quote: quoteText,
      author: authorText,
      category: 'Monarca',
      levelRequired: 1,
      unlocked: true,
      active: true,
      xpCostToUnlock: 0,
    };

    setQuotes((prev) => [
      newQuote,
      ...prev.map((q) => ({ ...q, active: false })),
    ]);
  };

  // MIDNIGHT RESET HANDLER (12:00 AM)
  const handleMidnightReset = (newDateKey: string) => {
    soundManager.playLevelUpSound();
    
    // Save yesterday's recap
    const todaySessions = sessions.filter((s) => s.date === dayStats.dateKey && s.completed);
    const totalFocusSecs = todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const highValSecs = todaySessions.filter((s) => s.isHighValue).reduce((acc, s) => acc + s.durationSeconds, 0);

    const newRecap: DayRecap = {
      date: dayStats.dateKey,
      totalFocusSeconds: totalFocusSecs,
      highValueSeconds: highValSecs,
      sessionsCount: todaySessions.length,
    };

    setRecaps((prev) => [...prev.filter((r) => r.date !== newRecap.date), newRecap]);

    // Update streak
    setProfile((prev) => {
      const nextStreak = totalFocusSecs > 0 ? prev.currentStreakDays + 1 : 1;
      return {
        ...prev,
        currentStreakDays: nextStreak,
        lastActiveDate: newDateKey,
      };
    });

    // Reset daily quests
    setQuests((prev) =>
      prev.map((q) => ({
        ...q,
        currentAmount: 0,
        completed: false,
        claimed: false,
      }))
    );

    // Open Midnight Modal announcement
    setShowMidnightModal(true);
  };

  // START A NEW TIMER SESSION
  const handleStartTimer = (
    title: string,
    tagId: string,
    durationMinutes: number,
    mode: TimerType,
    isHighValue: boolean
  ) => {
    setActiveSession({
      title,
      tagId,
      durationSeconds: durationMinutes * 60,
      elapsedSeconds: 0,
      isRunning: true,
      timerType: mode,
      isHighValue,
      xpEarned: 0,
    });
    setActiveTab('day');
  };

  const handlePauseTimer = () => {
    setActiveSession((prev) => (prev ? { ...prev, isRunning: false } : null));
  };

  const handleResumeTimer = () => {
    setActiveSession((prev) => (prev ? { ...prev, isRunning: true } : null));
  };

  const handleResetTimer = () => {
    setActiveSession((prev) => (prev ? { ...prev, elapsedSeconds: 0, xpEarned: 0 } : null));
  };

  // FINISH TIMER SESSION & GIVE XP / QUEST PROGRESS
  const finishTimerSession = (
    title: string,
    tagId: string,
    durationSecs: number,
    isHighValue: boolean,
    earnedXpOverride?: number
  ) => {
    const elapsedSecs = activeSession ? activeSession.elapsedSeconds : durationSecs;
    const finalSecs = elapsedSecs > 0 ? elapsedSecs : durationSecs;

    const tag = tags.find((t) => t.id === tagId);
    const multiplier = isHighValue ? (tag?.xpMultiplier || 2.0) : 1.0;
    const baseMinutes = Math.max(1, Math.round(finalSecs / 60));
    const xpEarned = earnedXpOverride || Math.floor(baseMinutes * 5 * multiplier);

    soundManager.playTimerCompleteSound();
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Create session record
    const newSession: TimerSession = {
      id: `session-${Date.now()}`,
      title,
      tagId,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: finalSecs,
      xpEarned,
      date: dayStats.dateKey,
      isHighValue,
      completed: true,
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSession(null);

    // Award XP and check Level Up
    addPlayerXp(xpEarned, finalSecs, isHighValue);

    // Update Daily Quests
    updateQuestsProgress(baseMinutes, isHighValue, tagId);
  };

  // ADD PLAYER XP & LEVEL UP LOGIC
  const addPlayerXp = (xp: number, durationSecs: number, isHighValue: boolean) => {
    setProfile((prev) => {
      let newXp = prev.xp + xp;
      let newLevel = prev.level;
      let newXpNext = prev.xpToNextLevel;
      let addedPoints = prev.availableStatPoints;

      const durationHours = durationSecs / 3600;
      const newTotalFocus = prev.totalFocusHours + durationHours;
      const newHighValue = isHighValue ? prev.totalHighValueHours + durationHours : prev.totalHighValueHours;

      // Check level up loop
      while (newXp >= newXpNext) {
        newXp -= newXpNext;
        newLevel += 1;
        newXpNext = newLevel * 100;
        addedPoints += 3; // +3 stat points per level up
        soundManager.playLevelUpSound();
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpToNextLevel: newXpNext,
        availableStatPoints: addedPoints,
        totalFocusHours: newTotalFocus,
        totalHighValueHours: newHighValue,
        totalSessions: prev.totalSessions + 1,
      };
    });
  };

  // UPDATE QUESTS PROGRESS
  const updateQuestsProgress = (focusMins: number, isHighValue: boolean, tagId: string) => {
    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.completed) return quest;

        let added = 0;
        if (quest.targetType === 'focus_minutes') {
          added = focusMins;
        } else if (quest.targetType === 'high_value_minutes' && isHighValue) {
          added = focusMins;
        } else if (quest.targetType === 'completed_timers') {
          added = 1;
        } else if (quest.targetType === 'specific_tag') {
          added = focusMins;
        }

        const newCurrent = quest.currentAmount + added;
        const isCompletedNow = newCurrent >= quest.targetAmount;

        return {
          ...quest,
          currentAmount: newCurrent,
          completed: isCompletedNow,
        };
      })
    );
  };

  // CLAIM QUEST REWARD
  const handleClaimQuestReward = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.claimed) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
    );

    // Award bonus XP and stat points
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + quest.rewardXp,
      availableStatPoints: prev.availableStatPoints + quest.rewardStatPoints,
    }));
  };

  // STAT UPGRADE
  const handleUpgradeStat = (statKey: keyof PlayerProfile['stats']) => {
    if (profile.availableStatPoints <= 0) return;

    setProfile((prev) => ({
      ...prev,
      availableStatPoints: prev.availableStatPoints - 1,
      stats: {
        ...prev.stats,
        [statKey]: prev.stats[statKey] + 1,
      },
    }));
  };

  // SHADOW EXTRACTION
  const handleExtractShadow = (shadowId: string) => {
    setShadows((prev) =>
      prev.map((s) => (s.id === shadowId ? { ...s, unlocked: true } : s))
    );
  };

  // TAG ACTIONS
  const handleCreateTag = (newTagData: Omit<Tag, 'id' | 'bgColor' | 'borderColor'>) => {
    const newTag: Tag = {
      ...newTagData,
      id: `tag-${Date.now()}`,
      bgColor: 'bg-slate-900 border-slate-800 text-slate-200',
      borderColor: 'border-cyan-500',
    };
    setTags((prev) => [...prev, newTag]);
  };

  const handleDeleteTag = (tagId: string) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  // PRESET ACTIONS
  const handleCreatePreset = (newPresetData: Omit<TimerPreset, 'id'>) => {
    const newPreset: TimerPreset = {
      ...newPresetData,
      id: `preset-${Date.now()}`,
    };
    setPresets((prev) => [...prev, newPreset]);
  };

  const handleDeletePreset = (presetId: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
  };

  const unclaimedQuestsCount = quests.filter((q) => q.completed && !q.claimed).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        appName={appName}
        onChangeAppName={setAppName}
        profile={profile}
        onOpenHighValue={() => setShowHighValueModal(true)}
        onOpenAiAdvice={() => setShowAiModal(true)}
        onToggleSound={() =>
          setProfile((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onSimulateMidnight={() => handleMidnightReset(dayStats.dateKey)}
        onOpenBubbleSettings={() => setShowBubbleSettingsModal(true)}
        onOpenThemeSettings={() => setShowThemeModal(true)}
        onOpenPwaModal={() => setShowPwaModal(true)}
        onReplayStartup={() => setShowStartupOverlay(true)}
      />

      {/* Main View Area */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {activeTab === 'day' && (
          <DayTimerWidget
            dayStats={dayStats}
            dayTitle={dayTitle}
            onChangeDayTitle={setDayTitle}
            activeQuote={activeQuote}
            tags={tags}
            presets={presets}
            activeSession={activeSession}
            ambientSound={profile.ambientSound || 'rain'}
            ambientVolume={profile.ambientVolume ?? 0.5}
            onChangeAmbientSound={(sound) =>
              setProfile((prev) => ({ ...prev, ambientSound: sound }))
            }
            onChangeAmbientVolume={(vol) =>
              setProfile((prev) => ({ ...prev, ambientVolume: vol }))
            }
            onStartTimer={handleStartTimer}
            onPauseTimer={handlePauseTimer}
            onResumeTimer={handleResumeTimer}
            onResetTimer={handleResetTimer}
            onCompleteTimer={() => {
              if (activeSession) {
                finishTimerSession(
                  activeSession.title,
                  activeSession.tagId,
                  activeSession.durationSeconds,
                  activeSession.isHighValue,
                  activeSession.xpEarned
                );
              }
            }}
            onOpenHighValueModal={() => setShowHighValueModal(true)}
          />
        )}

        {activeTab === 'tags' && (
          <TagsAndTimersTab
            tags={tags}
            presets={presets}
            onCreateTag={handleCreateTag}
            onDeleteTag={handleDeleteTag}
            onCreatePreset={handleCreatePreset}
            onDeletePreset={handleDeletePreset}
            onStartTimer={handleStartTimer}
          />
        )}

        {activeTab === 'system' && (
          <SoloLevelingTab
            profile={profile}
            quests={quests}
            onUpgradeStat={handleUpgradeStat}
            onClaimQuestReward={handleClaimQuestReward}
            onUpdatePlayerName={(newName, newTitle) => {
              setProfile((prev) => ({
                ...prev,
                name: newName,
                title: newTitle !== undefined ? newTitle : prev.title,
              }));
            }}
          />
        )}

        {activeTab === 'shadows' && (
          <ShadowsTab
            shadows={shadows}
            achievements={achievements}
            quotes={quotes}
            profile={profile}
            onExtractShadow={handleExtractShadow}
            onUnlockQuote={handleUnlockQuote}
            onSelectActiveQuote={handleSelectActiveQuote}
            onCreateCustomQuote={handleCreateCustomQuote}
          />
        )}

        {activeTab === 'stats' && (
          <WeeklyStatsTab
            sessions={sessions}
            tags={tags}
            recaps={recaps}
          />
        )}
      </main>

      {/* Modals */}
      <HighValueModal
        isOpen={showHighValueModal}
        onClose={() => setShowHighValueModal(false)}
        tags={tags}
        onStartHighValueTimer={(title, tagId, mins, mode) => {
          handleStartTimer(title, tagId, mins, mode, true);
        }}
      />

      <MidnightResetModal
        isOpen={showMidnightModal}
        onClose={() => setShowMidnightModal(false)}
        todayHighValueHours={profile.totalHighValueHours}
        todayTotalFocusHours={profile.totalFocusHours}
        completedQuestsCount={quests.filter((q) => q.completed).length}
        streakDays={profile.currentStreakDays}
      />

      <SystemAIModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        profile={profile}
        weeklyFocusHours={profile.totalFocusHours}
      />

      <BubbleSettingsModal
        isOpen={showBubbleSettingsModal}
        onClose={() => setShowBubbleSettingsModal(false)}
        config={bubbleConfig}
        onChangeConfig={setBubbleConfig}
      />

      <ThemeSettingsModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        currentTheme={currentTheme}
        onChangeTheme={(themeId) => {
          setCurrentTheme(themeId);
          saveAppTheme(themeId);
        }}
      />

      <PWAInstallModal
        isOpen={showPwaModal}
        onClose={() => setShowPwaModal(false)}
      />

      {/* Floating Countdown Bubble Widget */}
      <FloatingBubbleWidget
        config={bubbleConfig}
        dayStats={dayStats}
        activeSession={activeSession}
        tags={tags}
        onPauseTimer={handlePauseTimer}
        onResumeTimer={handleResumeTimer}
        onOpenSettings={() => setShowBubbleSettingsModal(true)}
      />

      {/* System Entry Boot Sequence Overlay */}
      {showStartupOverlay && (
        <SystemStartupOverlay
          onComplete={() => setShowStartupOverlay(false)}
          appName={appName}
          playerName={profile.name}
          playerRank={profile.rank}
          playerLevel={profile.level}
        />
      )}

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        unclaimedQuestsCount={unclaimedQuestsCount}
      />
    </div>
  );
}
