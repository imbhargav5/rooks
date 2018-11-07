const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // custom route for posts
  server.get("/hook/:hookName", (req, res) => {
    return app.render(req, res, "/hook", {
      hookName: req.params.hookName.startsWith("use-")
        ? req.params.hookName.substring(4)
        : "counter"
    });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
