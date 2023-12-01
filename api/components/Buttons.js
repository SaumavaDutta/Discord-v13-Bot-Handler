'use strict';

const { RangeError } = require(`${process.cwd()}/api/errors`);
const { Util, Constants, BaseMessageComponent } = require('discord.js');
const { MessageButtonStyles, MessageComponentTypes } = Constants;
class MessageButton extends BaseMessageComponent {

  constructor(data = {}) {
    super({ type: 'BUTTON' });

    this.setup(data);
  }

  setup(data) {
    this.label = data.label ?? null;

    this.customId = data.custom_id ?? data.customId ?? null;

    this.style = data.style ? MessageButton.resolveStyle(data.style) : null;

    this.emoji = data.emoji ? Util.resolvePartialEmoji(data.emoji) : null;

    this.url = data.url ?? null;

    this.disabled = data.disabled ?? false;
  }

  setCustomId(customId) {
    this.customId = Util.verifyString(customId, RangeError, 'BUTTON_CUSTOM_ID');
    return this;
  }

  setDisabled(disabled = true) {
    this.disabled = disabled;
    return this;
  }

  setEmoji(emoji) {
    this.emoji = Util.resolvePartialEmoji(emoji);
    return this;
  }

  setLabel(label) {
    this.label = Util.verifyString(label, RangeError, 'BUTTON_LABEL');
    return this;
  }

  setStyle(style) {
    this.style = MessageButton.resolveStyle(style);
    return this;
  }

  setURL(url) {
    this.url = Util.verifyString(url, RangeError, 'BUTTON_URL');
    return this;
  }

  toJSON() {
    return {
      custom_id: this.customId,
      disabled: this.disabled,
      emoji: this.emoji,
      label: this.label,
      style: MessageButtonStyles[this.style],
      type: MessageComponentTypes[this.type],
      url: this.url,
    };
  }

  static resolveStyle(style) {
    return typeof style === 'string' ? style : MessageButtonStyles[style];
  }
}

module.exports = MessageButton;

/* Made
*  By
*  Discord Id - Saumava (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/

