/**
 * BreakEvenRoasCalculator — a permitted React island (01 §2.1).
 *
 * Break-even ROAS = 1 / gross margin. Profit per order = AOV × margin − AOV / ROAS.
 * The formula and a worked example are in crawlable HTML on the page (JS-off users
 * still get the substance); this widget is the interactive layer. It reads and
 * writes ?aov=&margin=&roas= so a result is shareable via the URL.
 *
 * The calculator's own defaults are illustrative inputs, not client claims.
 */
import { useEffect, useRef, useState } from 'react';

interface Props {
  aov?: number;
  margin?: number;
  roas?: number;
}

const inr = (n: number) =>
  '₹' + Math.round(n).toLocaleString('en-IN');
const num = (v: string | null, fallback: number) => {
  const n = v == null ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

export default function BreakEvenRoasCalculator({ aov: aov0 = 1500, margin: margin0 = 40, roas: roas0 = 3 }: Props) {
  const [aov, setAov] = useState(aov0);
  const [margin, setMargin] = useState(margin0);
  const [roas, setRoas] = useState(roas0);
  const ready = useRef(false);

  // Read shareable params after hydration (avoids SSR/hydration mismatch).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setAov(num(p.get('aov'), aov0));
    setMargin(num(p.get('margin'), margin0));
    setRoas(num(p.get('roas'), roas0));
    ready.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync so the result is shareable.
  useEffect(() => {
    if (!ready.current) return;
    const p = new URLSearchParams();
    p.set('aov', String(aov));
    p.set('margin', String(margin));
    p.set('roas', String(roas));
    window.history.replaceState(null, '', `?${p.toString()}`);
  }, [aov, margin, roas]);

  const m = margin / 100;
  const breakEven = m > 0 ? 1 / m : Infinity;
  const adCostPerOrder = roas > 0 ? aov / roas : 0;
  const profit = aov * m - adCostPerOrder;
  const profitable = Number.isFinite(breakEven) && roas >= breakEven;

  const field = (
    label: string,
    value: number,
    setter: (n: number) => void,
    opts: { prefix?: string; suffix?: string; step?: number; min?: number },
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
          onChange={(e) => setter(num(e.target.value, 0))}
          className="w-full bg-transparent py-[0.6rem] text-body text-[var(--fg)] outline-none"
        />
        {opts.suffix && <span className="pl-[0.3rem] text-[var(--fg-muted)]">{opts.suffix}</span>}
      </span>
    </label>
  );

  return (
    <div className="grid gap-[var(--space-6)] md:grid-cols-2">
      <div className="flex flex-col gap-[var(--space-4)]">
        {field('Average order value (AOV)', aov, setAov, { prefix: '₹', step: 50 })}
        {field('Gross margin', margin, setMargin, { suffix: '%', step: 1, min: 0 })}
        {field('Current ROAS', roas, setRoas, { suffix: '×', step: 0.1, min: 0 })}
      </div>

      <div className="flex flex-col gap-[var(--space-3)]">
        <div className="rounded-[var(--radius-card)] border border-[var(--rule-c)] bg-[var(--surface-c)] p-[var(--space-4)]">
          <div className="text-label font-medium text-[var(--fg-muted)]">Break-even ROAS</div>
          <div className="display-type text-data-sm font-semibold text-[var(--fg)]">
            {Number.isFinite(breakEven) ? breakEven.toFixed(2) + '×' : '—'}
          </div>
          <p className="mt-[0.4rem] text-small text-[var(--fg-muted)]">
            Below this, every order loses money. Above it, each order contributes profit.
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--rule-c)] bg-[var(--surface-c)] p-[var(--space-4)]">
          <div className="text-label font-medium text-[var(--fg-muted)]">Profit per order at {roas}× ROAS</div>
          <div
            className="display-type text-data-sm font-semibold"
            style={{ color: `var(--${profit >= 0 ? 'pos' : 'neg'})` }}
          >
            {inr(profit)}
          </div>
          <p className="mt-[0.4rem] text-small text-[var(--fg-muted)]">
            {profitable
              ? `At ${roas}× you clear break-even and keep ${inr(profit)} per order.`
              : `At ${roas}× you are under break-even, losing ${inr(Math.abs(profit))} per order.`}
          </p>
        </div>
      </div>
    </div>
  );
}
