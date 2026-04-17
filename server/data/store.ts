import * as fs from 'fs';
import * as path from 'path';
import { randomBytes, pbkdf2 } from 'crypto';
import { length, digest } from '../config';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  salt: string;
  active: boolean;
  createdAt: string;
}

const DATA_FILE = path.join(__dirname, 'users.json');

function readUsers(): User[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch { /* corrupt file — start fresh */ }
  return [];
}

function writeUsers(users: User[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export function getAllUsers(): User[] {
  return readUsers();
}

export function findUserByEmail(email: string): User | undefined {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase() && u.active);
}

export function findUserByPhone(phone: string): User | undefined {
  const normalized = phone.replace(/[\s\-\(\)]/g, '');
  return readUsers().find(u => u.phone.replace(/[\s\-\(\)]/g, '') === normalized && u.active);
}

export function findUserByIdentifier(identifier: string): User | undefined {
  return findUserByEmail(identifier) || findUserByPhone(identifier);
}

export function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const s = salt || randomBytes(128).toString('base64');
  return new Promise((resolve, reject) => {
    pbkdf2(password, s, 10000, length, digest, (err, derivedKey) => {
      if (err) return reject(err);
      resolve({ hash: derivedKey.toString('hex'), salt: s });
    });
  });
}

export async function createUser(data: { name: string; email: string; phone: string; password: string }): Promise<User> {
  const users = readUsers();
  const { hash, salt } = await hashPassword(data.password);
  const user: User = {
    id: randomBytes(16).toString('hex'),
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: hash,
    salt,
    active: true,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  const { hash } = await hashPassword(password, user.salt);
  return hash === user.password;
}

// Seed admin user on first load
(async () => {
  const users = readUsers();
  if (users.length === 0) {
    const { hash, salt } = await hashPassword('admin123');
    const admin: User = {
      id: 'admin-001',
      name: 'Admin',
      email: 'admin@kree.org',
      phone: '+1234567890',
      password: hash,
      salt,
      active: true,
      createdAt: new Date().toISOString(),
    };
    writeUsers([admin]);
    console.log('Seeded admin user: admin@kree.org / admin123');
  }
})();
