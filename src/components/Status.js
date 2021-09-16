import styled, {keyframes} from "styled-components";

const Ready = styled.div`
  border-radius: 50%;
  background: green;
  border: 1px solid black;
  height: 26px;
  width: 26px;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const Status = (props) => {
  const {loading} = props;

  return (
      loading ? <Spinner /> : <Ready />
  )
}

export default Status