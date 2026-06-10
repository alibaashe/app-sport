import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API endpoint handling Support / Activity Requests
  app.post("/api/support", async (req, res) => {
    const { subject, description, email } = req.body;

    // We just return a mock success
    res.json({
      success: true,
      results: {
        message: "Support request processed successfully (Mock fallback)",
      },
      errors: [],
    });
  });

  // HLS CORS Proxy Endpoint
  app.get("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) return res.status(400).send("No url provided");

    try {
      // Using native fetch
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "*/*",
          Connection: "keep-alive",
        },
      });

      if (!response.ok) {
        return res
          .status(response.status)
          .send(`Failed to fetch: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType) res.setHeader("Content-Type", contentType);
      res.setHeader("Access-Control-Allow-Origin", "*");

      if (
        targetUrl.includes(".m3u8") ||
        (contentType && contentType.includes("mpegurl"))
      ) {
        const text = await response.text();
        const targetUrlObj = new URL(targetUrl);
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);

        const rewrittenText = text
          .split("\n")
          .map((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return line;
            if (trimmedLine.startsWith("#")) {
              if (trimmedLine.includes("URI=")) {
                return line.replace(/URI="([^"]+)"/g, (match, uri) => {
                  let absoluteUri = uri;
                  if (!uri.startsWith("http")) {
                    absoluteUri = uri.startsWith("/")
                      ? targetUrlObj.origin + uri
                      : baseUrl + uri;
                  }
                  return `URI="/api/proxy?url=${encodeURIComponent(absoluteUri)}"`;
                });
              }
              return line;
            }

            let absoluteUrl = trimmedLine;
            if (!trimmedLine.startsWith("http")) {
              if (trimmedLine.startsWith("/")) {
                absoluteUrl = targetUrlObj.origin + trimmedLine;
              } else {
                absoluteUrl = baseUrl + trimmedLine;
              }
            }
            return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
          })
          .join("\n");

        return res.send(rewrittenText);
      } else {
        // Pipe stream directly for TS segments
        const arrayBuffer = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
      }
    } catch (err: any) {
      console.error("Proxy error:", err.message);
      res.status(500).send("Proxy error: " + err.message);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production behavior
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
