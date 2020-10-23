import React from 'react';
import { Box } from 'rebass';
import { Link } from '../components/misc/link';
import { routes } from '../routes';

export const SettingsPage: React.FC = () => {
  return (
    <>
      <Box>
        <Link to={routes.todos}>Close</Link>
      </Box>
      <Box>Settings</Box>
    </>
  );
};
