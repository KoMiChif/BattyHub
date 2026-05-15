# Google Sign-In setup

The frontend `Continue with Google` button and the backend `POST /api/auth/google`
endpoint both rely on the **same** Google OAuth Client ID. You set it up once
in Google Cloud Console, then drop it into two env files.

## 1. Create the OAuth client (one-time, ~5 minutes)

1. Go to <https://console.cloud.google.com/> and create a project (e.g.
   `BattyHub`) — or reuse an existing one.
2. In the sidebar: **APIs & Services → OAuth consent screen**
   - User type: **External**
   - App name: `BattyHub`
   - Support email: your email
   - Developer contact: your email
   - Save. (No scopes required for sign-in beyond defaults.)
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `BattyHub Web`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - (later) your production frontend origin, e.g. `https://battyhub.com`
   - **Authorized redirect URIs**: leave empty (we use the JS popup flow, no
     redirect URI is needed).
   - Click **Create**. Copy the **Client ID** (long string ending in
     `.apps.googleusercontent.com`). Ignore the client secret — we don't need it
     for ID-token verification.

## 2. Wire it up

### Frontend (`/Users/mjr/Desktop/battyhub/.env.local`)

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<paste-client-id>.apps.googleusercontent.com
```

Restart `npm run dev` after changes.

### Backend (`backend/.env`)

```
GOOGLE_CLIENT_ID=<same-client-id>.apps.googleusercontent.com
```

The backend uses the Client ID as the audience when verifying ID tokens, so it
**must** be identical to the one the frontend sends.

## 3. Try it

1. `cd backend && npm run dev`
2. In another terminal: `npm run dev` (frontend)
3. Open <http://localhost:3000/login>
4. Click **Continue with Google** → pick an account → you're signed in.

## How it works

- Browser loads `https://accounts.google.com/gsi/client` (Google Identity Services).
- User clicks the button → popup → Google returns a **JWT ID token** (the
  `credential` field).
- Frontend POSTs `{ credential }` to `/api/auth/google`.
- Backend verifies the JWT signature against Google's JWKS + checks audience
  matches our Client ID, extracts `email`, `sub` (Google user ID), `name`,
  `picture`.
- Backend upserts a `User` by `googleId`; if missing, links by `email` to an
  existing password account; otherwise creates a new account.
- Backend signs and returns **our own** JWT — frontend stores it and uses it
  exactly like a password-login token.

## Common errors

- **"Google sign-in is not configured"** — `GOOGLE_CLIENT_ID` is unset on
  whichever side throws it. Check both env files.
- **"redirect_uri_mismatch"** — you're seeing the legacy OAuth flow; check the
  client type is **Web application**, not Desktop / Android.
- **Button doesn't appear / "The given origin is not allowed for the given
  client ID"** — the origin your browser is using isn't in the authorized
  list. Add it in Google Cloud Console → Credentials → that client ID.
