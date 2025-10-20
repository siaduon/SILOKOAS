
import React, { useMemo } from 'react';
import type { User, LogbookEntry } from '../types';
import { MOCK_LOGBOOKS, USERS, MOCK_GRADES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      totalStudents: USERS.filter(u => u.role === 'mahasiswa').length,
      totalLecturers: USERS.filter(u => u.role === 'dosen').length,
      submittedToday: MOCK_LOGBOOKS.filter(lb => lb.tgl_pengajuan?.startsWith(today)).length,
    };
  }, []);

  const staseAverageData = useMemo(() => {
    const gradesByStase: { [key: string]: { total: number; count: number } } = {};
    MOCK_GRADES.forEach(grade => {
      if (!gradesByStase[grade.nama_stase]) {
        gradesByStase[grade.nama_stase] = { total: 0, count: 0 };
      }
      gradesByStase[grade.nama_stase].total += grade.nilai_akhir;
      gradesByStase[grade.nama_stase].count++;
    });

    return Object.entries(gradesByStase).map(([name, data]) => ({
      name,
      'Rata-rata Nilai': parseFloat((data.total / data.count).toFixed(2)),
    }));
  }, []);
  

  return (
    <div className="space-y-6">
       <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard {user.nama_lengkap}</h2>
        <p className="text-gray-600 capitalize">Peran: {user.role}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-500 font-medium">Total Mahasiswa</h4>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalStudents}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-500 font-medium">Total Dosen</h4>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalLecturers}</p>
          </div>
           <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-500 font-medium">Logbook Diajukan Hari Ini</h4>
              <p className="text-3xl font-bold text-indigo-600">{stats.submittedToday}</p>
          </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Rata-rata Nilai Akhir per Stase</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={staseAverageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Rata-rata Nilai" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
