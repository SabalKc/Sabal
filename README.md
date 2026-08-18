# Sabal

A photo-sharing feed in the spirit of Instagram — stories, likes, comments,
saves, and a create-post flow. Built with plain HTML, CSS, and JavaScript,
no build step, no dependencies, no backend.

**Note:** all data (posts, likes, comments, follows) lives in memory in
`js/app.js` and resets on every page refresh. There's no database, no user
accounts, and no real image upload — it's a front-end practice project.

## Run it locally

You don't need to install anything. Either:

- Double-click `index.html` to open it directly in your browser, or
- Serve it locally (recommended, avoids some browser file-access quirks):

  ```bash
  cd sabal
  python3 -m http.server 8000
  ```

  then open `http://localhost:8000` in your browser.

## Project structure

```
sabal/
├── index.html        # page structure + all modals
├── css/style.css      # all styling
├── js/app.js           # fake data + all interactivity
├── assets/leaf.svg    # logomark
└── README.md
```

## Publish it on GitHub Pages

1. Create a new **public** repository on GitHub (e.g. `sabal`).
2. From inside this folder, push it up:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sabal.git
   git push -u origin main
   ```

3. On GitHub, go to your repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`,
   pick the **main** branch and the **/ (root)** folder, then **Save**.
5. After a minute or two, GitHub will give you a live URL, usually:

   ```
   https://<your-username>.github.io/sabal/
   ```

That's it — no build tools, no server to manage.

## Where to take it next

If you want this to become a real app rather than a demo:

- **Persistence** — swap the in-memory arrays in `app.js` for calls to a
  backend (e.g. Supabase, Firebase, or your own API) so posts/likes/comments
  survive a refresh.
- **Accounts** — add real auth (Supabase Auth, Firebase Auth, or a custom
  backend) instead of the fixed "you" user.
- **Uploads** — replace the preset image picker in the create-post modal
  with real file upload to storage (e.g. S3, Supabase Storage).
- **Routing** — split into real pages/routes (profile, single post, explore)
  once there's a framework in the mix — this is a good point to consider
  React, Vue, or similar if the project grows.

## License

Do whatever you like with this code — it's yours to learn from and build on.

