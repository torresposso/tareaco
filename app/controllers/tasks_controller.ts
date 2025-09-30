import type { HttpContext } from '@adonisjs/core/http';
import Task from '#models/task';
import Project from '#models/project';

export default class TasksController {
  public async index({ view, params, auth }: HttpContext) {
    const user = auth.user!;
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('tasks')
      .firstOrFail();

    return view.render('pages/tasks/index', { project });
  }

  public async create({ view, params, auth }: HttpContext) {
    const user = auth.user!;
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail();

    return view.render('pages/tasks/create', { project });
  }

  public async store({ request, response, params, auth, session }: HttpContext) {
    const user = auth.user!;
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail();

    const data = request.only(['title', 'description']);

    try {
      await Task.create({
        ...data,
        completed: false,
        projectId: project.id,
      });

      session.flash('success', 'Task created successfully!');
      return response.redirect().toRoute('projects.tasks.index', { id: project.id });
    } catch (error) {
      session.flash('error', 'Failed to create task. Please try again.');
      return response.redirect().back();
    }
  }

  public async show({ view, params, auth }: HttpContext) {
    const user = auth.user!;
    const task = await Task.query()
      .where('id', params.taskId)
      .whereHas('project', (query) => {
        query.where('userId', user.id);
      })
      .preload('project')
      .firstOrFail();

    return view.render('pages/tasks/show', { task });
  }

  public async edit({ view, params, auth }: HttpContext) {
    const user = auth.user!;
    const task = await Task.query()
      .where('id', params.taskId)
      .whereHas('project', (query) => {
        query.where('userId', user.id);
      })
      .preload('project')
      .firstOrFail();

    return view.render('pages/tasks/edit', { task });
  }

  public async update({ request, response, params, auth, session }: HttpContext) {
    const user = auth.user!;
    const task = await Task.query()
      .where('id', params.taskId)
      .whereHas('project', (query) => {
        query.where('userId', user.id);
      })
      .preload('project')
      .firstOrFail();

    const data = request.only(['title', 'description', 'completed']);

    try {
      task.merge(data);
      await task.save();

      session.flash('success', 'Task updated successfully!');
      return response.redirect().toRoute('projects.tasks.show', {
        id: task.project.id,
        taskId: task.id,
      });
    } catch (error) {
      session.flash('error', 'Failed to update task. Please try again.');
      return response.redirect().back();
    }
  }

  public async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!;
    const task = await Task.query()
      .where('id', params.taskId)
      .whereHas('project', (query) => {
        query.where('userId', user.id);
      })
      .preload('project')
      .firstOrFail();

    try {
      await task.delete();

      session.flash('success', 'Task deleted successfully!');
      return response.redirect().toRoute('projects.tasks.index', { id: task.project.id });
    } catch (error) {
      session.flash('error', 'Failed to delete task. Please try again.');
      return response.redirect().back();
    }
  }

  public async toggle({ params, response, auth, session }: HttpContext) {
    const user = auth.user!;
    const task = await Task.query()
      .where('id', params.taskId)
      .whereHas('project', (query) => {
        query.where('userId', user.id);
      })
      .firstOrFail();

    try {
      task.completed = !task.completed;
      await task.save();

      const status = task.completed ? 'completed' : 'pending';
      session.flash('success', `Task marked as ${status}!`);
      return response.redirect().back();
    } catch (error) {
      session.flash('error', 'Failed to update task status. Please try again.');
      return response.redirect().back();
    }
  }
}
