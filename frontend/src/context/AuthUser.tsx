import React from "react";
import { useContext } from "react";

export interface AuthUserType {
  userId: number | null;
  isLoggedIn: boolean;
  setUserId: (id: number | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  userName: string;
  userAvatarId: number | null;
  userAvatarImg: string;
  isLoading: boolean;
}

export const UserContext = React.createContext<AuthUserType | undefined>(
  undefined,
);

export function useAuth(): AuthUserType {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error();
  }

  return context;
}
