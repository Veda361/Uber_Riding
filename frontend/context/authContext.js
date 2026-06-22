"use client";

import {
createContext,
useContext,
useEffect,
useState,
} from "react";

import { auth } from "@/lib/firebase";

import {
onAuthStateChanged,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
signOut,
} from "firebase/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
const context = useContext(AuthContext);

if (!context) {
throw new Error(
"useAuth must be used within an AuthProvider"
);
}

return context;
};

export const AuthProvider = ({
children,
}) => {
const [user, setUser] =
useState(null);

const [token, setToken] =
useState(null);

const [loading, setLoading] =
useState(true);

useEffect(() => {
const unsubscribe =
onAuthStateChanged(
auth,
async (currentUser) => {
try {
if (currentUser) {
const idToken =
await currentUser.getIdToken();

          setUser(currentUser);
          setToken(idToken);

          localStorage.setItem(
            "token",
            idToken
          );
        } else {
          setUser(null);
          setToken(null);

          localStorage.removeItem(
            "token"
          );
        }
      } catch (error) {
        console.error(
          "Auth state error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }
  );

return () => unsubscribe();

}, []);

const login = async (
email,
password
) => {
const result =
await signInWithEmailAndPassword(
auth,
email,
password
);


const idToken =
  await result.user.getIdToken();

setUser(result.user);
setToken(idToken);

localStorage.setItem(
  "token",
  idToken
);

return result.user;


};

const register = async (
email,
password
) => {
const result =
await createUserWithEmailAndPassword(
auth,
email,
password
);


return result.user;


};

const logout = async () => {
await signOut(auth);


setUser(null);
setToken(null);

localStorage.removeItem(
  "token"
);


};

return (
<AuthContext.Provider
value={{
user,
token,
loading,
login,
register,
logout,
}}
>
{children}
</AuthContext.Provider>
);
};
