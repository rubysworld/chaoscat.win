// Worker entry point - serves static assets
export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    return env.ASSETS.fetch(request);
  },
};
