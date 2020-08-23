import React from 'react';
import { Box, BoxProps, Flex } from 'rebass';

const SidebarContext = React.createContext({
  size: 300
});

export const SidebarContainer: React.FC<
  { size?: number } & Omit<Omit<BoxProps, 'css'>, 'flexDirection'>
> = ({ size = 300, children, ...rest }) => {
  return (
    <Flex {...rest} sx={{ position: 'relative', ...rest.sx }}>
      <SidebarContext.Provider value={{ size }}>
        {children}
      </SidebarContext.Provider>
    </Flex>
  );
};

export const Sidebar: React.FC<
  { headerSize: number } & Omit<BoxProps, 'css'>
> = ({ headerSize, children, ...rest }) => {
  return (
    <SidebarContext.Consumer>
      {({ size }) => (
        <Box
          {...rest}
          sx={{
            width: size,
            position: 'fixed',
            top: headerSize,
            left: 0,
            bottom: 0,
            ...rest.sx
          }}
        >
          {children}
        </Box>
      )}
    </SidebarContext.Consumer>
  );
};

export const SidebarBody: React.FC<Omit<BoxProps, 'css'>> = ({
  children,
  ...rest
}) => {
  return (
    <SidebarContext.Consumer>
      {({ size }) => (
        <Flex {...rest} ml={size} sx={{ flexGrow: 1, ...rest.sx }}>
          {children}
        </Flex>
      )}
    </SidebarContext.Consumer>
  );
};
