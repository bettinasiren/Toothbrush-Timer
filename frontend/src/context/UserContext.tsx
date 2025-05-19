import React, { useState, useEffect, useContext, type ReactNode } from "react";

interface AuthUserType {
  userId: number | null;
  isLoggedIn: boolean;
}

const UserContext = React.createContext<AuthUserType | undefined>(undefined);

export function useAuth() {
  return useContext(UserContext);
}

const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
// //subscibe to authservice
//     const subscribe = AuthService.subscribe((user)=> {
//       if(user){
//         setIsLoggedIn(true)
//         setAuthUser(user)
//     })
//   },[])

  const value = {
    userId,
    setUserId,
    isLoggedIn,
    setIsLoggedIn
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;
