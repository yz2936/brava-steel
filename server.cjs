const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function resolveFile(urlPath) {
  const decodedPath = decodeURIComponent(urlPath);
  const cleanPath = decodedPath.replace(/^\/+/, "");
  const requested = path.normalize(path.join(root, cleanPath));

  if (!requested.startsWith(root)) {
    return null;
  }

  const candidates = [];

  if (decodedPath === "/" || decodedPath === "") {
    candidates.push(path.join(root, "index.html"));
  } else {
    candidates.push(requested);

    if (!path.extname(requested)) {
      candidates.push(`${requested}.html`);
      candidates.push(path.join(requested, "index.html"));
    }
  }

  return candidates.find((filePath) => {
    try {
      return fs.statSync(filePath).isFile();
    } catch {
      return false;
    }
  });
}

function sendError(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(message);
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, {
      Allow: "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8"
    });
    response.end("Method not allowed");
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const filePath = resolveFile(url.pathname);

  if (!filePath) {
    sendError(response, 404, "Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const headers = {
    "Content-Type": types[ext] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff"
  };

  if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    headers["Cache-Control"] = "public, max-age=86400";
  }

  response.writeHead(200, headers);

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Brava Steel website listening on http://${host}:${port}`);
});
