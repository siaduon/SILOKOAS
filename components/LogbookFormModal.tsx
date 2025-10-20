import React, { useState, useEffect, useCallback } from 'react';
import type { LogbookEntry, Dosen, User } from '../types';
import { getAIAssistance } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface LogbookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: LogbookEntry, isDraft: boolean) => void;
  lecturers: (User & { details: Dosen })[];
  logbook: LogbookEntry | null;
}

const LogbookFormModal: React.FC<LogbookFormModalProps> = ({ isOpen, onClose, onSave, lecturers, logbook }) => {
  const [formData, setFormData] = useState<Partial<LogbookEntry>>({
    tanggal_kegiatan: new Date().toISOString().split('T')[0],
    judul_kegiatan: '',
    isi_logbook: '',
    dosen_id: lecturers[0]?.id_ref || 0,
    attachment: '',
  });
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    if (logbook) {
      setFormData(logbook);
      setFileName(logbook.attachment || '');
    } else {
      setFormData({
        tanggal_kegiatan: new Date().toISOString().split('T')[0],
        judul_kegiatan: '',
        isi_logbook: '',
        dosen_id: lecturers[0]?.id_ref || 0,
        attachment: '',
      });
      setFileName('');
    }
  }, [logbook, lecturers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      // In a real app, you would handle the file upload here.
      // For this mock, we'll just store the name.
      setFormData(prev => ({ ...prev, attachment: file.name }));
    } else {
        setFileName('');
        setFormData(prev => ({...prev, attachment: ''}));
    }
  };
  
  const handleGetSuggestion = useCallback(async () => {
    if (!formData.isi_logbook) return;
    setIsLoadingAI(true);
    setAiSuggestion('');
    const prompt = `Anda adalah seorang supervisor pendidikan kedokteran. Tinjau entri logbook berikut untuk kejelasan, kelengkapan, dan bahasa profesional. Berikan saran perbaikan dalam format poin-poin. Entri logbook:\n\n"${formData.isi_logbook}"`;
    const suggestion = await getAIAssistance(prompt);
    setAiSuggestion(suggestion);
    setIsLoadingAI(false);
  }, [formData.isi_logbook]);

  const handleSubmit = (isDraft: boolean) => {
    onSave(formData as LogbookEntry, isDraft);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{logbook ? 'Edit Logbook' : 'Isi Logbook Baru'}</h3>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <label htmlFor="tanggal_kegiatan" className="block text-sm font-medium text-gray-700">Tanggal Kegiatan</label>
              <input type="date" name="tanggal_kegiatan" id="tanggal_kegiatan" value={formData.tanggal_kegiatan} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="dosen_id" className="block text-sm font-medium text-gray-700">Dosen Pembimbing</label>
              <select name="dosen_id" id="dosen_id" value={formData.dosen_id} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                {lecturers.map(l => <option key={l.id_ref} value={l.id_ref}>{l.nama_lengkap}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="judul_kegiatan" className="block text-sm font-medium text-gray-700">Judul Kegiatan</label>
              <input type="text" name="judul_kegiatan" id="judul_kegiatan" value={formData.judul_kegiatan} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="isi_logbook" className="block text-sm font-medium text-gray-700">Isi Logbook</label>
              <textarea name="isi_logbook" id="isi_logbook" rows={6} value={formData.isi_logbook} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
             <div>
                <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">Lampiran (Opsional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="attachment-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Unggah file</span>
                                <input id="attachment-upload" name="attachment-upload" type="file" className="sr-only" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">atau seret dan lepas</p>
                        </div>
                        {fileName ? (
                             <p className="text-xs text-gray-500 font-semibold">{fileName}</p>
                        ) : (
                             <p className="text-xs text-gray-500">Semua jenis file</p>
                        )}
                    </div>
                </div>
            </div>
            
            {aiSuggestion && (
              <div className="p-4 bg-indigo-50 rounded-md">
                  <h4 className="text-sm font-semibold text-indigo-800">Saran dari AI:</h4>
                  <div className="mt-2 text-sm text-indigo-700 whitespace-pre-wrap">{aiSuggestion}</div>
              </div>
            )}
            
          </div>
          <div className="items-center px-4 py-3 mt-4 sm:flex sm:flex-row-reverse sm:px-0">
             <button onClick={() => handleSubmit(false)} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
              Ajukan Verifikasi
            </button>
             <button onClick={() => handleSubmit(true)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Simpan sebagai Draft
            </button>
            <button onClick={handleGetSuggestion} disabled={isLoadingAI} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:mr-auto sm:w-auto sm:text-sm disabled:opacity-50">
              <SparklesIcon className="h-5 w-5 mr-2 text-yellow-500"/>
              {isLoadingAI ? 'Memproses...' : 'Bantuan AI'}
            </button>
            <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogbookFormModal;