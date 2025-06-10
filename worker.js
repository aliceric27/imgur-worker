/*
copy and paste in Cloudflare Worker.
*/

const checkPath = (path) => {
  let vaildPath = [ '/account', '/album', '/image', '/upload' ];
  for (let tmp of vaildPath) {
      if (path.includes(tmp)) 
          return true;
  }
  return false;
}

export default {
  async fetch(request, env, ctx) {
      const url = new URL(request.url);

      if (!checkPath(url.pathname))
        return new Response('', { status: 403 });

      url.protocol = 'https:';
      url.host = 'api.imgur.com';
      url.port = '443';

      return fetch(url, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
  },
};