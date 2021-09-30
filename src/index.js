const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const users = [];

function verifyExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({
      error: "User not found!",
    });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const user = users.find((user) => user.usename === username);

  if (user) {
    return response.status(400).json({ error: "User already exists!" });
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });
  return response.status(201).send();
});

app.get("/todos", verifyExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", verifyExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { user } = request;

  const newTodos = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodos);

  return response.status(201).json(user);
});

app.put("/todos/:id", verifyExistsUserAccount, (request, response) => {
  const { user } = request;

  const { id } = request.query;
  const { title, deadline } = request.body;

  const todo = [
    user.todos.map((newTodo) => {
      if (newTodo.id === id)
        return {
          ...newTodo,
          title: title,
          deadline: new Date(deadline),
        };
    }),
  ];

  console.log(todo);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found!" });
  }

  return response.json(todo);
});

app.patch("/todos/:id", verifyExistsUserAccount, (request, response) => {
  const { user } = request;

  const { id } = request.query;
  const { title, deadline } = request.body;

  const todo = user.todos.map((newTodo) => {
    if (newTodo.id === id)
      return {
        ...newTodo,
        done: true,
      };
  });

  console.log([todo]);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found!" });
  }

  return response.json(todo);
});

app.delete("/todos/:id", verifyExistsUserAccount, (request, response) => {
  const { user } = request;

  const { id } = request.query;

  const todo = user.todos.map((newTodo) => {
    return {
      ...newTodo,
    };
  });

  const indexTodo = todo.findIndex((indexTodo) => indexTodo.id === id);
  todo.splice(indexTodo, 1);

  return response.status(204).json(todo);
});

app.listen(8080);
