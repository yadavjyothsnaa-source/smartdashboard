import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'analyst') {
      return NextResponse.json({ error: 'Unauthorized: Only Analysts can upload datasets.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('csv') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded. Please select a CSV file.' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a valid .csv file' }, { status: 400 });
    }

    // Safety: Handle large files (> 5MB limit for example)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Convert to buffer safely
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write the file to public/uploads
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

    // Trigger simulated ML prediction (inline refactored)
    const uploadId = uploaded.lastInsertRowid as number;
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

    db.prepare('INSERT INTO ml_predictions (user_id, upload_id, result) VALUES (?, ?, ?)')
      .run(session.userId, uploadId, result);

    db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)')
      .run(session.userId, `📊 ML Prediction complete! Trend: ${trend}, Confidence: ${confidence}%`);

    if (admin && anomalies > 0) {
      db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)')
        .run(admin.id, `⚠️ ${anomalies} Sales anomalies detected in latest dataset – review predictions.`);
    }

    revalidatePath('/dashboard');
    return NextResponse.json({ success: true, message: 'Upload complete!', fileName });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: 'Server error parsing CSV file. Please check console.' }, { status: 500 });
  }
}
