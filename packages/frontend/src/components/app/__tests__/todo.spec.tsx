import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import { ProjectFieldsFragment } from '../../../generated/types-and-hooks';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const fakeDefaultProject: ProjectFieldsFragment = {
  id: '1',
  name: 'Default Project',
  color: '#ff4',
  todos: [
    {
      id: '1',
      name: 'First todo',
      completed: false,
    },
    {
      id: '2',
      name: 'second todo',
      completed: true,
      description: 'Such tech, much wow.',
    },
  ],
};

const fakeProject: ProjectFieldsFragment = {
  id: '2',
  name: 'New Project',
  color: '#0ff',
  todos: [
    {
      id: '1',
      name: 'third todo',
      completed: false,
    },
    {
      id: '2',
      name: 'fourth todo',
      completed: true,
    },
  ],
};

describe('Todo page', () => {
  beforeEach(() => {
    server.use(
      graphql.query('getAllProjectsAndTodos', (req, res, ctx) => {
        res(
          ctx.data({
            defaultProject: [fakeDefaultProject],
            projects: [fakeProject],
          }),
        );
      }),
    );
  });
  it.todo('creates a todo');
  it.todo('checks/unchecks a todo');
  it.todo('opens a edit dialog');
  describe('dialog', () => {
    it.todo('can change the todo name');
  });
});
