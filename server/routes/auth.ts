import { Router, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { secret } from '../config';
import { findUserByIdentifier, createUser, verifyPassword } from '../data/store';

const authRouter: Router = Router();

// Check if a user exists by email or phone
authRouter.post('/check', async (req: Request, res: Response) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'identifier is required' });
  }
  const user = findUserByIdentifier(identifier);
  res.json({ exists: !!user });
});

// Sign up a new user
authRouter.post('/signup', async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  if (!email && !phone) {
    return res.status(400).json({ error: 'Email or phone is required' });
  }

  const existing = findUserByIdentifier(email || phone);
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }

  try {
    const user = await createUser({ name: name || '', email: email || '', phone: phone || '', password });
    const token = sign({ userId: user.id, email: user.email }, secret, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Log in an existing user
authRouter.post('/login', async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'identifier and password are required' });
  }

  const user = findUserByIdentifier(identifier);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const valid = await verifyPassword(user, password);
  if (!valid) {
    return res.json({ success: false, message: 'Wrong password' });
  }

  const token = sign({ userId: user.id, email: user.email }, secret, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

export { authRouter };
