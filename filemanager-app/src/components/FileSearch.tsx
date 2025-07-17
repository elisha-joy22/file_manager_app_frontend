import React from 'react';
import './FileSearch.css';

interface FileSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const FileSearch: React.FC<FileSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default FileSearch;
