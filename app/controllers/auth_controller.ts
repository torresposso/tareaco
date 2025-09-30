import User from '#models/user';
import type { HttpContext } from '@adonisjs/core/http';

export default class AuthController {
  public async redirect({ ally }: HttpContext) {
    return ally.use('google').redirect();
  }
  public async callback({ ally, response, view, auth }: HttpContext) {
    const google = ally.use('google');

    try {
      if (google.accessDenied()) {
        return view.render('pages/login', { error: 'Access was denied.' });
      }

      if (google.hasError()) {
        return view.render('pages/login', { error: google.getError() });
      }

      const { name, email, avatarUrl, id: providerId } = await google.user();

      const user = await User.firstOrCreate(
        {
          email,
        },
        {
          name,
          avatarUrl,
          providerId,
        },
      );

      await auth.use('web').login(user);

      return response.redirect('/dashboard');
    } catch (error) {
      console.error('OAuth Callback Error:', error);

      return view.render('pages/login', { error: 'An unexpected error occurred.' });
    }
  }

  public async login({ view }: HttpContext) {
    return view.render('pages/login');
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout();
    return response.redirect('/');
  }
}
