import React, { useContext, createContext, useEffect, useState } from "react";
import { createUser } from "./db";

import firebase from "./firebase";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};
// custom hook
function useProvideAuth() {
  const [user, setUser] = useState(null);

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      createUser(user.uid, user);
      setUser(user);
      return user;
    } else {
      setUser(false);
      return false;
    }
  };
  const singinWithGithub = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => {
        chandleUser(response.user);
      })
      .catch((err) => {
        console.log(err, " ???????error");
      });
  };
  const signinWithGoogle = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user);
      })
      .catch((err) => {
        console.log(err, " ???????error");
      });
  };

  const singout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
      });
  };

  useEffect(() => {
    const unsubcribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        va;
      } else {
        setUser(false);
      }
    });
    return () => unsubcribe();
  }, []);

  return {
    userId: user && user.uid,
    singinWithGithub,
    signinWithGoogle,
    singout,
  };
}

const formatUser = (user) => {
  //const token = await user.getIdToken();
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
  };
};
