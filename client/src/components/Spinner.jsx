import styled, { keyframes } from 'styled-components';

const SpinnerWrapper = styled.tr`
  position: relative;
  height: 200px;
  background-color: var(--color-white);
`;

const spinnerAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const SpinnerQuarter = styled.td`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border: 10px solid;
  border-color: var(--color-red) transparent transparent transparent;
  border-radius: 50%;
  animation: ${spinnerAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  animation-delay: ${({ delay }) => delay ?? 0}s;
`;

const Spinner = (props) => {
  return (
    <SpinnerWrapper {...props}>
      <SpinnerQuarter delay={-0.45} />
      <SpinnerQuarter delay={-0.3} />
      <SpinnerQuarter delay={-0.15} />
      <SpinnerQuarter />
    </SpinnerWrapper>
  )
};

export default Spinner;