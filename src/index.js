const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const users = [];

function verifyExistsUserAccount(request, response, next) {

    const { username } = request.headers;

    const user = users.find((user) => user.username === username);

    if(!user){
        return response.status(400).json({
            error: "User not found!"
        });
    }

    request.user = user;

    return next();

}


app.post("/users", (request, response) => {
    const { name, username} = request.body;

    const user = users.find((user) => user.usename === username);

    if(user){
        return response.status(400).json({error: "User already exists!"});
    }

    users.push({
        id: uuidv4(),
        name,
        username,
        todos: []
    });
    return response.status(201).send();
})

app.get("/todos", verifyExistsUserAccount, (request, response) => {
    const { user } = request;

    return response.json(user.todos);
})

app.post("/todos", verifyExistsUserAccount, (request, response) => {
    const { title, deadline} = request.body;

    const { user } = request;

    const newTodos = {
        id: uuidv4(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    }

    user.todos.push(newTodos);

    return response.status(201).json(user);
    
})

app.put("/todos/:id", verifyExistsUserAccount, (request, response) => {
    const { user } = request;

    const id = request.query.params;

    const { title, deadline } = request.body;

    const { todo } = user.todos.find(todo => todo.id === id);

    console.log(todo.destructures);
/*
    const todo = user.todos[0].find(todo => todo.id === id);
    console.log(todo)

    if(!todo){
        return response.status(404).json({error: "todo not exists"})
    }

    todo.title = title;
    todo.deadline = deadline;

    return response.json(todo);*/
})

app.patch("/todos/:id/done",verifyExistsUserAccount, (request, response) => {
    const { user } = request;

    const id = request.params;

    const todo = user.todos.find(todo => todo.id == id);

    if(!todo){
        return response.status(404).json({error: "todo not exists"})
    }

    todo.done = true;

    return response.json(todo);
})

app.delete("/todos/:id", verifyExistsUserAccount, (request, response) => {
    const { user } = request;

    const id = request.params;

    const todoIndex = user.todos.findIndex(todo => todo.id == id);

    if(!todoIndex === -1) {
        return response.status(404).json({error: "Todo not exists"})
    }

    user.todo.splice(todoIndex, 1);

    return response.status(204).json(users);
    
})

app.listen(8080);