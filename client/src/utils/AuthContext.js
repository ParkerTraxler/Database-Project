import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

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
    const login = (email, role) => {
        const userData = { email, role };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Save as JSON
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("user"); // Remove user completely
        setUser(null); // Update state
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);