import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AnimatedRoutes from './components/AnimatedRoutes';
import Navigation from './components/Navigation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
