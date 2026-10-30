const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "world-mods-official-api",
        stage: "migration",
        database: Boolean(env.DB),
        drive: "not-connected",
      });
    }

    // No admin, OAuth, or upload endpoints are exposed until their
    // authentication and resumable-upload implementation is complete.
    return json({ error: "This staging API route is not enabled yet." }, 404);
  },
};
