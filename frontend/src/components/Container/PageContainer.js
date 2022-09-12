import { motion } from 'framer-motion';

import { Container } from '../styles';

const transitionVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const AnimatedContainer = motion(Container);

export const PageContainer = ({ children, ...rest }) => {
  return (
    <AnimatedContainer
      variants={transitionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...rest}
    >
      {children}
    </AnimatedContainer>
  );
};
