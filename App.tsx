import React, { useState, useEffect, useMemo } from 'react';
import { User, Cork } from './types';
import UserSelector from './components/UserSelector';
import Birdhouse from './components/Birdhouse';
import CorkInput from './components/CorkInput';
import Celebration from './components/Celebration';

const CORK_GOAL = 130;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [corks, setCorks] = useState<Cork[]>([]);
  const [estimateMessage, setEstimateMessage] = useState<string>('');
  const [estimateKey, setEstimateKey] = useState(0); // For re-triggering animation

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedCorks = localStorage.getItem('birdhouseCorks');
      if (savedCorks) {
        setCorks(JSON.parse(savedCorks));
      }
      const savedEstimate = localStorage.getItem('birdhouseEstimate');
      if (savedEstimate) {
        setEstimateMessage(savedEstimate);
      }
    } catch (error) {
      console.error("Could not load from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('birdhouseCorks', JSON.stringify(corks));
      localStorage.setItem('birdhouseEstimate', estimateMessage);
    } catch (error) {
      console.error("Could not save to localStorage", error);
    }
  }, [corks, estimateMessage]);
  
  const totalCorks = corks.length;

  const scores = useMemo(() => {
    return {
      [User.Markus]: corks.filter(cork => cork.user === User.Markus).length,
      [User.Diana]: corks.filter(cork => cork.user === User.Diana).length,
    }
  }, [corks]);

  const formatDuration = (ms: number): string => {
    const seconds = ms / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (days > 1.5) return `ca. ${Math.round(days)} Tagen`;
    if (days > 0.8) return `ca. einem Tag`;
    if (hours > 1.5) return `ca. ${Math.round(hours)} Stunden`;
    if (hours > 0.8) return `ca. einer Stunde`;
    if (minutes > 1) return `ca. ${Math.round(minutes)} Minuten`;
    return `weniger als einer Minute`;
  };

  const calculateEstimate = (updatedCorks: Cork[]) => {
    const remainingCorks = CORK_GOAL - updatedCorks.length;
    if (remainingCorks <= 0 || updatedCorks.length < 2) {
      setEstimateMessage('');
      return;
    }
    
    const sortedCorks = [...updatedCorks].sort((a, b) => a.timestamp - b.timestamp);
    const firstTimestamp = sortedCorks[0].timestamp;
    const lastTimestamp = sortedCorks[sortedCorks.length - 1].timestamp;
    const duration = lastTimestamp - firstTimestamp;

    if (duration < 1000) { // Benötigt mindestens eine Sekunde an Daten, um eine Rate zu berechnen
      return; // Behält die alte Schätzung bei, wenn keine neue berechnet werden kann
    }

    const rate = (sortedCorks.length - 1) / duration; // Korken pro ms
    const remainingTimeMs = remainingCorks / rate;
    
    setEstimateMessage(`Bei diesem Tempo ist das Haus in ${formatDuration(remainingTimeMs)} fertig!`);
    setEstimateKey(key => key + 1); // Animation auslösen
  };

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
  };

  const handleAddCorks = (count: number) => {
    if (!currentUser || count <= 0) return;
    const now = Date.now();
    const newCorks: Cork[] = Array.from({ length: count }, (_, i) => ({
      user: currentUser,
      id: `${currentUser}-${now}-${i}`,
      timestamp: now
    }));
    
    const updatedCorks = [...corks, ...newCorks];
    setCorks(updatedCorks);
    calculateEstimate(updatedCorks);
  };

  const handleSwitchUser = () => {
    setCurrentUser(null);
  };
  
  const handleReset = () => {
    if (window.confirm("Bist du sicher, dass du den Spielstand als Admin zurücksetzen möchtest?")) {
      localStorage.removeItem('birdhouseCorks');
      localStorage.removeItem('birdhouseEstimate');
      window.location.reload();
    }
  };

  const isGoalReached = totalCorks >= CORK_GOAL;

  return (
    <div className="bg-sky-100 min-h-screen flex flex-col items-center justify-center p-4 text-slate-800 transition-all duration-500">
      {isGoalReached && <Celebration />}
      <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 text-center">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-amber-900 tracking-tight">
            Weinkorken-Vogelhaus
          </h1>
          
        </header>

        {!currentUser ? (
          <UserSelector onSelectUser={handleSelectUser} />
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col items-center justify-center">
              <Birdhouse corks={corks} goalCorks={CORK_GOAL} />
              <div className="w-full max-w-sm mt-4">
                <div className="flex justify-between mb-1 text-amber-900 font-bold">
                  <span>Fortschritt</span>
                  <span>{totalCorks} / {CORK_GOAL}</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min((totalCorks / CORK_GOAL) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
               <div className="h-10 mt-2 flex items-center">
                  {estimateMessage && (
                    <p key={estimateKey} className="text-sm font-semibold text-emerald-800 bg-emerald-100 p-2 rounded-md shadow-sm animate-fade-in">
                      {estimateMessage}
                    </p>
                  )}
              </div>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">
                  Hallo, <span className="text-emerald-600">{currentUser}!</span>
                </h2>
                <CorkInput onAddCorks={handleAddCorks} />
                <button
                    onClick={handleSwitchUser}
                    className="mt-4 w-full text-center text-sm text-slate-500 hover:text-emerald-600 transition"
                >
                    Benutzer wechseln
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-slate-700 mb-3">Punktestand</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold flex-shrink-0 pr-2">{User.Markus}:</span>
                    <span className="font-black text-amber-700 text-right">{scores[User.Markus]} Korken</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold flex-shrink-0 pr-2">{User.Diana}:</span>
                    <span className="font-black text-amber-700 text-right">{scores[User.Diana]} Korken</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
         <footer className="mt-8 pt-4 border-t border-slate-200">
            {currentUser === User.Markus && (
              <button onClick={handleReset} className="text-xs text-slate-400 hover:text-red-500 transition">
                Spielstand zurücksetzen (Admin)
              </button>
            )}
        </footer>
      </div>
    </div>
  );
};

export default App;