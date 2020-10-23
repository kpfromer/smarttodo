import React from 'react';
import { Reference } from '@apollo/client';
import { FaTimes } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import {
  useThemeUI,
  Text,
  Box,
  Flex,
  Label,
  Checkbox,
  Divider
} from 'theme-ui';
import {
  ProjectFieldsFragment,
  TodoFieldsFragment,
  useUpdateTodoMutation,
  useDeleteTodoMutation
} from '../../generated/types-and-hooks';

export const TodoItem: React.FC<{
  project: ProjectFieldsFragment;
  todo: TodoFieldsFragment;
  onClick?: () => void;
}> = ({ project, todo, onClick }) => {
  const { theme } = useThemeUI();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation({
    update(cache) {
      // delete todo from project's todos lists
      const deletedTodoRef = cache.identify(todo);
      cache.modify({
        id: cache.identify(project),
        fields: {
          todos(existingTodoRefs: Reference[]) {
            return existingTodoRefs.filter(
              (todoRef) => todoRef.__ref !== deletedTodoRef
            );
          }
        }
      });
    }
  });
  return (
    <Box>
      <Flex
        sx={{
          '& .showOnHover': {
            visibility: 'hidden'
          },
          '&:hover .showOnHover': {
            visibility: 'visible'
          }
        }}
      >
        <Box>
          <Label>
            <Checkbox
              checked={todo.completed}
              onChange={(event) =>
                updateTodo({
                  variables: {
                    id: todo.id,
                    completed: event.target.checked
                  },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    updateTodo: {
                      __typename: 'Todo',
                      id: todo.id,
                      completed: event.target.checked,
                      name: todo.name,
                      description: todo.description
                    }
                  }
                })
              }
            />
          </Label>
        </Box>
        <Text onClick={onClick} sx={{ flexGrow: 1 }}>
          {todo.name}
        </Text>
        <Box
          className="showOnHover"
          mr={1}
          onClick={() => deleteTodo({ variables: { todoId: todo.id } })}
        >
          <IconContext.Provider
            value={{
              style: { verticalAlign: 'middle' },
              color: theme.colors?.text
            }}
          >
            <FaTimes />
          </IconContext.Provider>
        </Box>
      </Flex>
      <Divider />
    </Box>
  );
};
