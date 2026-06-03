// TenTrix backend — scaffold only. No endpoints implemented yet.
//
// Planned responsibilities:
//   • Score persistence across sessions
//   • Leaderboard API
//   • (Optional) session management

const PORT = parseInt(Deno.env.get("PORT") ?? "8000");

console.log(`TenTrix backend ready — http://localhost:${PORT}`);

// Placeholder: wire a real HTTP server here when the first endpoint is needed.
// import { serve } from "jsr:@std/http";
// serve(router, { port: PORT });
