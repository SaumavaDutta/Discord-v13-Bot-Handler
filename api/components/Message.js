'use strict';

const process = require('node:process');
const { Collection } = require('@discordjs/collection');
const { Constants, MessageFlags, Util, ReactionManager, Permissions, SnowflakeUtil, BaseMessageComponent, ClientApplication, InteractionCollector, MessageAttachment, MessageEmbed, MessageMentions, MessagePayload, ReactionCollector, Sticker } = require("discord.js")
const { Error } = require(`${process.cwd()}/api/errors`);
const Base = require(`${process.cwd()}/api/structure/Base`);
const { InteractionTypes, MessageTypes, SystemMessageTypes, MaxBulkDeletableMessageAge } = Constants;

const deletedMessages = new WeakSet();
let deprecationEmittedForDeleted = false;


class Message extends Base {
  constructor(client, data) {
    super(client);

    this.channelId = data.channel_id;

    this.guildId = data.guild_id ?? this.channel?.guild?.id ?? null;

    this._patch(data);
  }

  _patch(data) {
   
    this.id = data.id;

    if ('position' in data) {
     
      this.position = data.position;
    } else {
      this.position ??= null;
    }

    this.createdTimestamp = SnowflakeUtil.timestampFrom(this.id);

    if ('type' in data) {
     
      this.type = MessageTypes[data.type];

      this.system = SystemMessageTypes.includes(this.type);
    } else {
      this.system ??= null;
      this.type ??= null;
    }

    if ('content' in data) {
     
      this.content = data.content;
    } else {
      this.content ??= null;
    }

    if ('author' in data) {
      /**
       * The author of the message
       * @type {?User}
       */
      this.author = this.client.users._add(data.author, !data.webhook_id);
    } else {
      this.author ??= null;
    }

    if ('pinned' in data) {
      this.pinned = Boolean(data.pinned);
    } else {
      this.pinned ??= null;
    }

    if ('tts' in data) {
      this.tts = data.tts;
    } else {
      this.tts ??= null;
    }

    if ('nonce' in data) {
      this.nonce = data.nonce;
    } else {
      this.nonce ??= null;
    }

    if ('embeds' in data) {
      this.embeds = data.embeds.map(e => new MessageEmbed(e, true));
    } else {
      this.embeds = this.embeds?.slice() ?? [];
    }

    if ('components' in data) {
      this.components = data.components.map(c => BaseMessageComponent.create(c, this.client));
    } else {
      this.components = this.components?.slice() ?? [];
    }

    if ('attachments' in data) {
      this.attachments = new Collection();
      if (data.attachments) {
        for (const attachment of data.attachments) {
          this.attachments.set(attachment.id, new MessageAttachment(attachment.url, attachment.filename, attachment));
        }
      }
    } else {
      this.attachments = new Collection(this.attachments);
    }

    if ('sticker_items' in data || 'stickers' in data) {
      
      this.stickers = new Collection(
        (data.sticker_items ?? data.stickers)?.map(s => [s.id, new Sticker(this.client, s)]),
      );
    } else {
      this.stickers = new Collection(this.stickers);
    }

    // Discord sends null if the message has not been edited
    if (data.edited_timestamp) {
      this.editedTimestamp = new Date(data.edited_timestamp).getTime();
    } else {
      this.editedTimestamp ??= null;
    }

    if ('reactions' in data) {
      this.reactions = new ReactionManager(this);
      if (data.reactions?.length > 0) {
        for (const reaction of data.reactions) {
          this.reactions._add(reaction);
        }
      }
    } else {
      this.reactions ??= new ReactionManager(this);
    }

    if (!this.mentions) {
      this.mentions = new MessageMentions(
        this,
        data.mentions,
        data.mention_roles,
        data.mention_everyone,
        data.mention_channels,
        data.referenced_message?.author,
      );
    } else {
      this.mentions = new MessageMentions(
        this,
        data.mentions ?? this.mentions.users,
        data.mention_roles ?? this.mentions.roles,
        data.mention_everyone ?? this.mentions.everyone,
        data.mention_channels ?? this.mentions.crosspostedChannels,
        data.referenced_message?.author ?? this.mentions.repliedUser,
      );
    }

    if ('webhook_id' in data) {
      this.webhookId = data.webhook_id;
    } else {
      this.webhookId ??= null;
    }

    if ('application' in data) {
      this.groupActivityApplication = new ClientApplication(this.client, data.application);
    } else {
      this.groupActivityApplication ??= null;
    }

    if ('application_id' in data) {
      this.applicationId = data.application_id;
    } else {
      this.applicationId ??= null;
    }

    if ('activity' in data) {
      this.activity = {
        partyId: data.activity.party_id,
        type: data.activity.type,
      };
    } else {
      this.activity ??= null;
    }

    if ('thread' in data) {
      this.client.channels._add(data.thread, this.guild);
    }

    if (this.member && data.member) {
      this.member._patch(data.member);
    } else if (data.member && this.guild && this.author) {
      this.guild.members._add(Object.assign(data.member, { user: this.author }));
    }

    if ('flags' in data) {
      this.flags = new MessageFlags(data.flags).freeze();
    } else {
      this.flags = new MessageFlags(this.flags).freeze();
    }


    if ('message_reference' in data) {
      this.reference = {
        channelId: data.message_reference.channel_id,
        guildId: data.message_reference.guild_id,
        messageId: data.message_reference.message_id,
      };
    } else {
      this.reference ??= null;
    }

    if (data.referenced_message) {
      this.channel?.messages._add({ guild_id: data.message_reference?.guild_id, ...data.referenced_message });
    }


    if (data.interaction) {
     
      this.interaction = {
        id: data.interaction.id,
        type: InteractionTypes[data.interaction.type],
        commandName: data.interaction.name,
        user: this.client.users._add(data.interaction.user),
      };
    } else {
      this.interaction ??= null;
    }
  }

