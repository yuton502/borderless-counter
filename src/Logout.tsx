import { getAuth, signInWithPopup, TwitterAuthProvider, getAdditionalUserInfo, User, AdditionalUserInfo, signOut } from "firebase/auth";
import { firebaseAuth } from "./firebaseInititial";
import { Button } from "react-bootstrap";
import { useContext, useState } from "react";
import DbLogin from "./DbLogin";
import DbCounter, { getCounterKey } from "./DbCounter";
import UserInfoProvider from "./UserInfoContext";
import { AuthContext } from "./UserAuthProvider";


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


const Logout: React.FC = () => {
  const { currentUser, signout } = useContext(AuthContext);
  const [user, setUser] = useState<{info: User, additionalUserInfo: AdditionalUserInfo | null}>();

  const handleClick = () => {
    signout();
  }

  return (
    <>
      { user?.info.displayName }
      <Button variant="primary" onClick={handleClick}>Twitterログアウト</Button>
    </>
  );
}

export default Logout;