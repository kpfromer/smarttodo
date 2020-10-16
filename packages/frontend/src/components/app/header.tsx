import React from 'react';
import { Flex, Box, BoxProps } from 'rebass';

interface Props {
  left: React.ReactChildren | React.ReactChild;
  right: React.ReactChildren | React.ReactChild;
}

export const Header: React.FC<Props & Omit<BoxProps, 'css'>> = ({
  left,
  right,
  ...rest
}) => {
  return (
    <Box {...rest}>
      <Flex py={3} alignItems="center">
        <Flex alignItems="center">{left}</Flex>
        <Flex ml="auto" alignItems="center">
          {right}
        </Flex>
      </Flex>
    </Box>
  );
};
