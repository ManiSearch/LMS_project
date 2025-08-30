import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [
    react(),
    {
      name: 'entity-api',
      configureServer(server) {
        // Entity API endpoint
        server.middlewares.use('/api/entities/write', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                // Validate JSON
                JSON.parse(body);

                // Write to public/entity.json
                const filePath = path.join(process.cwd(), 'public', 'entity.json');
                fs.writeFileSync(filePath, body, 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Entity data written successfully' }));
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error'
                }));
              }
            });
          } else {
            next();
          }
        });

        // Faculty API endpoint
        server.middlewares.use('/api/faculty/write', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                // Validate JSON
                JSON.parse(body);

                // Write to public/faculty.json
                const filePath = path.join(process.cwd(), 'public', 'faculty.json');
                fs.writeFileSync(filePath, body, 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Faculty data written successfully' }));
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error'
                }));
              }
            });
          } else {
            next();
          }
        });

        // Students API endpoint
        server.middlewares.use('/api/students/write', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                // Validate JSON
                JSON.parse(body);

                // Write to public/students.json
                const filePath = path.join(process.cwd(), 'public', 'students.json');
                fs.writeFileSync(filePath, body, 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Students data written successfully' }));
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error'
                }));
              }
            });
          } else {
            next();
          }
        });

        // Program API endpoint
        server.middlewares.use('/api/programs/write', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                // Validate JSON
                JSON.parse(body);

                // Write to public/program.json
                const filePath = path.join(process.cwd(), 'public', 'program.json');
                fs.writeFileSync(filePath, body, 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Program data written successfully' }));
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error'
                }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));
