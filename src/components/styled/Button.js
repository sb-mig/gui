import styled from "styled-components";

export const Button = styled.button`
  font-size: 10px;
  border-radius: 3px;
  padding: 8px 4px;
  margin: 2px;
  background: white;
  background: ${props => props.primary && 'yellow'};
  background: ${props => props.secondary && 'orange'};
  color: black;
  border: 1px solid black;
  
  &:hover {
    background: gray;
    color: white;
  }
  
  &:active {
    color: black;
    background: white;
  }
`