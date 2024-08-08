import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism-tomorrow.css';

const CodeEditor = ({ code, highlightText }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    setLines(code.split('\n'));
    Prism.highlightAll();
  }, [code]);

  const highlightLine = (line) => {
    if (!highlightText) return line;
    const escapedHighlightText = highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = line.split(new RegExp(`(${escapedHighlightText})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlightText.toLowerCase() 
        ? <span key={index} className="bg-yellow-500 text-black">{part}</span>
        : part
    );
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">
      <pre className="language-jsx">
        <code>
          {lines.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {highlightLine(line)}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default CodeEditor;
