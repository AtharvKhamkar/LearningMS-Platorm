import { Permissions } from '@app/common/rbac/permissions';
import { RolePermissions } from '@app/common/rbac/role-permissions';
import { Roles } from '@app/common/rbac/roles';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

async function syncRBAC() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('🔄 Syncing roles...');
        for (const role of Object.values(Roles)) {
            await client.query(
                `
        INSERT INTO mst_roles (role_name)
        VALUES ($1)
        ON CONFLICT (role_name) DO NOTHING
        `,
                [role],
            );
        }

        console.log('🔄 Syncing permissions...');
        for (const permission of Object.values(Permissions)) {
            await client.query(
                `
        INSERT INTO mst_permissions (permission_key)
        VALUES ($1)
        ON CONFLICT (permission_key) DO NOTHING
        `,
                [permission],
            );
        }

        console.log('🔄 Syncing role-permission mappings...');
        for (const [roleKey, permissions] of Object.entries(RolePermissions)) {
            for (const permissionKey of permissions) {
                await client.query(
                    `
          INSERT INTO mst_role_permissions (role_id, permission_id)
          SELECT r.role_id, p.permission_id
          FROM mst_roles r, mst_permissions p
          WHERE r.role_name = $1
            AND p.permission_key = $2
          ON CONFLICT DO NOTHING
          `,
                    [roleKey, permissionKey],
                );
            }
        }

        await client.query('COMMIT');
        console.log('✅ RBAC sync completed successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ RBAC sync failed', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

syncRBAC();
