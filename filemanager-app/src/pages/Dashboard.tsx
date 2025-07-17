import React, { useEffect, useState} from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import FileList from '../components/FileList';
import type { UserFile } from '../components/FileList';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<UserFile[]>([]);  //cards
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  
  const [profile, setProfile] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();


  const username = profile?.username
  ? profile.username.charAt(0).toUpperCase() + profile.username.slice(1)
  : 'User';
  console.log(profile)
  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:8002/api/auth/profile/', {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) navigate('/login');
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();
      setProfile(data); // expected: { username: "yourname" }
    } catch (err) {
      console.error(err);
      setProfile(null);
    }
  };


  const fetchFiles = (pageNumber: number) => {
    setLoading(true);
    fetch(`http://localhost:8002/api/files/list/?page=${pageNumber}`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) navigate('/login');
          throw new Error('Failed to fetch files');
        }
        return res.json();
      })
      .then(data => {
        console.log(data)
        setFiles(data.results || data);
        setTotalPages(data.total_pages || data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not load files');
        setLoading(false);
      });
  };


  useEffect(() => {
    fetchFiles(page);
  }, [page]);

  useEffect(() => {
  fetchProfile();
}, []);


  const handleDelete = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    fetch(`http://localhost:8002/api/files/${id}/`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        fetchFiles(page);
      })
      .catch(err => {
        console.error(err);
      alert('Failed to delete file.');
      });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleUpload = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    fetch('http://localhost:8002/api/files/upload/', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Upload failed');
        return res.json();
      })
      .then(() => {
        setSelectedFile(null);
        fetchFiles(page);
      })
      .catch(err => {
        console.error(err);
        alert('Upload failed.');
      })
      .finally(() => setUploading(false));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchFiles(1);
  };

  const handleLogout = () => {
    fetch('http://localhost:8002/api/logout/', {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      navigate('/login');
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-actions">
          <button onClick={() => navigate('/profile')}>Edit Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="welcome-container">
        <h2 className="welcome-text">Welcome back, <span>{username}.</span></h2>
      </div>
      <div className='mid-container'>
      <form className="top-bar" onSubmit={handleUpload}>
        <div className='upload-section'>
          <input type="file" onChange={handleFileChange} />
          <button type="submit" disabled={!selectedFile || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        <div className='search-section'>
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearchSubmit} type="button">
            Search
          </button>
        </div>

        <select className="filter">
          <option value="">Filter</option>
          <option value="pdf">PDF</option>
          <option value="image">Images</option>
          <option value="doc">Documents</option>
        </select>
      </form>
      </div>
      <div className="body-container">
        <h3 className="section-heading">My Files</h3>

        <FileList
          files={files}
          loading={loading}
          error={error}
          onDelete={handleDelete}
        />

        {!loading && !error && files.length > 0 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
