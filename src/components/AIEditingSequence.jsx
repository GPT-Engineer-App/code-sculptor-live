import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import CodeEditor from './CodeEditor';

const simulateAIEditing = async () => {
  // This is a mock function to simulate AI editing
  // In a real scenario, this would be an API call to your AI service
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  return {
    search: "console.log(\"Hello, \" + name + \"!\");",
    replace: "console.log(`Hello, ${name}!`);"
  };
};

const streamTokens = (text, callback) => {
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      callback(text.slice(0, i + 1));
      i++;
    } else {
      clearInterval(interval);
    }
  }, 100);
  return () => clearInterval(interval);
};

const AIEditingSequence = ({ originalCode, onEditComplete }) => {
  const [currentCode, setCurrentCode] = useState(originalCode);
  const [searchSequence, setSearchSequence] = useState('');
  const [replaceSequence, setReplaceSequence] = useState('');
  const [isSearching, setIsSearching] = useState(true);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['aiEdit'],
    queryFn: simulateAIEditing,
    enabled: true,
  });

  useEffect(() => {
    if (data) {
      let clearSearchStream, clearReplaceStream;

      if (isSearching) {
        clearSearchStream = streamTokens(data.search, (streamedText) => {
          setSearchSequence(streamedText);
        });
        
        return () => {
          if (clearSearchStream) clearSearchStream();
        };
      } else {
        setCurrentCode(prev => prev.replace(data.search, ''));
        clearReplaceStream = streamTokens(data.replace, (streamedText) => {
          setReplaceSequence(streamedText);
          setCurrentCode(prev => prev + streamedText[streamedText.length - 1]);
        });

        return () => {
          if (clearReplaceStream) clearReplaceStream();
        };
      }
    }
  }, [data, isSearching]);

  useEffect(() => {
    if (searchSequence === data?.search) {
      setIsSearching(false);
    }
  }, [searchSequence, data]);

  useEffect(() => {
    if (replaceSequence === data?.replace) {
      onEditComplete(currentCode);
    }
  }, [replaceSequence, data, currentCode, onEditComplete]);

  if (isLoading) return <div>AI is thinking...</div>;
  if (isError) return <div>Error occurred during AI editing</div>;

  return (
    <div className="mt-4">
      <div className="mb-2">
        <span className="font-bold">Search: </span>
        <span className="bg-yellow-200">{searchSequence}</span>
      </div>
      <div className="mb-2">
        <span className="font-bold">Replace: </span>
        <span className="bg-green-200">{replaceSequence}</span>
      </div>
      <CodeEditor code={currentCode} highlightText={isSearching ? searchSequence : ''} />
    </div>
  );
};

export default AIEditingSequence;
