import React, { useState } from 'react';
import {
  useUpdateTodoMutation,
  TodoFieldsFragment,
  ProjectFieldsFragment,
} from '../../generated/types-and-hooks';
import { Modal } from '../misc/Modal';
import { Flex, Box, Text } from 'rebass';
import { Label, Checkbox, Input } from '@rebass/forms';
import { useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import { Dot } from '../misc/Dot';

interface Props {
  project: ProjectFieldsFragment;
  todo: TodoFieldsFragment;
  onClose?: () => void;
}

interface Inputs {
  name: string;
}

export const TodoModal: React.FC<Props> = ({ project, todo, onClose }) => {
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();
  const [updateTodo] = useUpdateTodoMutation();
  // const handleStop = () => {
  //   setEditing(false);
  //   setName(todo.name);
  // };
  const onSubmit = async (inputs: Inputs) => {
    await updateTodo({
      variables: {
        id: todo.id,
        name: inputs.name,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateTodo: {
          __typename: 'Todo',
          id: todo.id,
          completed: todo.completed,
          name: inputs.name,
          description: todo.description,
        },
      },
    });

    setEditing(false);
  };
  return (
    <Modal
      background="rgba(0, 0, 0, .75)"
      onClose={onClose}
      sx={{
        color: 'text',
        bg: 'background',
        textAlign: 'center',
        width: ['95%', 300],
        borderRadius: 10,
        minWidth: 400,
      }}
      py={3}
      px={2}
    >
      <Flex mb={2}>
        <Box mx={2}>
          <Dot color={project.color} sx={{ display: 'inline-block' }} mr={2} />
          {project.name}
        </Box>
        <Box ml="auto" mr={1} onClick={onClose}>
          <FaTimes />
        </Box>
      </Flex>

      {!editing ? (
        <Flex>
          <Box>
            <Label>
              <Checkbox
                checked={todo.completed}
                onChange={(event) =>
                  updateTodo({
                    variables: {
                      id: todo.id,
                      completed: event.target.checked,
                    },
                    optimisticResponse: {
                      __typename: 'Mutation',
                      updateTodo: {
                        __typename: 'Todo',
                        id: todo.id,
                        completed: event.target.checked,
                        name: todo.name,
                        description: todo.description,
                      },
                    },
                  })
                }
              />
            </Label>
          </Box>
          <Text onClick={() => setEditing(true)}>{todo.name}</Text>
        </Flex>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box p={1}>
            <Input name="name" ref={register({ required: true })} defaultValue={todo.name} />
          </Box>
        </form>
      )}
    </Modal>
  );
};
