import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Load user from localStorage on app start
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);  // Parse the JSON string correctly
                setUser(parsedUser);  // Set the user data
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
            }
        }
    }, []);
    // Login function
    const login = (email, role, token) => {
        const userData = { email, role, token };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Save as JSON
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("user"); // Remove user completely
        setIsLoggingOut(true)
        setUser(null); // Update state
        setTimeout(() => setIsLoggingOut(false), 500)
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggingOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);