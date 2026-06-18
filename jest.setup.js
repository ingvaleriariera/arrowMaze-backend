jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-' + Math.random().toString(36).substring(7),
  NIL: '00000000-0000-0000-0000-000000000000',
}));
