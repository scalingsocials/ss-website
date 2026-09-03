/**
 * ShopifySpeedGrader — a permitted React island (01 §2.1).
 *
 * Grades a store's Largest Contentful Paint against Google's Core Web Vitals
 * thresholds (Good ≤2.5s, Needs improvement ≤4s, Poor >4s) and models the revenue
 * of reaching the 2.5s "Good" bar. The uplift uses a user-set sensitivity
 * assumption (relative conversion change per second faster) — it is explicitly an
 * assumption the operator controls, never a claimed result. The thresholds and
 * formula are in crawlable HTML on the page. Shareable via
 * ?lcp=&sessions=&cr=&aov=&sens=.
 */
import { useEffect, useRef, useState } from 'react';

interface Props {
  lcp?: number;
  sessions?: number;
  cr?: number;
  aov?: number;
  sens?: number;
}

const TARGET = 2.5; // Google's "Good" LCP threshold, in seconds.
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const num = (v: string | null, fallback: number) => {
  const n = v == null ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

function grade(lcp: number): { label: string; tone: 'pos' | 'fg' | 'neg' } {
  if (lcp <= 2.5) return { label: 'Good', tone: 'pos' };
  if (lcp <= 4) return { label: 'Needs improvement', tone: 'fg' };
  return { label: 'Poor', tone: 'neg' };
}

export default function ShopifySpeedGrader({ lcp: lcp0 = 4.2, sessions: se0 = 40000, cr: cr0 = 1.8, aov: aov0 = 1500, sens: sens0 = 7 }: Props) {
  const [lcp, setLcp] = useState(lcp0);
  const [sessions, setSessions] = useState(se0);
  const [cr, setCr] = useState(cr0);
  const [aov, setAov] = useState(aov0);
  const [sens, setSens] = useState(sens0);
  const ready = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setLcp(num(p.get('lcp'), lcp0));
    setSessions(num(p.get('sessions'), se0));
    setCr(num(p.get('cr'), cr0));
    setAov(num(p.get('aov'), aov0));
    setSens(num(p.get('sens'), sens0));
    ready.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    const p = new URLSearchParams();
    p.set('lcp', String(lcp));
    p.set('sessions', String(sessions));
    p.set('cr', String(cr));
    p.set('aov', String(aov));
    p.set('sens', String(sens));
    window.history.replaceState(null, '', `?${p.toString()}`);
  }, [lcp, sessions, cr, aov, sens]);

  const g = grade(lcp);
  const secondsSaved = Math.max(0, lcp - TARGET);
  const upliftRel = (secondsSaved * sens) / 100; // relative uplift
  const newCr = cr * (1 + upliftRel);
  const extraOrders = (sessions * (newCr - cr)) / 100;
  const extraRevenue = extraOrders * aov;

  const field = (
    label: string,
    value: number,
    setter: (n: number) => void,
    opts: { prefix?: string; suffix?: string; step?: number; min?: number; hint?: string },
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
      {opts.hint && <span className="text-label text-[var(--fg-muted)]">{opts.hint}</span>}
    </label>
  );

  return (
    <div className="grid gap-[var(--space-6)] md:grid-cols-2">
      <div className="flex flex-col gap-[var(--space-4)]">
        {field('Largest Contentful Paint (LCP)', lcp, setLcp, { suffix: 's', step: 0.1, hint: 'Find it in PageSpeed Insights or Shopify’s web performance report.' })}
        {field('Monthly sessions', sessions, setSessions, { step: 1000 })}
        {field('Current conversion rate', cr, setCr, { suffix: '%', step: 0.1 })}
        {field('Average order value (AOV)', aov, setAov, { prefix: '₹', step: 50 })}
        {field('Assumed conversion change per second faster', sens, setSens, { suffix: '%', step: 1, hint: 'Your assumption, not a fact — set it to be conservative.' })}
      </div>

      <div className="flex flex-col gap-[var(--space-3)]">
        <div className="rounded-[var(--radius-card)] border border-[var(--rule-c)] bg-[var(--surface-c)] p-[var(--space-4)]">
          <div className="text-label font-medium text-[var(--fg-muted)]">Core Web Vitals grade (LCP)</div>
          <div className="display-type text-data-sm font-semibold" style={{ color: `var(--${g.tone})` }}>
            {g.label}
          </div>
          <p className="mt-[0.4rem] text-small text-[var(--fg-muted)]">
            Google rates LCP Good at 2.5s or under, Needs improvement up to 4s, and Poor above 4s. Your
            {' '}{lcp}s is {secondsSaved > 0 ? `${secondsSaved.toFixed(1)}s over the Good bar.` : 'already within the Good bar.'}
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--rule-c)] bg-[var(--surface-c)] p-[var(--space-4)]">
          <div className="text-label font-medium text-[var(--fg-muted)]">Modelled monthly revenue at 2.5s</div>
          <div className="display-type text-data-sm font-semibold" style={{ color: `var(--${extraRevenue > 0 ? 'pos' : 'fg'})` }}>
            {secondsSaved > 0 ? '+' + inr(extraRevenue) : '—'}
          </div>
          <p className="mt-[0.4rem] text-small text-[var(--fg-muted)]">
            {secondsSaved > 0
              ? `Reaching 2.5s at your assumed ${sens}% per second lifts conversion from ${cr}% to ${newCr.toFixed(2)}% — about ${Math.round(extraOrders)} more orders a month. This is a modelled estimate from your assumption, not a guarantee.`
              : 'You are already at or under the 2.5s target, so no speed gain is modelled here.'}
          </p>
        </div>
      </div>
    </div>
  );
}
