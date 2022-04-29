import React, { useState, useRef, CSSProperties, useCallback, useEffect } from 'react'
import { FormControl } from 'react-bootstrap';
import { BsFillPencilFill } from 'react-icons/bs'

interface Props {
  name: string,
  changeName: React.Dispatch<React.SetStateAction<string>>,
  onMouseEnter?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const TextEditable: React.FC<Props> = (props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const newNameRef = useRef<HTMLInputElement>(null);
  const canTextSelect: CSSProperties = {
      userSelect: 'text'
  }

  const handleClick = useCallback(() => {
    console.log("handleClick was get for " + isEditing)
    setIsEditing(true);
  }, [isEditing])

  const handleBlur = useCallback(() => {
    console.log("handleBlur was get for " + isEditing)
    setIsEditing(false);
  }, [isEditing])

  const handleKeyDown = (key: React.KeyboardEvent) => {
    console.log(key.code + "\n" + key.keyCode);
    switch (key.code) {
      case 'Enter':
        if (key.keyCode == 13) {
          props.changeName(newNameRef.current?.value ?? props.name);
          setIsEditing(false);
          console.log(isEditing);
        }
        break;
      
      case 'Escape':
        setIsEditing(false);
        break;
    }
  };

  const nameDisplayNode: React.ReactNode = (
    <>
      {props.name}
      <span onClick={handleClick}>
        <BsFillPencilFill />
      </span>  
    </>
  )

  const changeNameNode: React.ReactNode = (
    <>
      <FormControl 
        placeholder="name..."
        onBlur={handleBlur}
        defaultValue={props.name}
        onKeyUp={(e) => handleKeyDown(e)}
        autoFocus={true}
        ref={newNameRef}        
      >
      </FormControl>
    </>
  )

// const [showNode, setShowNode] = useState<React.ReactNode>(nameDisplayNode);

//   useEffect(() => {
//     setShowNode(isEditing ? changeNameNode : nameDisplayNode)
//   }, [isEditing]);

  
  return (
    <span style={canTextSelect}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}>
      {isEditing ? changeNameNode : nameDisplayNode}
    </span>
  );
}

export default TextEditable;