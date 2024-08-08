import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism-tomorrow.css';

const CodeEditor = ({ code, highlightText }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, highlightText]);

  const highlightCode = () => {
    if (!highlightText) return code;
    const escapedHighlightText = highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlightText})`, 'gi');
    return code.replace(regex, '<span class="bg-yellow-500 text-black">$1</span>');
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">
      <pre className="language-jsx">
        <code dangerouslySetInnerHTML={{ __html: Prism.highlight(highlightCode(), Prism.languages.jsx, 'jsx') }} />
      </pre>
    </div>
  );
};

export default CodeEditor;
