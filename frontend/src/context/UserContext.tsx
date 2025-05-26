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

export function useAuth(): AuthUserType {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error();
  }

  return context;
}

const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatarId, setUserAvatarId] = useState<number | null>(null);
  const [userAvatarImg, setUserAvatarImg] = useState("");

  useEffect(() => {
    const cookie = document.cookie
      .split("; ") // gör en array av strängar
      .find((row) => row.startsWith("tbtimer_token=")); //hitta min cookie på namnet

    if (cookie && !userId) {
      const token = cookie.split("=")[1];
      fetchUserId(token);
    }
    if (userId) {
      fetchUserData();
      // fetchUserMedals();
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
  }, [userId, userAvatarId, isLoggedIn]);

  async function fetchUserAvatar() {
    await fetch(`http://localhost:3000/avatars/${userAvatarId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserAvatarImg(data.avatar);
      });
  }

  async function fetchUserData() {
    await fetch(`http://localhost:3000/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserName(data.username);
        setUserAvatarId(data.avatar_id);
      });
  }

  async function fetchUserId(token: string) {
    await fetch(`http://localhost:3000/token/${token}`)
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.user_id);
      });
  }

  const value: AuthUserType = {
    userId,
    setUserId,
    isLoggedIn,
    setIsLoggedIn,
    userName,
    userAvatarId,
    userAvatarImg,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserContextProvider;