  get deleted() {
    if (!deprecationEmittedForDeleted) {
      deprecationEmittedForDeleted = true;
      process.emitWarning(
        'Message#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091.',
        'DeprecationWarning',
      );
    }

    return deletedMessages.has(this);
  }

  set deleted(value) {
    if (!deprecationEmittedForDeleted) {
      deprecationEmittedForDeleted = true;
      process.emitWarning(
        'Message#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091.',
        'DeprecationWarning',
      );
    }

    if (value) deletedMessages.add(this);
    else deletedMessages.delete(this);
  }

  get channel() {
    return this.client.channels.resolve(this.channelId);
  }

  get partial() {
    return typeof this.content !== 'string' || !this.author;
  }

 
  get member() {
    return this.guild?.members.resolve(this.author) ?? null;
  }

  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  get editedAt() {
    return this.editedTimestamp ? new Date(this.editedTimestamp) : null;
  }

  get guild() {
    return this.client.guilds.resolve(this.guildId) ?? this.channel?.guild ?? null;
  }

  get hasThread() {
    return this.flags.has(MessageFlags.FLAGS.HAS_THREAD);
  }

  get thread() {
    return this.channel?.threads?.resolve(this.id) ?? null;
  }

  get url() {
    return `https://discord.com/channels/${this.guildId ?? '@me'}/${this.channelId}/${this.id}`;
  }

  get cleanContent() {
    return this.content != null ? Util.cleanContent(this.content, this.channel) : null;
  }

  createReactionCollector(options = {}) {
    return new ReactionCollector(this, options);
  }

