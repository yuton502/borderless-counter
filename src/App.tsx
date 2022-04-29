import React, { useContext, useState, useCallback } from 'react'
import logo from './logo.svg';
import './css/App.css';
import { Button, Container, Col, Row, ThemeProvider, CardGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Counter from './Counter';
import { count } from 'console';
import Login from './Login';
import { useUIDSeed } from 'react-uid';
import { AuthContext } from './UserAuthProvider';
import { CounterProvider, useCounter } from './CounterProvider';


function App() {
  const seed = useUIDSeed();
  const user = useContext(AuthContext);
  const counters = useCounter();
  

  const handleAdd = () => {
    console.log("added");
    counters.add(0, "untitled");
  };

  const handleDelete = () => {
    
  };

  return (
    <ThemeProvider
  breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
    >
        <Button onClick={handleAdd}>+</Button>
        <Button onClick={handleDelete}>-</Button>
        
        <div>userid = {user.currentUserId}</div>
        <div>useruid = {user.currentUser?.uid}</div>
        {counters.counters.map((data) => 
          <div key={data.uid}>
            <Counter name={data.name} count={data.count} uid={data.uid}/>
            {}
          </div>)}
          {console.log(counters.counters)}
    </ThemeProvider>
  );
}

export default App;
