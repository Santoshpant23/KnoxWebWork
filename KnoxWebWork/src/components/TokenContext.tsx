import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the token context
interface TokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

// Create the context
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// Provider component
export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Update localStorage whenever the token changes
  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
  };

  return (
    <TokenContext.Provider value={{ token, setToken: updateToken }}>
      {children}
    </TokenContext.Provider>
  );
};

// Hook to use the token context
export const useToken = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
