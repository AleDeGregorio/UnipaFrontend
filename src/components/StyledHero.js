import styled from "styled-components";
const StyledHero = styled.header`
  min-height: 60vh;
  /* background: url(${''}); */
  background: url(${props => (props.img ? props.img : '')});
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-position-x: center;
  background-repeat: no-repeat;
  background-origin: content-box;
`;

export default StyledHero;
