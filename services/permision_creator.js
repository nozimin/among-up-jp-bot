const { AsyncNedb } = require('nedb-async')
var rolesDB         = new AsyncNedb({ filename: 'db/roles', autoload: true })

module.exports = {
  async kansenPermission(guild_id = 0) {
    let role = await rolesDB.asyncFindOne({ guild_id: guild_id, kind: 'kansen' })
    if (role === null) return null

    return {
      id: role.role_id, // user_id or role_id
      // allow: ['ADD_REACTIONS'], // 許可する権限
      deny: ['SPEAK'], // 許可しない権限
      type: 'role' // role or member
    }
  },
  async visitorPermission(guild_id = 0) {
    let role = await rolesDB.asyncFindOne({ guild_id: guild_id, kind: 'visitor' })
    if (role === null) return null

    return {
      id: role.role_id,
      deny: ['CONNECT', 'SEND_MESSAGES'],
      type: 'role'
    }
  },
}
