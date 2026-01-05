import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [editingNote, setEditingNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setAlert({ type: 'error', message: 'Failed to fetch notes' });
        }
    };

    const handleCreateOrUpdateNote = async (e) => {
        e.preventDefault();
        if (!title) return;

        try {
            if (editingNote) {
                const response = await api.put(`/notes/${editingNote._id}`, { title, description });
                setNotes(notes.map(n => n._id === editingNote._id ? response.data : n));
                setAlert({ type: 'success', message: 'Note updated!' });
            } else {
                const response = await api.post('/notes', { title, description });
                setNotes([response.data, ...notes]);
                setAlert({ type: 'success', message: 'Note created!' });
            }
            resetForm();
        } catch (error) {
            console.error('Error saving note:', error);
            setAlert({ type: 'error', message: 'Failed to save note' });
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(note => note._id !== id));
            setAlert({ type: 'success', message: 'Note deleted' });
        } catch (error) {
            console.error('Error deleting note:', error);
            setAlert({ type: 'error', message: 'Failed to delete note' });
        }
    };

    const startEditing = (note) => {
        setEditingNote(note);
        setTitle(note.title);
        setDescription(note.description);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingNote(null);
        setTitle('');
        setDescription('');
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
            <header style={{ borderBottom: '1px solid var(--color-border)', padding: '1rem 0', marginBottom: '2rem', position: 'sticky', top: 0, background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
                <div className="container flex justify-between items-center">
                    <h1 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(45deg, var(--color-primary), #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>UserNotes</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-muted hide-mobile">Welcome, <strong>{user?.username}</strong> ({user?.email})</span>
                        <button onClick={logout} className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>Logout</button>
                    </div>
                </div>
            </header>

            <div className="container">
                {alert && (
                    <div className={`card`} style={{
                        position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
                        borderLeft: `4px solid ${alert.type === 'success' ? 'var(--color-primary)' : 'var(--color-error)'}`,
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        {alert.message}
                    </div>
                )}

                <div className="card mb-4" style={{ marginBottom: '3rem', border: editingNote ? '1px solid var(--color-primary)' : '1px solid var(--color-border)' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 style={{ margin: 0 }}>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
                        {editingNote && <button onClick={resetForm} className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>Cancel</button>}
                    </div>
                    <form onSubmit={handleCreateOrUpdateNote} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Description (Optional)"
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn">{editingNote ? 'Update Note' : 'Add Note'}</button>
                        </div>
                    </form>
                </div>

                <div className="mb-4" style={{ marginBottom: '2rem' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search notes..."
                        className="input"
                        style={{ background: 'var(--color-bg-offset)', borderRadius: '2rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredNotes.length === 0 ? (
                        <div className="text-center" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
                            <p className="text-muted" style={{ fontSize: '1.2rem' }}>
                                {searchTerm ? 'No notes match your search.' : 'Your workspace is empty. Start by adding a note!'}
                            </p>
                        </div>
                    ) : (
                        filteredNotes.map(note => (
                            <div key={note._id} className="card note-card" style={{ display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'default' }}>
                                <div style={{ marginBottom: '1rem', flex: 1 }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{note.title}</h4>
                                    <p className="text-muted" style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.5' }}>{note.description}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEditing(note)}
                                            className="btn btn-ghost"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNote(note._id)}
                                            className="btn btn-ghost"
                                            style={{ color: 'var(--color-error)', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .note-card:hover { transform: translateY(-4px); border-color: var(--color-primary); }
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @media (max-width: 600px) { .hide-mobile { display: none; } }
            `}</style>
        </div>
    );
};

export default Dashboard;
