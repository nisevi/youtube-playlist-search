var querystring = require('querystring');
var xhr = require('xhr');

if (!xhr.open) xhr = require('request');

var allowedProperties = [
  'key',
  'maxResults',
  'part',
  'playlistId'
];

module.exports = function (term, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {}
  }

  var params = {
    q: term,
    part: opts.part || 'snippet,contentDetails',
    maxResults: opts.maxResults || 30
  };

  Object.keys(opts).map(function (k) {
    if (allowedProperties.indexOf(k) > -1) params[k] = opts[k]
  });

  xhr({
    url: 'https://www.googleapis.com/youtube/v3/playlistItems?' + querystring.stringify(params),
    method: 'GET'
  }, function (err, res, body) {
    if (err) return cb(err);
    try {
      var result = JSON.parse(body);

      if (result.error) {
        var error = new Error(result.error.errors.shift().message);
        return cb(error)
      }

      var pageInfo = {
        totalResults: result.pageInfo.totalResults,
        resultsPerPage: result.pageInfo.resultsPerPage,
        nextPageToken: result.nextPageToken,
        prevPageToken: result.prevPageToken
      };

      var findings = result.items.map(function (item) {
        return {
          id: item.snippet.resourceId.videoId,
          link: 'https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId,
          kind: item.kind,
          etag: item.etag,
          publishedAt: item.snippet.publishedAt,
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnails: item.snippet.thumbnails,
          playlistId: item.snippet.playlistId,
          position: item.snippet.position
        }
      });

      return cb(null, findings, pageInfo)
    } catch(e) {
      return cb(e)
    }
  })
};
