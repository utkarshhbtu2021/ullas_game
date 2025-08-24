import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { UserProvider } from './contexts/UserContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PhonicGame from './pages/games/PhonicGame';
import ImageWordGame from './pages/games/ImageWordGame';
import CountingGame from './pages/games/CountingGame';
import ReadingGame from './pages/games/ReadingGame';
import WritingGame from './pages/games/WritingGame';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <VoiceProvider>
          <UserProvider>
            <div className="min-h-screen mainHome">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/games/phonics" element={
                  <ProtectedRoute>
                    <PhonicGame />
                  </ProtectedRoute>
                } />
                <Route path="/games/image-word" element={
                  <ProtectedRoute>
                    <ImageWordGame />
                  </ProtectedRoute>
                } />
                <Route path="/games/counting" element={
                  <ProtectedRoute>
                    <CountingGame />
                  </ProtectedRoute>
                } />
                <Route path="/games/reading" element={
                  <ProtectedRoute>
                    <ReadingGame />
                  </ProtectedRoute>
                } />
                <Route path="/games/writing" element={
                  <ProtectedRoute>
                    <WritingGame />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </UserProvider>
        </VoiceProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;