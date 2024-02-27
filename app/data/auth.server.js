import { prisma } from './database.server';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { createAccountAndUser } from '~/data/objects/Account.server.js';
import bcrypt from 'bcryptjs';

const SESSION_SECRET = process.env.SESSION_SECRET;

const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    secrets: [SESSION_SECRET],
    sameSite: 'lax',
    maxAge: 30 * 86400, // seconds
    httpOnly: true
  }
})

async function createUserSession(userId, redirectPath) {
  const session = await sessionStorage.getSession();
  session.set('userId', userId);
  return redirect(redirectPath, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    }
  })
}

export async function getUserIdFromSession(request) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  if (!userId) {
    return null;
  }
  return userId;
}

export async function getUserFromSession(request) {
  const userId = await getUserIdFromSession(request);
  if (!userId) {
    return null;
  }
  const user = await prisma.user.findFirst({
      where: { id: userId }
  });

  if (user) {
    const person = await prisma.person.findFirst({ where: { id: user.personId } });
    user.personExternalId = (person ? person.externalId : null);
    user.person = person;
    return user;
  }
  return null;
}

export async function destroyUserSession(request) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    }
  })
}

export async function requireAuthUser(request) {
  const user = await getUserFromSession(request);

  if (!user) {
    // Will not trigger an ErrorBoundary, but redirects user.
    throw redirect('/login');
  }

  return user;
}

export async function login({email, password}) {
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (!existingUser) {
    const error = new Error(
      'Unable to log in with the provided credentials.'
    );
    error.status = 401;
    throw error;
  }

  const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordCorrect) {
    const error = new Error(
      'Unable to log in with the provided credentials.'
    );
    error.status = 401;
    throw error;
  }

  // console.log('Logged in as User ID: ', existingUser.id);

  return createUserSession(existingUser.id, '/dashboard');
}

function isValidName(value) {
  return value && value.trim().length >= 0;
}

function isValidEmail(value) {
  return value && value.includes('@');
}

function isValidPassword(value) {
  return value && value.trim().length >= 8;
}

export function validateLogin(input) {
  let validationErrors = {};

  if (!isValidEmail(input.email)) {
    validationErrors.email = 'Invalid email address.'
  }

  if (!isValidPassword(input.password)) {
    validationErrors.password = 'Password must be at least 8 characters.'
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

export function validateRegister(input) {
  let validationErrors = {};

  if (!isValidName(input.name_first)) {
    validationErrors.name_first = 'First name is required.'
  }

  if (!isValidName(input.name_last)) {
    validationErrors.name_last = 'Last name is required.'
  }

  if (!isValidEmail(input.email)) {
    validationErrors.email = 'Invalid email address.'
  }

  if (!isValidPassword(input.password)) {
    validationErrors.password = 'Password must be at least 8 characters.'
  }

  if (input.password !== input.cpassword) {
    validationErrors.cpassword = 'Passwords must match.'
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

export async function register({ name_first, name_last, email, password }) {
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    const error = new Error(
      'The user already exists for this email address'
    );
    error.status = 422;
    throw error;
  }

  const args = { nameFirst: name_first, nameLast: name_last, email: email, password: password };
  const {user, personExternalId} = await createAccountAndUser(args);

  return createUserSession(user.id, '/dashboard');
}
