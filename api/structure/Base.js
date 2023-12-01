'use strict';

const { Util } = require('discord.js');

class Base {
  constructor(client) {
    Object.defineProperty(this, 'client', { value: client });
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _patch(data) {
    return data;
  }

  _update(data) {
    const clone = this._clone();
    this._patch(data);
    return clone;
  }

  toJSON(...props) {
    return Util.flatten(this, ...props);
  }

  valueOf() {
    return this.id;
  }
}

module.exports = Base;

/* Made
*  By
*  Discord Id - ashton.gg (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
