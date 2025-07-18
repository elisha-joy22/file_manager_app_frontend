import React from 'react';
import './FileList.css';

export interface UserFile {
  id: number;
  original_filename: string;
  uploaded_at: string;
  file_url: string;
  file_type: string;
  file_size: number;
}

interface FileListProps {
  files: UserFile[];
  loading: boolean;
  error: string;
  onDelete: (id: number) => void;
}

const FileList: React.FC<FileListProps> = ({ files, loading, error, onDelete }) => {
  if (loading) return <p>Loading files...</p>;
  if (error) return <p className="error">{error}</p>;
  if (files.length === 0) return <p>No files uploaded yet.</p>;

  return (
    <div className="file-grid">
      {files.map((file) => (
        <div key={file.id} className="file-card">
          <p className="file-name">{file.original_filename}</p>
          <p className="file-meta">
            {file.file_type || 'Unknown type'} | {(file.file_size / 1024).toFixed(1)} KB
          </p>
          <p className="file-date">{new Date(file.uploaded_at).toLocaleString()}</p>
          <div className="file-actions">
            <a href={file.file_url} target="_blank" rel="noreferrer">
              Download
            </a>
            <button className="delete-btn" onClick={() => onDelete(file.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
