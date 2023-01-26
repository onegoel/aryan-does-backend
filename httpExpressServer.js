const express = require('express');
const app = express();
const PORT = 8001;
const legalKeys = ['task', 'isCompleted'];
app.use(express.json());

let tasksToDo = [
    {
        task: 'buy bread',
        id: 1,
        isComplete: false
    },
    {
        task: 'buy milk',
        id: 2,
        isComplete: true
    }
];

let idCounter = tasksToDo[tasksToDo.length - 1]['id'];

const keyChecker = (res, keys) => {
    keys.forEach(key => {
        if(!legalKeys.includes(key)) {
            res.sendStatus(400);
        }
    });
};

app.get('/', (res) => {
    res.send('this is a to-do api').status(200);
});

app.route('/tasks')
    .get((res) => {
        res.send(tasksToDo).status(200);
    })
    .post((req, res) => {
        const { body } = req;
        const keys = Object.keys(body);
        keyChecker(keys, res);
        idCounter += 1;
        const task = {
            ...body,
            id: idCounter,
            isComplete: false,
        };
        tasksToDo.push(task);
        res.send(tasksToDo);
    })
    .put((req, res) => {
        const { body } = req;
        const keys = Object.keys(body);
        keyChecker(keys, res);
        idCounter += 1;
        const todo = {
            ...body,
            id: idCounter,
            isComplete: false,
        };
        tasksToDo.push(todo);
        res.send(tasksToDo);
        res.end();
    });

// read one
app.route('/tasks/:id')
    .get((req, res) => {
        const { id: targetId } = req.params;
        const targetIndex = tasksToDo.findIndex(todo => todo.id == parseInt(targetId));
        if(targetIndex === -1) {
            return res.sendStatus(404);
        }
        res.send(tasksToDo.at(targetIndex)).status(200);
    })
    .put((req, res) => {
        const { id: targetId } = req.params;
        const { body } = req;
        const keys = Object.keys(body);
        keyChecker(keys, res);
        idCounter += 1;
        const todo = {
            ...body,
            id: idCounter,
            isComplete: false
        };
        const targetIndex = tasksToDo.findIndex(todo => todo['id'] === parseInt(targetId));
        tasksToDo[targetIndex] = todo;
        res.send(tasksToDo);
    })
    .patch((req, res) => {
        const { body } = req;
        const keys = Object.keys(body);
        keyChecker(keys, res);
        const { id: targetId } = req.params;
        const targetIndex = tasksToDo.findIndex(todo => todo['id'] === parseInt(targetId));
        keys.forEach((key) => {
            tasksToDo[targetIndex][key] = body[key];
            res.send(tasksToDo).status(200);
        });
    })
    .delete((req, res) => {
        const {id: targetId} = req.params;
        tasksToDo = tasksToDo.filter(todo => todo['id'] === parseInt(targetId));
        res.send(tasksToDo).status(200);
    });

app.route('/tasks/complete/:id')
    .patch((req, res) => {
        const { id: targetId } = req.params;
        const targetIndex = tasksToDo.findIndex(todo => todo['id'] === parseInt(targetId));
        tasksToDo.at(targetIndex)['isComplete'] = true;
        res.send(tasksToDo).status(200);
    });


app.listen(PORT, console.log(`Ok, ready on ${PORT}`));