import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryName: string;
}

export default function Dashboard() {
    const { logout, user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products');
        }
    };

    // Filter and Pagination Logic
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Tienda Asisya
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600 hidden md:block">Bienvenido, {user?.username}</span>
                            <Link to="/admin" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
                                Administrar
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="w-full p-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1">
                            <div className="h-48 bg-gradient-to-tr from-gray-200 to-gray-100 flex items-center justify-center">
                                <span className="text-4xl text-gray-400">📦</span>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full uppercase tracking-wider">
                                        {product.categoryName || 'General'}
                                    </span>
                                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Stock: {product.stock}</span>
                                    <Link to={`/product/${product.id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold">
                                        Ver Detalles &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No se encontraron productos.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 text-gray-600">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
