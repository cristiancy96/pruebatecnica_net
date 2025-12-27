import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORY_IMAGES: { [key: string]: string } = {
    'Electronics': 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba',
    'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    'Home': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a',
    'General': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
    'Electrodomésticos': 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba',
    'Electrónica': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03',
    'Ropa': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    'Hogar': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a',
    'Deportes': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211'
};

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error('Error fetching product details', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-xl">Cargando detalles...</div>;
    if (!product) return <div className="p-8 text-center text-xl text-red-500">Producto no encontrado</div>;

    const imageUrl = CATEGORY_IMAGES[product.categoryName as keyof typeof CATEGORY_IMAGES] || CATEGORY_IMAGES['General'];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-1/2">
                        <img
                            className="h-64 w-full object-cover md:h-full"
                            src={imageUrl}
                            alt={product.categoryName}
                        />
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col justify-center">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
                            {product.categoryName || 'General'}
                        </div>
                        <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-gray-900">
                            {product.name}
                        </h1>
                        <p className="mt-4 text-gray-500 text-lg">
                            {product.description || 'Sin descripción disponible.'}
                        </p>

                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-4xl font-bold text-gray-900">
                                ${product.price}
                            </span>
                            <div className="text-sm text-gray-500">
                                Stock disponible: <span className="font-bold text-gray-800">{product.stock}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <Link
                                to="/"
                                className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                ← Volver
                            </Link>
                            <button className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 w-full shadow-lg transform transition hover:-translate-y-0.5">
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
