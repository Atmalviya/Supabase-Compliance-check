const express = require('express');
const router = express.Router();
const { rlsLogger, mfaLogger, pitrLogger } = require('../lib/logger');
const cors = require('cors');

router.get('/stats', async (req, res) => {
  try {
    const supabaseAdmin = req.supabaseAdmin;
    
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) throw userError;
  
    const mfaStats = {
      enabled: users.filter(user => user.app_metadata?.mfa_enabled).length,
      total: users.length
    };

    const mappedUsers = users.map(user => ({
      ...user,
      hasMFA: !!user.app_metadata?.mfa_enabled
    }));

    const { data: tables, error: tableError } = await supabaseAdmin.rpc(
      'get_all_tables'
    );
    if (tableError) throw tableError;

    const { data: rlsStatus, error: rlsError } = await supabaseAdmin.rpc(
      'get_rls_status'
    );
    if (rlsError) throw rlsError;

    const rlsStats = {
      enabled: rlsStatus?.filter(table => table.rls_enabled)?.length || 0,
      total: tables?.length || 0
    };

    const { data: pitrStatus, error: pitrError } = await supabaseAdmin.rpc(
      'get_pitr_status'
    );
    if (pitrError) throw pitrError;

    const pitrStats = {
      enabled: pitrStatus?.filter(project => project.pitr_enabled)?.length || 0,
      total: pitrStatus?.length || 0
    };

    rlsLogger.info(`RLS Status: ${rlsStats.enabled}/${rlsStats.total} tables enabled`);
    mfaLogger.info(`MFA Status: ${mfaStats.enabled}/${mfaStats.total} users enabled`);
    pitrLogger.info(`PITR Status: ${pitrStats.enabled}/${pitrStats.total} projects enabled`);

    return res.status(200).json({
      users: mappedUsers,
      rlsStatus,
      pitrStatus,
      stats: {
        mfa: mfaStats,
        rls: rlsStats,
        pitr: pitrStats
      }
    });
  } catch (error) {
    console.error('Error fetching security stats:', error);
    return res.status(500).json({ error: 'Failed to fetch security statistics' });
  }
});

router.post('/mfa/enable', async (req, res) => {
  const { userId } = req.body;
  try {
    const supabaseAdmin = req.supabaseAdmin;
    
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) throw userError;
    
    const userExists = users.some(u => u.id === userId);
    if (!userExists) {
      throw new Error(`User ${userId} not found`);
    }

    const { error } = await supabaseAdmin.rpc('enable_mfa_for_user', { 
      user_id: userId 
    });

    if (error) throw error;

    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (updateError) throw updateError;

    mfaLogger.info(`MFA enabled for user ${userId}`);
    return res.status(200).json({ 
      message: 'MFA enabled successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('MFA enable error:', error);
    mfaLogger.error(`Failed to enable MFA for user ${userId}: ${error.message}`);
    return res.status(500).json({ error: 'Failed to enable MFA' });
  }
});

router.options('/rls/enable', cors({
  origin: [
    'https://supabase-compliance-check.atmalviya.cloud',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

router.post('/rls/enable', async (req, res) => {
  const { tableId } = req.body;
  try {
    const supabaseAdmin = req.supabaseAdmin;
    
    const { data: tables, error: tableError } = await supabaseAdmin.rpc(
      'get_all_tables'
    );
    
    if (tableError) throw tableError;
    
    const tableExists = tables.some(t => t.table_name === tableId);
    if (!tableExists) {
      throw new Error(`Table ${tableId} not found`);
    }

    const { error } = await supabaseAdmin.rpc('enable_rls_for_table', { 
      table_name: tableId 
    });

    if (error) throw error;

    const { data: rlsStatus, error: rlsError } = await supabaseAdmin.rpc(
      'get_rls_status'
    );
    if (rlsError) throw rlsError;

    rlsLogger.info(`RLS enabled for table ${tableId}`);
    return res.status(200).json({ 
      message: 'RLS enabled successfully',
      rlsStatus 
    });
  } catch (error) {
    console.error('RLS enable error:', error);
    rlsLogger.error(`Failed to enable RLS for table ${tableId}: ${error.message}`);
    return res.status(500).json({ error: 'Failed to enable RLS' });
  }
});

router.post('/pitr/enable', async (req, res) => {
  const { projectId } = req.body;
  try {
    const supabaseAdmin = req.supabaseAdmin;
    
    const { error } = await supabaseAdmin
      .rpc('enable_pitr_for_project', { project_id: projectId });

    if (error) throw error;

    pitrLogger.info(`PITR enabled for project ${projectId}`);
    return res.status(200).json({ message: 'PITR enabled successfully' });
  } catch (error) {
    pitrLogger.error(`Failed to enable PITR for project ${projectId}: ${error.message}`);
    return res.status(500).json({ error: 'Failed to enable PITR' });
  }
});

module.exports = router; 