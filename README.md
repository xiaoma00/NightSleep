# NightSleep

## Deploy to Zeabur

1. Push this repository to a Git provider (GitHub/GitLab).
2. On Zeabur, create a new app and connect your repository.
3. Set build command: `npm run build`.
4. Set start command: `npm start`.
5. Ensure the project uses Node.js (Zeabur will detect automatically). The server listens on `process.env.PORT`.

Locally you can test:

```bash
npm install
npm run build
npm start
```

For development:

```bash
npm install
npm run dev
```
