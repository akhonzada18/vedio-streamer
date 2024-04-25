const http = require("http");
const fs = require("fs");
const path = require("path");

const FILE_PATH = path.resolve("video.mp4");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    fs.createReadStream(path.resolve("index.html")).pipe(res);
    return;
  }
  if (req.method === "GET" && req.url === "/video") {
    const stat = fs.statSync(FILE_PATH);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(FILE_PATH, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(FILE_PATH).pipe(res);
    }
  } else {
    res.writeHead(400);
    fs.createReadStream(FILE_PATH).pipe(res);
    res.end("bad request");
  }
});

const PORT = process.env.PORT || 8001;
const IP_ADDRESS = "192.168.100.78";
server.listen(3000, "127.0.0.1", function () {
  server.close(function () {
    server.listen(PORT, IP_ADDRESS);
  });
});
