import React from 'react';
import { Box, BoxProps } from 'rebass';

interface Props {
  color: string;
}

export const Dot: React.FC<Props & Omit<BoxProps, 'color'>> = ({ color, ...rest }) => {
  return (
    <Box
      {...rest}
      sx={{
        ...rest.sx,
        width: '10px',
        '&:before': {
          backgroundColor: color,
          content: `""`,
          display: 'inline-block',
          width: '10px',
          height: '10px',
          borderRadius: '100%',
        },
      }}
    />
  );
};
