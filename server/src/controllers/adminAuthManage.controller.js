const { pool } = require('../config/db');
const { hashPassword } = require('../utils/hash');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách tài khoản Admin
 * Route: GET /api/admin/auth/admin
 */
async function getAdminUsers(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.username, a.nickname, a.room_id, a.avatar, a.email, a.status, a.memo, a.kefu_url,
             UNIX_TIMESTAMP(a.logintime) as logintime,
             UNIX_TIMESTAMP(a.created_at) as createtime,
             COALESCE(GROUP_CONCAT(g.name SEPARATOR ', '), 'Admin group') as groups_text
      FROM fa_admin a
      LEFT JOIN fa_auth_group_access ga ON a.id = ga.uid
      LEFT JOIN fa_auth_group g ON ga.group_id = g.id
      GROUP BY a.id
      ORDER BY a.id ASC
    `);

    return success(res, 'Lấy danh sách Admin thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thêm hoặc sửa tài khoản Admin
 * Route: POST /api/admin/auth/admin
 */
async function saveAdminUser(req, res) {
  try {
    const { id, username, nickname, password, email, room_id, kefu_url, memo, status = 'normal' } = req.body;

    if (!username || !username.trim()) {
      return error(res, 'Vui lòng nhập tên tài khoản admin');
    }

    if (id) {
      if (password && password.trim()) {
        const passHash = await hashPassword(password.trim());
        await pool.query(`
          UPDATE fa_admin 
          SET username = ?, nickname = ?, password = ?, email = ?, room_id = ?, kefu_url = ?, memo = ?, status = ?
          WHERE id = ?
        `, [username.trim(), nickname || '', passHash, email || null, room_id || null, kefu_url || null, memo || null, status, id]);
      } else {
        await pool.query(`
          UPDATE fa_admin 
          SET username = ?, nickname = ?, email = ?, room_id = ?, kefu_url = ?, memo = ?, status = ?
          WHERE id = ?
        `, [username.trim(), nickname || '', email || null, room_id || null, kefu_url || null, memo || null, status, id]);
      }
      return success(res, 'Cập nhật tài khoản Admin thành công');
    } else {
      if (!password || !password.trim()) {
        return error(res, 'Vui lòng nhập mật khẩu cho tài khoản mới');
      }
      const passHash = await hashPassword(password.trim());
      const [result] = await pool.query(`
        INSERT INTO fa_admin (username, nickname, password, email, room_id, kefu_url, memo, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [username.trim(), nickname || '', passHash, email || null, room_id || null, kefu_url || null, memo || null, status]);
      return success(res, 'Thêm tài khoản Admin thành công', { id: result.insertId });
    }
  } catch (err) {
    return error(res, 'Lưu tài khoản Admin thất bại: ' + err.message);
  }
}

/**
 * Xóa tài khoản Admin
 * Route: DELETE /api/admin/auth/admin/:id
 */
