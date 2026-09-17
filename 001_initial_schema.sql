-- ==============================================================================
-- MANARILA Autonomous Management OS
-- Schema Migration: 001_initial_schema.sql
-- Compatible with PostgreSQL 15+ and Supabase (with pgvector extension)
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Clean Existing Tables
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS agent_tasks CASCADE;
DROP TABLE IF EXISTS service_improvement_proposals CASCADE;
DROP TABLE IF EXISTS reflection_logs CASCADE;
DROP TABLE IF EXISTS kpi_records CASCADE;
DROP TABLE IF EXISTS kpi_definitions CASCADE;
DROP TABLE IF EXISTS standard_processes CASCADE;
DROP TABLE IF EXISTS business_canvases CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- 3. Organizations (Tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Users (Members & Admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'coach', 'member')),
    line_user_id VARCHAR(100) UNIQUE,
    slack_user_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_line_user_id ON users(line_user_id);
CREATE INDEX idx_users_organization_id ON users(organization_id);

-- 5. Business Canvases (調和ビジネスキャンバス: L1)
CREATE TABLE business_canvases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    vision TEXT NOT NULL, -- 理念・ゴール
    target_customer TEXT NOT NULL, -- 顧客像
    core_value TEXT NOT NULL, -- 提供価値
    core_activities TEXT NOT NULL, -- 活動
    resources_human JSONB NOT NULL DEFAULT '{}'::jsonb, -- ヒト（4大力量：構造設計力、対話力、運用力、固有知識）
    resources_material JSONB NOT NULL DEFAULT '{}'::jsonb, -- モノ（IT、ツール、環境）
    guiding_principles TEXT NOT NULL, -- 判断軸（誠実さ、謙虚さ、違和感を放置しない等）
    revenue_model TEXT NOT NULL, -- 収益
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_canvases_org_active ON business_canvases(organization_id, is_active);

-- 6. Standard Processes (プロセスマップ & フロー: L2/L4)
CREATE TABLE standard_processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    process_type VARCHAR(50) NOT NULL CHECK (process_type IN ('governance', 'sales', 'development', 'delivery')),
    step_number NUMERIC(4,1) NOT NULL, -- 1.0, 2.0, etc.
    step_name VARCHAR(255) NOT NULL,
    input_data TEXT NOT NULL,
    activity_description TEXT NOT NULL,
    output_data TEXT NOT NULL,
    record_format VARCHAR(255) NOT NULL, -- 記録・書式
    record_id_ref VARCHAR(50), -- R01, R02, etc. (第2層記録定義)
    required_competencies VARCHAR(255) NOT NULL, -- 必要力量
    executor VARCHAR(50) NOT NULL DEFAULT 'human_ai' CHECK (executor IN ('human', 'ai', 'human_ai')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uq_org_process_step ON standard_processes(organization_id, process_type, step_number);

-- 7. KPI Definitions (理念KPI & プロセスKPI定義: L3)
CREATE TABLE kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('vision_harmony', 'vision_wisdom', 'process_lead', 'process_lag')),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) NOT NULL DEFAULT '件',
    target_value NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. KPI Records (理念KPI実績ログ)
CREATE TABLE kpi_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    kpi_definition_id UUID NOT NULL REFERENCES kpi_definitions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    value NUMERIC(12,2) NOT NULL DEFAULT 1.0,
    context_note TEXT,
    source_reference_id UUID,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kpi_records_org ON kpi_records(organization_id, recorded_at);

-- 9. Reflection Logs (循環ログ・違和感・気づき: L3)
CREATE TABLE reflection_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    process_type VARCHAR(50) NOT NULL CHECK (process_type IN ('governance', 'sales', 'development', 'delivery', 'unclassified')),
    raw_user_input TEXT NOT NULL,
    insight TEXT NOT NULL, -- 違和感・気づき
    competency VARCHAR(100), -- 発揮力量
    next_experiment TEXT NOT NULL, -- 次の実験・改善アクション
    kpi_category VARCHAR(50), -- vision_harmony, vision_wisdom, none
    ai_feedback TEXT, -- AIコーチの一言メモ
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'experimenting', 'resolved', 'converted_to_wisdom')),
    embedding vector(1536), -- OpenAI / text-embedding-3-small (or 768 for Gemini)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reflection_org_status ON reflection_logs(organization_id, status);

-- 10. Service Improvement Proposals (開発プロセス自動起票: L2開発自走)
CREATE TABLE service_improvement_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    source_reflection_id UUID REFERENCES reflection_logs(id) ON DELETE SET NULL,
    target_process VARCHAR(50) NOT NULL,
    step_number NUMERIC(4,1),
    issue_summary TEXT NOT NULL,
    proposed_diff TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_human_review' CHECK (status IN ('pending_human_review', 'approved', 'rejected', 'deployed')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Agent Tasks & Orchestration (自律エージェント間連携)
CREATE TABLE agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('governance_agent', 'sales_agent', 'delivery_agent', 'dev_agent')),
    task_name VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'waiting_human')),
    result JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_agent_tasks_queue ON agent_tasks(organization_id, agent_type, status);

-- 12. Audit Logs (改ざん不能な監査証跡)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_type VARCHAR(50) NOT NULL CHECK (actor_type IN ('human', 'agent', 'system')),
    actor_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
