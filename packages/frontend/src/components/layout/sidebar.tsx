import React from 'react';
import { Box, BoxProps, Flex } from 'rebass';

export const SidebarContainer: React.FC<Omit<BoxProps, 'flexDirection'>> = ({
  children,
  ...rest
}) => {
  return (
    <Flex {...rest} flexDirection="row">
      {children}
    </Flex>
  );
};

export const Sidebar: React.FC = ({ children }) => {
  return <Box sx={{ width: 300 }}>{children}</Box>;
};

export const SidebarBody: React.FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box {...rest} sx={{ ...rest.sx, flexGrow: 1 }}>
      {children}
    </Box>
  );
};
