import React, { useState, useEffect, FormEvent } from 'react';
import { gql, Reference } from '@apollo/client';
import { Heading, Text, Flex, Box, Button } from 'rebass';
import { Divider, Label, Checkbox } from 'theme-ui';
import {
  useGetAllProjectsAndTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation
} from '../../generated/types-and-hooks';
import { Input } from '@rebass/forms';
import { Dot } from '../misc/Dot';
import { TodoModal } from './TodoModal';

export const Todo: React.FC = () => {
  const [projectId, setProjectId] = useState<undefined | string>(undefined);

  const { loading, data } = useGetAllProjectsAndTodosQuery({
    onCompleted: (data) => {
      if (!projectId) {
        setProjectId(data.defaultProject.id);
      }
    }
  });
  const currentProject = data?.projects.find(
    (project) => project.id === projectId
  );
  const [name, setName] = useState('');
  const [openedTodo, setOpen] = useState<undefined | string>(undefined);
  const currentTodo = currentProject?.todos.find(
    (todo) => todo.id === openedTodo
  );
  const [createTodo] = useCreateTodoMutation({
    update(cache, { data }) {
      // create new todo reference
      const newTodoRef = cache.writeFragment({
        data: data?.createTodo,
        fragment: gql`
          fragment NewTodo on Todo {
            id
            completed
            name
            description
          }
        `
      });

      // add todo to project's todos lists
      cache.modify({
        id: cache.identify(currentProject!),
        fields: {
          todos(existingTodoRefs: Reference[]) {
            return [...existingTodoRefs, newTodoRef];
          }
        }
      });
    }
  });
  const [updateTodo] = useUpdateTodoMutation();

  const handleCreateTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTodo({
      variables: {
        projectId: currentProject!.id,
        name,
        completed: false
      }
    });
    setName('');
  };

  if (loading) return <Text>Loading</Text>;
  return (
    <>
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <>
          <Flex mt={4} flexDirection={['column', 'column', 'row']}>
            <Flex width={[1, 1, 1 / 5]} flexDirection="column" pr={[0, 0, 4]}>
              <Text fontWeight="bold">Projects</Text>
              <Divider />

              {data?.projects.map((project) => (
                <Flex
                  key={project.id}
                  alignItems="center"
                  onClick={() => setProjectId(project.id)}
                >
                  <Dot color={project.color} mr={2} />
                  <Box>
                    <Text
                      sx={{ display: 'inline' }}
                      fontWeight={projectId === project.id ? 'bold' : 'normal'}
                    >
                      {project.name}{' '}
                    </Text>
                    <Text
                      as="span"
                      color="mutedText"
                      sx={{ display: 'inline' }}
                    >
                      {project.todos.length}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Flex>

            <Box width={[1, 1, 4 / 5]}>
              {!!currentProject && (
                <>
                  <Heading mb={2}>{currentProject.name}</Heading>

                  {currentProject.todos.map((todo) => (
                    <Box key={todo.id}>
                      <Flex>
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
                        <Text onClick={() => setOpen(todo.id)}>
                          {todo.name}
                        </Text>
                      </Flex>
                      <Divider />
                    </Box>
                  ))}
                  <form onSubmit={handleCreateTodo}>
                    <Flex>
                      <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        mr={2}
                      />
                      <Button type="submit">Create</Button>
                    </Flex>
                  </form>
                </>
              )}
            </Box>
          </Flex>
          {!!currentTodo && (
            <TodoModal
              project={currentProject}
              todo={currentTodo}
              onClose={() => setOpen(undefined)}
            />
          )}
        </>
      )}
    </>
  );
};
