export default ({ title, content, url, search }: Lume.Data, helpers: Lume.Helpers) => {
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
    const currentPostIndex = allPosts.findIndex(post => post.url === url);
    
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
    </head>
    <body>
      ${showNavigation ? `<nav class="site-nav">
        <a href="/" class="home-link">Home</a>
      </nav>` : ""}
      
      <main class="content">
        ${content}
      </main>
      
      ${showNavigation ? `<nav class="post-nav">
        ${prevPostUrl ? `<a href="${prevPostUrl}" class="prev-link">← Older: ${prevPostTitle || "Previous Post"}</a>` : `<span class="prev-link disabled">← No Older Posts</span>`}
        <a href="/" class="home-link">Home</a>
        ${nextPostUrl ? `<a href="${nextPostUrl}" class="next-link">Newer: ${nextPostTitle || "Next Post"} →</a>` : `<span class="next-link disabled">No Newer Posts →</span>`}
      </nav>` : ""}
    </body>
  </html>`;
};
