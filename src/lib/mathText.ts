/**
 * Converts prose containing unicode math/chemistry (CO₂, 10⁻⁴, ∇², ≈, T_∞ ...) and
 * explicit $...$ / $$...$$ segments into an array of text / math parts so that every
 * equation, symbol, unit exponent and chemical formula is typeset by KaTeX.
 */

export type MathPart = { type: 'text'; value: string } | { type: 'math'; value: string; block?: boolean };

const SUP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+',
};
const SUB: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', '₊': '+', '₋': '-',
};
const SYMBOLS: Record<string, string> = {
  '∇': '\\nabla ', '∂': '\\partial ', '≈': '\\approx ', '→': '\\to ', '⇌': '\\rightleftharpoons ', '⇒': '\\Rightarrow ',
  '×': '\\times ', '≤': '\\le ', '≥': '\\ge ', '±': '\\pm ', '∞': '\\infty ', '∝': '\\propto ', '≪': '\\ll ', '≫': '\\gg ',
  '·': '\\cdot ', '°': '^{\\circ}', '√': '\\sqrt{}', '∫': '\\int ', '∑': '\\sum ', '−': '-',
  'α': '\\alpha ', 'β': '\\beta ', 'γ': '\\gamma ', 'δ': '\\delta ', 'ε': '\\varepsilon ', 'θ': '\\theta ', 'κ': '\\kappa ',
  'λ': '\\lambda ', 'μ': '\\mu ', 'µ': '\\mu ', 'ν': '\\nu ', 'π': '\\pi ', 'ρ': '\\rho ', 'σ': '\\sigma ', 'τ': '\\tau ',
  'φ': '\\varphi ', 'χ': '\\chi ', 'ψ': '\\psi ', 'ω': '\\omega ', 'Δ': '\\Delta ', 'Σ': '\\Sigma ', 'Ω': '\\Omega ',
  'Φ': '\\Phi ', 'Ψ': '\\Psi ', 'Π': '\\Pi ', 'Λ': '\\Lambda ',
};

const SUP_CLASS = '⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺';
const SUB_CLASS = '₀₁₂₃₄₅₆₇₈₉₊₋';
const SYM_CLASS = Object.keys(SYMBOLS).filter((k) => !['·', '−', '°', '√', '∫', '∑'].includes(k)).join('');

const UNITS = new Set(['m', 's', 'K', 'W', 'J', 'N', 'kg', 'g', 'mol', 'Pa', 'kPa', 'psi', 'nm', 'mm', 'cm', 'km', 'Hz', 'V', 'A', 'eV', 'kJ', 'MJ', 'atm', 'T', 'L', 'cm', 'min', 'h', 'ms']);
const STOP = new Set(['a', 'an', 'in', 'to', 'is', 'as', 'of', 'on', 'or', 'by', 'at', 'be', 'it', 'we', 'up', 'so', 'no', 'do', 'if', 'the', 'and', 'for', 'but', 'not', 'are', 'was', 'can', 'may', 'has', 'had', 'its', 'via', 'vs', 'per', 'then', 'with', 'from', 'that', 'this', 'than', 'when', 'into', 'while']);

function mapRun(run: string): string {
  // Turn a run of super/sub-script glyphs into ^{..} / _{..}
  let out = '';
  let i = 0;
  while (i < run.length) {
    const isSup = run[i] in SUP;
    let j = i;
    let val = '';
    while (j < run.length && (isSup ? run[j] in SUP : run[j] in SUB)) {
      val += isSup ? SUP[run[j]] : SUB[run[j]];
      j++;
    }
    out += (isSup ? '^{' : '_{') + val + '}';
    i = j;
  }
  return out;
}

function symbolsToTex(s: string): string {
  let out = '';
  for (const ch of s) out += SYMBOLS[ch] ?? ch;
  return out;
}

/** Convert a base token (CO, m/s, g, 10, ...) that carries scripts into TeX. */
function tokenToTex(base: string, scripts: string): string {
  const tex = mapRun(scripts);
  const isChem = /^([A-Z][a-z]?\d*|\(|\)|\[|\])+$/.test(base) && !/^[A-Z]$/.test(base);
  const isUnit = UNITS.has(base) || /[/·]/.test(base) || base.endsWith('/') ;
  const isNumber = /^[\d.]+$/.test(base);
  const b = symbolsToTex(base);
  if (isNumber) return `${b}${tex}`;
  if (isChem || isUnit) return `\\mathrm{${b.replace(/\//g, '/')}}${tex}`;
  return `${b}${tex}`;
}

