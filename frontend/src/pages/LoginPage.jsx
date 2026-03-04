import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserByUsername, registerUser } from '../api/users';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        if (!username.trim()) return;
        setLoading(true);
        setError('');
        try {
            const found = await getUserByUsername(username.trim());
            if (!found) {
                setError('User not found. Would you like to register instead?');
                setMode('register');
            } else {
                login({ id: found.id, username: found.username });
                navigate('/tasks');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        if (!username.trim() || !email.trim()) {
            setError('Username and email are required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const newUser = await registerUser(username.trim(), email.trim());
            login({ id: newUser.id, username: newUser.username });
            navigate('/tasks');
        } catch (err) {
            setError('Registration failed. Username or email may already exist.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <span className="logo-icon">✦</span>
                    <span className="logo-text">TaskFlow</span>
                </div>
                <p className="login-subtitle">
                    Your personal task manager, cloud-native and ready.
                </p>

                <div className="tab-group">
                    <button
                        className={`tab ${mode === 'login' ? 'tab-active' : ''}`}
                        onClick={() => { setMode('login'); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`tab ${mode === 'register' ? 'tab-active' : ''}`}
                        onClick={() => { setMode('register'); setError(''); }}
                    >
                        Register
                    </button>
                </div>

                {error && <div className="form-error">{error}</div>}

                {mode === 'login' ? (
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="login-username">Username</label>
                            <input
                                id="login-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="login-form">
                        <div className="form-group">
                            <label htmlFor="reg-username">Username</label>
                            <input
                                id="reg-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reg-email">Email</label>
                            <input
                                id="reg-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
