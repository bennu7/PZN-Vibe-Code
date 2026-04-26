import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const registerUser = async (payload: any) => {
  const { name, email, password } = payload;

  // 1. Cek apakah email sudah terdaftar
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    throw new Error('Email sudah terdaftar');
  }

  // 2. Hash password
  const hashedPassword = await Bun.password.hash(password);

  // 3. Simpan user baru
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: 'OK' };
};
