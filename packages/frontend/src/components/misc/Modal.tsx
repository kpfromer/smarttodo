import React from 'react';
import usePortal from 'react-useportal';
import { Box, SxStyleProp, BoxProps } from 'rebass';

interface Props {
  background?: string;
  onClose?: () => void;
  sx: SxStyleProp;
}

export const Modal: React.FC<Props & Omit<BoxProps, 'onClick' | 'sx'>> = ({
  background,
  onClose,
  sx,
  children,
  ...rest
}) => {
  const { Portal } = usePortal();

  const modalStyle: SxStyleProp = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    ...sx,
  };

  const backgroundStyle: SxStyleProp = {
    position: 'absolute',
    background: background ?? 'transparent',
    width: '100vw',
    height: '100vh',
    top: 0,
    bottom: 0,
    zIndex: 1000,
  };

  return (
    <Portal>
      <Box sx={backgroundStyle} onClick={onClose}>
        <Box {...rest} sx={modalStyle} onClick={(event) => event.stopPropagation()}>
          {children}
        </Box>
      </Box>
    </Portal>
  );
};