async function deleteAdminUser(req, res) {
  try {
    const { id } = req.params;
    if (Number(id) === 1) {
      return error(res, 'Không thể xóa tài khoản Super Admin mặc định (ID 1)');
    }
    await pool.query('DELETE FROM fa_admin WHERE id = ?', [id]);
    await pool.query('DELETE FROM fa_auth_group_access WHERE uid = ?', [id]);
    return success(res, 'Đã xóa tài khoản Admin thành công');
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Lấy danh sách nhóm quyền
 * Route: GET /api/admin/auth/group
 */
async function getAuthGroups(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT id, pid, name, rules, status,
             UNIX_TIMESTAMP(created_at) as createtime,
             UNIX_TIMESTAMP(updated_at) as updatetime
      FROM fa_auth_group
      ORDER BY id ASC
    `);
    return success(res, 'Lấy danh sách nhóm quyền thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thêm hoặc cập nhật nhóm quyền
 * Route: POST /api/admin/auth/group
 */
async function saveAuthGroup(req, res) {
  try {
    const { id, pid = 0, name, rules = '*', status = 'normal' } = req.body;
    if (!name || !name.trim()) {
      return error(res, 'Vui lòng nhập tên nhóm quyền');
    }

    if (id) {
      await pool.query(`
        UPDATE fa_auth_group 
        SET pid = ?, name = ?, rules = ?, status = ?, updated_at = NOW()
        WHERE id = ?
      `, [pid, name.trim(), rules, status, id]);
      return success(res, 'Cập nhật nhóm quyền thành công');
    } else {
      const [result] = await pool.query(`
        INSERT INTO fa_auth_group (pid, name, rules, status, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `, [pid, name.trim(), rules, status]);
      return success(res, 'Thêm nhóm quyền thành công', { id: result.insertId });
    }
  } catch (err) {
    return error(res, 'Lưu nhóm quyền thất bại: ' + err.message);
  }
}

/**
 * Xóa nhóm quyền
 * Route: DELETE /api/admin/auth/group/:id
 */
async function deleteAuthGroup(req, res) {
  try {
    const { id } = req.params;
    if (Number(id) === 1) {
      return error(res, 'Không thể xóa nhóm Admin mặc định');
    }
    await pool.query('DELETE FROM fa_auth_group WHERE id = ?', [id]);
    return success(res, 'Đã xóa nhóm quyền thành công');
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Lấy danh sách quy tắc menu (Rules)
 * Route: GET /api/admin/auth/rule
 */
async function getAuthRules(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT id, pid, name, title, icon, \`condition\`, remark, ismenu, weigh, status,
             UNIX_TIMESTAMP(created_at) as createtime,
             UNIX_TIMESTAMP(updated_at) as updatetime
      FROM fa_auth_rule
      ORDER BY weigh DESC, id ASC
    `);
    return success(res, 'Lấy danh sách quy tắc menu thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thêm hoặc sửa quy tắc menu
 * Route: POST /api/admin/auth/rule
 */
async function saveAuthRule(req, res) {
  try {
    const { id, pid = 0, name, title, icon = '', condition = '', remark = '', ismenu = 1, weigh = 0, status = 'normal' } = req.body;
    if (!name || !title) {
      return error(res, 'Vui lòng nhập tên và tiêu đề quy tắc');
    }

    if (id) {
      await pool.query(`
        UPDATE fa_auth_rule 
        SET pid = ?, name = ?, title = ?, icon = ?, \`condition\` = ?, remark = ?, ismenu = ?, weigh = ?, status = ?, updated_at = NOW()
        WHERE id = ?
      `, [pid, name.trim(), title.trim(), icon, condition, remark, ismenu, weigh, status, id]);
      return success(res, 'Cập nhật quy tắc menu thành công');
    } else {
      const [result] = await pool.query(`
        INSERT INTO fa_auth_rule (pid, name, title, icon, \`condition\`, remark, ismenu, weigh, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [pid, name.trim(), title.trim(), icon, condition, remark, ismenu, weigh, status]);
      return success(res, 'Thêm quy tắc menu thành công', { id: result.insertId });
    }
  } catch (err) {
    return error(res, 'Lưu quy tắc thất bại: ' + err.message);
  }
}

/**
 * Xóa quy tắc menu
 * Route: DELETE /api/admin/auth/rule/:id
 */
async function deleteAuthRule(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fa_auth_rule WHERE id = ?', [id]);
    return success(res, 'Đã xóa quy tắc thành công');
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Lấy nhật ký thao tác Admin
 * Route: GET /api/admin/auth/log
 */
async function getAdminLogs(req, res) {
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
    const [rows] = await pool.query(`
      SELECT id, admin_id, username, url, title, content, ip, useragent,
             UNIX_TIMESTAMP(created_at) as createtime
      FROM fa_admin_log
      ORDER BY id DESC
      LIMIT ?
    `, [limit]);

    return success(res, 'Lấy nhật ký Admin thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Xóa nhật ký Admin
 * Route: DELETE /api/admin/auth/log
 */
async function deleteAdminLogs(req, res) {
  try {
    const { ids } = req.body;
    if (Array.isArray(ids) && ids.length > 0) {
      await pool.query('DELETE FROM fa_admin_log WHERE id IN (?)', [ids]);
    } else {
      await pool.query('TRUNCATE TABLE fa_admin_log');
    }
    return success(res, 'Đã xóa nhật ký thành công');
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getAdminUsers,
  saveAdminUser,
  deleteAdminUser,
  getAuthGroups,
  saveAuthGroup,
  deleteAuthGroup,
  getAuthRules,
  saveAuthRule,
  deleteAuthRule,
  getAdminLogs,
  deleteAdminLogs,
};
