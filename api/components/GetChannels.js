const { getGuild } = require(`${process.cwd()}/api/components/GetGuilds.js`);

async function getChannel(client, channelRawData, force = false) {
  const channelObj = resolveChannel(channelRawData, client);
  if (channelObj) {
    if (!force)
      return client.channels.cache.get(channelObj.id);
    else {
      try {
        return (await client.api.channels(channelObj.id).get().catch(() => undefined));
      } catch (error) {
        console.error(`Error fetching channel with ID ${channelObj.id}:`, error);
        return null;
      }
    }
  }
  return null;
}

async function getChannels(client, guildId, force = false){
   const guildObj = await getGuild(client, guildId, force);
  if (guildObj) {
    if (!force)
      return [...client.guilds.cache.get(guildObj.id).channels.cache.values()];
    else {
      try {
        return (await client.api.guilds(guildObj.id).channels.get().catch(() => undefined));
      } catch (error) {
        console.error(`Unable to fetch channels:`, error);
        return null;
      }
    }
  }
  return null;
}

function resolveChannel(channel, client) {
  if (!channel) return null;
  if (typeof channel === 'object' && channel.id)
    return channel;
  else if (typeof channel === 'string') {
    if (/^\d+$/.test(channel))
      return { id: channel };
    else
      return client.channels.cache.find(ch => ch.name === channel) || null;
  }
  return null;
}

module.exports.getChannel = getChannel;
module.exports.getChannels = getChannels;

/* Made
*  By
*  Discord Id - Saumava (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
