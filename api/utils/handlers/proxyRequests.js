const { URL } = require('node:url');
const { populateSuccessfulResponse, populateErrorResponse } = require(`${process.cwd()}/api/utils/responseHelpers.js`);

function proxyRequests(rest) {
  return async (req, res) => {
    const { method, url } = req;

    if (!method || !url) {
      throw new TypeError('Invalid request. Missing method and/or url, implying that this is not a Server IncomingMessage');
    }

    const parsedUrl = new URL(url, 'http://noop');
    const fullRoute = parsedUrl.pathname.replace(/^\/api(\/v\d+)?/, '');

    const headers = {
      'Content-Type': req.headers['content-type'] || '',
    };

    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization;
    }

    if (req.headers['x-audit-log-reason']) {
      headers['x-audit-log-reason'] = req.headers['x-audit-log-reason'];
    }

    try {
      const discordResponse = await rest.queueRequest({
        body: req,
        fullRoute,
        method: method,
        auth: false,
        passThroughBody: true,
        query: parsedUrl.searchParams,
        headers,
      });

      await populateSuccessfulResponse(res, discordResponse);
    } catch (error) {
      const knownError = populateErrorResponse(res, error);
      if (!knownError) {
        throw error;
      }
    } finally {
      res.end();
    }
  };
}

module.exports.proxyRequests = proxyRequests;

/* Made
*  By
*  Discord Id - Saumava (Basic Implementation of Discord.jsV13 Library)
*  Credits must be there
*/
