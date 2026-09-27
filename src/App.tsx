import { useState } from 'react'
import {
  ShieldAlert, Play, RotateCcw, CheckCircle2, XCircle,
  AlertTriangle, MinusCircle, FileCode2, FlaskConical,
  ChevronRight, BadgeCheck, Zap, GitBranch, FileWarning, Bug
} from 'lucide-react'
import analysisData from './data/bob-analysis.json'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DiffLine {
  type: 'add' | 'remove' | 'context'
  content: string
}

interface RemediationOption {
  id: string
  name: string
  subtitle: string
  philosophy: string
  filesAffected: number
  linesChanged?: string
  legacySupport?: boolean
  risk?: string
  technicalDebt?: string
  tradeOff: string
  before: string
  after: string
  diffLines: DiffLine[]
  codeFile?: string
}

interface FailureStep {
  step: number
  location: string
  event: string
  status: 'ok' | 'error' | 'blocked'
}

// ─── Architecture node definitions ────────────────────────────────────────────

interface ArchNode {
  id: string
  label: string
  sublabel: string
  color: 'red' | 'orange' | 'yellow' | 'green'
}

const ARCH_NODES: ArchNode[] = [
  { id: 'payment', label: 'Payment API', sublabel: 'payment.ts:7', color: 'red' },
  { id: 'checkout', label: 'Checkout Service', sublabel: 'checkout.ts:9', color: 'orange' },
  { id: 'notification', label: 'Notification', sublabel: 'notification.ts:1', color: 'yellow' },
]

const NODE_COLORS: Record<ArchNode['color'], { ring: string; bg: string; text: string; dot: string }> = {
  red:    { ring: 'border-red-500/70',    bg: 'bg-red-950/40',    text: 'text-red-300',    dot: 'bg-red-500' },
  orange: { ring: 'border-orange-500/70', bg: 'bg-orange-950/40', text: 'text-orange-300', dot: 'bg-orange-500' },
  yellow: { ring: 'border-amber-500/70',  bg: 'bg-amber-950/40',  text: 'text-amber-300',  dot: 'bg-amber-500' },
  green:  { ring: 'border-emerald-500/70',bg: 'bg-emerald-950/40',text: 'text-emerald-300',dot: 'bg-emerald-500' },
}

// ─── Helper utilities ──────────────────────────────────────────────────────────

function stepBorderColor(status: FailureStep['status']): string {
  if (status === 'ok') return 'border-emerald-500/40 bg-emerald-950/20'
  if (status === 'error') return 'border-red-500/40 bg-red-950/20'
  return 'border-amber-500/40 bg-amber-950/20'
}

function stepLabel(status: FailureStep['status']): string {
  if (status === 'ok') return 'ok'
  if (status === 'error') return 'error'
  return 'blocked'
}

function stepLabelColor(status: FailureStep['status']): string {
  if (status === 'ok') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  if (status === 'error') return 'text-red-400 bg-red-500/10 border-red-500/30'
  return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
}

function StepStatusIcon({ status }: { status: FailureStep['status'] }) {
  if (status === 'ok') return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
  if (status === 'error') return <XCircle className="w-4 h-4 text-red-400 shrink-0" />
  return <MinusCircle className="w-4 h-4 text-amber-400 shrink-0" />
}

// ─── DiffViewer ────────────────────────────────────────────────────────────────

