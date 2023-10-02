# Bootstrap
- copy .env.example to .env for local dev configuration
- Create instance on vercel.com (pull project from github)
- Create next auth secret, `openssl rand -base64 32`
    - add id and secret to .env and vercel
- Create DB on planetscale (or somewhere else)
    - Add database URL from planetscale to .env file and Vercel environment variables
- Create oauth app on GitHub (can update code for other providers at your discretion)
    - dev:
        - homepage: https://localhost:3000
        - authorization callback url: http://localhost:3000/api/auth/callback/github
    - prod: use your dns
- create a redis db (I used upstash)
    - add upstash rest url and token to .env and vercel environment variables
- npm run dev and verify sign/out works
- git push then check build/deploy on vercel (should be auto-linked)
- vercel -> app name -> deploy status -> promote to production


# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `npx create-t3-app@latest`.
