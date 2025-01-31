const express = require("express");
const routes = express.Router();

const RegisterController = require('./../controllers/RegisterController');
const LoginController = require('./../controllers/login.controller');
const ProjectController = require('./../controllers/project.controller');
const TaskController = require('./../controllers/task.controller');
const auth = require('./../middleware/auth');

routes.get('/create', RegisterController.test);
routes.post('/store', RegisterController.store);
routes.post('/login', LoginController.login);

routes.post('/project/store', auth, ProjectController.store);
routes.post('/project/index', auth, ProjectController.index);
routes.post('/project/show', auth, ProjectController.show);
routes.post('/project/update', auth, ProjectController.update);
routes.post('/project/destroy', auth, ProjectController.destroy);

routes.get('/get-users', TaskController.getUsers);
routes.post('/task/store', auth, TaskController.store);
routes.post('/task/update/complete', auth, TaskController.updateComplete);
routes.post('/task/mine', auth, TaskController.myTasks);

module.exports = routes;