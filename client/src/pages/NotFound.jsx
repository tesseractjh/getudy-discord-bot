import styled from 'styled-components';
const { HomeHeader } = require("./Home")

const Container = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const NotFound = () => {
  return (
    <Container>
      <HomeHeader>Not Found</HomeHeader>
    </Container>
  );
};

export default NotFound;