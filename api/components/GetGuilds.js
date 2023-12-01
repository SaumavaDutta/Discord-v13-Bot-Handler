async function getGuild(client, guildRawData, force = false) {
  const guildObj = resolveGuild(guildRawData, client);
  if (guildObj) {
    if (!force)
      return client.guilds.cache.get(guildObj.id);
    else {
      try {
        return (await client.api.guilds(guildObj.id).get().catch(() => undefined));
      } catch (error) {
        console.error(`Error fetching channel with ID ${guildObj.id}:`, error);
        return null;
      }
    }
  }
  return null;
}

async function getGuilds(client, force = false){
    if (!force)
      return [...client.guilds.cache.values()];
    else {
      try {
        return (await client.api.users('@me').guilds.get().catch(() => undefined));
      } catch (error) {
        console.error(`Unable to fetch guilds:`, error);
        return null;
      }
    }
}

function resolveGuild(guild, client) {
  if (!guild) return null;
  if (typeof guild === 'object' && guild.id)
    return guild;
  else if (typeof guild === 'string') {
    if (/^\d+$/.test(guild))
      return { id: guild };
    else
      return client.guilds.cache.find(g => g.name === guild) || null;
  }
  return null;
}

module.exports.getGuild = getGuild;
module.exports.getGuilds = getGuilds;

/* Made
*  By
*  Discord Id - Saumava (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/

