import React, { useEffect } from 'react';

const TestBackground: React.FC = () => {
  useEffect(() => {
    console.log('TestBackground mounted');
  }, []);

  return (
    <div className="fixed inset-0 -z-30 bg-purple-800 opacity-50" />
  );
};

export default TestBackground; 