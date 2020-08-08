describe('Project resolver', () => {
  // create multiple users to ensure that todo are for only current user!

  describe('todos', () => {
    it.todo('returns todos for a project');
    it.todo('shows error message if not authenticated');
  });
  describe('projects', () => {
    it.todo('returns all projects and their todos');
    it.todo('shows error message if not authenticated');
  });
  describe('defaultProject', () => {
    it.todo("returns the default project and it's todos for the user");
    it.todo('shows error message if not authenticated');
  });
  describe('createProject', () => {
    it.todo('creates a project');
    it.todo('shows error message if not authenticated');
  });
  describe('deleteProject', () => {
    it.todo('deletes a project');
    it.todo('shows error message if trying to delete the default project');
    it.todo('shows error message if not authenticated');
  });
});
