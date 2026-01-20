// Worker entry point - serves static assets with SPA fallback
export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle /static redirect
    if (url.pathname === '/static' || url.pathname === '/static/') {
      return Response.redirect(new URL('/art/gradient-orbs', url.origin).toString(), 301);
    }
    
    // Try to serve the asset directly
    let response = await env.ASSETS.fetch(request);
    
    // If 404 and not a file request (no extension), serve index.html for SPA
    if (response.status === 404) {
      const hasExtension = url.pathname.includes('.') && !url.pathname.endsWith('/');
      if (!hasExtension) {
        // SPA fallback - serve index.html
        const indexRequest = new Request(new URL('/index.html', url.origin).toString(), request);
        response = await env.ASSETS.fetch(indexRequest);
      }
    }
    
    return response;
  },
};
