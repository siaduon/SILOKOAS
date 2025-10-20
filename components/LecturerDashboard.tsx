
import React, { useState, useMemo, useCallback } from 'react';
import type { User, LogbookEntry } from '../types';
import { MOCK_LOGBOOKS, USERS } from '../constants';
import { LogbookStatus } from '../types';
import LogbookList from './LogbookList';
import LogbookDetailModal from './LogbookDetailModal';

interface LecturerDashboardProps {
  user: User;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ user }) => {
  const [logbooks, setLogbooks] = useState<LogbookEntry[]>(MOCK_LOGBOOKS);
  const [selectedLogbook, setSelectedLogbook] = useState<LogbookEntry | null>(null);

  const submittedLogbooks = useMemo(() => {
    return logbooks
      .filter(lb => lb.dosen_id === user.id_ref && lb.status === LogbookStatus.Diajukan)
      .sort((a, b) => new Date(a.tgl_pengajuan || 0).getTime() - new Date(b.tgl_pengajuan || 0).getTime());
  }, [logbooks, user.id_ref]);
  
  const getStudentName = (mahasiswa_id: number) => {
    return USERS.find(u => u.id_ref === mahasiswa_id && u.role === 'mahasiswa')?.nama_lengkap || 'Unknown';
  };

  const handleSelectLogbook = useCallback((logbook: LogbookEntry) => {
    setSelectedLogbook(logbook);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedLogbook(null);
  }, []);

  const handleUpdateStatus = useCallback((id: number, status: LogbookStatus, revisionNote?: string) => {
    setLogbooks(prev =>
      prev.map(lb =>
        lb.id === id
          ? {
              ...lb,
              status,
              catatan_revisi: revisionNote,
              tgl_verifikasi: status === LogbookStatus.Disetujui ? new Date().toISOString() : undefined,
            }
          : lb
      )
    );
    handleCloseModal();
  }, [handleCloseModal]);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800">Selamat Datang, {user.nama_lengkap}</h2>
        <p className="text-gray-600">NIDN: {(user.details as { nidn: string }).nidn}</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Logbook Perlu Verifikasi</h3>
        </div>
        <LogbookList 
            logbooks={submittedLogbooks} 
            onSelect={handleSelectLogbook} 
            userRole="dosen" 
        />
      </div>

      {selectedLogbook && (
        <LogbookDetailModal
          isOpen={!!selectedLogbook}
          onClose={handleCloseModal}
          logbook={selectedLogbook}
          studentName={getStudentName(selectedLogbook.mahasiswa_id)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default LecturerDashboard;
