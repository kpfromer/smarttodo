import React, { useState } from 'react';
import { gql, Reference } from '@apollo/client';
import { Heading, Text, Flex, Box, Button } from 'rebass';
import { Divider, Label, Checkbox, useThemeUI } from 'theme-ui';
import {
  useGetAllProjectsAndTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  TodoFieldsFragment,
  ProjectFieldsFragment,
  useDeleteTodoMutation
} from '../../generated/types-and-hooks';
import { Input } from '@rebass/forms';
import { Dot } from '../misc/Dot';
import { TodoModal } from './TodoModal';
import { Header } from './header';
import { Sidebar, SidebarBody, SidebarContainer } from '../layout/sidebar';
import { useForm } from 'react-hook-form';
import { FaTimes, FaBars, FaCog } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { useSpring, animated } from 'react-spring';
import { lighten } from '@theme-ui/color';

const AnimatedSidebarBody = animated(SidebarBody);

const TodoItem: React.FC<{
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

interface CreateTodoInputs {
  name: string;
}

const CreateTodo: React.FC<{ project: ProjectFieldsFragment }> = ({
  project
}) => {
  const { register, handleSubmit, setValue } = useForm<CreateTodoInputs>();

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
        id: cache.identify(project),
        fields: {
          todos(existingTodoRefs: Reference[]) {
            return [...existingTodoRefs, newTodoRef];
          }
        }
      });
    }
  });

  const onSubmit = (inputs: CreateTodoInputs) => {
    createTodo({
      variables: {
        projectId: project.id,
        name: inputs.name,
        completed: false
      }
    });
    setValue('name', '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex>
        <Input
          name="name"
          ref={register({ required: true })}
          defaultValue=""
          mr={2}
        />
        <Button type="submit">Create</Button>
      </Flex>
    </form>
  );
};

export const Todo: React.FC = () => {
  const headerSize = 50;
  const sidebarSize = 300;
  const lighterBackground = lighten('background', 0.025);
  const { theme } = useThemeUI();
  // TODO: Change if in mobile
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarProps = useSpring({
    marginLeft: sidebarOpen ? `${sidebarSize}px` : `0px`
  });
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
  const [openedTodo, setOpen] = useState<undefined | string>(undefined);
  const currentTodo = currentProject?.todos.find(
    (todo) => todo.id === openedTodo
  );

  if (loading) return <Text>Loading</Text>;
  return (
    <Flex sx={{ minHeight: '100vh' }} flexDirection="column">
      <Header
        color="text"
        bg="primary"
        height={headerSize}
        px={3}
        left={
          <>
            <IconContext.Provider
              value={{
                style: { verticalAlign: 'middle' },
                color: theme.colors?.text
              }}
            >
              <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} />
            </IconContext.Provider>
          </>
        }
        right={
          <>
            <IconContext.Provider
              value={{
                style: { verticalAlign: 'middle' },
                color: theme.colors?.text
              }}
            >
              <FaCog />
            </IconContext.Provider>
          </>
        }
      />

      {loading ? (
        <Text>Loading</Text>
      ) : (
        <SidebarContainer size={sidebarSize} sx={{ flexGrow: 1 }}>
          <AnimatedSidebarBody style={sidebarProps} sx={{ flexGrow: 1 }}>
            {!!currentProject && (
              <Box
                pt={3}
                px={3}
                sx={{
                  flexGrow: 1,
                  position: 'relative',
                  zIndex: 10,
                  bg: 'background'
                }}
              >
                <Heading mb={2}>{currentProject.name}</Heading>

                {currentProject.todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    project={currentProject}
                    todo={todo}
                    onClick={() => setOpen(todo.id)}
                  />
                ))}
                <CreateTodo project={currentProject} />
              </Box>
            )}
          </AnimatedSidebarBody>

          <Sidebar
            headerSize={headerSize}
            pt={3}
            px={3}
            sx={{ bg: lighterBackground }}
          >
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
                  <Text as="span" color="mutedText" sx={{ display: 'inline' }}>
                    {project.todos.length}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Sidebar>
        </SidebarContainer>
      )}
      {!!currentTodo && !!currentProject && (
        <TodoModal
          project={currentProject}
          todo={currentTodo}
          onClose={() => setOpen(undefined)}
        />
      )}
    </Flex>
  );
};
