
 function createEnum(keys) {
  const obj = {};
  for (const [index, key] of keys.entries()) {
    if (key === null) continue;
    obj[key] = index;
    obj[index] = key;
  }
  return obj;
}

module.exports.createEnum = createEnum;

/* Made
*  By
*  Discord Id - ashton.gg (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
