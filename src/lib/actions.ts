'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { Message, Notification, UploadedData, MlPrediction } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import path from 'path';
import fs from 'fs';

// ── CHAT ──────────────────────────────────────────────
export async function getMessages(): Promise<Message[]> {
  const db = getDb();
  const rows = db.prepare(`
    SELECT m.*, u.name AS sender_name
    FROM messages m
    JOIN users u ON u.id = m.sender_id
    ORDER BY m.timestamp ASC
    LIMIT 50
  `).all() as Message[];
  return rows;
}

export async function sendMessage(message: string) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const db = getDb();
  // Send to the first user with opposite role
  const otherRole = session.role === 'analyst' ? 'admin' : 'analyst';
  const recipient = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get(otherRole) as { id: number } | undefined;
  if (!recipient) return { error: 'No recipient found' };

  db.prepare('INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)')
    .run(session.userId, recipient.id, message);

  revalidatePath('/dashboard');
  return { success: true };
}

// ── NOTIFICATIONS ─────────────────────────────────────
export async function getNotifications(): Promise<Notification[]> {
  const session = await getSession();
  if (!session) return [];
  const db = getDb();
  return db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20')
    .all(session.userId) as Notification[];
}

export async function markNotificationRead(id: number) {
  const db = getDb();
  db.prepare('UPDATE notifications SET status = ? WHERE id = ?').run('read', id);
  revalidatePath('/dashboard');
}

// ── FILE UPLOAD ───────────────────────────────────────
export async function uploadCSV(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'analyst') return { error: 'Unauthorized' };

  const file = formData.get('csv') as File;
  if (!file || !file.name.endsWith('.csv')) return { error: 'Please upload a valid .csv file' };

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const db = getDb();
  const uploaded = db.prepare('INSERT INTO uploaded_data (user_id, file_name, file_path) VALUES (?, ?, ?)')
    .run(session.userId, fileName, `/uploads/${fileName}`);

  // Notify admin
  const admin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as { id: number } | undefined;
  if (admin) {
    db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)')
      .run(admin.id, `📥 New data uploaded: ${file.name}`);
  }
  // Trigger simulated ML prediction
  await runMlPrediction(session.userId, uploaded.lastInsertRowid as number);

  revalidatePath('/dashboard');
  return { success: true, fileName };
}

async function runMlPrediction(userId: number, uploadId: number) {
  // Simulated ML: Generate realistic-looking trend analysis
  const trends = ['upward', 'downward', 'stable', 'seasonal'];
  const trend = trends[Math.floor(Math.random() * trends.length)];
  const confidence = (Math.random() * 20 + 75).toFixed(1);
  const anomalies = Math.floor(Math.random() * 5);

  const result = JSON.stringify({
    trend,
    confidence: `${confidence}%`,
    anomalies_detected: anomalies,
    forecast_next_period: `${(Math.random() * 20 - 5).toFixed(1)}%`,
    model_used: 'Linear Regression + Anomaly Detection',
    generated_at: new Date().toISOString()
  });

  const db = getDb();
  db.prepare('INSERT INTO ml_predictions (user_id, upload_id, result) VALUES (?, ?, ?)')
    .run(userId, uploadId, result);

  // Notify analyst + admin
  db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)')
    .run(userId, `📊 ML Prediction complete! Trend: ${trend}, Confidence: ${confidence}%`);

  const admin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as { id: number } | undefined;
  if (admin && anomalies > 0) {
    db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)')
      .run(admin.id, `⚠️ ${anomalies} Sales anomalies detected in latest dataset – review predictions.`);
  }
}

// ── UPLOADS LIST ──────────────────────────────────────
export async function getUploads(): Promise<UploadedData[]> {
  const session = await getSession();
  if (!session) return [];
  const db = getDb();
  return db.prepare('SELECT * FROM uploaded_data WHERE user_id = ? ORDER BY upload_date DESC')
    .all(session.userId) as UploadedData[];
}

// ── ML PREDICTIONS LIST ───────────────────────────────
export async function getMlPredictions(): Promise<MlPrediction[]> {
  const session = await getSession();
  if (!session) return [];
  const db = getDb();
  return db.prepare('SELECT * FROM ml_predictions ORDER BY created_at DESC LIMIT 5')
    .all() as MlPrediction[];
}
