import React, { useState } from 'react';
import { Heading, Text, Flex, Box } from 'rebass';
import { Divider, useThemeUI } from 'theme-ui';
import { FaBars, FaCog } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { useSpring, animated } from 'react-spring';
import { lighten } from '@theme-ui/color';
import { Header } from '../components/app/header';
import { TodoModal } from '../components/app/TodoModal';
import {
  SidebarBody,
  SidebarContainer,
  Sidebar
} from '../components/layout/sidebar';
import { useGetAllProjectsAndTodosQuery } from '../generated/types-and-hooks';
import { TodoItem } from '../components/todo/TodoItem';
import { ProjectItem } from '../components/todo/ProjectItem';
import { LoadingOverlay } from '../components/misc/Loading';
import { CreateTodo } from '../components/todo/CreateTodo';
import { Link } from '../components/misc/link';
import { routes } from '../routes';

const AnimatedSidebarBody = animated(SidebarBody);

export const TodoPage: React.FC = () => {
  // const { projectId } = useParams<{ projectId?: string }>();
  // const history = useHistory();

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
        // history.push(`${routes.todos}/${data.defaultProject.id}`);
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

  if (loading) return <LoadingOverlay />;

  return (
    <Flex sx={{ minHeight: '100vh' }} flexDirection="column">
      <Header
        color="text"
        bg="primary"
        height={headerSize}
        px={3}
        left={
          <Box verticalAlign="middle">
            <IconContext.Provider
              value={{
                color: theme.colors?.text
              }}
            >
              <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} />
            </IconContext.Provider>
          </Box>
        }
        right={
          <>
            <Link to={routes.settings} variant="noStyle" verticalAlign="middle">
              <IconContext.Provider
                value={{
                  color: theme.colors?.text
                }}
              >
                <FaCog />
              </IconContext.Provider>
            </Link>
          </>
        }
      />

      {loading ? (
        <LoadingOverlay />
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
              <ProjectItem
                key={project.id}
                selected={projectId === project.id}
                project={project}
                onClick={() => setProjectId(project.id)}
                // onClick={() => history.push(`${routes.todos}/${project.id}`)}
              />
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
