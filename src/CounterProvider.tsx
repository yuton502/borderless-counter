import { getAdditionalUserInfo, signInWithPopup, signOut, TwitterAuthProvider, User } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, database } from "./firebaseInititial";
import React, { createContext, useCallback, useContext, useEffect, useState, useMemo } from "react";
import * as databaseModule from "firebase/database";
import { AuthContext } from "./UserAuthProvider";
import { snapshotEqual } from "firebase/firestore";


interface ICounterObject {
  name: string,
  count: number,
  uid: string,  
}

// Contextの型を用意
interface ICounterContext {
  counters: ICounterObject[];
  add: (counterCount: number, counterName: string) => void;
  update: (counterUid: string, counterCount?: number, counterName?: string) => void
  remove: (counterUid: string) => void;
}


function createWrapContext<ContextType>() {
  const context = React.createContext<ContextType | undefined>(undefined);
  const useWrapContext = () => {
    const usingContext = React.useContext(context);
    if (!usingContext) throw new Error("useWrapContext must be inside a Provider with a value");
    return usingContext;
  };
  return [useWrapContext, context.Provider] as const;
}

// Contextを宣言。Contextの中身を {counters: undefined} と定義
export const [useCounter, CounterContextProvider] = createWrapContext<ICounterContext>();

const CounterProvider: React.FC = ({ children }) => {
  // Contextに持たせるcurrentUserは内部的にはuseStateで管理
  const [counterObject, setCounterObject] = useState<ICounterObject>({
    name: "untitled",
    count: 0,
    uid: "no-uid-0"
  })
  const [counters, setCounters] = useState<ICounterObject[]>([counterObject]);
  const user = useContext(AuthContext);

  const userCounterRef = databaseModule.ref(database, 'counters/' + user.currentUser?.uid)
  let data: ICounterObject[] = []

  useMemo(() => {
    if (user.currentUser !== null) {
      setCounters(counters.slice(0, 0) ?? [counterObject]);

      databaseModule.get(databaseModule.query(userCounterRef, databaseModule.orderByPriority())).then((snapshot) => {
        // console.log("database changed => " + );
        snapshot.forEach(rawData => {
          console.log("rawcounters.uid = " + rawData.val().uid)
        
          if (counters.length == 0 || !counters.includes(rawData.val())) {
            data.push(rawData.val());
            setCounters(data);
          }
          console.log("checked...\n" + JSON.stringify(rawData.val()));
        })
        console.log(snapshot.val())
      })
    }
  }, [user]);

  // databaseModule.onChildAdded()

  const add = useCallback((counterCount: number, counterName: string) => {
    let key = "";
    let counterObject: ICounterObject = {
      name: counterName,
      count: counterCount,
      uid: "no-uid-1"
     }
    
    const newPushRef = databaseModule.push(userCounterRef);
    databaseModule.set(newPushRef, counterObject)
      .then(() => {      
        console.log("current.user : " + user.currentUserId);
        console.log("current.user : (from auth)" + firebaseAuth.currentUser?.uid);

        const updates: any = {};
        updates[newPushRef.key + "/uid"] = newPushRef.key;

        databaseModule.update(userCounterRef, updates);
        counterObject.uid = newPushRef.key ?? "no-uid-1";
    })
    setCounters([...counters, counterObject])
  },[counters, user]);

  const update = useCallback((counterUid: string, counterCount?: number, counterName?: string) => {
    const updates: any = {};
    if (counterName != undefined) {
      updates[counterUid + "/name"] = counterName;
    }
    if (counterCount != undefined) {
      updates[counterUid + "/count"] = counterCount;
    }
    databaseModule.update(userCounterRef, updates);

    const updatesObject: ICounterObject = {
      count: counterCount ?? counters.find((count) => count.uid === counterUid)?.count ?? 0,
      name: counterName ?? counters.find((count) => count.uid === counterUid)?.name ?? "undefined",
      uid: counterUid
    }
    setCounters(
      counters.map((counter, index) => (
        index == counters.findIndex((count) => count.uid === counterUid) ? updatesObject : counter
      ))
    );
  } ,[counters]);

  const remove = useCallback((counterUid: string) => {
    databaseModule.remove(databaseModule.ref(database, 'counters/' + user.currentUser?.uid + '/' + counterUid));
    setCounters(
      counters.filter((counter) => counter.uid != counterUid)
    )
  }, [user, counters])

  return (
    <CounterContextProvider
      value={{
        counters: counters,
        add: add,
        update: update,
        remove: remove
      }}
    >
      {/* こうすることで、下階層のコンポーネントを内包できるようになる */}
      {children}
    </CounterContextProvider>
  );
};

export { CounterProvider };