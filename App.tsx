import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { Layout } from './components/Layout';
import { Gallery } from './features/gallery/Gallery';
import { PromptGenerator } from './features/generator/PromptGenerator';
import { UploadForm } from './features/upload/UploadForm';
import { Profile } from './features/profile/Profile';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/generate" element={<PromptGenerator />} />
            <Route path="/upload" element={<UploadForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
