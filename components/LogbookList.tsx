
import React from 'react';
import type { LogbookEntry } from '../types';
import { LogbookStatus } from '../types';
import { USERS } from '../constants';
import PencilIcon from './icons/PencilIcon';

interface LogbookListProps {
  logbooks: LogbookEntry[];
  userRole: 'mahasiswa' | 'dosen';
  onEdit?: (logbook: LogbookEntry) => void;
  onSelect?: (logbook: LogbookEntry) => void;
}

const getStatusBadge = (status: LogbookStatus) => {
  switch (status) {
    case LogbookStatus.Disetujui:
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Disetujui</span>;
    case LogbookStatus.Diajukan:
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Diajukan</span>;
    case LogbookStatus.Revisi:
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Revisi</span>;
    case LogbookStatus.Draft:
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Draft</span>;
    default:
      return null;
  }
};

const getLecturerName = (dosen_id: number) => {
    return USERS.find(u => u.id_ref === dosen_id)?.nama_lengkap || 'N/A';
};

const getStudentName = (mahasiswa_id: number) => {
    return USERS.find(u => u.id_ref === mahasiswa_id && u.role === 'mahasiswa')?.nama_lengkap || 'Unknown';
}

const LogbookList: React.FC<LogbookListProps> = ({ logbooks, userRole, onEdit, onSelect }) => {
    
  if (logbooks.length === 0) {
      return <p className="text-center text-gray-500 py-10">Tidak ada data logbook.</p>
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {userRole === 'mahasiswa' ? 'Tanggal Kegiatan' : 'Tanggal Pengajuan'}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {userRole === 'mahasiswa' ? 'Judul Kegiatan' : 'Nama Mahasiswa'}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {userRole === 'mahasiswa' ? 'Dosen Pembimbing' : 'Judul Kegiatan'}
            </th>
             {userRole === 'mahasiswa' && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
                </th>
             )}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logbooks.map((lb) => (
            <tr key={lb.id} className={userRole === 'dosen' ? "hover:bg-gray-50 cursor-pointer" : ""} onClick={() => userRole === 'dosen' && onSelect && onSelect(lb)}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {userRole === 'mahasiswa' ? lb.tanggal_kegiatan : new Date(lb.tgl_pengajuan || '').toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {userRole === 'mahasiswa' ? lb.judul_kegiatan : getStudentName(lb.mahasiswa_id)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {userRole === 'mahasiswa' ? getLecturerName(lb.dosen_id) : lb.judul_kegiatan}
              </td>
              {userRole === 'mahasiswa' && (
                <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(lb.status)}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {userRole === 'mahasiswa' && lb.status === LogbookStatus.Revisi && onEdit && (
                  <button onClick={() => onEdit(lb)} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                    <PencilIcon className="h-4 w-4 mr-1"/>
                    Edit
                  </button>
                )}
                 {userRole === 'dosen' && onSelect && (
                   <span className="text-indigo-600 hover:text-indigo-900">Lihat Detail</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogbookList;
