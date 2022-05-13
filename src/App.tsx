import React, { useContext, useState, useCallback } from 'react'
import './css/App.css';
import { Button, Container, Col, Row, ThemeProvider, CardGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Counter from './Counter';
import { useUIDSeed } from 'react-uid';
import { AuthContext } from './UserAuthProvider';
import { CounterProvider, useCounter } from './CounterProvider';


function App() {
  const user = useContext(AuthContext);
  const counters = useCounter();
  

  const handleAdd = () => {
    console.log("added");
    counters.add(0, "untitled");
  };

  const handleDelete = useCallback((uid: string) => {
    counters.remove(uid);
  }, []);

  return (
    <ThemeProvider
  breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
    >
        <div>userid = {user.currentUserId}</div>
        <div>useruid = {user.currentUser?.uid}</div>
        {counters.counters.map((data) => 
          <div key={data.uid}>
            <Counter name={data.name} count={data.count} uid={data.uid} remove={handleDelete}/>
            {}
          </div>)}
        <Button onClick={handleAdd}>+</Button>
        {console.log(counters.counters)}
    </ThemeProvider>
  );
}

export default App;
