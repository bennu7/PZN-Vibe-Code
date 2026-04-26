import { Elysia, t } from 'elysia';
import { registerUser } from '../services/users-service';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const usersRoute = new Elysia()
  .post('/api/users', async ({ body, set }) => {
    try {
      const { name, email, password } = body;

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
