import React, { useState, type ReactNode, useEffect, useCallback } from "react";

import { UserContext, type AuthUserType } from "./AuthUser";

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
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tbtimer_token="));

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

  //hämtar info från den inloggade användaren
  const fetchUserData = useCallback(async () => {
    if (userId) {
      await fetch(`/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUserName(data.username);
          if (data.avatar_id) {
            setUserAvatarId(data.avatar_id);
          }
        });
    } else {
      setUserAvatarId(null);
      setUserAvatarImg("");
      setUserName("");
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // hämtar användarens id genom att titta på unik token.
  async function fetchUserId(token: string) {
    await fetch(`/token/${token}`)
      .then((response) => {
        if (response.status !== 404) {
          return response.json();
        }
      })
      .then((data) => {
        if (data.user_id) {
          setUserId(data.user_id);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      });
  }

  //hämtar den avatar som användaren har
  const fetchUserAvatar = useCallback(async () => {
    if (userAvatarId) {
      await fetch(`/avatars/${userAvatarId}`)
        .then((response) => response.json())
        .then((data) => {
          setUserAvatarImg(data.avatar);
        });
    }
  }, [userAvatarId]);

  useEffect(() => {
    fetchUserAvatar();
  }, [fetchUserAvatar]);

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
