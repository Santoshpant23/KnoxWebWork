import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

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
  // console.log(token + 
  //   " is the current token"
  //   );
  

  // useEffect(()=>{
  //   setToken(localStorage.getItem("token"));
  //   console.log("Token is updated now inside useefffect " + token);
    
  // }, [])

  // Update localStorage whenever the token changes
  const updateToken = (newToken: string | null) => {
    // console.log("New token is given to me " + newToken);
    
    if (newToken) {
      localStorage.setItem("token", newToken);
      // console.log("LocalStorage is updated with new token " + newToken);
      
    } else {
      localStorage.removeItem("token");
      // console.log("Oops, current token is removed from localstorage ");
      
    }
    setToken(newToken);
    // console.log("Token is updated in current context, so the current token is " + token);
    
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
