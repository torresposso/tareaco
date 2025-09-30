import type { HttpContext } from '@adonisjs/core/http';
import Project from '#models/project';

export default class ProjectsController {
  public async index({ view, auth }: HttpContext) {
    const user = auth.user!;

    const projects = await Project.query()
      .where('userId', user.id)
      .preload('tasks')
      .orderBy('createdAt', 'desc');

    return view.render('pages/projects/index', { projects });
  }

  public async create({ view }: HttpContext) {
    return view.render('pages/projects/create');
  }

  public async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!;
    const data = request.only(['name', 'description']);

    try {
      await Project.create({
        ...data,
        userId: user.id,
      });

      session.flash('success', 'Project created successfully!');
      return response.redirect().toRoute('projects.index');
    } catch (error) {
      session.flash('error', 'Failed to create project. Please try again.');
      return response.redirect().back();
    }
  }

  public async show({ view, params, auth }: HttpContext) {
    const user = auth.user!;
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('tasks')
      .firstOrFail();

    return view.render('pages/projects/show', { project });
  }

  public async edit({ view, params, auth }: HttpContext) {
    const user = auth.user!;
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail();

    return view.render('pages/projects/edit', { project });
  }

  public async update({ request, response, params, auth, session }: HttpContext) {
    const user = auth.user!;
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail();

    const data = request.only(['name', 'description']);

    try {
      project.merge(data);
      await project.save();

      session.flash('success', 'Project updated successfully!');
      return response.redirect().toRoute('projects.show', { id: project.id });
    } catch (error) {
      session.flash('error', 'Failed to update project. Please try again.');
      return response.redirect().back();
    }
  }

  public async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!;
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail();

    try {
      await project.delete();

      session.flash('success', 'Project deleted successfully!');
      return response.redirect().toRoute('projects.index');
    } catch (error) {
      session.flash('error', 'Failed to delete project. Please try again.');
      return response.redirect().back();
    }
  }
}
