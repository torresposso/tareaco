import type { HttpContext } from '@adonisjs/core/http';
import Project from '#models/project';
import Task from '#models/task';

export default class DashboardController {
  public async index({ view, auth }: HttpContext) {
    const user = auth.user!;

    // Get user's projects with task counts
    const projects = await Project.query()
      .where('userId', user.id)
      .preload('tasks')
      .orderBy('createdAt', 'desc');

    // Get recent tasks across all projects
    const recentTasks = await Task.query()
      .whereHas('project', (query) => {
        query.where('userId', user.id);
      })
      .orderBy('createdAt', 'desc')
      .limit(10);

    // Calculate stats
    const totalProjects = projects.length;
    const totalTasks = await Task.query()
      .whereHas('project', (query) => {
        query.where('userId', user.id);
      })
      .count('* as total');

    const completedTasks = await Task.query()
      .whereHas('project', (query) => {
        query.where('userId', user.id);
      })
      .where('completed', true)
      .count('* as total');

    return view.render('pages/dashboard', {
      projects,
      recentTasks,
      stats: {
        totalProjects,
        totalTasks: totalTasks[0].$extras.total,
        completedTasks: completedTasks[0].$extras.total,
      },
    });
  }
}
