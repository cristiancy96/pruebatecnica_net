import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Admin() {
    const [products, setProducts] = useState<any[]>([]);
    const [formData, setFormData] = useState({ name: '', price: 0, stock: 0, categoryId: 1 });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data);
    };

    const validate = () => {
        let tempErrors: { [key: string]: string } = {};
        if (!formData.name) tempErrors.name = 'El nombre es obligatorio';
        if (formData.price <= 0) tempErrors.price = 'El precio debe ser mayor a 0';
        if (formData.stock < 0) tempErrors.stock = 'La cantidad no puede ser negativa';
        if (formData.categoryId <= 0) tempErrors.categoryId = 'ID de categoría inválido';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!validate()) return;

        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formData);
                setMessage('Producto actualizado exitosamente');
            } else {
                await api.post('/products', formData);
                setMessage('Producto creado exitosamente');
            }
            setFormData({ name: '', price: 0, stock: 0, categoryId: 1 });
            setEditingId(null);
            loadProducts();
        } catch (error) {
            setMessage('Error al guardar producto');
        }
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId || 1
        });
        setEditingId(product.id);
        setMessage('');
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await api.delete(`/products/${id}`);
            setMessage('Producto eliminado exitosamente');
            loadProducts();
        } catch (error) {
            setMessage('Error al eliminar producto');
        }
    };

    const cancelEdit = () => {
        setFormData({ name: '', price: 0, stock: 0, categoryId: 1 });
        setEditingId(null);
        setErrors({});
        setMessage('');
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Gestión de Productos</h2>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded shadow">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                    {editingId && <button type="button" onClick={cancelEdit} className="text-red-500 hover:text-red-700 text-sm">Cancelar Edición</button>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <input
                            placeholder="Nombre"
                            className={`border p-2 rounded w-full ${errors.name ? 'border-red-500' : ''}`}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <input
                            placeholder="Precio"
                            type="number"
                            className={`border p-2 rounded w-full ${errors.price ? 'border-red-500' : ''}`}
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>

                    <div>
                        <input
                            placeholder="Cantidad"
                            type="number"
                            className={`border p-2 rounded w-full ${errors.stock ? 'border-red-500' : ''}`}
                            value={formData.stock}
                            onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                        />
                        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                    </div>

                    <div>
                        <input
                            placeholder="ID Categoría"
                            type="number"
                            className={`border p-2 rounded w-full ${errors.categoryId ? 'border-red-500' : ''}`}
                            value={formData.categoryId}
                            onChange={e => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                        />
                        {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
                    </div>
                </div>
                <button className={`mt-4 text-white px-4 py-2 rounded transition ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {editingId ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
            </form>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-4 text-left">Nombre</th>
                            <th className="p-4 text-left">Precio</th>
                            <th className="p-4 text-left">Cantidad</th>
                            <th className="p-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-t hover:bg-gray-50">
                                <td className="p-4">{p.name}</td>
                                <td className="p-4">${p.price}</td>
                                <td className="p-4">{p.stock}</td>
                                <td className="p-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="text-red-600 hover:text-red-900 font-medium"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
