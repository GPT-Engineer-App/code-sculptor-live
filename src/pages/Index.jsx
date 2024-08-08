import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import AIEditingSequence from '../components/AIEditingSequence';

const Index = () => {
  const [code, setCode] = useState(`function greet(name) {\n  console.log("Hello, " + name + "!");\n}\n\ngreet("World");`);
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleEditComplete = (newCode) => {
    setCode(newCode);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">AI Code Editor Showcase</h1>
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <CodeEditor code={code} />
        {!isEditing && (
          <button
            onClick={handleStartEditing}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Start AI Editing
          </button>
        )}
        {isEditing && (
          <AIEditingSequence
            originalCode={code}
            onEditComplete={handleEditComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
