#!/usr/bin/env node
/**
 * Sync Ralph PRD progress to Supabase
 *
 * Usage: node sync-to-supabase.mjs
 * Or:    watch -n 5 'node sync-to-supabase.mjs'
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PROJECT_DIR = 'squads/copy/projects/copy-v2-upgrade';
const PRD_FILE = path.resolve(__dirname, 'prd.json');

async function syncProject() {
  // Read local PRD
  const prdContent = JSON.parse(fs.readFileSync(PRD_FILE, 'utf-8'));
  const stories = prdContent.userStories || [];
  const total = stories.length;
  const completed = stories.filter(s => s.passes === true).length;
  const pending = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  console.log(`\n📊 PRD Status: ${completed}/${total} (${percent}%)`);
  console.log(`   ✅ Completed: ${completed}`);
  console.log(`   ⏳ Pending: ${pending}`);

  // Check if project exists
  const { data: existing } = await supabase
    .from('ralph_projects')
    .select('id')
    .eq('project_dir', PROJECT_DIR)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('ralph_projects')
      .update({
        stories_total: total,
        stories_completed: completed,
        last_status: completed === total ? 'completed' : 'running',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) {
      console.error('❌ Update error:', error.message);
    } else {
      console.log(`✅ Updated project in Supabase (ID: ${existing.id})`);
    }
  } else {
    // Create new
    const { data, error } = await supabase
      .from('ralph_projects')
      .insert({
        name: prdContent.project || 'Copy Framework v2 Upgrade',
        project_dir: PROJECT_DIR,
        prd_file: `${PROJECT_DIR}/prd.json`,
        stories_total: total,
        stories_completed: completed,
        last_status: 'running',
        project_metadata: { mode: 'research' },
      })
      .select('id')
      .single();

    if (error) {
      console.error('❌ Insert error:', error.message);
    } else {
      console.log(`✅ Created project in Supabase (ID: ${data?.id})`);
    }
  }

  // Show recently completed
  const recentlyCompleted = stories.filter(s => s.passes).slice(-5);
  if (recentlyCompleted.length > 0) {
    console.log('\n🏆 Recently Completed:');
    recentlyCompleted.forEach(s => console.log(`   ✓ ${s.id}: ${s.title}`));
  }

  // Show next pending
  const nextPending = stories.filter(s => !s.passes).slice(0, 5);
  if (nextPending.length > 0) {
    console.log('\n📋 Next Pending:');
    nextPending.forEach(s => console.log(`   ⏳ ${s.id}: ${s.title}`));
  }

  console.log(`\n⏰ Synced at: ${new Date().toLocaleTimeString()}`);
}

syncProject().catch(console.error);
