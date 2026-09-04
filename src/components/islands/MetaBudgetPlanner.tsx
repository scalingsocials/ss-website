/**
 * MetaBudgetPlanner — a permitted React island (01 §2.1).
 *
 * Splits a monthly Meta budget into testing and scaling, and derives the daily
 * spend, the number of test cells the testing pool can fund, and an estimated
 * order volume from a target CPA. The formulae and a worked example are in
 * crawlable HTML on the page; this widget is the interactive layer. It reads
 * and writes ?budget=&split=&cpa=&cell= so a plan is shareable via URL.
 *
 * The defaults are illustrative planning inputs, not client claims or forecasts.
 */
import { useEffect, useRef, useState } from 'react';

interface Props {
  budget?: number;
  split?: number; // testing % of budget
  cpa?: number;
  cell?: number; // spend to read one test cell
}

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const num = (v: string | null, fallback: number) => {
  const n = v == null ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

export default function MetaBudgetPlanner({ budget: b0 = 150000, split: s0 = 30, cpa: c0 = 600, cell: cell0 = 8000 }: Props) {
  const [budget, setBudget] = useState(b0);
  const [split, setSplit] = useState(s0);
  const [cpa, setCpa] = useState(c0);
  const [cell, setCell] = useState(cell0);
  const ready = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setBudget(num(p.get('budget'), b0));
    setSplit(num(p.get('split'), s0));
    setCpa(num(p.get('cpa'), c0));
    setCell(num(p.get('cell'), cell0));
    ready.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    const p = new URLSearchParams();
    p.set('budget', String(budget));
    p.set('split', String(split));
    p.set('cpa', String(cpa));
    p.set('cell', String(cell));
    window.history.replaceState(null, '', `?${p.toString()}`);
  }, [budget, split, cpa, cell]);

  const s = Math.min(Math.max(split, 0), 100) / 100;
  const testing = budget * s;
  const scaling = budget - testing;
  const daily = budget / 30.4;
  const testCells = cell > 0 ? Math.floor(testing / cell) : 0;
  const estOrders = cpa > 0 ? budget / cpa : 0;
  const scalingOrders = cpa > 0 ? scaling / cpa : 0;

  const field = (
    label: string,
    value: number,
    setter: (n: number) => void,
    opts: { prefix?: string; suffix?: string; step?: number; min?: number; max?: number; hint?: string },
  ) => (
    <label className="flex flex-col gap-[0.4rem]">
      <span className="text-small font-medium text-[var(--fg)]">{label}</span>
      <span className="flex items-center rounded-[var(--radius-input)] border border-[var(--fg-muted)] bg-[var(--ground)] px-[var(--space-3)] focus-within:outline focus-within:outline-2 focus-within:outline-[var(--accent-text)]">
        {opts.prefix && <span className="pr-[0.3rem] text-[var(--fg-muted)]">{opts.prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ''}
          step={opts.step ?? 1}
          min={opts.min ?? 0}
          max={opts.max}
          onChange={(e) => setter(num(e.target.value, 0))}
          className="w-full bg-transparent py-[0.6rem] text-body text-[var(--fg)] outline-none"
        />
        {opts.suffix && <span className="pl-[0.3rem] text-[var(--fg-muted)]">{opts.suffix}</span>}
      </span>
      {opts.hint && <span className="text-label text-[var(--fg-muted)]">{opts.hint}</span>}
    </label>
  );

  const stat = (label: string, value: string, note: string) => (
    <div className="rounded-[var(--radius-card)] border border-[var(--rule-c)] bg-[var(--surface-c)] p-[var(--space-4)]">
      <div className="text-label font-medium text-[var(--fg-muted)]">{label}</div>
      <div className="display-type text-data-sm font-semibold text-[var(--fg)]">{value}</div>
      <p className="mt-[0.4rem] text-small text-[var(--fg-muted)]">{note}</p>
    </div>
  );

  return (
    <div className="grid gap-[var(--space-6)] md:grid-cols-2">
      <div className="flex flex-col gap-[var(--space-4)]">
        {field('Monthly ad budget', budget, setBudget, { prefix: '₹', step: 5000 })}
        {field('Testing split', split, setSplit, { suffix: '%', step: 5, min: 0, max: 100, hint: 'The share reserved for testing new creative and audiences.' })}
        {field('Target cost per acquisition (CPA)', cpa, setCpa, { prefix: '₹', step: 50 })}
        {field('Spend to read one test cell', cell, setCell, { prefix: '₹', step: 500, hint: 'Roughly the spend needed to judge one creative or audience.' })}
      </div>

      <div className="flex flex-col gap-[var(--space-3)]">
        <div className="grid gap-[var(--space-3)] sm:grid-cols-2">
          {stat('Testing budget', inr(testing), `${split}% of your budget, funding ${testCells} test ${testCells === 1 ? 'cell' : 'cells'} at ${inr(cell)} each.`)}
          {stat('Scaling budget', inr(scaling), `${100 - split}% put behind proven winners, roughly ${Math.round(scalingOrders)} orders at ${inr(cpa)} CPA.`)}
        </div>
        <div className="grid gap-[var(--space-3)] sm:grid-cols-2">
          {stat('Daily spend', inr(daily), 'Total budget spread across the month.')}
          {stat('Est. orders / month', `${Math.round(estOrders)}`, `At a ${inr(cpa)} target CPA across the whole budget, a planning estimate rather than a forecast.`)}
        </div>
      </div>
    </div>
  );
}
