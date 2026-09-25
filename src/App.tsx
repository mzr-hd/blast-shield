import { ShieldAlert, Play, CheckCircle2, Cpu, Terminal, FileCode2 } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              BlastShield <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">IBM Bob 2.0</span>
            </h1>
            <p className="text-xs text-slate-400">Architecture Blast-Radius & Chaos Simulator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
            Load Demo Data
          </button>
          <button className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 transition">
            <Play className="w-3.5 h-3.5" /> Run Bob Subagents
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 grid grid-cols-12 gap-0">
        {/* Left: System Canvas Area */}
        <section className="col-span-8 border-r border-slate-800 p-6 flex flex-col bg-slate-950">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Cpu className="w-4 h-4 text-indigo-400" /> System Dependency Graph
            </div>
            <span className="text-xs text-slate-500">React Flow Canvas Placeholder</span>
          </div>

          <div className="flex-1 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-slate-900/20">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-3 shadow-inner">
              <FileCode2 className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-sm font-medium text-slate-300">Visual Dependency Architecture</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Nodes and failure cascade paths will be rendered here interactively.
            </p>
          </div>
        </section>

        {/* Right: Bob 2.0 Session & Agent Output */}
        <aside className="col-span-4 bg-slate-900/30 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 border-b border-slate-800 pb-3">
            <Terminal className="w-4 h-4 text-emerald-400" /> Bob 2.0 Agent Activity
          </div>

          {/* Subagent Status Cards */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Subagent 1: Dependency Tracer</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Analyzes cross-file imports and API calls.</p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Subagent 2: Chaos Simulator</span>
                <span className="text-slate-400 font-mono text-[11px]">Idle</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Simulates 500 error cascades and null payloads.</p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Subagent 3: Defensive Patch Agent</span>
                <span className="text-slate-400 font-mono text-[11px]">Idle</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Generates circuit breakers and missing tests.</p>
            </div>
          </div>

          {/* Log / Session Output Container */}
          <div className="flex-1 mt-2 border border-slate-800 rounded-lg bg-black/40 p-3 font-mono text-[11px] text-slate-400 overflow-y-auto">
            <p className="text-slate-500">// IBM Bob 2.0 Task Output</p>
            <p className="text-emerald-400 mt-2">$ Initializing BlastShield pipeline...</p>
            <p className="text-slate-400 mt-1">&gt; Ready for repository ingest or demo scenario.</p>
          </div>
        </aside>
      </main>
    </div>
  )
}