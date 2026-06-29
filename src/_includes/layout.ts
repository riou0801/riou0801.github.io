export default (
  { title, content, url, search }: Lume.Data,
  helpers: Lume.Helpers,
) => {
  // Only show navigation on post pages
  const showNavigation = url?.startsWith("/posts/");

  // Extract the current post date from URL
  let currentPostDate = null;
  if (showNavigation) {
    const postUrlMatch = url.match(/\/posts\/(\d{4}-\d{2}-\d{2})/);
    if (postUrlMatch && postUrlMatch[1]) {
      currentPostDate = postUrlMatch[1];
    }
  }

  // Get all posts sorted by date if on a post page
  let prevPostUrl = null;
  let prevPostTitle = null;
  let nextPostUrl = null;
  let nextPostTitle = null;

  if (showNavigation && search?.pages) {
    const allPosts = search.pages("type=post", "date=asc");

    // Find current post index
    const currentPostIndex = allPosts.findIndex((post) => post.url === url);

    // If we found the current post
    if (currentPostIndex !== -1) {
      // Get previous post (older)
      if (currentPostIndex > 0) {
        const prev = allPosts[currentPostIndex - 1];
        prevPostUrl = prev.url;
        prevPostTitle = prev.title;
      }

      // Get next post (newer)
      if (currentPostIndex < allPosts.length - 1) {
        const next = allPosts[currentPostIndex + 1];
        nextPostUrl = next.url;
        nextPostTitle = next.title;
      }
    }
  }

  return `<html>
    <head>
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta charset="UTF-8">
      <link rel="stylesheet" href="/css/styles.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css">
      <script>
        (function() {
          const saved = localStorage.getItem('theme');
          if (saved) document.documentElement.setAttribute('data-theme', saved);
        })();
      <\/script>
    </head>
    <body>
      <nav class="site-nav">
        ${
    showNavigation
      ? `<button class="home-link" role="link" aria-label="ホーム" onclick="location.href='/'"></button>`
      : `<span></span>`
  }
        <span class="site-title">riou's blog</span>
        <button class="theme-toggle" id="theme-toggle" aria-label="テーマ切り替え"></button>
      </nav>
      <script>
        (function() {
          const homeLink = document.querySelector('.site-nav .home-link');
          if (homeLink) homeLink.innerHTML = '<i class="ph ph-house"></i>';
          const btn = document.getElementById('theme-toggle');
          if (!btn) return;
          function getTheme() {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;
            return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
          }
          function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            btn.innerHTML = theme === 'dark' ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
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

      ${
    showNavigation
      ? `<nav class="post-nav">
        ${
        prevPostUrl
          ? `<a href="${prevPostUrl}" class="prev-link">← Older: ${
            prevPostTitle || "Previous Post"
          }</a>`
          : `<span class="prev-link disabled">← No Older Posts</span>`
      }
        <a href="/" class="home-link" aria-label="ホーム"><i class="ph ph-house"></i></a>
        ${
        nextPostUrl
          ? `<a href="${nextPostUrl}" class="next-link">Newer: ${
            nextPostTitle || "Next Post"
          } →</a>`
          : `<span class="next-link disabled">No Newer Posts →</span>`
      }
      </nav>`
      : ""
  }
    </body>
  </html>`;
};
