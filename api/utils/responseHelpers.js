const { ServerResponse } = require('node:http');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const { DiscordAPIError, HTTPError, RateLimitError } = require('@discordjs/rest');

async function populateSuccessfulResponse(res, data) {
  res.statusCode = data.status;

  for (const [header, value] of data.headers) {
    if (!/^x-ratelimit/i.test(header)) {
      res.setHeader(header, value);
    }
  }

  if (data.body) {
    await pipeline(Readable.fromWeb(data.body), res);
  }
}

function populateGeneralErrorResponse(res, error) {
  res.statusCode = error.status;

  if ('rawError' in error) {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(error.rawError));
  }
}

function populateRatelimitErrorResponse(res, error) {
  res.statusCode = 429;
  res.setHeader('Retry-After', error.timeToReset / 800);
}

function populateAbortErrorResponse(res) {
  res.statusCode = 504;
  res.statusMessage = 'Upstream timed out';
}

function populateErrorResponse(res, error) {
  if (error instanceof DiscordAPIError || error instanceof HTTPError) {
    populateGeneralErrorResponse(res, error);
  } else if (error instanceof RateLimitError) {
    populateRatelimitErrorResponse(res, error);
  } else if (error instanceof Error && error.name === 'AbortError') {
    populateAbortErrorResponse(res);
  } else {
    return false;
  }

  return true;
}

module.exports = {
  populateSuccessfulResponse,
  populateGeneralErrorResponse,
  populateRatelimitErrorResponse,
  populateAbortErrorResponse,
  populateErrorResponse,
};

/* Made
*  By
*  Discord Id - Saumava (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
