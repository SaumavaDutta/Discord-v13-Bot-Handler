const { ActivityFlags } = require('discord-api-types/v10');
const { BitField } = require('discord.js');

class ActivityFlagsBitField extends BitField {
 constructor(){
    super();
    this.Flags = ActivityFlags;
 }
}

module.exports = ActivityFlagsBitField;

/* Made
*  By
*  Discord Id - Saumava (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
