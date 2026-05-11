# Brava Steel Deployment

This site is served by a dependency-free Node.js static server.

## Run locally

```bash
npm start
```

The server uses:

- `PORT`, default `3000`
- `HOST`, default `0.0.0.0`

## Deploy

Any Node hosting provider can run the app with:

```bash
npm start
```

The server serves:

- `/` from `index.html`
- clean URLs such as `/about` from `about.html`
- files under `/assets`

## DNS

DNS records depend on the hosting provider and domain.

For a typical web host:

| Hostname | Type | Value |
| --- | --- | --- |
| `www` | `CNAME` | provider hostname |
| `@` | `A` or `ALIAS/ANAME` | provider IP or hostname |

After the host gives you its target values, add those records at your domain registrar and enable HTTPS in the hosting provider dashboard.
