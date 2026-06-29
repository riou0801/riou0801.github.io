import type { Data as LumeData, Helpers as LumeHelpers } from "lume/types.ts";

export default (
  { title, content, url, date, author, search }: LumeData,
  helpers: LumeHelpers,
) => {
  // Get all posts sorted by date
  const allPosts = search?.pages ? search.pages("type=post", "date=asc") : [];

  // Find current post index
  const currentIndex = allPosts.findIndex((post) => post.url === url);

  // Get previous and next posts
  const prevPost = currentIndex > 0
    ? {
      url: allPosts[currentIndex - 1].url,
      title: allPosts[currentIndex - 1].title,
    }
    : null;

  const nextPost = currentIndex < allPosts.length - 1
    ? {
      url: allPosts[currentIndex + 1].url,
      title: allPosts[currentIndex + 1].title,
    }
    : null;

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
        <a href="/" class="home-link">Home</a>
        <span class="site-title">${title}</span>
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

      <main class="content">
        ${content}
      </main>

      <nav class="post-nav">
        ${
    prevPost
      ? `<a href="${prevPost.url}" class="prev-link">← 前の記事: ${prevPost.title}</a>`
      : `<span class="prev-link disabled">← 前の記事はありません</span>`
  }
        <a href="/" class="home-link">ホーム</a>
        ${
    nextPost
      ? `<a href="${nextPost.url}" class="next-link">次の記事: ${nextPost.title} →</a>`
      : `<span class="next-link disabled">次の記事はありません →</span>`
  }
      </nav>

      <footer>
        <p>&copy; ${
    new Date().getFullYear()
  } - <a href="/">riou's blog</a> - Powered by <a href="https://lume.land">Lume</a></p>
      </footer>
    </body>
  </html>`;
};
