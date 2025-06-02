import React, { useState, useContext, type ReactNode, useEffect } from "react";

interface AuthUserType {
  userId: number | null;
  isLoggedIn: boolean;
  setUserId: (id: number | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  userName: string;
  userAvatarId: number | null;
  userAvatarImg: string;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userAvatarId, setUserAvatarId] = useState<number | null>(null);
  const [userAvatarImg, setUserAvatarImg] = useState("");

  // kollar på inloggat läge och sätter cookie
  useEffect(() => {
    console.log("HALLÅ");
    const cookie = document.cookie
      .split("; ") // gör en array av strängar
      .find((row) => row.startsWith("tbtimer_token=")); //hitta min cookie på namnet

    if (cookie) {
      const token = cookie.split("=")[1];
      fetchUserId(token).then(() => {
        setIsLoggedIn(true);
        setIsLoading(false);
      });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  //hämtar userData om userId är satt eller tömmer userData om userId är tom
  useEffect(() => {
    console.log("kommer till useEffect", userId); //här kolla rjag om userId finns och då hämtar jag datan
    if (userId) {
      fetchUserData();
    } else {
      setUserAvatarId(null); //i denna tömmer jag allt om userId inte finns
      setUserAvatarImg("");
      setUserName("");
    }
  }, [userId]);

  //hämtar den avatar som användaren har
  useEffect(() => {
    if (userAvatarId) {
      fetchUserAvatar();
    }
  }, [userAvatarId]);

  // hämtar användarens id genom att titta på unik token.
  async function fetchUserId(token: string) {
    await fetch(`http://localhost:3000/token/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user_id) {
          setUserId(data.user_id);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      });
  }

  //hämtar info från den inloggade användaren
  async function fetchUserData() {
    await fetch(`http://localhost:3000/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("1");
        setUserName(data.username);
        if (data.avatar_id) {
          console.log("2");
          setUserAvatarId(data.avatar_id);
        }
      });
  }

  async function fetchUserAvatar() {
    console.log("id på userAvatar: ", userAvatarId);

    await fetch(`http://localhost:3000/avatars/${userAvatarId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserAvatarImg(data.avatar);
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
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserContextProvider;
