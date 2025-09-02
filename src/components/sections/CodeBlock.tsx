// components/CodeBlock.tsx
'use client';
import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Thème (tu peux changer)

interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'javascript' }: Props) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className={`language-${language}`}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
