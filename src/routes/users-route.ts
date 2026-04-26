import { Elysia, t } from 'elysia';
import { registerUser } from '../services/users-service';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const usersRoute = new Elysia()
  .post('/api/users', async ({ body, set }) => {
    try {
      const { name, email, password } = body as { name: string; email: string; password: string };

      if (!name || name.trim().length === 0) {
        set.status = 400;
        return { error: 'Name tidak boleh kosong' };
      }

      if (!email || !emailRegex.test(email)) {
        set.status = 400;
        return { error: 'Format email tidak valid' };
      }

      if (!password || password.length < 6) {
        set.status = 400;
        return { error: 'Password minimal 6 karakter' };
      }

      const result = await registerUser({ name: name.trim(), email: email.toLowerCase().trim(), password });
      set.status = 201;
      return result;
    } catch (error: any) {
      if (error.message === 'Email sudah terdaftar') {
        set.status = 400;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 }),
    })
  });