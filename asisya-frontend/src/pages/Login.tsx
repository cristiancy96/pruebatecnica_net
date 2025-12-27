import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Bienvenido</h2>
                {error && <p className="text-red-300 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-white/80 mb-2">Usuario</label>
                        <input
                            type="text"
                            className="w-full bg-white/20 border-none text-white placeholder-white/50 rounded-lg py-3 px-4 focus:ring-2 focus:ring-white/50 focus:outline-none transition"
                            placeholder="Ingrese su usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Contraseña</label>
                        <input
                            type="password"
                            className="w-full bg-white/20 border-none text-white placeholder-white/50 rounded-lg py-3 px-4 focus:ring-2 focus:ring-white/50 focus:outline-none transition"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-white text-indigo-600 font-bold py-3 rounded-lg hover:bg-white/90 transition transform hover:scale-105"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                <p className="mt-6 text-center text-white/70">
                    ¿No tienes una cuenta? <Link to="/register" className="text-white font-bold hover:underline">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}
