import React, { useState, useEffect } from 'react';

// === PREMIUM SVG ICONS MAP (Lucide Alternative to avoid dynamic bundle issues) ===
const Icons = {
  Cpu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  Trophy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 4h4M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
};

// === INITIAL WORKFLOW DATA SET ===
const initialTasks = [
  { id: 'T1', duration: 4, deadline: 24, priority: 3, profit: 40, skill: 'backend', dependsOn: [] },
  { id: 'T2', duration: 6, deadline: 32, priority: 2, profit: 30, skill: 'frontend', dependsOn: ['T1'] },
  { id: 'T3', duration: 2, deadline: 20, priority: 5, profit: 50, skill: 'qa', dependsOn: ['T1'] },
  { id: 'T4', duration: 8, deadline: 40, priority: 1, profit: 10, skill: 'backend', dependsOn: [] },
];

const initialResources = [
  { id: 'R1', name: 'Dev-R1 (Backend/QA)', skills: ['backend', 'qa'], start: 9, end: 17, color: 'from-blue-500 to-indigo-600' },
  { id: 'R2', name: 'Dev-R2 (Frontend Only)', skills: ['frontend'], start: 10, end: 18, color: 'from-purple-500 to-pink-600' }
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [resources] = useState(initialResources);
  const [algorithm, setAlgorithm] = useState('greedy'); // 'greedy' | 'fcfs'
  const [timeline, setTimeline] = useState([]);
  const [metrics, setMetrics] = useState({ profit: 0, completed: 0, missed: 0 });
  
  // Custom Dynamic Input Form State
  const [newTask, setNewTask] = useState({ id: 'T5', duration: 4, deadline: 30, priority: 4, profit: 25, skill: 'backend', dependsOn: '' });

  // === SYSTEM ENGINE: REAL-TIME SOLVER RESOLUTION ===
  const solveAndSchedule = () => {
    let resolvedSequence = [];
    
    if (algorithm === 'greedy') {
      // Step 1: In-degree and Graph mappings
      const inDegree = {};
      const adj = {};
      tasks.forEach(t => {
        inDegree[t.id] = 0;
        adj[t.id] = [];
      });

      tasks.forEach(t => {
        t.dependsOn.forEach(dep => {
          if (adj[dep]) {
            adj[dep].push(t.id);
            inDegree[t.id]++;
          }
        });
      });

      // Step 2: Kahn's Topological Sorter with Custom Tie-Breakers (Priority & Profit Priority Queue Sim)
      let pool = tasks.filter(t => inDegree[t.id] === 0);

      while (pool.length > 0) {
        // Sort pool with multi-indices: High priority, then High profit, then Earliest Deadline
        pool.sort((a, b) => {
          if (b.priority !== a.priority) return b.priority - a.priority;
          if (b.profit !== a.profit) return b.profit - a.profit;
          return a.deadline - b.deadline;
        });

        const current = pool.shift();
        resolvedSequence.push(current.id);

        if (adj[current.id]) {
          adj[current.id].forEach(child => {
            inDegree[child]--;
            if (inDegree[child] === 0) {
              const childObj = tasks.find(t => t.id === child);
              if (childObj) pool.push(childObj);
            }
          });
        }
      }
    } else {
      // FCFS baseline mode
      resolvedSequence = tasks.map(t => t.id);
    }

    // Step 3: Resource Allocation Sim with working hours
    const resState = {};
    resources.forEach(r => {
      resState[r.id] = { currentTime: r.start, currentDay: 0 };
    });

    const plan = [];
    const earliestEnd = {};
    let profit = 0;
    let completedCount = 0;
    let missedCount = 0;

    resolvedSequence.forEach(tid => {
      const task = tasks.find(t => t.id === tid);
      if (!task) return;

      // Calculate dependency delay limits
      const depTime = task.dependsOn.reduce((acc, depId) => Math.max(acc, earliestEnd[depId] || 0), 0);
      let bestPlacement = null;

      resources.forEach(res => {
        // Skill constraint check
        if (!res.skills.includes(task.skill)) return;

        let trackingTime = Math.max(resState[res.id].currentTime, depTime, res.start);
        let simDay = resState[res.id].currentDay;

        // Shift constraint check
        while (trackingTime + task.duration > res.end + simDay * 24) {
          simDay++;
          trackingTime = res.start + simDay * 24;
        }

        const lateness = Math.max(0, (trackingTime + task.duration) - task.deadline);
        const placementScore = lateness * 100 - task.priority * 10;

        if (bestPlacement === null || placementScore < bestPlacement.score) {
          bestPlacement = { score: placementScore, start: trackingTime, resId: res.id, day: simDay };
        }
      });

      if (bestPlacement) {
        plan.push({
          task_id: tid,
          res_id: bestPlacement.resId,
          start: bestPlacement.start,
          end: bestPlacement.start + task.duration,
          deadline: task.deadline,
          priority: task.priority,
          profit: task.profit,
          skill: task.skill,
          isOverrun: (bestPlacement.start + task.duration) > task.deadline
        });

        resState[bestPlacement.resId].currentTime = bestPlacement.start + task.duration;
        resState[bestPlacement.resId].currentDay = bestPlacement.day;
        earliestEnd[tid] = bestPlacement.start + task.duration;

        if ((bestPlacement.start + task.duration) <= task.deadline) {
          profit += task.profit;
          completedCount++;
        } else {
          missedCount++;
        }
      }
    });

    setTimeline(plan);
    setMetrics({ profit, completed: completedCount, missed: missedCount });
  };

  // Re-run solver instantly whenever tasks, resources, or algorithm settings change
  useEffect(() => {
    solveAndSchedule();
  }, [tasks, algorithm]);

  // Add Custom Task to Simulation Map
  const handleAddTask = (e) => {
    e.preventDefault();
    const formattedTask = {
      ...newTask,
      duration: Number(newTask.duration),
      deadline: Number(newTask.deadline),
      priority: Number(newTask.priority),
      profit: Number(newTask.profit),
      dependsOn: newTask.dependsOn.trim() ? newTask.dependsOn.split(',').map(s => s.trim()) : []
    };
    setTasks([...tasks, formattedTask]);
    
    // Automatically generate next target task placeholder ID
    const nextId = `T${tasks.length + 2}`;
    setNewTask({ id: nextId, duration: 4, deadline: 30, priority: 3, profit: 20, skill: 'backend', dependsOn: '' });
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans antialiased">
      {/* === HEADER BRANDING === */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Icons.Cpu />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Task Scheduler Optimization
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium">
              Enterprise DSA Solver Portfolio Dashboard (Pure Client-Side Simulation)
            </p>
          </div>
        </div>

        {/* Algorithm Selection Mode */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setAlgorithm('greedy')}
            className={`px-4 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              algorithm === 'greedy'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Optimal Greedy (Heap/Topo)
          </button>
          <button
            onClick={() => setAlgorithm('fcfs')}
            className={`px-4 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              algorithm === 'fcfs'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            FCFS Baseline
          </button>
        </div>
      </div>

      {/* === LIVE METRICS WIDGETS === */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* KPI: Profit Core */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute right-4 top-4 opacity-10">
            <Icons.Trophy />
          </div>
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Optimized Profit Score</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-400 mt-2">${metrics.profit}K</h2>
          <p className="text-xs text-slate-500 mt-1">Succeeded with highest yield priority selection</p>
        </div>

        {/* KPI: Successful Allocations */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute right-4 top-4 opacity-10">
            <Icons.Check />
          </div>
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">On-Time Deliveries</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-400 mt-2">
            {metrics.completed} / {tasks.length}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Tasks scheduled perfectly within deadline windows</p>
        </div>

        {/* KPI: Delay Risks */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute right-4 top-4 opacity-10">
            <Icons.Alert />
          </div>
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Deadline Breached Count</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-rose-400 mt-2">{metrics.missed}</h2>
          <p className="text-xs text-slate-500 mt-1">Resource allocation overruns requiring optimization</p>
        </div>
      </div>

      {/* === DYNAMIC CONTROLS & VISUAL GANTT ROW === */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left column: Dataset Configurator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-md font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
              Live Scenario Task Sandbox
            </h3>
            
            {/* Quick Task Adding Form */}
            <form onSubmit={handleAddTask} className="grid grid-cols-2 gap-3 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="col-span-2 text-xs font-bold text-slate-400">Add Live Mock Task to Run</div>
              
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Task ID</label>
                <input
                  type="text"
                  value={newTask.id}
                  onChange={e => setNewTask({...newTask, id: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Duration (Hours)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newTask.duration}
                  onChange={e => setNewTask({...newTask, duration: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Deadline (Hour Limit)</label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={newTask.deadline}
                  onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Priority (1 to 5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Profit ($ Value)</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={newTask.profit}
                  onChange={e => setNewTask({...newTask, profit: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Skill Required</label>
                <select
                  value={newTask.skill}
                  onChange={e => setNewTask({...newTask, skill: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100"
                >
                  <option value="backend">Backend Eng</option>
                  <option value="frontend">Frontend Eng</option>
                  <option value="qa">QA Analyst</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Depends On (e.g. T1, T2 - Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. T1"
                  value={newTask.dependsOn}
                  onChange={e => setNewTask({...newTask, dependsOn: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="col-span-2 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded transition flex items-center justify-center gap-1"
              >
                <Icons.Plus /> Append Task to Array Node
              </button>
            </form>

            {/* List of Tasks Live Preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {tasks.map(t => (
                <div key={t.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-indigo-400 mr-2">{t.id}</span>
                    <span className="bg-slate-800 text-slate-300 rounded px-1.5 py-0.5 text-[10px] mr-2">
                      {t.skill}
                    </span>
                    <span className="text-slate-400">
                      Dur: <b className="text-slate-200">{t.duration}h</b> | Ddl: <b className="text-slate-200">{t.deadline}h</b> | Prio: <b className="text-slate-200">{t.priority}</b>
                    </span>
                    {t.dependsOn.length > 0 && (
                      <div className="text-[10px] text-amber-500 font-semibold mt-1">
                        🔒 Prerequisite Dependency: {t.dependsOn.join(', ')}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeTask(t.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                    title="Remove task from simulation run"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Beautiful Dynamic Gantt-Style Visualization */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-md font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                  Gantt Chart Execution Timeline (0h - 48h)
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                  Real-Time Updates
                </span>
              </div>

              {/* Grid hours headers */}
              <div className="grid grid-cols-24 gap-px pl-24 pr-2 mb-2 text-[10px] font-bold text-slate-500 text-center select-none hidden md:grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="col-span-2">{(i * 4)}h</span>
                ))}
              </div>

              {/* Gantt Chart Matrix Rows */}
              <div className="space-y-6 mt-4">
                {resources.map(res => {
                  const assignedTasks = timeline.filter(t => t.res_id === res.id);
                  
                  return (
                    <div key={res.id} className="relative">
                      {/* Resource Information Card */}
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-indigo-300">{res.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Core Shift Limit: {res.start}:00 - {res.end}:00
                        </span>
                      </div>

                      {/* Continuous Time Channel Bar */}
                      <div className="relative h-12 bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-hidden shadow-inner flex items-center">
                        {/* Shaded background representing non-working shift hours */}
                        <div 
                          className="absolute h-full bg-slate-900/30 border-r border-slate-800/20"
                          style={{ left: 0, width: `${(res.start / 48) * 100}%` }}
                        ></div>
                        <div 
                          className="absolute h-full bg-slate-900/30 border-l border-slate-800/20"
                          style={{ left: `${(res.end / 48) * 100}%`, right: 0 }}
                        ></div>

                        {/* Executed Allocated Tasks Map */}
                        {assignedTasks.map((p, idx) => {
                          const leftPct = (p.start / 48) * 100;
                          const widthPct = ((p.end - p.start) / 48) * 100;
                          
                          return (
                            <div
                              key={idx}
                              className={`absolute h-9 flex flex-col justify-center items-center rounded-lg text-white font-black text-xs shadow-md transition-all duration-300 hover:scale-105 select-none ${
                                p.isOverrun 
                                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 border border-rose-400' 
                                  : `bg-gradient-to-r ${res.color} border border-indigo-400/20`
                              }`}
                              style={{ 
                                left: `${leftPct}%`, 
                                width: `${widthPct}%`,
                                minWidth: '24px'
                              }}
                              title={`Task: ${p.task_id} | Start: ${p.start}h | End: ${p.end}h | Deadline: ${p.deadline}h | Priority: ${p.priority}`}
                            >
                              <span className="text-[11px] font-extrabold">{p.task_id}</span>
                              <span className="text-[8px] opacity-80">{p.start}-{p.end}h</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Map Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 border-t border-slate-800/50 pt-4 mt-6">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-indigo-600"></span>
                R1 Managed Blocks
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gradient-to-r from-purple-500 to-pink-600"></span>
                R2 Managed Blocks
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gradient-to-r from-rose-500 to-pink-600"></span>
                Deadline Overrun Warning
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* === LINKEDIN PORTFOLIO SOCIAL SHARE GENERATOR === */}
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/10 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <svg className="w-64 h-64 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.8v8h2.8v-4.87c0-.26.05-.52.13-.7a1.11 1.11 0 0 1 .97-.7c.66 0 1.22.56 1.22 1.44v4.83h2.8M6.5 8.37a1.37 1.37 0 1 0 0-2.75 1.37 1.37 0 0 0 0 2.75M8 18.5V10.5H5v8h3z"/>
          </svg>
        </div>
        
        <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2 mb-2">
          <span>💼</span> Ready to post on LinkedIn?
        </h3>
        <p className="text-xs md:text-sm text-slate-400 max-w-3xl mb-4 leading-relaxed">
          Nisha, tame tamari terminal output ane aa interactive Gantt chart app sathe visual posts muki sako chho. Recruiter na attention mate perfect template copy-paste karo!
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-mono select-all">
          <p className="font-bold text-indigo-400 mb-1">💬 Copy LinkedIn Caption Idea:</p>
          🚀 Project Completed: Dynamic Constraint-Satisfying Task Scheduler! <br /><br />
          I developed a standalone scheduling optimization system that organizes heterogeneous software workflows under strict real-world constraints (Shift limits, Developer skills, Precedence logic). <br /><br />
          🧠 Core DSA Built in: <br />
          ✅ Graph Dependency Checking using Kahn's Topological Sort<br />
          ✅ Dynamic Job dispatching simulation utilizing Custom Heap-Sorter Tie-Breakers<br />
          ✅ Real-time interactive visual Gantt chart tracking panel<br /><br />
          Building this dynamic hybrid model demonstrates how core computer science concepts scale up to drive complex project planners (Jira) or process threads in operating systems.<br /><br />
          👉 View full modular code repository: [INSERT GITHUB REPO LINK]<br /><br />
          #ComputerScience #SoftwareEngineering #DataStructures #Python #Algorithms #Optimization
        </div>
      </div>
    </div>
  );
}