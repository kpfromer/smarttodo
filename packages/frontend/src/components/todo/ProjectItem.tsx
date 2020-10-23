import React from 'react';
import { Text, Box, Flex, FlexProps } from 'rebass';
import { ProjectFieldsFragment } from '../../generated/types-and-hooks';
import { Dot } from '../misc/Dot';

export const ProjectItem: React.FC<
  { selected?: boolean; project: ProjectFieldsFragment } & Omit<
    FlexProps,
    'css'
  >
> = ({ selected = false, project, ...props }) => {
  return (
    <Flex alignItems="center" {...props}>
      <Dot color={project.color} mr={2} />
      <Box>
        <Text
          sx={{ display: 'inline' }}
          fontWeight={selected ? 'bold' : 'normal'}
        >
          {project.name}{' '}
        </Text>
        <Text as="span" color="mutedText" sx={{ display: 'inline' }}>
          {project.todos.length}
        </Text>
      </Box>
    </Flex>
  );
};
