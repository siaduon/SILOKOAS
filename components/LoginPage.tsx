import React, { useState, useMemo } from 'react';
import { USERS } from '../constants';
import type { Role } from '../types';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const usersByRole = useMemo(() => {
    if (!selectedRole) return [];
    return USERS.filter(user => user.role === selectedRole);
  }, [selectedRole]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            SILOKOAS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistem Informasi Logbook & Penilaian Koas
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="role-select" className="sr-only">Peran</label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value as Role);
                  setUsername('');
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                required
              >
                <option value="" disabled>Pilih peran Anda</option>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="dosen">Dosen</option>
                <option value="sekretariat">Sekretariat</option>
                <option value="kaprodi">Kaprodi</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="user-select" className="sr-only">User</label>
              <select
                id="user-select"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!selectedRole}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                required
              >
                <option value="" disabled>Pilih user</option>
                {usersByRole.map(user => (
                  <option key={user.id} value={user.username}>{user.nama_lengkap}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (bisa diisi apa saja)"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                required
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;