/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller');
const DashboardController = () => import('#controllers/dashboard_controller');
const ProjectsController = () => import('#controllers/projects_controller');
const TasksController = () => import('#controllers/tasks_controller');
import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

router
  .get('/', async (ctx) => {
    await ctx.auth.check();
    return ctx.view.render('pages/home');
  })
  .as('home');

// Authentication routes
router.get('/login', [AuthController, 'login']).as('login');
router.get('/logout', [AuthController, 'logout']).as('logout');
router.get('/google/redirect', [AuthController, 'redirect']).as('google_redirect');
router.get('/google/callback', [AuthController, 'callback']).as('google_callback');

// Dashboard route
router
  .get('/dashboard', [DashboardController, 'index'])
  .as('dashboard')
  .middleware(middleware.auth());

// Project CRUD routes
router.resource('projects', ProjectsController).use('*', middleware.auth());

// Task CRUD routes (nested under projects)
router
  .get('/projects/:id/tasks', [TasksController, 'index'])
  .as('projects.tasks.index')
  .middleware(middleware.auth());
router
  .get('/projects/:id/tasks/create', [TasksController, 'create'])
  .as('projects.tasks.create')
  .middleware(middleware.auth());
router
  .post('/projects/:id/tasks', [TasksController, 'store'])
  .as('projects.tasks.store')
  .middleware(middleware.auth());
router
  .get('/projects/:id/tasks/:taskId', [TasksController, 'show'])
  .as('projects.tasks.show')
  .middleware(middleware.auth());
router
  .get('/projects/:id/tasks/:taskId/edit', [TasksController, 'edit'])
  .as('projects.tasks.edit')
  .middleware(middleware.auth());
router
  .put('/projects/:id/tasks/:taskId', [TasksController, 'update'])
  .as('projects.tasks.update')
  .middleware(middleware.auth());
router
  .patch('/projects/:id/tasks/:taskId', [TasksController, 'update'])
  .as('projects.tasks.patch')
  .middleware(middleware.auth());
router
  .delete('/projects/:id/tasks/:taskId', [TasksController, 'destroy'])
  .as('projects.tasks.destroy')
  .middleware(middleware.auth());
router
  .patch('/projects/:id/tasks/:taskId/toggle', [TasksController, 'toggle'])
  .as('projects.tasks.toggle')
  .middleware(middleware.auth());
