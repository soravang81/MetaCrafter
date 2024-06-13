
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Admin from './components/Admin';
import User from './components/User';

const App: React.FC = () => {
    return (
        <div className="p-8">
            <nav className="mb-8">
                <Link to="/" className="mr-4">Home</Link>
                <Link to="/admin" className="mr-4">Admin</Link>
                <Link to="/user">User</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/user" element={<User />} />
            </Routes>
        </div>
    );
};

const Home: React.FC = () => (
    <div className="text-center">
        <h1 className="text-4xl">Welcome to the Token Vesting DApp</h1>
        <p className="mt-4">Please navigate to Admin or User pages.</p>
    </div>
);

export default App;
