import { useState, useEffect } from 'react';

const CodeEditor = ({ code, highlightText }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    setLines(code.split('\n'));
  }, [code]);

  const highlightLine = (line) => {
    if (!highlightText) return line;
    const parts = line.split(new RegExp(`(${highlightText})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlightText.toLowerCase() 
        ? <span key={index} className="bg-yellow-500 text-black">{part}</span>
        : part
    );
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm">
      {lines.map((line, index) => (
        <pre key={index} className="whitespace-pre-wrap">
          {highlightLine(line)}
        </pre>
      ))}
    </div>
  );
};

export default CodeEditor;
