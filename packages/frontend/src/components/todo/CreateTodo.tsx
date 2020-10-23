import { gql, Reference } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Flex, Input, Button } from 'theme-ui';
import {
  ProjectFieldsFragment,
  useCreateTodoMutation
} from '../../generated/types-and-hooks';

interface CreateTodoInputs {
  name: string;
}

export const CreateTodo: React.FC<{ project: ProjectFieldsFragment }> = ({
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
