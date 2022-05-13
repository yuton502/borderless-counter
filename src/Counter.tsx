import React, { useState, useCallback, CSSProperties } from 'react'
import { Button, Card, CardGroup, CardProps } from 'react-bootstrap';
import { BsFillTrashFill } from 'react-icons/bs';
import { useCounter } from './CounterProvider';
import TextEditable from './TextEditable';

interface Props {
  count: number,
  name: string,
  uid: string,
  remove: (uid: string) => void
};

const Counter: React.FC<Props> = (props) => {
  const [count, setCount] = useState<number>(props.count);
  const [name, setName] = useState<string>(props.name);
  const [uniqueId, setUID] = useState<string>(props.uid);
  const [isMouseHover, setIsMouseHover] = useState<boolean>(false);
  const counters = useCounter();

  const handleIncrement = useCallback(() => {
    if (!isMouseHover) {
      setCount(prev => prev + 1);
    }
    console.log("this counter is " + (count + 1))
    counters.update(uniqueId, (count + 1), name);
  }, [isMouseHover, uniqueId, count, name]);

  const handleRemove = useCallback(() => {
    props.remove(uniqueId);
    console.log("removed");
  }, [uniqueId]);

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
            <div className="row justify-content-end" 
            onMouseEnter={handleHoverEntered}
            onMouseLeave={handleHoverLeft}
            onClick={handleRemove}>
              <BsFillTrashFill />
            </div>
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