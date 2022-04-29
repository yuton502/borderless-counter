import { getAuth, signInWithPopup, TwitterAuthProvider, getAdditionalUserInfo, User, AdditionalUserInfo } from "firebase/auth";
import { firebaseAuth } from "./firebaseInititial";
import { Button } from "react-bootstrap";
import { useContext, useState } from "react";
import DbLogin from "./DbLogin";
import DbCounter, { getCounterKey } from "./DbCounter";
import UserInfoProvider from "./UserInfoContext";
import { AuthContext } from "./UserAuthProvider";
import Logout from "./Logout";


//   const handleClick = (e: ) => {
//     e.preventDefault();
//     const provider = new firebase.auth.TwitterAuthProvider();
//     firebase.auth().signInWithPopup(provider)
//       .then((userCredential) => {
//           console.log(userCredential);
//         }).catch((error) => {
//           console.log(error);
//         });
//   }


const Login: React.FC = () => {
  const { currentUser, signin, currentUserId } = useContext(AuthContext);
  const handleClick = () => {
    signin()
  }

  return (
    <>
      <Button variant="primary" onClick={handleClick}>Twitterログイン</Button>
      <Logout />
      <DbLogin userId={currentUserId ?? ""} uid={currentUser?.uid ?? "nobody-user"}></DbLogin>
      <DbCounter user_uid={currentUser?.uid ?? "nobody-user"} counter_uid={"1"} />
      { getCounterKey() }
    </>
  );
}

export default Login;