const U = '(?:kPa|kg|kJ|MJ|mol|psi|atm|min|Hz|eV|Pa|nm|mm|cm|µm|µs|ms|m|s|K|W|J|N|g|V|A|L)';
const US = `${U}[${SUP_CLASS}]*`;
const UNIT_COMPOUND = `${US}(?:[/·](?:${US}|\\(${US}(?:[/·]${US})*\\)))+`;
const UNIT_SUP = `${U}[${SUP_CLASS}]+`;
const CHEM = `(?=[A-Za-z]*[${SUB_CLASS}])(?:[A-Z][a-z]?[${SUB_CLASS}]*)+[⁺⁻]?`;
const NUM_SUP = `\\d+(?:\\.\\d+)?[${SUP_CLASS}]+`;
const VAR_SCRIPT = `[A-Za-zα-ωΑ-Ω](?:[${SUP_CLASS}]|[${SUB_CLASS}])+`;
const SUBWORD = `[A-Za-zα-ωΑ-Ω]_(?:\\{[^}]+\\}|[A-Za-z0-9∞]+)(?:\\^\\{?-?\\d+\\}?)?`;
const SYMBOL = `[${SYM_CLASS}][${SUP_CLASS}]*`;
const MU_UNIT = `[µμ](?:mol|m|s|g|L)`;
const EXCITED = `(?:CH|OH|NH|CN|C[₂2])\\*`;

const DETECT_RE = new RegExp(
  [
    `(?<![A-Za-z0-9])(?<unitc>${UNIT_COMPOUND})(?![A-Za-z])`,
    `(?<![A-Za-z0-9])(?<units>${UNIT_SUP})(?![A-Za-z])`,
    `(?<![A-Za-z])(?<exc>${EXCITED})`,
    `(?<![A-Za-z])(?<chem>${CHEM})(?![a-z])`,
    `(?<numsup>${NUM_SUP})`,
    `(?<![A-Za-z0-9])(?<vars>${VAR_SCRIPT})`,
    `(?<![A-Za-z0-9])(?<sub>${SUBWORD})`,
    `(?<=\\d\\s?|^)(?<mu>${MU_UNIT})(?![A-Za-z])`,
    `(?<sym>${SYMBOL})`,
  ].join('|'),
  'gu',
);

function chemToTex(s: string): string {
  const body = s.replace(/([A-Z][a-z]?)([₀-₉]+)?/g, (_m, el: string, sub?: string) => (sub ? `${el}_{${mapRun(sub).slice(2, -1)}}` : el));
  return `\\mathrm{${body.replace(/⁺/g, '^{+}').replace(/⁻/g, '^{-}')}}`;
}
function unitToTex(s: string): string {
  const body = s
    .replace(new RegExp(`[${SUP_CLASS}]+`, 'g'), (r) => mapRun(r))
    .replace(/µ/g, '\\mu ')
    .replace(/·/g, '\\cdot ');
  return `\\mathrm{${body}}`;
}
function varToTex(s: string): string {
  const base = s[0];
  const rest = s.slice(1);
  return `${SYMBOLS[base] ?? base}${mapRun(rest)}`;
}
function subToTex(s: string): string {
  const m = s.match(/^(.)_(\{[^}]+\}|[A-Za-z0-9∞]+)(\^\{?(-?\d+)\}?)?$/u)!;
  const sub = m[2].replace(/^\{|\}$/g, '').replace(/∞/g, '\\infty ');
  const subTex = /^[A-Za-z]{2,}$/.test(sub) ? `\\text{${sub}}` : sub;
  return `${SYMBOLS[m[1]] ?? m[1]}_{${subTex}}${m[4] ? `^{${m[4]}}` : ''}`;
}

