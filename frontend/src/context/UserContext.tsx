import React, { useState, useContext, type ReactNode, useEffect } from "react";

interface AuthUserType {
  userId: number | null;
  isLoggedIn: boolean;
  setUserId: (id: number | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  userName: string;
  userAvatarId: number | null;
  userAvatarImg: string;
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
  const [userName, setUserName] = useState("");
  const [userAvatarId, setUserAvatarId] = useState<number | null>(null);
  const [userAvatarImg, setUserAvatarImg] = useState("");

  async function fetchUserData() {
    await fetch(`http://localhost:3000/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserName(data[0].username);
        setUserAvatarId(data[0].avatar_id);
      });
  }

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
    if (userAvatarId) {
      fetchUserAvatar();
    }

    //subscibe to authservice
    // const subscribe = AuthService.subscribe((user)=> {
    //   if(user){
    //     setIsLoggedIn(true)
    //     setAuthUser(user)
    // })
  }, [userId, userAvatarId]);

  // async function fetchMedals(){

  // }

  async function fetchUserAvatar() {
    await fetch(`http://localhost:3000/avatars/${userAvatarId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.avatar);
        setUserAvatarImg(data.avatar)
      });
  }

  const value: AuthUserType = {
    userId,
    setUserId,
    isLoggedIn,
    setIsLoggedIn,
    userName,
    userAvatarId,
    userAvatarImg
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserContextProvider;
