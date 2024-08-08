import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

const simulateAIEditing = async () => {
  // This is a mock function to simulate AI editing
  // In a real scenario, this would be an API call to your AI service
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  return {
    search: "console.log(\"Hello, \" + name + \"!\");",
    replace: "console.log(`Hello, ${name}!`);"
  };
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
      let searchTimer, replaceTimer;
      
      if (isSearching) {
        let i = 0;
        searchTimer = setInterval(() => {
          if (i < data.search.length) {
            setSearchSequence(prev => prev + data.search[i]);
            i++;
          } else {
            clearInterval(searchTimer);
            setIsSearching(false);
            // Remove the searched sequence from the code
            setCurrentCode(prev => prev.replace(data.search, ''));
          }
        }, 100);
      } else {
        let i = 0;
        replaceTimer = setInterval(() => {
          if (i < data.replace.length) {
            setReplaceSequence(prev => prev + data.replace[i]);
            setCurrentCode(prev => prev + data.replace[i]);
            i++;
          } else {
            clearInterval(replaceTimer);
            onEditComplete(currentCode);
          }
        }, 100);
      }

      return () => {
        clearInterval(searchTimer);
        clearInterval(replaceTimer);
      };
    }
  }, [data, isSearching]);

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
      <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
        {currentCode}
      </div>
    </div>
  );
};

export default AIEditingSequence;
