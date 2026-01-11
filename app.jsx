import React, { useState, useEffect, useRef } from 'react';

// --- Icons (Inline SVGs) ---
const Moon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);
const Baby = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.8 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.8A9 9 0 0 1 12 2.5c2.7 0 5.1 1.4 6.6 3.8" />
  </svg>
);
const Coffee = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" x2="6" y1="2" y2="4" /><line x1="10" x2="10" y1="2" y2="4" /><line x1="14" x2="14" y1="2" y2="4" />
  </svg>
);
const SettingsIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const ChevronLeft = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const AlertCircle = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);
const X = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// --- Configuration based on 8.5 month old doc ---
const DEFAULT_CONFIG = {
  pauseDurationSeconds: 20, // "Give him 10-20 seconds"
  sootheBeforeChangeMinutes: 2, // "Soothe 1-2 mins before changing"
  feedIntervalHours: 4,   
};

export default function App() {
  // --- State Initialization with Persistence ---
  
  const [view, setView] = useState('home'); 
  
  // Load Last Feed from LocalStorage or default to 5 hours ago
  const [lastFeedTime, setLastFeedTime] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alaric_last_feed');
        const parsedDate = saved ? new Date(saved) : null;
        // Check if date is valid
        if (parsedDate && !isNaN(parsedDate)) {
          return parsedDate;
        }
      } catch (e) {
        console.error("Failed to parse date", e);
      }
    }
    return new Date(Date.now() - 1000 * 60 * 60 * 5);
  });

  // Load Config from LocalStorage (Robust merge)
  const [config, setConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alaric_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Merge with default to ensure new keys are present if code updates
          return { ...DEFAULT_CONFIG, ...parsed };
        }
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
    return DEFAULT_CONFIG;
  });

  // Load Logs from LocalStorage
  const [logs, setLogs] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alaric_logs');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [timer, setTimer] = useState(0);
  
  // Ref for timer interval
  const intervalRef = useRef(null);

  // --- Persistence Effect ---
  // Save to LocalStorage whenever critical data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (lastFeedTime instanceof Date && !isNaN(lastFeedTime)) {
        localStorage.setItem('alaric_last_feed', lastFeedTime.toISOString());
      }
      localStorage.setItem('alaric_config', JSON.stringify(config));
      localStorage.setItem('alaric_logs', JSON.stringify(logs));
    }
  }, [lastFeedTime, config, logs]);


  // --- Helpers ---
  const formatTime = (date) => {
    if (!date || isNaN(date)) return "--:--";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  
  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startTimer = (durationSeconds, onComplete) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimer(durationSeconds);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    stopTimer();
    setView('home');
  };

  const addLog = (action) => {
    setLogs(prev => [{ action, time: formatTime(new Date()), id: Date.now() }, ...prev]);
  };

  // --- Flow Actions ---

  const handleWakeUp = () => {
    setView('assessment');
  };

  const handleJustFussing = () => {
    setView('pause');
    startTimer(config.pauseDurationSeconds, () => {
       // Timer finished
    });
  };

  const handleDiaperIssue = () => {
    setView('diaper_soothe');
    startTimer(config.sootheBeforeChangeMinutes * 60);
  };

  const handleReadyToChange = () => {
    stopTimer();
    setView('diaper_change');
  };

  const handleChangeComplete = () => {
    addLog('换尿布完成');
    setView('soothing'); 
  };

  const handleCryingHard = () => {
    setView('soothing');
  };

  const handleFeedNeeded = () => {
    setView('feeding');
  };

  const finishFeed = () => {
    setLastFeedTime(new Date());
    addLog('喂奶完成');
    setView('soothing'); 
  };

  const handleAllDone = () => {
    stopTimer();
    addLog('入睡');
    setView('home');
  };

  // --- Components ---

  const ResetButton = () => (
    <button 
      onClick={handleReset} 
      className="absolute top-6 right-6 p-2 bg-slate-900/50 rounded-full text-slate-500 hover:text-white border border-slate-800 transition-colors z-50"
      aria-label="重置返回主页"
    >
      <X size={20} />
    </button>
  );

  const BigButton = ({ onClick, label, sub, color = "amber", icon: Icon }) => {
    const colors = {
      amber: "bg-amber-700 active:bg-amber-800 text-amber-50 border-amber-800",
      slate: "bg-slate-700 active:bg-slate-800 text-slate-200 border-slate-600",
      red: "bg-red-900/40 active:bg-red-900/60 text-red-200 border-red-900",
      emerald: "bg-emerald-900/40 active:bg-emerald-900/60 text-emerald-200 border-emerald-900",
      indigo: "bg-indigo-900/40 active:bg-indigo-900/60 text-indigo-200 border-indigo-900"
    };

    return (
      <button 
        onClick={onClick}
        className={`w-full p-5 rounded-xl flex flex-col items-center justify-center transition-all transform active:scale-95 border ${colors[color]}`}
      >
        {Icon && <Icon className="mb-2 opacity-80" size={32} />}
        <span className="text-lg font-bold tracking-wide">{label}</span>
        {sub && <span className="text-sm opacity-70 mt-1 text-center font-normal">{sub}</span>}
      </button>
    );
  };

  const TipCard = ({ title, children }) => (
    <div className="bg-slate-800/50 border-l-4 border-amber-500 p-4 rounded-r-lg my-4">
      <h4 className="text-amber-400 font-bold text-sm uppercase mb-1">{title}</h4>
      <p className="text-slate-300 text-sm leading-relaxed">{children}</p>
    </div>
  );

  // --- Views ---

  if (view === 'settings') {
    // Helper to format date for input
    const toLocalISO = (date) => {
      if (!date || isNaN(date)) return "";
      const tzOffset = date.getTimezoneOffset() * 60000; 
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
        <header className="flex items-center mb-8">
          <button onClick={() => setView('home')} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-xl font-bold ml-2">设置 (Settings)</h1>
        </header>
        <div className="space-y-6">
          
          {/* Manual Last Feed Override */}
          <div className="space-y-2 pb-6 border-b border-slate-800">
            <label className="text-sm text-amber-500 font-bold flex items-center gap-2">
              <Coffee size={16}/> 上次喂奶时间 (修正)
            </label>
            <input 
              type="datetime-local" 
              value={toLocalISO(lastFeedTime)}
              onChange={(e) => {
                if(e.target.value) setLastFeedTime(new Date(e.target.value));
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            />
            <p className="text-xs text-slate-500">如果自动记录不准，可以在这里手动修改时间。</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">暂停观察时间 (秒)</label>
            <input type="number" value={config.pauseDurationSeconds} onChange={(e) => setConfig({...config, pauseDurationSeconds: parseInt(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"/>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">尿布前安抚时间 (分钟)</label>
            <input type="number" value={config.sootheBeforeChangeMinutes} onChange={(e) => setConfig({...config, sootheBeforeChangeMinutes: parseInt(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"/>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">喂奶间隔 (小时)</label>
            <input type="number" value={config.feedIntervalHours} onChange={(e) => setConfig({...config, feedIntervalHours: parseFloat(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"/>
          </div>

          <button onClick={() => {
            if(confirm("确定要清除所有历史记录吗？")) {
               setLogs([]);
            }
          }} className="w-full py-3 text-red-400 border border-red-900/50 rounded-lg text-sm mt-8">
            清除历史记录
          </button>
        </div>
      </div>
    );
  }

  // 1. ASSESSMENT
  if (view === 'assessment') {
    return (
      <div className="min-h-screen bg-black text-amber-500 p-6 flex flex-col font-sans relative">
        <ResetButton />
        <h2 className="text-2xl font-bold text-white mb-6 text-center mt-8">此时状态?</h2>
        <div className="space-y-4 flex-1">
          <BigButton 
            label="只是哼唧/翻身" 
            sub="Pause & Observe"
            color="indigo" 
            onClick={handleJustFussing} 
          />
          <BigButton 
            label="大哭 / 坐起来了" 
            sub="需要介入"
            color="amber" 
            onClick={handleCryingHard} 
          />
          <BigButton 
            label="尿湿 / 脏了" 
            sub="Diaper Check"
            color="slate" 
            onClick={handleDiaperIssue} 
          />
        </div>
        <button onClick={() => setView('home')} className="text-slate-500 text-sm mt-4 text-center pb-4">误触返回</button>
      </div>
    );
  }

  // 2. PAUSE (Just Fussing)
  if (view === 'pause') {
    return (
      <div className="min-h-screen bg-black text-amber-500 p-6 flex flex-col items-center justify-center font-sans text-center relative">
        <ResetButton />
        <div className="text-sm text-slate-400 uppercase tracking-widest mb-4">The Pause</div>
        <div className="text-8xl font-mono text-white mb-8 tabular-nums">{formatDuration(timer)}</div>
        <TipCard title="专家建议">
          给他 10-20 秒，看能否自己接觉。环境保持全黑。
        </TipCard>
        <div className="w-full space-y-4 mt-8">
           <BigButton label="睡回去了" color="emerald" onClick={handleAllDone} />
           <BigButton label="升级为大哭" color="red" onClick={handleCryingHard} />
        </div>
      </div>
    );
  }

  // 3. DIAPER: SOOTHE FIRST
  if (view === 'diaper_soothe') {
    return (
      <div className="min-h-screen bg-black text-amber-500 p-6 flex flex-col font-sans relative">
         <ResetButton />
         <h2 className="text-2xl font-bold text-red-400 mb-2 mt-8">🛑 停！先不要换！</h2>
         <p className="text-slate-300 mb-6">如果在他崩溃时换尿布，他会彻底清醒。</p>
         
         <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-6xl font-mono text-white mb-4 tabular-nums">{formatDuration(timer)}</div>
            <TipCard title="步骤 1: 稳定情绪">
              把他抱起来，安抚 1-2 分钟。告诉他“妈妈在”。等他没那么抗拒了，再动手。
            </TipCard>
         </div>

         <div className="w-full mt-4">
           <BigButton label="情绪稳了，开始换" color="amber" onClick={handleReadyToChange} />
         </div>
      </div>
    );
  }

  // 4. DIAPER: CHANGING
  if (view === 'diaper_change') {
    return (
      <div className="min-h-screen bg-black text-slate-200 p-6 flex flex-col font-sans relative">
         <ResetButton />
         <h2 className="text-xl font-bold text-white mb-6 mt-8">步骤 2: 慢速更换 (Stealth Change)</h2>
         <TipCard title="暗、慢、少">
           <ul>
             <li>• 仅使用极暗夜灯</li>
             <li>• 动作慢到夸张</li>
             <li>• 不要解释，只低声说“妈妈在”</li>
             <li>• 尽量减少皮肤暴露</li>
           </ul>
         </TipCard>
         <div className="flex-1"></div>
         <BigButton label="换完了" sub="不要立刻喂奶，回到安抚" color="emerald" onClick={handleChangeComplete} />
      </div>
    );
  }

  // 5. SOOTHING (General & Post-Diaper)
  if (view === 'soothing') {
    const hoursSinceFeed = (new Date() - lastFeedTime) / (1000 * 60 * 60);
    const showFeed = hoursSinceFeed > config.feedIntervalHours;

    return (
      <div className="min-h-screen bg-black text-amber-500 p-6 flex flex-col font-sans relative">
        <ResetButton />
        <h2 className="text-2xl font-bold text-white mb-2 mt-8">安抚 (Soothing)</h2>
        <div className="text-sm text-slate-400 mb-6">做“无聊的人肉靠垫”</div>

        <div className="space-y-4">
           <TipCard title="应对分离焦虑">
             <li>• 抱起，维持同一姿势 (趴身上/侧抱)</li>
             <li>• <strong>不要</strong>眼神对视，<strong>不要</strong>说话</li>
             <li>• 等身体变沉、呼吸变慢再放</li>
           </TipCard>

           <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
             <div className="text-xs text-slate-500 uppercase">距离上次喂奶</div>
             <div className="text-xl text-white font-mono">{hoursSinceFeed.toFixed(1)} 小时</div>
           </div>
        </div>

        <div className="mt-auto space-y-4">
          <BigButton label="睡着了 (放床成功)" color="emerald" onClick={handleAllDone} />
          
          {showFeed ? (
             <BigButton label="实在哄不好 (喂奶)" sub="最后手段" color="indigo" onClick={handleFeedNeeded} />
          ) : (
             <div className="text-center text-xs text-slate-600">
               距离喂奶间隔还差 {(config.feedIntervalHours - hoursSinceFeed).toFixed(1)}h (通常不建议喂)
               <button onClick={handleFeedNeeded} className="block w-full mt-2 underline">强制记录喂奶</button>
             </div>
          )}
        </div>
      </div>
    );
  }

  // 6. FEEDING
  if (view === 'feeding') {
    return (
      <div className="min-h-screen bg-black text-slate-200 p-6 flex flex-col font-sans relative">
         <ResetButton />
         <h2 className="text-xl font-bold text-white mb-6 mt-8">夜奶 (Night Feed)</h2>
         <TipCard title="注意事项">
           <li>• 喂奶前先抱 1-2 分钟</li>
           <li>• <strong>吃完不拍嗝</strong> (或极轻)</li>
           <li>• 喂完直接进入抱睡状态</li>
         </TipCard>
         <div className="flex-1 flex items-center justify-center">
            <Coffee size={64} className="text-slate-700" />
         </div>
         <BigButton label="吃完 / 睡着了" color="emerald" onClick={finishFeed} />
      </div>
    );
  }

  // HOME
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans flex flex-col">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Moon className="fill-amber-400 text-amber-400" size={24} />
            Alaric 夜间模式
          </h1>
          <p className="text-slate-500 text-sm mt-1">口诀：暗、慢、少、稳</p>
        </div>
        <button onClick={() => setView('settings')} className="p-2 bg-slate-900 rounded-full text-slate-400">
          <SettingsIcon size={20} />
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        <Card className="flex items-center gap-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <div className="p-3 bg-indigo-900/50 rounded-full">
            <Baby className="text-indigo-400" size={32} />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">上次记录</div>
            <div className="text-xl text-white font-medium">
              {logs.length > 0 ? logs[0].action : '暂无'}
            </div>
            <div className="text-sm text-slate-500">
              {logs.length > 0 ? logs[0].time : '--:--'}
            </div>
          </div>
        </Card>

        {/* Display Last Feed Time on Home Screen too for quick check */}
        <Card className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-amber-900/30 rounded-full">
               <Coffee className="text-amber-500" size={20} />
             </div>
             <div>
               <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">上次喂奶</div>
               <div className="text-lg text-slate-200 font-mono">
                 {formatTime(lastFeedTime)}
               </div>
             </div>
           </div>
           <div className="text-right">
              <div className="text-xs text-slate-500">已过去</div>
              <div className="text-lg font-mono text-slate-300">
                {((new Date() - lastFeedTime) / (1000 * 60 * 60)).toFixed(1)}h
              </div>
           </div>
        </Card>

        <div className="mt-auto mb-8">
          <button 
            onClick={handleWakeUp}
            className="w-full aspect-square max-h-80 rounded-full bg-gradient-to-b from-amber-600 to-amber-700 active:from-amber-700 active:to-amber-800 shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)] flex flex-col items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 mx-auto ring-4 ring-amber-900/30"
          >
            <AlertCircle size={48} className="mb-2 opacity-90" />
            <span className="text-3xl font-bold">Alaric 醒了</span>
            <span className="text-sm opacity-80 mt-1">Start Guide</span>
          </button>
        </div>

        {logs.length > 0 && (
          <div className="space-y-3">
             <div className="space-y-2 max-h-32 overflow-y-auto">
               {logs.slice(0, 3).map(log => (
                 <div key={log.id} className="flex justify-between text-sm p-3 bg-slate-900 rounded-lg text-slate-400 border border-slate-800">
                    <span>{log.action}</span>
                    <span className="font-mono">{log.time}</span>
                 </div>
               ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 ${className}`}>
    {children}
  </div>
);