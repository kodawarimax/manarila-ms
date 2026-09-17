import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.MANARILA_DB_PATH || path.join(process.cwd(), 'manarila.db');

export function getDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  return db;
}

export function initSchema() {
  const db = getDb();
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      plan TEXT DEFAULT 'starter',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'owner',
      line_user_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS business_canvases (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      vision TEXT NOT NULL,
      target_customer TEXT NOT NULL,
      core_value TEXT NOT NULL,
      core_activities TEXT NOT NULL,
      resources_human TEXT NOT NULL,
      resources_material TEXT NOT NULL,
      guiding_principles TEXT NOT NULL,
      revenue_model TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS standard_processes (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      process_type TEXT NOT NULL,
      step_number REAL NOT NULL,
      step_name TEXT NOT NULL,
      input_data TEXT NOT NULL,
      activity_description TEXT NOT NULL,
      output_data TEXT NOT NULL,
      record_format TEXT NOT NULL,
      record_id_ref TEXT,
      required_competencies TEXT NOT NULL,
      executor TEXT DEFAULT 'human_ai',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS kpi_definitions (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      unit TEXT DEFAULT '件',
      target_value REAL DEFAULT 0,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS kpi_records (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      kpi_definition_id TEXT NOT NULL,
      user_id TEXT,
      value REAL DEFAULT 1.0,
      context_note TEXT,
      source_reference_id TEXT,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (kpi_definition_id) REFERENCES kpi_definitions(id)
    );

    CREATE TABLE IF NOT EXISTS reflection_logs (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      process_type TEXT NOT NULL,
      raw_user_input TEXT NOT NULL,
      insight TEXT NOT NULL,
      competency TEXT,
      next_experiment TEXT NOT NULL,
      kpi_category TEXT,
      ai_feedback TEXT,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS service_improvement_proposals (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      source_reflection_id TEXT,
      target_process TEXT NOT NULL,
      step_number REAL,
      issue_summary TEXT NOT NULL,
      proposed_diff TEXT NOT NULL,
      status TEXT DEFAULT 'pending_human_review',
      approved_by TEXT,
      approved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (source_reflection_id) REFERENCES reflection_logs(id)
    );
  `);

  return db;
}
