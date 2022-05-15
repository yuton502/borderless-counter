import { getAdditionalUserInfo, signInWithPopup, signOut, TwitterAuthProvider, updateCurrentUser, User } from "firebase/auth"
import * as databaseModule from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { database, firebaseAuth } from "./config/firebaseInititial";
import React, { createContext, useCallback, useEffect, useState } from "react";


// Contextの型を用意
interface IAuthContext {
  currentUser: User | null | undefined;
  currentUserId?: string;
  signin: () => void;
  signout: () => void;
}

// Contextを宣言。Contextの中身を {currentUser: undefined} と定義
const AuthContext = createContext<IAuthContext>({ currentUser: undefined, signin: () => {}, signout: () => {} });

const AuthProvider: React.FC = ({ children }) => {
  // Contextに持たせるcurrentUserは内部的にはuseStateで管理
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );
  const [userId, setUserId] = useState<string>();
  firebaseAuth.languageCode = 'it';

  useEffect(() => {
    // Firebase Authのメソッド。ログイン状態が変化すると呼び出される
    onAuthStateChanged(firebaseAuth, user => {
      setCurrentUser(user);

      const userRef = databaseModule.ref(database, 'users/' + user?.uid);
      return databaseModule.onValue(userRef, (snapshot) => {
        const userId = (snapshot.val() && snapshot.val().user_id) || 'Anonymous';
        setUserId(userId);
      }, {
        onlyOnce: true
      });
    });
    console.log("Auth state changed!")
  }, [currentUser]);

  const signin = useCallback(() => {
    const provider = new TwitterAuthProvider();

    signInWithPopup(firebaseAuth, provider)
      .then((userCredential) => {
        // The signed-in user info.
        const user = userCredential.user;
        const additionalUserInfo = getAdditionalUserInfo(userCredential);

        // firebaseAuth.updateCurrentUser(user);
        setUserId(additionalUserInfo?.username ?? "");
        const userRef = databaseModule.ref(database, 'users/' + user.uid);
        databaseModule.set(userRef, {uid: user.uid, user_id: additionalUserInfo?.username});
        console.log(user.uid);
      }).catch((error) => {
        // Handle Errors here.
        console.log(error.code + " : " + error.message)
      });
  }, []);

  const signout = useCallback(() => {
    signOut(firebaseAuth)
      .then((userCredential) => {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        // firebaseAuth.updateCurrentUser(null);
        console.log("logout success");
        setUserId("");
      }).catch((error) => {
        // Handle Errors here.
        console.log(error.code + " : " + error.message)
      });
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        signin: signin,
        signout: signout,
        currentUserId: userId,
      }}
    >
      {/* こうすることで、下階層のコンポーネントを内包できるようになる */}
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };