import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const validUser = import.meta.env.VITE_ADMIN_USER;
        const validPass = import.meta.env.VITE_ADMIN_PASS;

        if (username === validUser && password === validPass) {
            localStorage.setItem('adminAuth', 'true');
            navigate('/admin/dashboard');
        } else {
            setError('Credenciais inválidas.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-slate-700">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-burgundy-600 rounded-full flex items-center justify-center text-white text-2xl">
                        <FaLock />
                    </div>
                </div>

                <h2 className="text-2xl font-serif text-white text-center mb-6">Acesso Administrativo</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-burgundy-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-burgundy-500 outline-none"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
