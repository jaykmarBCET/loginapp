
import { createContext, useState } from 'react';
export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    name:"",
    username:"",
    email: "",
    avatar:"",
    coverImage:""
  });
  return ( 
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  )
}
