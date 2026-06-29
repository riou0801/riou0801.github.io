import type { Data as LumeData, Helpers as LumeHelpers } from "lume/types.ts";

export default ({ title, content, search }: LumeData, helpers: LumeHelpers) => {
  // Get all post pages, filtering out drafts in production
  const showDrafts = Deno.env.get("LUME_ENV") !== "production";
  // Search for pages that have a URL starting with /posts/
  const allPosts = search.pages("url^=/posts/", "date=desc");
  const posts = showDrafts ? allPosts : allPosts.filter((post) => !post.draft);

  return `<html>
    <head>
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta charset="UTF-8">
      <link rel="stylesheet" href="/css/styles.css">
      <script>
        (function() {
          const saved = localStorage.getItem('theme');
          if (saved) document.documentElement.setAttribute('data-theme', saved);
        })();
      <\/script>
    </head>
    <body>
      <nav class="site-nav">
        <span></span>
        <span class="site-title">riou's blog</span>
        <button class="theme-toggle" id="theme-toggle" aria-label="テーマ切り替え"></button>
      </nav>
      <script>
        (function() {
          const btn = document.getElementById('theme-toggle');
          function getTheme() {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;
            return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
          }
          function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
          }
          applyTheme(getTheme());
          btn.addEventListener('click', function() {
            const next = getTheme() === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', next);
            applyTheme(next);
          });
        })();
      <\/script>
      <header>
        <h1>${title}</h1>
      </header>
      <main>
        ${content}

        <div class="post-list">
          <h2>Blog Posts</h2>
          ${
    posts.length > 0
      ? `
          <ul>
            ${
        posts.map((post) => {
          // Format the date nicely if it exists
          let dateStr = "No date";
          if (post.date) {
            console.log(`Post date for ${post.url}:`, {
              date: post.date,
              type: typeof post.date,
              isDate: post.date instanceof Date,
            });
            // Handle both string dates and Date objects
            const dateObj = post.date instanceof Date
              ? post.date
              : new Date(post.date);
            if (!isNaN(dateObj.getTime())) {
              dateStr = dateObj.toISOString().split("T")[0];
            } else {
              dateStr = `Invalid date: ${post.date}`;
            }
          }
          const postTitle = post.title || post.data.title || "Untitled Post";
          const author = post.author || post.data.author || "";

          return `
              <li>
                <span class="post-date">${dateStr}</span>
                <a href="${post.url}" class="post-title">${postTitle}</a>
                ${author ? `<span class="post-author">by ${author}</span>` : ""}
                ${post.draft ? '<span class="post-draft">[Draft]</span>' : ""}
              </li>`;
        }).join("")
      }
          </ul>`
      : `<p>No posts available yet.</p>`
  }
        </div>
      </main>
      <footer>
        <p>&copy; ${
    new Date().getFullYear()
  } - Made with <a href="https://lume.land">Lume</a></p>
      </footer>
    </body>
  </html>`;
};
