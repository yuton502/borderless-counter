import { Button } from "react-bootstrap";
import { useContext, useState } from "react";
import { AuthContext } from "./UserAuthProvider";


const SignControl: React.FC = () => {
  const { currentUser, signin, signout } = useContext(AuthContext);
  const handleSignControlClick = () => {
    signin()
  }
  const handleLogoutClick = () => {
    signout()
  }

  const login = 
  <>
    <Button variant="primary" onClick={handleSignControlClick}>Twitterログイン</Button>
  </>

  const logout = 
  <>
    <Button variant="primary" onClick={handleLogoutClick}>ログアウト</Button>
  </>


  return (
    <>
      { currentUser == null ? login : logout}
    </>
  );
}

export default SignControl;