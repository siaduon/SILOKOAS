
import React, { useState, useMemo, useCallback } from 'react';
import type { User, LogbookEntry, Dosen } from '../types';
import { MOCK_LOGBOOKS, USERS } from '../constants';
import { LogbookStatus } from '../types';
import LogbookList from './LogbookList';
import LogbookFormModal from './LogbookFormModal';
import PlusIcon from './icons/PlusIcon';

interface StudentDashboardProps {
  user: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const [logbooks, setLogbooks] = useState<LogbookEntry[]>(MOCK_LOGBOOKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogbook, setEditingLogbook] = useState<LogbookEntry | null>(null);

  const studentLogbooks = useMemo(() => {
    return logbooks.filter(lb => lb.mahasiswa_id === user.id_ref)
      .sort((a, b) => new Date(b.tanggal_kegiatan).getTime() - new Date(a.tanggal_kegiatan).getTime());
  }, [logbooks, user.id_ref]);

  const lecturers = useMemo(() => {
    return USERS.filter(u => u.role === 'dosen') as (User & { details: Dosen })[];
  }, []);

  const handleOpenModal = useCallback((logbook?: LogbookEntry) => {
    setEditingLogbook(logbook || null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingLogbook(null);
  }, []);

  const handleSaveLogbook = useCallback((entry: LogbookEntry, isDraft: boolean) => {
    const newStatus = isDraft ? LogbookStatus.Draft : LogbookStatus.Diajukan;
    const submissionDate = isDraft ? undefined : new Date().toISOString();
    
    if (editingLogbook) {
      // Update existing logbook
      setLogbooks(prev => prev.map(lb => lb.id === editingLogbook.id ? { ...entry, status: newStatus, tgl_pengajuan: submissionDate } : lb));
    } else {
      // Add new logbook
      const newEntry = {
        ...entry,
        id: Date.now(),
        mahasiswa_id: user.id_ref,
        status: newStatus,
        tgl_pengajuan: submissionDate,
      };
      setLogbooks(prev => [newEntry, ...prev]);
    }
    handleCloseModal();
  }, [editingLogbook, user.id_ref, handleCloseModal]);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800">Selamat Datang, {user.nama_lengkap}</h2>
        <p className="text-gray-600">NIM: {(user.details as { nim: string }).nim}</p>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Riwayat Logbook</h3>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2"/>
            Isi Logbook Baru
          </button>
        </div>
        <LogbookList logbooks={studentLogbooks} onEdit={handleOpenModal} userRole="mahasiswa" />
      </div>

      {isModalOpen && (
        <LogbookFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveLogbook}
          lecturers={lecturers}
          logbook={editingLogbook}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
