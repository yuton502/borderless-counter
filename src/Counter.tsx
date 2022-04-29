import React, { useState, useCallback, CSSProperties } from 'react'
import { Button, Card, CardGroup, CardProps } from 'react-bootstrap';
import ContentEditable from './ContentEditable';
import { useCounter } from './CounterProvider';
import TextEditable from './TextEditable';

interface Props {
  count: number,
  name: string,
  uid: string,
}

const Counter: React.FC<Props> = (props) => {
  const [count, setCount] = useState<number>(props.count);
  const [name, setName] = useState<string>(props.name);
  const [uniqueId, setUID] = useState<string>(props.uid);
  const [isMouseHover, setIsMouseHover] = useState<boolean>(false);
  const counters = useCounter();

  const handleIncrement = useCallback(() => {
    console.log("count tried to add for [isMouseHover] is " + isMouseHover);
    if (!isMouseHover) {
      setCount(prev => prev + 1);
    }
    console.log("this counter is " + uniqueId)
    counters.update(uniqueId, count, name);
  },[isMouseHover, uniqueId, count, name]);

  const handleHoverEntered = () => {
    setIsMouseHover(true);
  };
  const handleHoverLeft = () => {
    setIsMouseHover(false);
  };

  return (
    <Card border="primary" className='m-3'>
      <Button variant="primary">
        <Card.Body onClick={handleIncrement} >
          <Card.Text>

            {/* <ContentEditable value={name} onChange={handleChangeName} /> */}
            {/* <span onMouseEnter={handleHoverEvent}
            onMouseLeave={handleHoverEvent} 
            >
              {name}
              <span className='m-2 text-end' onClick={handleChangeName}>
                <BsFillPencilFill/>
              </span>
            </span> */}
            <TextEditable 
              name={name}
              changeName={setName}
              onMouseEnter={handleHoverEntered}
              onMouseLeave={handleHoverLeft}>
                
            </TextEditable>
          </Card.Text>
          <div>
            <Card.Text >
              { count }
            </Card.Text>
          </div>
        </Card.Body>
      </Button>
    </Card>
  )
};

export default Counter;