import React, { useState, useCallback } from 'react';
import type { LogbookEntry } from '../types';
import { LogbookStatus } from '../types';
import { getAIAssistance } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface LogbookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  logbook: LogbookEntry;
  studentName: string;
  onUpdateStatus: (id: number, status: LogbookStatus, revisionNote?: string) => void;
}

const LogbookDetailModal: React.FC<LogbookDetailModalProps> = ({ isOpen, onClose, logbook, studentName, onUpdateStatus }) => {
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleApprove = () => {
    onUpdateStatus(logbook.id, LogbookStatus.Disetujui);
  };

  const handleRequestRevision = () => {
    if (revisionNote.trim()) {
      onUpdateStatus(logbook.id, LogbookStatus.Revisi, revisionNote);
    }
  };
  
  const generateAIFeedback = useCallback(async () => {
    setIsLoadingAI(true);
    const prompt = `Anda adalah seorang dosen pembimbing kedokteran. Berdasarkan entri logbook ini: "${logbook.isi_logbook}", hasilkan masukan yang membangun dan sarankan poin-poin spesifik untuk revisi dalam format poin-poin.`;
    const feedback = await getAIAssistance(prompt);
    setRevisionNote(feedback);
    setIsLoadingAI(false);
  }, [logbook.isi_logbook]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <h3 className="text-xl font-bold text-gray-900">{logbook.judul_kegiatan}</h3>
        <div className="text-sm text-gray-500 mb-4">
          <p>Mahasiswa: {studentName}</p>
          <p>Tanggal Kegiatan: {logbook.tanggal_kegiatan}</p>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border max-h-60 overflow-y-auto">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{logbook.isi_logbook}</p>
        </div>

        {logbook.attachment && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Lampiran:</h4>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert(`Mengunduh ${logbook.attachment}... (simulasi)`); }} 
              className="text-sm text-indigo-600 hover:underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {logbook.attachment}
            </a>
          </div>
        )}

        {showRevisionInput && (
          <div className="mt-4">
            <label htmlFor="revision_note" className="block text-sm font-medium text-gray-700">Catatan Revisi</label>
            <textarea
              id="revision_note"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
            />
            <button
                onClick={generateAIFeedback}
                disabled={isLoadingAI}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
              <SparklesIcon className="h-5 w-5 mr-2 text-yellow-500" />
              {isLoadingAI ? 'Memproses...' : 'Buat Feedback dengan AI'}
            </button>
          </div>
        )}
        
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Tutup</button>
          {!showRevisionInput ? (
            <>
              <button onClick={() => setShowRevisionInput(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Minta Revisi</button>
              <button onClick={handleApprove} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Setujui</button>
            </>
          ) : (
            <button onClick={handleRequestRevision} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Kirim Revisi</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogbookDetailModal;