import * as Styled from './Spinner.styles';

const Spinner = ({ size = '100px' }) => {
  return (
    <Styled.SpinnerContainer size={size}>
      <Styled.AnimatedSpinner size={size} />
      <Styled.SpinnerShadow size={size} />
    </Styled.SpinnerContainer>
  );
};

export default Spinner;
