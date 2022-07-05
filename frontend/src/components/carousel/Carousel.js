import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiArrowLeftBoldOutline, mdiArrowRightBoldOutline } from "@mdi/js";

import { SmallButton } from "../styles";
import * as Styled from "./Carousel.styles";

const Carousel = ({ children, className, headings }) => {
  const [index, setIndex] = useState(0);

  const maxIndex = React.Children.count(children) - 1;
  const transform = index * -100;

  const cycleLeft = () => {
    setIndex((prev) => (prev === 0 ? prev : prev - 1));
  };

  const cycleRight = () => {
    setIndex((prev) => (prev === maxIndex ? prev : prev + 1));
  };

  return (
    <Styled.CarouselContainer className={className}>
      <Styled.CarouselNav>
        <Styled.CarouselNavList>
          {headings.map((heading, i) => {
            return (
              <Styled.CarouselNavItem
                key={i}
                isActive={i === index}
                onClick={() => setIndex(i)}
              >
                {heading}
              </Styled.CarouselNavItem>
            );
          })}
        </Styled.CarouselNavList>
      </Styled.CarouselNav>

      <Styled.InnerCarouselContainer transform={transform}>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { width: "100%" });
        })}
      </Styled.InnerCarouselContainer>

      <Styled.ButtonRow>
        <SmallButton onClick={() => cycleLeft()} disabled={index === 0}>
          <Icon path={mdiArrowLeftBoldOutline} size={0.75} title="Page left" />
        </SmallButton>
        <SmallButton onClick={() => cycleRight()} disabled={index === maxIndex}>
          <Icon
            path={mdiArrowRightBoldOutline}
            size={0.75}
            title="Page right"
          />
        </SmallButton>
      </Styled.ButtonRow>
    </Styled.CarouselContainer>
  );
};

export default Carousel;