  awaitReactions(options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createReactionCollector(options);
      collector.once('end', (reactions, reason) => {
        if (options.errors?.includes(reason)) reject(reactions);
        else resolve(reactions);
      });
    });
  }

  
  createMessageComponentCollector(options = {}) {
    return new InteractionCollector(this.client, {
      ...options,
      interactionType: InteractionTypes.MESSAGE_COMPONENT,
      message: this,
    });
  }

  
  awaitMessageComponent(options = {}) {
    const _options = { ...options, max: 1 };
    return new Promise((resolve, reject) => {
      const collector = this.createMessageComponentCollector(_options);
      collector.once('end', (interactions, reason) => {
        const interaction = interactions.first();
        if (interaction) resolve(interaction);
        else reject(new Error('INTERACTION_COLLECTOR_ERROR', reason));
      });
    });
  }

  /**
   * Whether the message is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    const precheck = Boolean(
      this.author.id === this.client.user.id && !deletedMessages.has(this) && (!this.guild || this.channel?.viewable),
    );

    // Regardless of permissions thread messages cannot be edited if
    // the thread is archived or the thread is locked and the bot does not have permission to manage threads.
    if (this.channel?.isThread()) {
      if (this.channel.archived) return false;
      if (this.channel.locked) {
        const permissions = this.channel.permissionsFor(this.client.user);
        if (!permissions?.has(Permissions.FLAGS.MANAGE_THREADS, true)) return false;
      }
    }

    return precheck;
  }

  /**
   * Whether the message is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    if (deletedMessages.has(this)) {
      return false;
    }
    if (!this.guild) {
      return this.author.id === this.client.user.id;
    }
    // DMChannel does not have viewable property, so check viewable after proved that message is on a guild.
    if (!this.channel?.viewable) {
      return false;
    }

    const permissions = this.channel?.permissionsFor(this.client.user);
    if (!permissions) return false;
    // This flag allows deleting even if timed out
    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR, false)) return true;

    return Boolean(
      this.author.id === this.client.user.id ||
        (permissions.has(Permissions.FLAGS.MANAGE_MESSAGES, false) &&
          this.guild.members.me.communicationDisabledUntilTimestamp < Date.now()),
    );
  }

  get bulkDeletable() {
    return (
      (this.inGuild() &&
        Date.now() - this.createdTimestamp < MaxBulkDeletableMessageAge &&
        this.deletable &&
        this.channel?.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_MESSAGES, false)) ??
      false
    );
  }

  get pinnable() {
    const { channel } = this;
    return Boolean(
      !this.system &&
        !deletedMessages.has(this) &&
        (!this.guild ||
          (channel?.viewable &&
            channel?.permissionsFor(this.client.user)?.has(Permissions.FLAGS.MANAGE_MESSAGES, false))),
    );
  }

  async fetchReference() {
    if (!this.reference) throw new Error('MESSAGE_REFERENCE_MISSING');
    const { channelId, messageId } = this.reference;
    const channel = this.client.channels.resolve(channelId);
    if (!channel) throw new Error('GUILD_CHANNEL_RESOLVE');
    const message = await channel.messages.fetch(messageId);
    return message;
  }

  get crosspostable() {
    const bitfield =
      Permissions.FLAGS.SEND_MESSAGES |
      (this.author.id === this.client.user.id ? Permissions.defaultBit : Permissions.FLAGS.MANAGE_MESSAGES);
    const { channel } = this;
    return Boolean(
      channel?.type === 'GUILD_NEWS' &&
        !this.flags.has(MessageFlags.FLAGS.CROSSPOSTED) &&
        this.type === 'DEFAULT' &&
        channel.viewable &&
        channel.permissionsFor(this.client.user)?.has(bitfield, false) &&
        !deletedMessages.has(this),
    );
  }

  edit(options) {
    if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
    return this.channel.messages.edit(this, options);
  }

  crosspost() {
    if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
    return this.channel.messages.crosspost(this.id);
  }

  async pin(reason) {
    if (!this.channel) throw new Error('CHANNEL_NOT_CACHED');
    await this.channel.messages.pin(this.id, reason);
    return this;
  }

  async unpin(reason) {
    if (!this.channel) throw new Error('CHANNEL_NOT_CACHED');
    await this.channel.messages.unpin(this.id, reason);
    return this;
  }

  async react(emoji) {
    if (!this.channel) throw new Error('CHANNEL_NOT_CACHED');
    await this.channel.messages.react(this.id, emoji);

    return this.client.actions.MessageReactionAdd.handle(
      {
        [this.client.actions.injectedUser]: this.client.user,
        [this.client.actions.injectedChannel]: this.channel,
        [this.client.actions.injectedMessage]: this,
        emoji: Util.resolvePartialEmoji(emoji),
      },
      true,
    ).reaction;
  }

  async delete() {
    if (!this.channel) throw new Error('CHANNEL_NOT_CACHED');
    await this.channel.messages.delete(this.id);
    return this;
  }

  reply(options) {
    if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
    let data;

    if (options instanceof MessagePayload) {
      data = options;
    } else {
      data = MessagePayload.create(this, options, {
        reply: {
          messageReference: this,
          failIfNotExists: options?.failIfNotExists ?? this.client.options.failIfNotExists,
        },
      });
    }
    return this.channel.send(data);
  }

  startThread(options = {}) {
    if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
    if (!['GUILD_TEXT', 'GUILD_NEWS'].includes(this.channel.type)) {
      return Promise.reject(new Error('MESSAGE_THREAD_PARENT'));
    }
    if (this.hasThread) return Promise.reject(new Error('MESSAGE_EXISTING_THREAD'));
    return this.channel.threads.create({ ...options, startMessage: this });
  }

  fetch(force = true) {
    if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
    return this.channel.messages.fetch(this.id, { force });
  }

  fetchWebhook() {
    if (!this.webhookId) return Promise.reject(new Error('WEBHOOK_MESSAGE'));
    if (this.webhookId === this.applicationId) return Promise.reject(new Error('WEBHOOK_APPLICATION'));
    return this.client.fetchWebhook(this.webhookId);
  }

  suppressEmbeds(suppress = true) {
    const flags = new MessageFlags(this.flags.bitfield);

    if (suppress) {
      flags.add(MessageFlags.FLAGS.SUPPRESS_EMBEDS);
    } else {
      flags.remove(MessageFlags.FLAGS.SUPPRESS_EMBEDS);
    }

    return this.edit({ flags });
  }

  removeAttachments() {
    return this.edit({ attachments: [] });
  }

  resolveComponent(customId) {
    return this.components.flatMap(row => row.components).find(component => component.customId === customId) ?? null;
  }

  equals(message, rawData) {
    if (!message) return false;
    const embedUpdate = !message.author && !message.attachments;
    if (embedUpdate) return this.id === message.id && this.embeds.length === message.embeds.length;

    let equal =
      this.id === message.id &&
      this.author.id === message.author.id &&
      this.content === message.content &&
      this.tts === message.tts &&
      this.nonce === message.nonce &&
      this.embeds.length === message.embeds.length &&
      this.attachments.length === message.attachments.length;

    if (equal && rawData) {
      equal =
        this.mentions.everyone === message.mentions.everyone &&
        this.createdTimestamp === new Date(rawData.timestamp).getTime() &&
        this.editedTimestamp === new Date(rawData.edited_timestamp).getTime();
    }

    return equal;
  }

  inGuild() {
    return Boolean(this.guildId);
  }

  toString() {
    return this.content;
  }

  toJSON() {
    return super.toJSON({
      channel: 'channelId',
      author: 'authorId',
      groupActivityApplication: 'groupActivityApplicationId',
      guild: 'guildId',
      cleanContent: true,
      member: false,
      reactions: false,
    });
  }
}

module.exports.Message = Message;
module.exports.deletedMessages = deletedMessages;

/* Made
*  By
*  Discord Id - ashton.gg (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
