import { useState, useEffect } from 'react';

const CodeEditor = ({ code }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    setLines(code.split('\n'));
  }, [code]);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm">
      {lines.map((line, index) => (
        <pre key={index} className="whitespace-pre-wrap">
          {line}
        </pre>
      ))}
    </div>
  );
};

export default CodeEditor;
