const express = require('express');
const userController = require('./controllers/userController');
const userRouter = require('./router/userRouter');
const categoriesRouter = require('./router/categoriesRouter');
const postRouter = require('./router/postRouter');

// ...

const app = express();

// não remova ou mova esse endpoint
app.get('/', (_request, response) => {
  response.send();
});

app.use(express.json());
app.use('/user', userRouter);
app.post('/login', userController.login);
app.use('/categories', categoriesRouter);
app.use('/post', postRouter);

// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
