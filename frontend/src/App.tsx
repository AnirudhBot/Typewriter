import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import DocumentList from './components/documents/DocumentList';
import Editor from './components/editor/Editor';
import Navigation from './components/common/Navigation';
import LandingPage from './components/LandingPage';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <main className="container mx-auto px-4">
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/documents" element={
                <PrivateRoute>
                  <DocumentList />
                </PrivateRoute>
              } />
              <Route path="/documents/:id" element={
                <PrivateRoute>
                  <Editor />
                </PrivateRoute>
              } />
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
