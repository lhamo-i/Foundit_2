// Everything about "who is logged in".
// It uses local demo data now. In Stage 3 each function below is replaced by the
// matching Firebase Auth call (signInWithEmailAndPassword, createUserWithEmailAndPassword,
// sendPasswordResetEmail, updatePassword, signOut). The screens do not need to change
// because they only use these functions.
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SEED_USERS } from '../data/seed';
import { CAMPUS_EMAIL_DOMAIN } from '../data/constants';
import { uid } from '../utils/format';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(SEED_USERS);
  const [userId, setUserId] = useState(null);
  const [initializing, setInitializing] = useState(true); // true while the splash screen shows

  useEffect(() => {
    const t = setTimeout(() => setInitializing(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const user = users.find((u) => u.id === userId) || null;
  const getUserById = (id) => users.find((u) => u.id === id) || { id, name: 'Unknown user', studentId: '' };

  const login = async (studentId, password) => {
    await wait(500);
    const found = users.find((u) => u.studentId === studentId.trim());
    if (!found || found.password !== password) {
      return { ok: false, error: 'Incorrect student / staff ID or password.' };
    }
    setUserId(found.id);
    return { ok: true };
  };

  const register = async ({ name, studentId, email, password }) => {
    await wait(500);
    if (users.some((u) => u.studentId === studentId)) {
      return { ok: false, error: 'An account with this student / staff ID already exists.' };
    }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: uid('u'), name, studentId, email, password,
      phone: '', avatarUri: null, points: 0, returns: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    setUserId(newUser.id);
    return { ok: true };
  };

  const logout = () => setUserId(null);

  // Always says "sent" so we never reveal which emails have accounts.
  const resetPassword = async (email) => {
    await wait(500);
    if (!email.toLowerCase().endsWith('@' + CAMPUS_EMAIL_DOMAIN)) {
      return { ok: false, error: `Use your campus email (@${CAMPUS_EMAIL_DOMAIN}).` };
    }
    return { ok: true };
  };

  const updateProfile = async (changes) => {
    await wait(300);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...changes } : u)));
    return { ok: true };
  };

  const changePassword = async (oldPassword, newPassword) => {
    await wait(400);
    if (!user || user.password !== oldPassword) {
      return { ok: false, error: 'Your current password is incorrect.' };
    }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, password: newPassword } : u)));
    return { ok: true };
  };

  // Good Samaritan points: called when an item is returned
  const awardPoints = (id, points) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, points: u.points + points, returns: u.returns + 1 } : u))
    );
  };

  const value = {
    user, users, initializing, getUserById,
    login, register, logout, resetPassword, updateProfile, changePassword, awardPoints,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