/** Auto-detect math fragments in a plain string (no $ delimiters). */
function autoDetect(text: string): MathPart[] {
  type Hit = { start: number; end: number; tex: string; rel?: boolean };
  let hits: Hit[] = [];
  for (const m of text.matchAll(DETECT_RE)) {
    const g = m.groups!;
    const start = m.index!;
    const end = start + m[0].length;
    let tex: string;
    let rel = false;
    if (g.exc) tex = `\\mathrm{${m[0].slice(0, -1).replace(/[₂2]/, '_2')}}^{*}`;
    else if (g.mu) tex = `\\mu\\mathrm{${m[0].slice(1)}}`;
    else if (g.unitc || g.units) tex = unitToTex(m[0]);
    else if (g.chem) {
      tex = chemToTex(m[0]);
    } else if (g.numsup) {
      const mm = m[0].match(/^([\d.]+)(.+)$/)!;
      tex = `${mm[1]}${mapRun(mm[2])}`;
    } else if (g.vars) tex = varToTex(m[0]);
    else if (g.sub) tex = subToTex(m[0]);
    else {
      const base = m[0][0];
      const sym = SYMBOLS[base] ?? base;
      tex = sym + mapRun(m[0].slice(1));
      rel = /^\\(approx|to|le|ge|pm|propto|ll|gg|rightleftharpoons|Rightarrow|times)\b/.test(sym);
    }
    hits.push({ start, end, tex, rel });
  }

  // A relation symbol absorbs a short variable before it ("Gr ≈") and a number after it ("≈ 0.38").
  for (const h of hits) {
    if (!h.rel) continue;
    const before = text.slice(0, h.start).match(/(?<![A-Za-z0-9.])([A-Za-z]{1,3}\d?|\d+(?:\.\d+)?)\s?$/);
    if (before && !STOP.has(before[1].toLowerCase()) && !hits.some((o) => o !== h && o.start >= h.start - before[0].length && o.end <= h.start)) {
      h.tex = `${before[1]}\\,${h.tex}`;
      h.start -= before[0].length;
    }
    const after = text.slice(h.end).match(/^\s?(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)(?![\d.A-Za-z⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺₀-₉])/);
    if (after) {
      h.tex = `${h.tex}\\,${after[1]}`;
      h.end += after[0].length;
    }
  }

  // Merge neighbours separated by at most one space so "Gr ≈ 10⁶" is one expression.
  hits.sort((a, b) => a.start - b.start);
  const merged: Hit[] = [];
  for (const h of hits) {
    const prev = merged[merged.length - 1];
    if (prev && h.start < prev.end) continue; // overlap, keep first
    if (prev && /^ ?$/.test(text.slice(prev.end, h.start)) && (prev.rel || h.rel || /\\(approx|to|times)/.test(prev.tex))) {
      prev.tex += (h.start > prev.end ? '\\,' : '') + h.tex;
      prev.end = h.end;
      prev.rel = prev.rel || h.rel;
    } else merged.push({ ...h });
  }

  const parts: MathPart[] = [];
  let cursor = 0;
  for (const h of merged) {
    if (h.start > cursor) parts.push({ type: 'text', value: text.slice(cursor, h.start) });
    parts.push({ type: 'math', value: h.tex });
    cursor = h.end;
  }
  if (cursor < text.length) parts.push({ type: 'text', value: text.slice(cursor) });
  return parts;
}

export function parseMathText(input: string): MathPart[] {
  if (!input) return [];
  const parts: MathPart[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let cursor = 0;
  for (const m of input.matchAll(re)) {
    if (m.index! > cursor) parts.push(...autoDetect(input.slice(cursor, m.index)));
    if (m[1] !== undefined) parts.push({ type: 'math', value: m[1].trim(), block: true });
    else parts.push({ type: 'math', value: m[2].trim() });
    cursor = m.index! + m[0].length;
  }
  if (cursor < input.length) parts.push(...autoDetect(input.slice(cursor)));
  return parts;
}

/** ASCII/WinAnsi-safe version for jsPDF's built-in fonts (KaTeX can't run inside a PDF). */
export function toPlainMath(input: string): string {
  if (!input) return '';
  const subSup = (run: string) => {
    const isSup = run[0] in SUP;
    const val = [...run].map((c) => (isSup ? SUP[c] : SUB[c]) ?? c).join('');
    return isSup ? `^${val.length > 1 || val === '-' ? `(${val})` : val}` : `_${val}`;
  };
  return input
    .replace(/\$\$?([^$]+?)\$\$?/g, '$1')
    .replace(new RegExp(`[${SUP_CLASS}]+|[${SUB_CLASS}]+`, 'g'), subSup)
    .replace(/[∇∂≈→⇌⇒≤≥∞∝≪≫−·×µαβγδεθκλμνπρστφχψωΔΣΩΦΨΠΛ]/g, (c) => {
      const map: Record<string, string> = {
        '∇': 'grad', '∂': 'd', '≈': '~', '→': '->', '⇌': '<=>', '⇒': '=>', '≤': '<=', '≥': '>=', '∞': 'inf', '∝': '~', '≪': '<<', '≫': '>>',
        '−': '-', '·': '*', '×': 'x', 'µ': 'u', 'μ': 'u', 'α': 'alpha', 'β': 'beta', 'γ': 'gamma', 'δ': 'delta', 'ε': 'eps', 'θ': 'theta',
        'κ': 'kappa', 'λ': 'lambda', 'ν': 'nu', 'π': 'pi', 'ρ': 'rho', 'σ': 'sigma', 'τ': 'tau', 'φ': 'phi', 'χ': 'chi', 'ψ': 'psi',
        'ω': 'omega', 'Δ': 'Delta', 'Σ': 'Sigma', 'Ω': 'Omega', 'Φ': 'Phi', 'Ψ': 'Psi', 'Π': 'Pi', 'Λ': 'Lambda',
      };
      return map[c] ?? c;
    });
}

/** Format a number as TeX scientific notation, e.g. 1.0e-4 -> "1.0\times10^{-4}". */
export function sciTex(n: number, digits = 2): string {
  if (!isFinite(n)) return '\\infty';
  if (n === 0) return '0';
  const [mant, exp] = n.toExponential(digits).split('e');
  return `${mant}\\times10^{${parseInt(exp, 10)}}`;
}
