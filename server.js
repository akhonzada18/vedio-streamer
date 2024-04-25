const http = require("http");
const fs = require("fs");
const path = require("path");

let movies = {
  id1: "/home/tayyab/movies/65 (2023) [720p] [WEBRip] [YTS.MX]/65.2023.720p.WEBRip.x264.AAC-[YTS.MX].mp4",
id2: "/home/tayyab/movies/Raya And The Last Dragon (2021) [720p] [WEBRip] [YTS.MX]/Raya.And.The.Last.Dragon.2021.720p.WEBRip.x264.AAC-[YTS.MX].mp4",
id3: "/home/tayyab/movies/Air (2023) [720p] [WEBRip] [YTS.MX]/Air.2023.720p.WEBRip.x264.AAC-[YTS.MX].mp4",
id4: "/home/tayyab/movies/The Magicians Elephant (2023) [1080p] [WEBRip] [5.1] [YTS.MX]/The.Magicians.Elephant.2023.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4",
id5: "/home/tayyab/movies/The.Woman.King.2022.720p.WEBRip.x264.AAC-[YTS.MX].mp4",
}
// const FILE_PATH = path.resolve("video2.mp4");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    fs.createReadStream(path.resolve("index.html")).pipe(res);
    return;
  }
  if (req.method === "GET" && req.url.startsWith("/video")) {
    const videoName = req.url.replace("/video/", "");

    const FILE_PATH = path.resolve(movies.id3);
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
const IP_ADDRESS = "192.168.100.61";
server.listen(3000, "127.0.0.1", function () {
  server.close(function () {
    server.listen(PORT, IP_ADDRESS);
    console.log(`server running on ${PORT}, at IP: ${IP_ADDRESS} `);
  });
});
