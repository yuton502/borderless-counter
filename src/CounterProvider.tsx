import { firebaseAuth, database } from "./config/firebaseInititial";
import React, { useCallback, useContext, useState, useMemo } from "react";
import * as databaseModule from "firebase/database";
import { AuthContext } from "./UserAuthProvider";
  

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

//undefinedを許容するContext
function createWrapContext<T>() {
  const context = React.createContext<T | undefined>(undefined);
  const useWrapContext = () => {
    const usingContext = React.useContext(context);
    if (!usingContext) throw new Error("useWrapContext must be inside a Provider with a value");
    return usingContext;
  };
  return [useWrapContext, context.Provider] as const;
}

// Contextの宣言
export const [useCounter, CounterContextProvider] = createWrapContext<ICounterContext>();

const CounterProvider: React.FC = ({ children }) => {
  // Contextに持たせるcurrentUserは内部的にはuseStateで管理
  const initialCounterObject = {
    name: "untitled",
    count: 0,
    uid: "no-uid-0"
  };
  const [counters, setCounters] = useState<ICounterObject[]>([initialCounterObject]);
  const user = useContext(AuthContext);

  const userCounterRef = databaseModule.ref(database, 'counters/' + user.currentUser?.uid);
  let data: ICounterObject[] = []

  //user.currentUserが変更されるたびに実行
  useMemo(() => {
    if (user.currentUser) {
      setCounters([]);
      data = [];

      databaseModule.get(databaseModule.query(userCounterRef, databaseModule.orderByPriority())).then((snapshot) => {
        // console.log("database changed => " + );
        snapshot.forEach(rawData => {
          console.log("rawcounters.uid = " + rawData.val().uid)
        
          if (data.length == 0 || !data.includes(rawData.val())) {
            data.push(rawData.val());
          }
          console.log("checked...\n" + JSON.stringify(rawData.val()));
        })
        setCounters(data);
        console.log("[useMemo]" + JSON.stringify(snapshot.val()));
      })
    }
  }, [user.currentUser]);


  const add = useCallback((counterCount: number, counterName: string) => {
    let key = "";
    let initialCounterObject: ICounterObject = {
      name: counterName,
      count: counterCount,
      uid: "no-uid-1"
     }
    
    const newPushRef = databaseModule.push(userCounterRef);
    databaseModule.set(newPushRef, initialCounterObject)
      .then(() => {      
        console.log("current.user : " + user.currentUserId);
        console.log("current.user : (from auth)" + firebaseAuth.currentUser?.uid);

        const updates: any = {};
        updates[newPushRef.key + "/uid"] = newPushRef.key;

        databaseModule.update(userCounterRef, updates);
        initialCounterObject.uid = newPushRef.key ?? "no-uid-1";
    })
    setCounters([...counters, initialCounterObject])
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
    console.log("[updated] " + userCounterRef);
  }, [counters]);

  const remove = useCallback((counterUid: string) => {
    databaseModule.remove(databaseModule.child(userCounterRef, '/' + counterUid))
    .then(() => {
      data = counters;
      setCounters(data.filter((counter) => counter.uid != counterUid));
      console.log("removed database in + " + counterUid);
      console.log(data)  
    })
  },[counters, data]);

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