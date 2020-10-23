import React from 'react';
import { BeatLoader } from 'react-spinners';
import { Box, Flex } from 'rebass';
import { useThemeUI } from 'theme-ui';

export const Loading: React.FC = () => {
  const { theme } = useThemeUI();
  return <BeatLoader color={theme.colors?.primary} />;
};

export const LoadingOverlay: React.FC = () => {
  return (
    <Flex sx={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Box m="auto">
        <Loading />
      </Box>
    </Flex>
  );
};
