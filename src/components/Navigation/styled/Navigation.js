import styled from "styled-components";

export const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
`

export const Nav = styled.nav`
  ul {
    display: flex;
    justify-content: space-between;
    padding: 0;
    margin: 0;
    
    li {
      list-style: none;
    }
  }
`