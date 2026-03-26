-- Claude-builds Monitoring System — Initial Schema

-- 1. Hook Events
CREATE TABLE hook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_root text NOT NULL,
  event_date date NOT NULL,
  timestamp timestamptz NOT NULL,
  tool_name text NOT NULL,
  file_path text NOT NULL,
  prettier_result text CHECK (prettier_result IN ('pass', 'fail', 'skip')),
  eslint_result text CHECK (eslint_result IN ('pass', 'fail', 'skip')),
  typecheck_result text CHECK (typecheck_result IN ('pass', 'fail', 'skip')),
  test_result text CHECK (test_result IN ('pass', 'fail', 'skip')),
  all_pass boolean GENERATED ALWAYS AS (
    prettier_result = 'pass'
    AND eslint_result = 'pass'
    AND typecheck_result = 'pass'
    AND test_result = 'pass'
  ) STORED,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_hook_events_date ON hook_events (event_date DESC);
CREATE INDEX idx_hook_events_project_date ON hook_events (project_root, event_date DESC);
CREATE INDEX idx_hook_events_file ON hook_events (file_path, event_date DESC);

-- 2. Session Logs
CREATE TABLE session_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_root text NOT NULL,
  session_timestamp timestamptz NOT NULL,
  commits text[] DEFAULT '{}',
  uncommitted_files text[] DEFAULT '{}',
  staged_files text[] DEFAULT '{}',
  total_events integer DEFAULT 0,
  success_rate integer DEFAULT 0,
  ts_errors integer DEFAULT 0,
  raw_content text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (project_root, session_timestamp)
);

CREATE INDEX idx_session_logs_ts ON session_logs (session_timestamp DESC);

-- 3. Agent Messages
CREATE TABLE agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_root text NOT NULL,
  message_id text NOT NULL UNIQUE,
  timestamp timestamptz NOT NULL,
  from_agent text NOT NULL,
  to_agent text NOT NULL,
  message_type text NOT NULL,
  priority text NOT NULL,
  subject text NOT NULL,
  body text,
  context jsonb,
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_messages_agents ON agent_messages (from_agent, to_agent);
CREATE INDEX idx_messages_ts ON agent_messages (timestamp DESC);
CREATE INDEX idx_messages_unread ON agent_messages (status) WHERE status = 'unread';

-- 4. Hook Logs (snapshots)
CREATE TABLE hook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_root text NOT NULL,
  hook_name text NOT NULL,
  captured_at timestamptz NOT NULL,
  last_lines text,
  has_error boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 5. Daily Summaries
CREATE TABLE daily_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_root text NOT NULL,
  summary_date date NOT NULL,
  total_events integer DEFAULT 0,
  pass_count integer DEFAULT 0,
  fail_count integer DEFAULT 0,
  prettier_fail integer DEFAULT 0,
  eslint_fail integer DEFAULT 0,
  typecheck_fail integer DEFAULT 0,
  test_fail integer DEFAULT 0,
  success_rate numeric(5,2) DEFAULT 0,
  unique_files integer DEFAULT 0,
  session_count integer DEFAULT 0,
  message_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (project_root, summary_date)
);
