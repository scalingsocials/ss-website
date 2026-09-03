/**
 * CacPaybackCalculator — a permitted React island (01 §2.1).
 *
 * Payback (months) = CAC ÷ (AOV × gross margin × orders-per-year ÷ 12).
 * Contribution per order = AOV × gross margin. The formula and a worked example
 * are in crawlable HTML on the page; this widget is the interactive layer. It
 * reads and writes ?cac=&aov=&margin=&freq= so a result is shareable via URL.
 *
 * The calculator's own defaults are illustrative inputs, not client claims.
 */
import { useEffect, useRef, useState } from 'react';

interface Props {
  cac?: number;
  aov?: number;
  margin?: number;
  freq?: number;
}

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const num = (v: string | null, fallback: number) => {
  const n = v == null ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

export default function CacPaybackCalculator({ cac: cac0 = 800, aov: aov0 = 1500, margin: margin0 = 40, freq: freq0 = 2.5 }: Props) {
  const [cac, setCac] = useState(cac0);
  const [aov, setAov] = useState(aov0);
  const [margin, setMargin] = useState(margin0);
  const [freq, setFreq] = useState(freq0);
  const ready = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setCac(num(p.get('cac'), cac0));
    setAov(num(p.get('aov'), aov0));
    setMargin(num(p.get('margin'), margin0));
    setFreq(num(p.get('freq'), freq0));
    ready.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    const p = new URLSearchParams();
    p.set('cac', String(cac));
    p.set('aov', String(aov));
    p.set('margin', String(margin));
    p.set('freq', String(freq));
    window.history.replaceState(null, '', `?${p.toString()}`);
  }, [cac, aov, margin, freq]);

  const m = margin / 100;
  const contribPerOrder = aov * m;
  const contribPerYear = contribPerOrder * freq;
  const monthly = contribPerYear / 12;
  const paybackMonths = monthly > 0 ? cac / monthly : Infinity;
  const firstOrderCovers = contribPerOrder >= cac;

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
        {field('Customer acquisition cost (CAC)', cac, setCac, { prefix: '₹', step: 50 })}
        {field('Average order value (AOV)', aov, setAov, { prefix: '₹', step: 50 })}
        {field('Gross margin', margin, setMargin, { suffix: '%', step: 1, min: 0 })}
        {field('Orders per customer per year', freq, setFreq, { suffix: '×', step: 0.1, min: 0 })}
      </div>

      <div className="flex flex-col gap-[var(--space-3)]">
        <div className="rounded-[var(--radius-card)] border border-[var(--rule-c)] bg-[var(--surface-c)] p-[var(--space-4)]">
          <div className="text-label font-medium text-[var(--fg-muted)]">CAC payback period</div>
          <div className="display-type text-data-sm font-semibold text-[var(--fg)]">
            {Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) + ' months' : '—'}
          </div>
          <p className="mt-[0.4rem] text-small text-[var(--fg-muted)]">
            {firstOrderCovers
              ? 'The first order already covers CAC — you are cash-positive on acquisition from day one.'
              : 'How long the customer’s repeat contribution takes to earn back what you paid to acquire them.'}
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--rule-c)] bg-[var(--surface-c)] p-[var(--space-4)]">
          <div className="text-label font-medium text-[var(--fg-muted)]">Contribution per order</div>
          <div
            className="display-type text-data-sm font-semibold"
            style={{ color: `var(--${contribPerOrder - cac >= 0 ? 'pos' : 'fg'})` }}
          >
            {inr(contribPerOrder)}
          </div>
          <p className="mt-[0.4rem] text-small text-[var(--fg-muted)]">
            First-order gross contribution is {inr(contribPerOrder)} against a CAC of {inr(cac)} — a
            {contribPerOrder - cac >= 0 ? ' surplus' : ' shortfall'} of {inr(Math.abs(contribPerOrder - cac))} on order one.
          </p>
        </div>
      </div>
    </div>
  );
}
