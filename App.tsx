import React, { useState, useCallback } from 'react';
import type { User, Role } from './types';
import { USERS } from './constants';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import LecturerDashboard from './components/LecturerDashboard';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = useCallback((username: string) => {
    const user = USERS.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const renderDashboard = () => {
    if (!currentUser) {
      return <LoginPage onLogin={handleLogin} />;
    }

    const isAdminRole = currentUser.role === 'sekretariat' || 
                        currentUser.role === 'kaprodi' || 
                        currentUser.role === 'komkordik' ||
                        currentUser.role === 'admin';

    return (
      <div className="min-h-screen bg-gray-100">
        <Header user={currentUser} onLogout={handleLogout} />
        <main className="p-4 sm:p-6 lg:p-8">
          {currentUser.role === 'mahasiswa' && <StudentDashboard user={currentUser} />}
          {currentUser.role === 'dosen' && <LecturerDashboard user={currentUser} />}
          {isAdminRole && <AdminDashboard user={currentUser} />}
        </main>
      </div>
    );
  };

  return (
    <>
      {renderDashboard()}
    </>
  );
};

export default App;