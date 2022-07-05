import * as Styled from "./CarouselItem.styles";

const CarouselItem = ({ children, className, width }) => {
  return (
    <Styled.CarouselItemContainer className={className} width={width}>
      {children}
    </Styled.CarouselItemContainer>
  );
};

export default CarouselItem;
