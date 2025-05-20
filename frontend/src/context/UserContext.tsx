import React, { useState, useContext, type ReactNode } from "react";

interface AuthUserType {
  userId: number | null;
  isLoggedIn: boolean;
  setUserId: (id: number | null) => void;
  setIsLoggedIn : (isLoggedIn: boolean) => void;

}

const UserContext = React.createContext<AuthUserType | undefined>(undefined);

export function useAuth() {
  return useContext(UserContext);
}

const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {


// //subscibe to authservice
//     // const subscribe = AuthService.subscribe((user)=> {
//     //   if(user){
//     //     setIsLoggedIn(true)
//     //     setAuthUser(user)
//     // })
//   },[])

  const value: AuthUserType ={
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