function DiffViewer({ lines, codeFile }: { lines: DiffLine[]; codeFile?: string }) {
  return (
    <div className="rounded-[6px] border border-[#1F2937] bg-black/60 overflow-hidden font-mono text-xs">
      <div className="px-3 py-1.5 bg-[#111827]/80 border-b border-[#1F2937] flex items-center gap-2">
        <FileCode2 className="w-3.5 h-3.5 text-[#22D3EE]/60" />
        <span className="text-[#22D3EE]/60 text-[11px] tracking-wide">{codeFile ?? 'checkout.ts — unified diff'}</span>
      </div>
      <div className="p-3 space-y-0.5">
        {lines.map((line, i) => {
          const bg =
            line.type === 'add'
              ? 'bg-emerald-950/50 text-emerald-300'
              : line.type === 'remove'
              ? 'bg-red-950/50 text-red-300 line-through opacity-70'
              : 'text-slate-500'
          const prefix =
            line.type === 'add' ? '+ ' : line.type === 'remove' ? '- ' : '  '
          return (
            <div key={i} className={`px-2 py-0.5 rounded leading-relaxed whitespace-pre ${bg}`}>
              {prefix}{line.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Architecture Flow ─────────────────────────────────────────────────────────

function ArchitectureFlow() {
  const [cascadeActive, setCascadeActive] = useState(false)

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#22D3EE]" />
          <h2 className="text-sm font-semibold text-slate-100">Architecture Flow</h2>
        </div>
        <button
          onClick={() => setCascadeActive((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold border transition-all duration-300 ${
            cascadeActive
              ? 'bg-red-950/50 text-red-300 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
              : 'bg-[#111827] text-slate-400 border-[#1F2937] hover:border-[#22D3EE]/40 hover:text-[#22D3EE]'
          }`}
        >
          <Zap className="w-3 h-3" />
          {cascadeActive ? 'Cascade Active' : 'Simulate Cascade'}
        </button>
      </div>

      {/* Flow diagram */}
      <div className="flex-1 flex flex-col items-center justify-center gap-0 py-2">
        {ARCH_NODES.map((node, i) => {
          const c = NODE_COLORS[node.color]
          const isFailing = cascadeActive && node.color !== 'green'
          return (
            <div key={node.id} className="flex flex-col items-center w-full">
              {/* Node card */}
              <div
                className={`w-full rounded-[6px] border p-3 transition-all duration-500 ${
                  isFailing
                    ? `${c.ring} ${c.bg} shadow-[0_0_16px_rgba(239,68,68,0.12)]`
                    : 'border-[#1F2937] bg-[#111827]/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-500 ${isFailing ? c.dot : 'bg-slate-600'} ${isFailing ? 'animate-pulse' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold transition-colors duration-300 ${isFailing ? c.text : 'text-slate-300'}`}>
                      {node.label}
                    </p>
                    <code className="text-[10px] text-slate-400 font-mono">{node.sublabel}</code>
                  </div>
                  {isFailing && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono ${
                      node.color === 'red' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                      node.color === 'orange' ? 'text-orange-400 bg-orange-500/10 border-orange-500/30' :
                      'text-amber-400 bg-amber-500/10 border-amber-500/30'
                    }`}>
                      {node.color === 'red' ? 'CONTRACT DRIFT' : node.color === 'orange' ? 'UNDEFINED' : 'BLOCKED'}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector arrow */}
              {i < ARCH_NODES.length - 1 && (
                <div className="flex flex-col items-center my-1">
                  <div className={`w-px h-4 transition-colors duration-500 ${cascadeActive ? 'bg-red-500/40' : 'bg-slate-700'}`} />
                  <ChevronRight className={`w-3 h-3 rotate-90 -mt-1 transition-colors duration-500 ${cascadeActive ? 'text-red-500/60' : 'text-slate-700'}`} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {cascadeActive && (
        <div className="rounded-[6px] border border-red-500/30 bg-red-950/20 p-2.5 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-red-300 leading-relaxed font-mono">
            Cascade triggered — <span className="text-red-200 font-semibold">2 services</span>{' '}
            <span className="inline-flex items-center gap-0.5"><XCircle className="w-3 h-3 text-red-400 shrink-0" /> degraded</span>,{' '}
            <span className="inline-flex items-center gap-0.5 text-amber-300"><MinusCircle className="w-3 h-3 shrink-0" /> 1 blocked</span>
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Failure Replay ────────────────────────────────────────────────────────────

function FailureReplaySection() {
  const steps = analysisData.failureReplay as FailureStep[]
  const [activeStep, setActiveStep] = useState<number>(-1)
  const [running, setRunning] = useState(false)

  function reset() {
    setActiveStep(-1)
    setRunning(false)
  }

  async function replay() {
    reset()
    setRunning(true)
    for (let i = 0; i < steps.length; i++) {
      await new Promise<void>((r) => setTimeout(r, 700))
      setActiveStep(i)
    }
    setRunning(false)
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-[#22D3EE]" />
          <h2 className="text-sm font-semibold text-slate-100">Failure Replay</h2>
          <span className="text-[10px] font-mono text-slate-500 bg-[#111827] border border-[#1F2937] px-1.5 py-0.5 rounded">flight-recorder</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium bg-[#111827] hover:bg-[#1F2937] text-slate-400 border border-[#1F2937] transition disabled:opacity-40"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={replay}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold bg-[#0891B2] hover:bg-[#22D3EE]/80 text-white border border-[#22D3EE]/50 transition disabled:opacity-40 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
          >
            <Play className="w-3 h-3" />
            {running ? 'Replaying…' : 'Replay Failure'}
          </button>
        </div>
      </div>

      <div className="space-y-2 font-mono">
        {steps.map((step, i) => {
          const revealed = activeStep >= i
          const padded = String(step.step).padStart(2, '0')
          return (
            <div
              key={step.step}
              className={`flex items-start gap-3 p-3 rounded-[6px] border transition-all duration-500 ${
                revealed ? stepBorderColor(step.status) : 'border-[#1F2937] bg-[#111827]/30 opacity-35'
              }`}
            >
              <div className="flex items-center gap-2 mt-0.5 shrink-0">
                <span className="text-[11px] font-mono text-slate-400 w-4 tabular-nums">{padded}</span>
                {revealed ? (
                  <StepStatusIcon status={step.status} />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#1F2937] shrink-0" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-[11px] text-[#22D3EE]/80 font-mono">{step.location}</code>
                  {revealed && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border font-mono ${stepLabelColor(step.status)}`}>
                      {stepLabel(step.status)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-sans">{step.event}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Remediation Cards ─────────────────────────────────────────────────────────

interface CardMetric {
  label: string
  value: string
  accent?: string
  statusIcon?: 'pass' | 'fail' | 'warn'
}

interface RemediationCard {
  option: RemediationOption
  index: number
  selected: boolean
  onSelect: () => void
}

const CARD_PHILOSOPHY_COLOR: Record<string, { badge: string; border: string; activeBorder: string }> = {
  'Backward Compatibility':   { badge: 'text-sky-300 bg-sky-500/10 border-sky-500/30',     border: 'border-[#1F2937]', activeBorder: 'border-sky-500/50' },
  'Simplicity & Cleanliness': { badge: 'text-violet-300 bg-violet-500/10 border-violet-500/30', border: 'border-[#1F2937]', activeBorder: 'border-violet-500/50' },
  'Resilience & Boundary Safety': { badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30', border: 'border-[#1F2937]', activeBorder: 'border-emerald-500/50' },
}

const TEST_STATUS: Record<string, { label: string; cls: string; icon: 'pass' | 'fail' | 'warn' }> = {
  'strategy-a': { label: 'PASS', cls: 'text-[#10B981] bg-emerald-500/10 border-[#10B981] border-solid', icon: 'pass' },
  'strategy-b': { label: 'PASS', cls: 'text-[#10B981] bg-emerald-500/10 border-[#10B981] border-solid', icon: 'pass' },
  'strategy-c': { label: 'PASS', cls: 'text-[#10B981] bg-emerald-500/10 border-[#10B981] border-solid', icon: 'pass' },
}

const RISK_COLOR: Record<string, string> = {
  Low:      'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Medium:   'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  High:     'text-red-400 bg-red-500/10 border-red-500/30',
}

function cardMetrics(opt: RemediationOption): CardMetric[] {
  const ts = TEST_STATUS[opt.id] ?? { label: 'PASS', cls: 'text-[#10B981] bg-emerald-500/10 border-[#10B981] border-solid', icon: 'pass' as const }
  return [
    { label: 'Files changed', value: String(opt.filesAffected) },
    { label: 'Test status', value: ts.label, accent: ts.cls, statusIcon: ts.icon },
    { label: 'Risk', value: opt.risk ?? '—', accent: opt.risk ? RISK_COLOR[opt.risk] : undefined },
  ]
}

function RemediationCard({ option: opt, index, selected, onSelect }: RemediationCard) {
  const ph = CARD_PHILOSOPHY_COLOR[opt.philosophy] ?? { badge: 'text-slate-400 bg-slate-800 border-slate-700', border: 'border-[#1F2937]', activeBorder: 'border-[#22D3EE]/50' }
  const metrics = cardMetrics(opt)
  const label = String.fromCharCode(65 + index)

  return (
    <button
      onClick={onSelect}
      className={`flex flex-col gap-3 p-4 rounded-[6px] border text-left w-full transition-all duration-200 ${
        selected
          ? `bg-[#111827] ${ph.activeBorder} shadow-[0_0_16px_rgba(34,211,238,0.08)]`
          : `bg-[#111827]/40 ${ph.border} hover:border-[#22D3EE]/20 hover:bg-[#111827]/70`
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${
          selected ? 'text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/30' : 'text-slate-500 bg-slate-800/80 border-[#1F2937]'
        }`}>
          {label}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold leading-tight ${selected ? 'text-slate-100' : 'text-slate-300'}`}>{opt.name}</p>
          <span className={`inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${ph.badge}`}>{opt.subtitle}</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-1.5">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-400 font-sans">{m.label}</span>
            <span className={`text-[10px] font-mono font-semibold tabular-nums px-1.5 py-0.5 rounded border flex items-center gap-1 ${m.accent ?? 'text-slate-300 bg-[#0A0E17] border-[#1F2937]'}`}>
              {m.statusIcon === 'pass' && <CheckCircle2 className="w-3 h-3 shrink-0" />}
              {m.statusIcon === 'fail' && <XCircle className="w-3 h-3 shrink-0" />}
              {m.statusIcon === 'warn' && <AlertTriangle className="w-3 h-3 shrink-0" />}
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* Trade-off */}
      <div className="flex items-start gap-1.5 pt-1 border-t border-[#1F2937]">
        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-400 leading-relaxed">{opt.tradeOff}</p>
      </div>
    </button>
  )
}

// ─── Remediation Lab Section ───────────────────────────────────────────────────

function RemediationLabSection() {
  const options = analysisData.remediationOptions as RemediationOption[]
  const [selected, setSelected] = useState(0)
  const [applied, setApplied] = useState(false)
  const opt = options[selected]

  function handleApply() {
    setApplied(true)
  }

  function handleTabChange(i: number) {
    setSelected(i)
    setApplied(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-[#22D3EE]" />
        <h2 className="text-sm font-semibold text-slate-100">Remediation Lab</h2>
        <span className="text-[10px] text-slate-500 font-mono bg-[#111827] border border-[#1F2937] px-1.5 py-0.5 rounded">3 hypotheses</span>
      </div>

      {/* 3 cards side-by-side */}
      <div className="grid grid-cols-3 gap-3">
        {options.map((o, i) => (
          <RemediationCard
            key={o.id}
            option={o}
            index={i}
            selected={selected === i}
            onSelect={() => handleTabChange(i)}
          />
        ))}
      </div>

      {/* Active Card Inspector */}
      <div className="rounded-[6px] border border-[#1F2937] bg-[#111827] p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-100">
              Option {String.fromCharCode(65 + selected)} — {opt.name}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">{opt.philosophy}</p>
          </div>
          <div className="text-[11px] text-slate-400 font-mono shrink-0">
            <span className="text-slate-200 font-semibold">{opt.filesAffected}</span> file{opt.filesAffected !== 1 ? 's' : ''} changed
          </div>
        </div>

        {/* Consequence Preview */}
        <div className="rounded-[6px] border border-[#1F2937] bg-[#0D1117] p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Consequence Preview</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400">Files affected</span>
              <span className="text-[10px] font-mono font-semibold text-slate-200 bg-[#111827] border border-[#1F2937] px-1.5 py-0.5 rounded">{opt.filesAffected}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400">Lines changed</span>
              <span className="text-[10px] font-mono font-semibold text-slate-200 bg-[#111827] border border-[#1F2937] px-1.5 py-0.5 rounded">
                {opt.linesChanged ?? '—'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400">Legacy support</span>
              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                opt.legacySupport === true ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                opt.legacySupport === false ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                'text-slate-400 bg-[#111827] border-[#1F2937]'
              }`}>
                {opt.legacySupport == null ? '—' : opt.legacySupport ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400">Technical debt</span>
              <span className="text-[10px] font-mono font-semibold text-slate-200 bg-[#111827] border border-[#1F2937] px-1.5 py-0.5 rounded">
                {opt.technicalDebt != null ? opt.technicalDebt : (opt.id === 'strategy-a' ? 'High' : opt.id === 'strategy-b' ? 'Low' : 'Medium')}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-[#1F2937] flex items-start gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-relaxed">{opt.tradeOff}</p>
          </div>
        </div>

        {/* Unified diff viewer */}
        <DiffViewer lines={opt.diffLines} codeFile={opt.codeFile} />

        {/* Verification Gate */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleApply}
            disabled={applied}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-xs font-semibold border transition-all duration-300 ${
              applied
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 cursor-default'
                : 'bg-[#0891B2] hover:bg-[#22D3EE]/80 text-white border-[#22D3EE]/50 shadow-[0_0_12px_rgba(34,211,238,0.15)] hover:shadow-[0_0_18px_rgba(34,211,238,0.25)]'
            } disabled:opacity-80`}
          >
            {applied ? (
              <><BadgeCheck className="w-3.5 h-3.5" /> Remediation Applied</>
            ) : (
              <><Play className="w-3 h-3" /> Apply This Remediation</>
            )}
          </button>

          {/* Status transition */}
          {applied ? (
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-[#EF4444] line-through opacity-60 border border-dashed border-[#EF4444] px-1.5 py-0.5 rounded">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                FAIL — {analysisData.verification.before}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="flex items-center gap-1 text-[#10B981] border border-solid border-[#10B981] px-1.5 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                PASS — {analysisData.verification.after}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#EF4444] border border-dashed border-[#EF4444] px-1.5 py-0.5 rounded">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              FAIL — {analysisData.verification.before}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── App Shell ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col font-sans"
      style={{ backgroundColor: '#0A0E17' }}
    >
      {/* ── Header ── */}
      <header className="border-b border-[#1F2937] bg-[#111827]/80 backdrop-blur px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#22D3EE]/10 border border-[#0891B2]/40 rounded-[6px]">
            <ShieldAlert className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              ReplayGuard
              <span className="text-[11px] bg-[#22D3EE]/10 text-[#22D3EE] px-2 py-0.5 rounded border border-[#0891B2]/40 font-medium tracking-wide">
                Remediation Lab
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">demo-target/ · v2.4.1 · loaded</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-[#111827] border border-[#1F2937] px-2.5 py-1 rounded-[6px] font-mono">
            Demo Loader <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-0.5" />
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[#22D3EE] bg-[#22D3EE]/10 border border-[#0891B2]/40 px-2.5 py-1 rounded-[6px] font-semibold">
            ● IBM Bob 2.0 Agent Mode
          </span>
        </div>
      </header>

      {/* ── Incident Bar ── */}
      <div className="bg-red-950/30 border-b border-red-500/30 px-6 py-2 flex items-center gap-3 shrink-0">
        <span className="text-[11px] font-bold text-red-400 font-mono tracking-widest uppercase">🔴 INCIDENT</span>
        <span className="w-px h-3 bg-red-500/30" />
        <span className="text-[11px] text-red-300 font-mono">{analysisData.incident}</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-amber-400 font-mono">
          <AlertTriangle className="w-3 h-3" />
          Contract Drift Detected
        </span>
      </div>

      {/* ── Top Grid: Architecture + Replay ── */}
      <div className="grid grid-cols-2 gap-0 border-b border-[#1F2937] shrink-0">
        {/* Left: Architecture Flow */}
        <div className="border-r border-[#1F2937] p-5">
          <ArchitectureFlow />
        </div>
        {/* Right: Failure Replay */}
        <div className="p-5">
          <FailureReplaySection />
        </div>
      </div>

      {/* ── Doc Drift + Test Trap Row ── */}
      <div className="grid grid-cols-2 gap-0 border-b border-[#1F2937] shrink-0">
        {/* Documentation Drift Detected */}
        <div className="border-r border-[#1F2937] p-5">
          <div className="rounded-[6px] border border-[#1F2937] bg-[#111827] p-4 space-y-3">
            <div className="flex items-center gap-2">
              <FileWarning className="w-3.5 h-3.5 text-[#F59E0B]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]">Documentation Drift Detected</p>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-[10px] text-slate-400 font-mono">{analysisData.docDrift.file}</code>
              <span className="text-[10px] font-mono text-slate-500 bg-[#0A0E17] border border-[#1F2937] px-1.5 py-0.5 rounded">L{analysisData.docDrift.line}</span>
            </div>
            <div className="space-y-0.5 font-mono text-xs">
              {analysisData.docDrift.diff.split('\n').map((line, i) => (
                <div
                  key={i}
                  className="px-2 py-0.5 rounded leading-relaxed"
                  style={{ color: line.startsWith('-') ? '#EF4444' : line.startsWith('+') ? '#10B981' : '#94a3b8' }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* False-Green Test Trap */}
        <div className="p-5">
          <div className="rounded-[6px] border border-[#EF4444]/30 bg-[#111827] p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Bug className="w-3.5 h-3.5 text-[#EF4444]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#EF4444]">False-Green Test Trap</p>
            </div>
            <code className="block text-[10px] text-slate-400 font-mono">{analysisData.testTrap.file}</code>
            <p className="text-xs text-slate-300 leading-relaxed">{analysisData.testTrap.reason}</p>
            <div className="rounded-[6px] border border-[#1F2937] bg-black/60 overflow-hidden font-mono text-xs">
              <div className="px-3 py-1 bg-[#111827]/80 border-b border-[#1F2937] text-[10px] text-slate-500">
                line {analysisData.testTrap.line}
              </div>
              <div className="p-3 text-red-300 bg-red-950/30 whitespace-pre-wrap break-all leading-relaxed">
                {analysisData.testTrap.snippet}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Grid: Remediation Lab ── */}
      <div className="flex-1 overflow-y-auto p-5">
        <RemediationLabSection />
      </div>
    </div>
  )
}
