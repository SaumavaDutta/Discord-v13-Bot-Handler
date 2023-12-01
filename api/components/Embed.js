'use strict';

const process = require('process');
const { RangeError } = require(`${process.cwd()}/api/errors`);
const { Util } = require('discord.js');

class MessageEmbed {
  constructor(data = {}, skipValidation = false) {
    this.setup(data, skipValidation);
  }

  setup(data, skipValidation) {
    this.type = data.type || 'rich';
    this.title = data.title || null;
    this.description = data.description || null;
    this.url = data.url || null;
    this.color = 'color' in data ? Util.resolveColor(data.color) : null;
    this.timestamp = 'timestamp' in data ? new Date(data.timestamp).getTime() : null;

    this.fields = [];
    if (data.fields) {
      this.fields = skipValidation ? data.fields.map(Util.cloneObject) : this.constructor.normalizeFields(data.fields);
    }

    this.thumbnail = data.thumbnail
      ? {
          url: data.thumbnail.url,
          proxyURL: data.thumbnail.proxyURL || data.thumbnail.proxy_url,
          height: data.thumbnail.height,
          width: data.thumbnail.width,
        }
      : null;

    this.image = data.image
      ? {
          url: data.image.url,
          proxyURL: data.image.proxyURL || data.image.proxy_url,
          height: data.image.height,
          width: data.image.width,
        }
      : null;

    this.video = data.video
      ? {
          url: data.video.url,
          proxyURL: data.video.proxyURL || data.video.proxy_url,
          height: data.video.height,
          width: data.video.width,
        }
      : null;

    this.author = data.author
      ? {
          name: data.author.name,
          url: data.author.url,
          iconURL: data.author.iconURL || data.author.icon_url,
          proxyIconURL: data.author.proxyIconURL || data.author.proxy_icon_url,
        }
      : null;

    this.provider = data.provider
      ? {
          name: data.provider.name,
          url: data.provider.url,
        }
      : null;

    this.footer = data.footer
      ? {
          text: data.footer.text,
          iconURL: data.footer.iconURL || data.footer.icon_url,
          proxyIconURL: data.footer.proxyIconURL || data.footer.proxy_icon_url,
        }
      : null;
  }

  get createdAt() {
    return this.timestamp ? new Date(this.timestamp) : null;
  }

  get hexColor() {
    return this.color ? `#${this.color.toString(16).padStart(6, '0')}` : null;
  }

  get length() {
    return (
      (this.title?.length || 0) +
      (this.description?.length || 0) +
      (this.fields.length >= 1
        ? this.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
        : 0) +
      (this.footer?.text.length || 0) +
      (this.author?.name.length || 0)
    );
  }

  equals(embed) {
    return (
      this.type === embed.type &&
      this.author?.name === embed.author?.name &&
      this.author?.url === embed.author?.url &&
      this.author?.iconURL === (embed.author?.iconURL || embed.author?.icon_url) &&
      this.color === embed.color &&
      this.title === embed.title &&
      this.description === embed.description &&
      this.url === embed.url &&
      this.timestamp === embed.timestamp &&
      this.fields.length === embed.fields.length &&
      this.fields.every((field, i) => this._fieldEquals(field, embed.fields[i])) &&
      this.footer?.text === embed.footer?.text &&
      this.footer?.iconURL === (embed.footer?.iconURL || embed.footer?.icon_url) &&
      this.image?.url === embed.image?.url &&
      this.thumbnail?.url === embed.thumbnail?.url &&
      this.video?.url === embed.video?.url &&
      this.provider?.name === embed.provider?.name &&
      this.provider?.url === embed.provider?.url
    );
  }

  _fieldEquals(field, other) {
    return field.name === other.name && field.value === other.value && field.inline === other.inline;
  }

  addField(name, value, inline) {
    return this.addFields({ name, value, inline });
  }

  addFields(...fields) {
    this.fields.push(...this.constructor.normalizeFields(fields));
    return this;
  }

  spliceFields(index, deleteCount, ...fields) {
    this.fields.splice(index, deleteCount, ...this.constructor.normalizeFields(...fields));
    return this;
  }

  setFields(...fields) {
    this.spliceFields(0, this.fields.length, fields);
    return this;
  }

  setAuthor(options, deprecatedIconURL, deprecatedURL) {
    if (options === null) {
      this.author = {};
      return this;
    }

    if (typeof options === 'string') {
      options = { name: options, url: deprecatedURL, iconURL: deprecatedIconURL };
    }

    const { name, url, iconURL } = options;
    this.author = { name: Util.verifyString(name, RangeError, 'EMBED_AUTHOR_NAME'), url, iconURL };
    return this;
  }

  setColor(color) {
    this.color = Util.resolveColor(color);
    return this;
  }

  setDescription(description) {
    this.description = Util.verifyString(description, RangeError, 'EMBED_DESCRIPTION');
    return this;
  }

  setFooter(options, deprecatedIconURL) {
    if (options === null) {
      this.footer = undefined;
      return this;
    }

    if (typeof options === 'string') {
      options = { text: options, iconURL: deprecatedIconURL };
    }

    const { text, iconURL } = options;
    this.footer = { text: Util.verifyString(text, RangeError, 'EMBED_FOOTER_TEXT'), iconURL };
    return this;
  }

  setImage(url) {
    this.image = { url };
    return this;
  }

  setThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  setTimestamp(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    this.timestamp = timestamp;
    return this;
  }

  setTitle(title) {
    this.title = Util.verifyString(title, RangeError, 'EMBED_TITLE');
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  toJSON() {
    return {
      title: this.title,
      type: 'rich',
      description: this.description,
      url: this.url,
      timestamp: this.timestamp && new Date(this.timestamp),
      color: this.color,
      fields: this.fields,
      thumbnail: this.thumbnail,
      image: this.image,
      author: this.author && {
        name: this.author.name,
        url: this.author.url,
        icon_url: this.author.iconURL,
      },
      footer: this.footer && {
        text: this.footer.text,
        icon_url: this.footer.iconURL,
      },
    };
  }

  static normalizeField(name, value, inline = false) {
    return {
      name: Util.verifyString(name, RangeError, 'EMBED_FIELD_NAME', false),
      value: Util.verifyString(value, RangeError, 'EMBED_FIELD_VALUE', false),
      inline,
    };
  }

  static normalizeFields(...fields) {
    return fields
      .flat(2)
      .map(field =>
        this.normalizeField(field.name, field.value, typeof field.inline === 'boolean' ? field.inline : false)
      );
  }
}

module.exports = MessageEmbed;

/* Made
*  By
*  Discord Id - Saumava (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
