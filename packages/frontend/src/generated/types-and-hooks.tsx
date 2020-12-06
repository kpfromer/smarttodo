import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  defaultProject: Project;
  me: CleanUser;
  projects: Array<Project>;
  token: Scalars['String'];
};

export type CleanUser = {
  __typename?: 'CleanUser';
  id: Scalars['ID'];
  email: Scalars['String'];
};

export type Project = DateMetadata &
  UserMetadata & {
    __typename?: 'Project';
    created?: Maybe<Scalars['DateTime']>;
    updated?: Maybe<Scalars['DateTime']>;
    userId: Scalars['ID'];
    id: Scalars['ID'];
    name: Scalars['String'];
    color: Scalars['String'];
    todos: Array<Todo>;
  };

export type DateMetadata = {
  created?: Maybe<Scalars['DateTime']>;
  updated?: Maybe<Scalars['DateTime']>;
};

export type UserMetadata = {
  userId: Scalars['ID'];
};

export type Todo = DateMetadata &
  UserMetadata & {
    __typename?: 'Todo';
    created?: Maybe<Scalars['DateTime']>;
    updated?: Maybe<Scalars['DateTime']>;
    userId: Scalars['ID'];
    id: Scalars['ID'];
    name: Scalars['String'];
    completed: Scalars['Boolean'];
    description?: Maybe<Scalars['String']>;
  };

export type Mutation = {
  __typename?: 'Mutation';
  createUser: Scalars['String'];
  refresh: Scalars['String'];
  login: Scalars['String'];
  logout: Scalars['Boolean'];
  createProject: Project;
  createTodo: Todo;
  updateTodo?: Maybe<Todo>;
  deleteTodo?: Maybe<Todo>;
};

export type MutationCreateUserArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
  rememberMe?: Maybe<Scalars['Boolean']>;
};

export type MutationCreateProjectArgs = {
  options: ProjectCreateInput;
};

export type MutationCreateTodoArgs = {
  options: TodoCreateInput;
  project: Scalars['ID'];
};

export type MutationUpdateTodoArgs = {
  options: TodoUpdateInput;
  id: Scalars['ID'];
};

export type MutationDeleteTodoArgs = {
  id: Scalars['ID'];
};

export type ProjectCreateInput = {
  name: Scalars['String'];
  color: Scalars['String'];
};

export type TodoCreateInput = {
  name: Scalars['String'];
  completed: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
};

export type TodoUpdateInput = {
  name?: Maybe<Scalars['String']>;
  completed?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
};

export type LoginTokenQueryVariables = Exact<{ [key: string]: never }>;

export type LoginTokenQuery = { __typename?: 'Query' } & Pick<Query, 'token'>;

export type RefreshMutationVariables = Exact<{ [key: string]: never }>;

export type RefreshMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'refresh'>;

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  rememberMe?: Maybe<Scalars['Boolean']>;
}>;

export type LoginMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'login'>;

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type RegisterMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'createUser'>;

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'logout'>;

export type TodoFieldsFragment = { __typename?: 'Todo' } & Pick<
  Todo,
  'id' | 'name' | 'completed' | 'description'
>;

export type ProjectFieldsFragment = { __typename?: 'Project' } & Pick<
  Project,
  'id' | 'name' | 'color'
> & {
    todos: Array<{ __typename?: 'Todo' } & Pick<Todo, 'id' | 'name' | 'completed' | 'description'>>;
  };

export type GetAllProjectsAndTodosQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllProjectsAndTodosQuery = { __typename?: 'Query' } & {
  defaultProject: { __typename?: 'Project' } & ProjectFieldsFragment;
  projects: Array<{ __typename?: 'Project' } & ProjectFieldsFragment>;
};

export type UpdateTodoMutationVariables = Exact<{
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  completed?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
}>;

export type UpdateTodoMutation = { __typename?: 'Mutation' } & {
  updateTodo?: Maybe<{ __typename?: 'Todo' } & TodoFieldsFragment>;
};

export type CreateTodoMutationVariables = Exact<{
  projectId: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  completed: Scalars['Boolean'];
}>;

