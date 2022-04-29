import { createContext, useState, useContext, SetStateAction, useEffect } from 'react';
import { getAuth, signInWithPopup, TwitterAuthProvider, getAdditionalUserInfo, User, AdditionalUserInfo } from "firebase/auth";

type UserInfo = {
  userInfo: {},
  setUserInfo?: React.Dispatch<SetStateAction<UserInfo>>
}

const initialUserInfo: UserInfo = {
  userInfo: {
    userId: "",
    userUid: "nobody-user",
  }
}
const UserInfoContext = createContext<UserInfo>(initialUserInfo);

export const useUserInfoContext = () => {
  return useContext(UserInfoContext);
}

type Props = {
  userId: string,
  userUid: string
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);

  const value = userInfo;
  console.log("userInfo.userId : " + userInfo.userInfo);

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>{children}</UserInfoContext.Provider>
  );
}

export default UserInfoProvider;