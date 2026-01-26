// Worker entry point - handles custom redirects and serves static assets
export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle /static redirect (legacy URL)
    if (url.pathname === '/static' || url.pathname === '/static/') {
      return Response.redirect(new URL('/art/gradient-orbs', url.origin).toString(), 301);
    }
    
    // Serve static assets - SPA fallback handled by not_found_handling config
    return env.ASSETS.fetch(request);
  },
};
