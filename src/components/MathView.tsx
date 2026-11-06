'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch (err) {
      console.error('KaTeX rendering error for equation:', math, err);
      return `<span class="katex-error text-rose-500 font-mono text-xs">${math}</span>`;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`my-2 overflow-x-auto py-1 scrollbar-none text-center ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-middle ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
