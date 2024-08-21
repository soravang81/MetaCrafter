// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Admin from './components/Admin';

const App: React.FC = () => {
    return (
        <div className="p-8">
            <Routes>
                <Route path="/" element={<Admin />} />
            </Routes>
        </div>
    );
};

export default App;
