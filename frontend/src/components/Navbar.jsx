import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-icon">✦</span>
                <span className="navbar-title">TaskFlow</span>
            </div>
            {user && (
                <div className="navbar-right">
                    <span className="navbar-user">
                        <span className="user-avatar">{user.username[0].toUpperCase()}</span>
                        {user.username}
                    </span>
                    <button className="btn btn-ghost" onClick={logout}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}
