import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ChatPage from './pages/ChatPage';
import DirectChatPage from './pages/DirectChatPage';
import Background from './components/Background';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/chat') || location.pathname === '/direct-chat';

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Animated background */}
      {!hideNavbar && <Background />}

      {/* Navigation - hide on chat pages */}
      {!hideNavbar && <Navbar />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/chat/:characterId" element={<ChatPage />} />
        <Route path="/direct-chat" element={<DirectChatPage />} />
      </Routes>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#22d3ee',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff3bf7',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
