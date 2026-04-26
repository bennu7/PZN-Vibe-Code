import { Elysia } from 'elysia';
import { db } from './db';
import { users } from './db/schema';
import { usersRoute } from './routes/users-route';

const app = new Elysia()
  .use(usersRoute)
  .get('/', () => 'Hello Elysia with Bun, Drizzle and MySQL!')
  .get('/users', async () => {
    try {
      // Note: This requires a working MySQL connection to succeed
      const allUsers = await db.select().from(users);
      return allUsers;
    } catch (error) {
      return { error: 'Database connection failed. Please check your .env configuration.' };
    }
  })
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
