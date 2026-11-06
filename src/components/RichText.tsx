'use client';

import React, { useMemo } from 'react';
import { MathView } from './MathView';
import { parseMathText } from '@/lib/mathText';

interface RichTextProps {
  text: string;
  className?: string;
}

/** Inline text where all math / chemistry / symbols are typeset with KaTeX. */
export const RichText: React.FC<RichTextProps> = ({ text, className }) => {
  const parts = useMemo(() => parseMathText(text ?? ''), [text]);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.type === 'text' ? (
          <React.Fragment key={i}>{p.value}</React.Fragment>
        ) : (
          <MathView key={i} math={p.value} block={p.block} className={p.block ? '' : 'mx-[0.1em]'} />
        ),
      )}
    </span>
  );
};

/** Inline **bold**, `code` and math inside a line of markdown. */
function renderInline(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let cursor = 0;
  let n = 0;
  for (const m of line.matchAll(re)) {
    if (m.index! > cursor) nodes.push(<RichText key={`${keyPrefix}-${n++}`} text={line.slice(cursor, m.index)} />);
    const tok = m[0];
    if (tok.startsWith('**')) {
      nodes.push(
        <strong key={`${keyPrefix}-${n++}`} className="font-semibold text-title">
          <RichText text={tok.slice(2, -2)} />
        </strong>,
      );
    } else {
      nodes.push(
        <code key={`${keyPrefix}-${n++}`} className="px-1 py-0.5 rounded bg-inset border border-theme-subtle text-[0.85em]">
          {tok.slice(1, -1)}
        </code>,
      );
    }
    cursor = m.index! + tok.length;
  }
  if (cursor < line.length) nodes.push(<RichText key={`${keyPrefix}-${n++}`} text={line.slice(cursor)} />);
  return nodes;
}

/** Light markdown renderer for Gemini answers (headings, lists, bold, $math$). */
export const RichMarkdown: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const blocks = useMemo(() => {
    const out: React.ReactNode[] = [];
    const lines = (text ?? '').replace(/\r/g, '').split('\n');
    let list: { ordered: boolean; items: string[] } | null = null;
    let para: string[] = [];
    let inDisplay = false;
    let display: string[] = [];
    let k = 0;

    const flushPara = () => {
      if (para.length) {
        out.push(
          <p key={`p${k++}`} className="leading-relaxed">
            {renderInline(para.join(' '), `p${k}`)}
          </p>,
        );
        para = [];
      }
    };
    const flushList = () => {
      if (!list) return;
      const Tag = list.ordered ? 'ol' : 'ul';
      out.push(
        <Tag key={`l${k++}`} className={`${list.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1.5 marker:text-accent`}>
          {list.items.map((it, i) => (
            <li key={i} className="leading-relaxed pl-1">
              {renderInline(it, `li${k}-${i}`)}
            </li>
          ))}
        </Tag>,
      );
      list = null;
    };

    for (const raw of lines) {
      const line = raw.trimEnd();
      if (inDisplay) {
        if (line.trim().endsWith('$$')) {
          display.push(line.trim().replace(/\$\$$/, ''));
          out.push(<RichText key={`d${k++}`} text={`$$${display.join(' ')}$$`} />);
          inDisplay = false;
          display = [];
        } else display.push(line);
        continue;
      }
      if (line.trim().startsWith('$$') && !(line.trim().length > 2 && line.trim().endsWith('$$'))) {
        flushPara();
        flushList();
        inDisplay = true;
        display = [line.trim().replace(/^\$\$/, '')];
        continue;
      }
      const h = line.match(/^(#{1,4})\s+(.*)$/);
      const ul = line.match(/^\s*[-*•]\s+(.*)$/);
      const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      if (!line.trim()) {
        flushPara();
        flushList();
      } else if (h) {
        flushPara();
        flushList();
        out.push(
          <h4 key={`h${k++}`} className="font-display font-semibold text-title text-base sm:text-lg pt-2">
            {renderInline(h[2], `h${k}`)}
          </h4>,
        );
      } else if (ul || ol) {
        flushPara();
        const ordered = !!ol;
        if (!list || list.ordered !== ordered) {
          flushList();
          list = { ordered, items: [] };
        }
        list.items.push((ul ?? ol)![1]);
      } else {
        flushList();
        para.push(line.trim());
      }
    }
    flushPara();
    flushList();
    return out;
  }, [text]);

  return <div className={`space-y-3 ${className}`}>{blocks}</div>;
};
