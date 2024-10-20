// src/components/AuthLinks.js
import React from 'react';
import { Link } from 'react-router-dom';

const AuthLinks = () => {
    return (
        <div className="flex space-x-4">
            <a
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:underline"
            >
                Log In
            </a>
            <Link
                to="/register"
                className="text-gray-700 dark:text-gray-300 hover:underline"
            >
                Create account
            </Link>
        </div>
    );
};

export default AuthLinks;
