import React, { useState, useEffect, useRef, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../constants';

const SearchComponent = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const searchRef = useRef(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products`);
            const products = response.data.data.products;

            const formattedItems = products.map(product => ({
                id: product._id,
                title: product.title,
                banner: product.gallery[0].url,
                price: product.price,
                link: `/product/${product._id}`
            }));

            setAllProducts(formattedItems);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleEscKeyPress = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKeyPress);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKeyPress);
        };
    }, [onClose]);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchTerm(query);

        const filtered = allProducts.filter(item =>
            item.title.toLowerCase().includes(query) // Use includes for more flexibility
        );
        setFilteredItems(filtered);
    };

    return (
        <Fragment>
            <div className="fixed inset-0  w-full bg-slate-900/50 backdrop-blur z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
                <div ref={searchRef} className="mx-auto max-w-xl w-2/5 transform divide-y divide-slate-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all dark:bg-slate-800 dark:divide-white/10 dark:ring-1 dark:ring-slate-700 ">
                    <div className='relative'>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search for products"
                            className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm dark:text-white"
                        />
                    </div>
                    {filteredItems.length > 0 && (
                        <ul className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                            {filteredItems.map(item => (
                                <li key={item.id} className="relative group flex items-center cursor-default select-none rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-white/5">
                                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800">
                                        <img src={item.banner} alt={item.title} className="rounded-md" />
                                    </div>
                                    <div className="ml-4 flex-auto">
                                        <Link to={item.link} className="text-sm font-medium text-slate-700 group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-white" onClick={onClose}>
                                            <span className="absolute inset-0"></span>
                                            {item.title}
                                        </Link>
                                        <p className="text-sm text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
                                            ${item.price} EGP
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
            </div>
        </Fragment >








    );
};

export default SearchComponent;
