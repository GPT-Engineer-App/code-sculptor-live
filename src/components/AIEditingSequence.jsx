import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import CodeEditor from './CodeEditor';
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const simulateAIEditing = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    search: "const WeatherApp = () => {",
    replace: "const EnhancedWeatherApp = () => {"
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
  }, 50);
  return () => clearInterval(interval);
};

const AIEditingSequence = ({ originalCode, onEditComplete }) => {
  const [currentCode, setCurrentCode] = useState(originalCode);
  const [searchSequence, setSearchSequence] = useState('');
  const [replaceSequence, setReplaceSequence] = useState('');
  const [isSearching, setIsSearching] = useState(true);
  const [progress, setProgress] = useState(0);

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
          setProgress((streamedText.length / data.search.length) * 50);
        });
        
        return () => {
          if (clearSearchStream) clearSearchStream();
        };
      } else {
        const searchIndex = currentCode.indexOf(data.search);
        if (searchIndex !== -1) {
          const beforeSearch = currentCode.slice(0, searchIndex);
          const afterSearch = currentCode.slice(searchIndex + data.search.length);
          clearReplaceStream = streamTokens(data.replace, (streamedText) => {
            setReplaceSequence(streamedText);
            setCurrentCode(beforeSearch + streamedText + afterSearch);
            setProgress(50 + (streamedText.length / data.replace.length) * 50);
          });

          return () => {
            if (clearReplaceStream) clearReplaceStream();
          };
        }
      }
    }
  }, [data, isSearching, currentCode]);

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

  if (isLoading) return <div className="text-center">AI is analyzing the code...</div>;
  if (isError) return <div className="text-center text-red-500">Error occurred during AI editing</div>;

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <Progress value={progress} className="mb-4" />
        <div className="mb-2">
          <span className="font-bold">Search: </span>
          <span className="bg-yellow-200 p-1 rounded">{searchSequence}</span>
        </div>
        <div className="mb-4">
          <span className="font-bold">Replace: </span>
          <span className="bg-green-200 p-1 rounded">{replaceSequence}</span>
        </div>
        <CodeEditor code={currentCode} highlightText={isSearching ? searchSequence : replaceSequence} />
      </CardContent>
    </Card>
  );
};

export default AIEditingSequence;
