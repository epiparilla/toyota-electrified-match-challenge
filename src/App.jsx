import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import SettingsModal from './components/SettingsModal';
import GridPreviewScreen from './components/GridPreviewScreen';
import GamePlayScreen from './components/GamePlayScreen';
import WinScreen from './components/WinScreen';
import LoseScreen from './components/LoseScreen';
import ScreenSaver from './components/ScreenSaver';
import { generateGameGrid } from './data/vehicles';
import { sounds } from './audio/soundEffects';
import {
  getCachedVideos,
  saveMultipleVideos,
  deleteCachedVideoById,
  clearAllCachedVideos
} from './utils/videoStorage';

const DEFAULT_SETTINGS = {
  idleTimeout: 180, // Idle seconds before screen saver starts
  videoAudioEnabled: true, // Screen saver audio enabled by default
  videoVolume: 0.95, // Screen saver audio volume
  gridPreviewDuration: 8,
  gameDuration: 20,
  targetPairsToWin: 3,
  autoResetDuration: 15,
  soundEnabled: true,
  soundVolume: 0.95,
  facilitatorControlOpacity: 0.4,
  testMode: false
};

export default function App() {
  // Load settings from localStorage with fallback
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('toyota_pevs_settings');
      const resolvedSettings = saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
      return {
        ...resolvedSettings,
        idleTimeout: Math.min(Math.max(resolvedSettings.idleTimeout, 5), 600),
        gridPreviewDuration: Math.min(Math.max(resolvedSettings.gridPreviewDuration, 5), 120),
        gameDuration: Math.min(Math.max(resolvedSettings.gameDuration, 5), 120),
        autoResetDuration: Math.min(Math.max(resolvedSettings.autoResetDuration, 5), 120)
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [phase, setPhase] = useState('welcome'); // welcome | grid-preview | playing | win | lose
  const [cards, setCards] = useState([]);
  const [gameStats, setGameStats] = useState({ timeSpent: 0, pairsFound: 0 });

  // Screen Saver & Video Playlist States
  const [isScreenSaverActive, setIsScreenSaverActive] = useState(false);
  const [videoPlaylist, setVideoPlaylist] = useState([]);

  const idleTimerRef = useRef(null);

  // Sync sound settings & persist to localStorage
  useEffect(() => {
    sounds.setMuted(!settings.soundEnabled);
    sounds.setVolume(settings.soundVolume);
    try {
      localStorage.setItem('toyota_pevs_settings', JSON.stringify(settings));
    } catch {
      // Storage safe
    }
  }, [settings]);

  // Load cached screen saver videos from IndexedDB on initial mount
  useEffect(() => {
    let createdUrls = [];

    async function loadStoredVideos() {
      try {
        const storedList = await getCachedVideos();
        if (storedList && storedList.length > 0) {
          const itemsWithUrls = storedList.map((item) => {
            const url = URL.createObjectURL(item.blob);
            createdUrls.push(url);
            return {
              ...item,
              url
            };
          });
          setVideoPlaylist(itemsWithUrls);
        }
      } catch (err) {
        console.error('Failed to load cached videos:', err);
      }
    }

    loadStoredVideos();

    return () => {
      createdUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  // Handler to import and cache multiple new video files
  const handleImportVideos = async (files) => {
    const updatedList = await saveMultipleVideos(files);
    // Revoke old URLs
    videoPlaylist.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });

    const itemsWithUrls = updatedList.map((item) => ({
      ...item,
      url: URL.createObjectURL(item.blob)
    }));

    setVideoPlaylist(itemsWithUrls);
  };

  // Handler to delete a single video by ID
  const handleDeleteVideo = async (id) => {
    const videoToDelete = videoPlaylist.find((v) => v.id === id);
    if (videoToDelete?.url) {
      URL.revokeObjectURL(videoToDelete.url);
    }

    const updatedList = await deleteCachedVideoById(id);
    const itemsWithUrls = updatedList.map((item) => {
      const existing = videoPlaylist.find((v) => v.id === item.id);
      return {
        ...item,
        url: existing ? existing.url : URL.createObjectURL(item.blob)
      };
    });

    setVideoPlaylist(itemsWithUrls);
  };

  // Handler to clear all cached videos
  const handleClearAllVideos = async () => {
    videoPlaylist.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    await clearAllCachedVideos();
    setVideoPlaylist([]);
  };

  // Reset Idle Timer
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Only activate screensaver when on welcome screen and settings modal is closed
    if (phase === 'welcome' && !isSettingsOpen && !isScreenSaverActive) {
      idleTimerRef.current = setTimeout(() => {
        setIsScreenSaverActive(true);
      }, (settings.idleTimeout || 30) * 1000);
    }
  }, [phase, isSettingsOpen, isScreenSaverActive, settings.idleTimeout]);

  // Global activity listener to detect user idle state
  useEffect(() => {
    resetIdleTimer();

    const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'touchstart'];
    const handleUserActivity = () => {
      resetIdleTimer();
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
    };
  }, [resetIdleTimer]);

  // Start new game cycle
  const handleStartGame = () => {
    const newCards = generateGameGrid();
    setCards(newCards);
    setGameStats({ timeSpent: 0, pairsFound: 0 });
    setPhase('grid-preview');
  };

  // Phase transitions
  const handleGridPreviewComplete = () => {
    setPhase('playing');
  };

  const handleWin = (stats) => {
    setGameStats(stats);
    setPhase('win');
  };

  const handleLose = (stats) => {
    setGameStats(stats);
    setPhase('lose');
  };

  const handleRestart = () => {
    setPhase('welcome');
  };

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: next }));
    sounds.setMuted(!next);
    if (next) sounds.playClick();
  };

  const handlePreviewScreenSaver = () => {
    setIsSettingsOpen(false);
    setIsScreenSaverActive(true);
  };

  return (
    <div className="kiosk-wrapper">
      {/* FULLSCREEN VIDEO LOOP SCREEN SAVER (LOCKED TO 9:16 PORTRAIT) */}
      {isScreenSaverActive && (
        <ScreenSaver
          playlist={videoPlaylist}
          videoVolume={settings.videoVolume !== undefined ? settings.videoVolume : 0.8}
          videoAudioEnabled={settings.videoAudioEnabled !== false}
          onDismiss={() => {
            setIsScreenSaverActive(false);
            resetIdleTimer();
          }}
        />
      )}

      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        facilitatorControlOpacity={settings.facilitatorControlOpacity}
        showSettings={phase === 'welcome'}
      />

      {phase === 'welcome' && (
        <WelcomeScreen
          onStartGame={handleStartGame}
          testMode={settings.testMode}
          targetPairs={settings.targetPairsToWin}
        />
      )}

      {phase === 'grid-preview' && (
        <GridPreviewScreen
          cards={cards}
          duration={settings.gridPreviewDuration}
          onComplete={handleGridPreviewComplete}
          testMode={settings.testMode}
        />
      )}

      {phase === 'playing' && (
        <GamePlayScreen
          cards={cards}
          gameDuration={settings.gameDuration}
          targetPairsToWin={settings.targetPairsToWin}
          onWin={handleWin}
          onLose={handleLose}
          testMode={settings.testMode}
        />
      )}

      {phase === 'win' && (
        <WinScreen
          stats={gameStats}
          autoResetDuration={settings.autoResetDuration}
          onRestart={handleRestart}
        />
      )}

      {phase === 'lose' && (
        <LoseScreen
          stats={gameStats}
          autoResetDuration={settings.autoResetDuration}
          onRestart={handleRestart}
        />
      )}

      <SettingsModal
        isOpen={phase === 'welcome' && isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetDefaults={() => setSettings(DEFAULT_SETTINGS)}
        videoPlaylist={videoPlaylist}
        onImportVideos={handleImportVideos}
        onDeleteVideo={handleDeleteVideo}
        onClearAllVideos={handleClearAllVideos}
        onPreviewScreenSaver={handlePreviewScreenSaver}
      />
    </div>
  );
}
