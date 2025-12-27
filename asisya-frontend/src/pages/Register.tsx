import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ username, password });
            navigate('/');
        } catch (err) {
            setError('Falló el registro. El usuario podría estar en uso.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Crear Cuenta</h2>
                {error && <p className="text-red-300 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-white/80 mb-2">Usuario</label>
                        <input
                            type="text"
                            className="w-full bg-white/20 border-none text-white placeholder-white/50 rounded-lg py-3 px-4 focus:ring-2 focus:ring-white/50 focus:outline-none transition"
                            placeholder="Elige un usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Contraseña</label>
                        <input
                            type="password"
                            className="w-full bg-white/20 border-none text-white placeholder-white/50 rounded-lg py-3 px-4 focus:ring-2 focus:ring-white/50 focus:outline-none transition"
                            placeholder="Elige una contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-white text-teal-600 font-bold py-3 rounded-lg hover:bg-white/90 transition transform hover:scale-105"
                    >
                        Registrarse
                    </button>
                </form>
                <p className="mt-6 text-center text-white/70">
                    ¿Ya tienes una cuenta? <Link to="/login" className="text-white font-bold hover:underline">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}
