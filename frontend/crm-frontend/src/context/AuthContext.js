'use client'

import React, { createContext, useState, useEffect } from "react";
import AuthServices from '../services/AuthServices';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true); // Assume true for initial load
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        AuthServices.isAuthenticated().then(data => {
            setUser(data.user);
            setIsAuthenticated(data.isAuthenticated);
            setIsAdmin(data.isAdmin); // Assuming isAdmin data comes from the same call
            setIsLoading(false);
        }).catch(err => {
            setError(err.message);
            setIsLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, isAdmin, isLoading, error }}>
            {!isLoading ? children : <h1>Loading...</h1>}
        </AuthContext.Provider>
    );
}

export default AuthProvider;