import { alpha } from '@theme-ui/color';
import BackgroundImage, { IBackgroundImageProps } from 'gatsby-background-image';
import React from 'react';
import { Box, Flex, FlexProps } from 'rebass';

interface Props {
  image: IBackgroundImageProps;
  overlayColor?: false | string;
}

export const Banner: React.FC<Props & Omit<FlexProps, 'css'>> = ({
  image,
  // defaults to .8 transparent of secondary color
  // Read more here: https://theme-ui.com/packages/color
  // setting this to false disables the overlay
  overlayColor = alpha('secondary', 0.85),
  children,
  ...rest
}) => (
  <BackgroundImage
    {...image}
    style={{
      position: 'relative',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}
    role={'banner'}
  >
    {overlayColor && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: -1,
          bg: overlayColor,
        }}
      />
    )}
    <Flex {...rest}>
      <Box m="auto">{children}</Box>
    </Flex>
  </BackgroundImage>
);
