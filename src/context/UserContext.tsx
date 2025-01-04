import React, { createContext, useContext, ReactNode } from "react";
import { User } from "firebase/auth";
import { getAuth } from "firebase/auth";
import firebaseApp from "@chat/services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface UserContextProps {
  user?: User | null;
  loading: boolean;
  error?: Error;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, loading, error] = useAuthState(getAuth(firebaseApp));

  const logout = () => {
    const auth = getAuth(firebaseApp);
    auth.signOut();
  };

  return (
    <UserContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