export type CreateTodoMutation = { __typename?: 'Mutation' } & {
  createTodo: { __typename?: 'Todo' } & Pick<Todo, 'id' | 'name' | 'description' | 'completed'>;
};

export type DeleteTodoMutationVariables = Exact<{
  todoId: Scalars['ID'];
}>;

export type DeleteTodoMutation = { __typename?: 'Mutation' } & {
  deleteTodo?: Maybe<{ __typename?: 'Todo' } & Pick<Todo, 'id'>>;
};

export const TodoFieldsFragmentDoc = gql`
  fragment TodoFields on Todo {
    id
    name
    completed
    description
  }
`;
export const ProjectFieldsFragmentDoc = gql`
  fragment ProjectFields on Project {
    id
    name
    color
    todos {
      id
      name
      completed
      description
    }
  }
`;
export const LoginTokenDocument = gql`
  query loginToken {
    token @client
  }
`;

/**
 * __useLoginTokenQuery__
 *
 * To run a query within a React component, call `useLoginTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginTokenQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoginTokenQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<LoginTokenQuery, LoginTokenQueryVariables>,
) {
  return ApolloReactHooks.useQuery<LoginTokenQuery, LoginTokenQueryVariables>(
    LoginTokenDocument,
    baseOptions,
  );
}
export function useLoginTokenLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LoginTokenQuery, LoginTokenQueryVariables>,
) {
  return ApolloReactHooks.useLazyQuery<LoginTokenQuery, LoginTokenQueryVariables>(
    LoginTokenDocument,
    baseOptions,
  );
}
export type LoginTokenQueryHookResult = ReturnType<typeof useLoginTokenQuery>;
export type LoginTokenLazyQueryHookResult = ReturnType<typeof useLoginTokenLazyQuery>;
export type LoginTokenQueryResult = ApolloReactCommon.QueryResult<
  LoginTokenQuery,
  LoginTokenQueryVariables
>;
export const RefreshDocument = gql`
  mutation refresh {
    refresh
  }
`;
export type RefreshMutationFn = ApolloReactCommon.MutationFunction<
  RefreshMutation,
  RefreshMutationVariables
>;

/**
 * __useRefreshMutation__
 *
 * To run a mutation, you first call `useRefreshMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshMutation, { data, loading, error }] = useRefreshMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<RefreshMutation, RefreshMutationVariables>,
) {
  return ApolloReactHooks.useMutation<RefreshMutation, RefreshMutationVariables>(
    RefreshDocument,
    baseOptions,
  );
}
export type RefreshMutationHookResult = ReturnType<typeof useRefreshMutation>;
export type RefreshMutationResult = ApolloReactCommon.MutationResult<RefreshMutation>;
export type RefreshMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RefreshMutation,
  RefreshMutationVariables
>;
export const LoginDocument = gql`
  mutation login($email: String!, $password: String!, $rememberMe: Boolean) {
    login(email: $email, password: $password, rememberMe: $rememberMe)
  }
`;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      rememberMe: // value for 'rememberMe'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>,
) {
  return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    baseOptions,
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const RegisterDocument = gql`
  mutation register($email: String!, $password: String!) {
    createUser(email: $email, password: $password)
  }
`;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>,
) {
  return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    baseOptions,
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const LogoutDocument = gql`
  mutation logout {
    logout
  }
`;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>,
) {
  return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    baseOptions,
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const GetAllProjectsAndTodosDocument = gql`
  query getAllProjectsAndTodos {
    defaultProject {
      ...ProjectFields
    }
    projects {
      ...ProjectFields
    }
  }
  ${ProjectFieldsFragmentDoc}
`;

/**
 * __useGetAllProjectsAndTodosQuery__
 *
 * To run a query within a React component, call `useGetAllProjectsAndTodosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllProjectsAndTodosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllProjectsAndTodosQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllProjectsAndTodosQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetAllProjectsAndTodosQuery,
    GetAllProjectsAndTodosQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetAllProjectsAndTodosQuery,
    GetAllProjectsAndTodosQueryVariables
  >(GetAllProjectsAndTodosDocument, baseOptions);
}
export function useGetAllProjectsAndTodosLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetAllProjectsAndTodosQuery,
    GetAllProjectsAndTodosQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetAllProjectsAndTodosQuery,
    GetAllProjectsAndTodosQueryVariables
  >(GetAllProjectsAndTodosDocument, baseOptions);
}
export type GetAllProjectsAndTodosQueryHookResult = ReturnType<
  typeof useGetAllProjectsAndTodosQuery
>;
export type GetAllProjectsAndTodosLazyQueryHookResult = ReturnType<
  typeof useGetAllProjectsAndTodosLazyQuery
>;
export type GetAllProjectsAndTodosQueryResult = ApolloReactCommon.QueryResult<
  GetAllProjectsAndTodosQuery,
  GetAllProjectsAndTodosQueryVariables
>;
export const UpdateTodoDocument = gql`
  mutation updateTodo($id: ID!, $name: String, $completed: Boolean, $description: String) {
    updateTodo(
      id: $id
      options: { completed: $completed, name: $name, description: $description }
    ) {
      ...TodoFields
    }
  }
  ${TodoFieldsFragmentDoc}
`;
export type UpdateTodoMutationFn = ApolloReactCommon.MutationFunction<
  UpdateTodoMutation,
  UpdateTodoMutationVariables
>;

/**
 * __useUpdateTodoMutation__
 *
 * To run a mutation, you first call `useUpdateTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTodoMutation, { data, loading, error }] = useUpdateTodoMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      completed: // value for 'completed'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateTodoMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateTodoMutation,
    UpdateTodoMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<UpdateTodoMutation, UpdateTodoMutationVariables>(
    UpdateTodoDocument,
    baseOptions,
  );
}
export type UpdateTodoMutationHookResult = ReturnType<typeof useUpdateTodoMutation>;
export type UpdateTodoMutationResult = ApolloReactCommon.MutationResult<UpdateTodoMutation>;
export type UpdateTodoMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateTodoMutation,
  UpdateTodoMutationVariables
>;
export const CreateTodoDocument = gql`
  mutation createTodo($projectId: ID!, $name: String!, $description: String, $completed: Boolean!) {
    createTodo(
      project: $projectId
      options: { name: $name, description: $description, completed: $completed }
    ) {
      id
      name
      description
      completed
    }
  }
`;
export type CreateTodoMutationFn = ApolloReactCommon.MutationFunction<
  CreateTodoMutation,
  CreateTodoMutationVariables
>;

/**
 * __useCreateTodoMutation__
 *
 * To run a mutation, you first call `useCreateTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTodoMutation, { data, loading, error }] = useCreateTodoMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      completed: // value for 'completed'
 *   },
 * });
 */
