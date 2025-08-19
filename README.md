# MeetusVR Auth App


Next.js 14 (App Router) + Tailwind + Zustand + Axios. Implements the assignment:


- Figma-inspired login page
- Validation (email + password required); login disabled until valid
- Calls token API and stores `token` in **HTTP-only** cookie via Next route handler
- Fetches user name/ID via proxy API using `Authorization: Bearer <token>`
- Protected `/dashboard` with middleware; shows ID/Name and a Logout button
- Logout clears the cookie and redirects back to login


## Run locally


```bash
pnpm i # or npm i / yarn
pnpm dev # http://localhost:3000
```


> Test credentials: `dev.aert@gmail.com` / `helloworld`


## Notes
- We avoid handling refresh tokens explicitly; if the backend returns 401 we redirect to login and clear the cookie.
- Styling uses Tailwind; swap `/public/meetusvr-ring.svg` with the asset exported from Figma to better match the design.