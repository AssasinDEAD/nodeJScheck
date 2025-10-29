const fetchJson = require('../index');
jest.setTimeout(10000);

test('fetchJson returns an object with id', async () => {
  const data = await fetchJson('https://jsonplaceholder.typicode.com/todos/1');
  expect(data).toBeDefined();
  expect(data).toHaveProperty('id', 1);
});
