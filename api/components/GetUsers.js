async function getUser(client, userRawData, force = false) {
  const userObj = resolveUser(userRawData, client);
  if (userObj) {
    if (!force)
      return client.users.cache.get(userObj.id);
    else {
      try {
        return (await client.api.users(userObj.id).get().catch(() => undefined));
      } catch (error) {
        console.error(`Error fetching channel with ID ${userObj.id}:`, error);
        return null;
      }
    }
  }
  return null;
}

function resolveUser(user, client) {
  if (!user) return null;
  if (typeof user === 'object' && user.id)
    return user;
  else if (typeof user === 'string') {
    if (/^\d+$/.test(user))
      return { id: user };
    else
      return client.users.cache.find(g => g.username === user || g.tag === user) || null;
  }
  return null;
}

module.exports.getUser = getUser;

/* Made
*  By
*  Discord Id - ashton.gg (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/

