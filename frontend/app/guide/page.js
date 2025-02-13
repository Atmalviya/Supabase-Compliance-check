'use client';
import { useAuth } from '../../lib/hooks/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import { RiGuideFill, RiDatabase2Line, RiFileCopyLine, RiCheckLine } from 'react-icons/ri';
import { useState } from 'react';
import { showToast } from '../../lib/utils/toast';

const setupSteps = [
  {
    title: 'Required Database Functions',
    icon: RiDatabase2Line,
    items: [
      {
        name: 'get_all_tables',
        description: 'Returns all tables in the public schema',
        code: `
CREATE OR REPLACE FUNCTION get_all_tables()
RETURNS TABLE (
  table_name text,
  schema_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::text,
    t.table_schema::text
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE';
END;
$$;`
      },
      {
        name: 'get_rls_status',
        description: 'Returns RLS status for all tables',
        code: `
CREATE OR REPLACE FUNCTION get_rls_status()
RETURNS TABLE (
  table_name text,
  rls_enabled boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.relname::text as table_name,
    c.relrowsecurity as rls_enabled
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
  AND c.relkind = 'r';  -- 'r' means regular table
END;
$$;`
      },
      {
        name: 'enable_rls_for_table',
        description: 'Enables RLS for a specific table and creates a default policy',
        code: `
CREATE OR REPLACE FUNCTION enable_rls_for_table(table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Enable RLS
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
  
  -- Drop existing policy if it exists
  BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "Enable access for authenticated users" ON %I', table_name);
  EXCEPTION WHEN others THEN
    -- Ignore errors if policy doesn't exist
    NULL;
  END;
  
  -- Create a default policy that allows all operations for authenticated users
  EXECUTE format(
    'CREATE POLICY "Enable access for authenticated users" ON %I
     FOR ALL
     TO authenticated
     USING (true)
     WITH CHECK (true)',
    table_name
  );
END;
$$;`
      },
      {
        name: 'enable_mfa_for_user',
        description: 'Enables MFA for a specific user',
        code: `
CREATE OR REPLACE FUNCTION enable_mfa_for_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Enable MFA for the user
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    '{"mfa_enabled": true}'::jsonb
  WHERE id = user_id;
END;
$$;`
      },
      {
        name: 'check_rls_status',
        description: 'Checks RLS status for a specific table',
        code: `
CREATE OR REPLACE FUNCTION check_rls_status(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_enabled boolean;
BEGIN
  SELECT c.relrowsecurity
  INTO is_enabled
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
  AND c.relname = table_name;
  
  RETURN COALESCE(is_enabled, false);
END;
$$;`
      },
      {
        name: 'get_pitr_status',
        description: 'Returns PITR status for all projects',
        code: `
CREATE OR REPLACE FUNCTION get_pitr_status()
RETURNS TABLE (
  project_id uuid,
  project_name text,
  pitr_enabled boolean,
  retention_period interval
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as project_id,
    p.name as project_name,
    p.pitr_enabled,
    p.retention_period
  FROM projects p
  WHERE p.deleted_at IS NULL;
END;
$$;`
      }
    ]
  }
];

export default function Guide() {
  const { isLoading } = useAuth();
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      showToast.success('Code copied to clipboard');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      showToast.error('Failed to copy code');
      console.error('Copy failed:', err);
    }
  };

  return (
    <DashboardLayout title="Setup Guide">
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <RiGuideFill className="h-10 w-10 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This guide provides all the required database functions that need to be created in your Supabase project.
                Log in to your Supabase project, go to the SQL editor and copy and execute these functions to enable all security features.
              </p>
            </div>
          </div>
        </div>

        {setupSteps.map((section, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="flex items-center mb-4">
              <section.icon className="h-6 w-6 text-indigo-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
            </div>

            {section.description && (
              <p className="text-gray-600 mb-4">{section.description}</p>
            )}

            {section.items && (
              <div className="space-y-6">
                {section.items.map((item, i) => (
                  <div key={i} className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="relative">
                      <button
                        onClick={() => handleCopy(item.code, i)}
                        className="absolute right-2 top-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === i ? (
                          <RiCheckLine className="w-5 h-5 text-green-400" />
                        ) : (
                          <RiFileCopyLine className="w-5 h-5 text-gray-300 hover:text-white" />
                        )}
                      </button>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <code>{item.code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
} 