export function useCreateTodoMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateTodoMutation,
    CreateTodoMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<CreateTodoMutation, CreateTodoMutationVariables>(
    CreateTodoDocument,
    baseOptions,
  );
}
export type CreateTodoMutationHookResult = ReturnType<typeof useCreateTodoMutation>;
export type CreateTodoMutationResult = ApolloReactCommon.MutationResult<CreateTodoMutation>;
export type CreateTodoMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateTodoMutation,
  CreateTodoMutationVariables
>;
export const DeleteTodoDocument = gql`
  mutation deleteTodo($todoId: ID!) {
    deleteTodo(id: $todoId) {
      id
    }
  }
`;
export type DeleteTodoMutationFn = ApolloReactCommon.MutationFunction<
  DeleteTodoMutation,
  DeleteTodoMutationVariables
>;

/**
 * __useDeleteTodoMutation__
 *
 * To run a mutation, you first call `useDeleteTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTodoMutation, { data, loading, error }] = useDeleteTodoMutation({
 *   variables: {
 *      todoId: // value for 'todoId'
 *   },
 * });
 */
export function useDeleteTodoMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteTodoMutation,
    DeleteTodoMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<DeleteTodoMutation, DeleteTodoMutationVariables>(
    DeleteTodoDocument,
    baseOptions,
  );
}
export type DeleteTodoMutationHookResult = ReturnType<typeof useDeleteTodoMutation>;
export type DeleteTodoMutationResult = ApolloReactCommon.MutationResult<DeleteTodoMutation>;
export type DeleteTodoMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeleteTodoMutation,
  DeleteTodoMutationVariables
>;
