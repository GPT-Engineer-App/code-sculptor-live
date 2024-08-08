import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import AIEditingSequence from '../components/AIEditingSequence';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sampleReactCode = `import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.weather.com/current');
        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <div>Loading weather data...</div>;

  return (
    <div className="weather-app">
      <h1>Current Weather</h1>
      {weather && (
        <div>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Condition: {weather.condition}</p>
          <p>Humidity: {weather.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;`;

const Index = () => {
  const [code, setCode] = useState(sampleReactCode);
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleEditComplete = (newCode) => {
    setCode(newCode);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">AI Code Editor Showcase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {isEditing ? (
              <AIEditingSequence
                originalCode={code}
                onEditComplete={handleEditComplete}
              />
            ) : (
              <CodeEditor code={code} />
            )}
          </div>
          {!isEditing && (
            <Button
              onClick={handleStartEditing}
              className="mt-4 w-full"
            >
              Start AI Editing
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
