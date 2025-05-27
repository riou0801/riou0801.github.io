import lume from "lume/mod.ts";
import metas from "lume/plugins/metas.ts";
import basePath from "lume/plugins/base_path.ts";

const site = lume({
  src: "./src",
  dest: "./_site",
  location: new URL("https://riou0801.github.io"),
});

// Copy static assets from src directories
site.copy("css");
site.copy("assets");

// Configure default layout for posts
site.data("posts", {
  url: (post) => {
    const filename = post.src.path.split("/").pop()?.replace(/\.md$/, "") || "";
    return `/posts/${filename}/`;
  }
});

// Process markdown files
site.process([".md"], (page) => {
  // Set type and layout for posts
  if (page.src?.path?.includes("/posts/")) {
    page.data.type = "post";
    
    // Only set layout if not explicitly defined in frontmatter
    if (!page.data.layout) {
      page.data.layout = "layout.ts";
    }
  }
});

// Use plugins
site.use(metas());
site.use(basePath());

// Process markdown files to ensure correct post types
site.process([".md"], (page) => {
  // If the page is in the posts directory, set its type to "post"
  if (page.src?.path?.includes("/posts/")) {
    page.data.type = "post";
  }
});

export default site;
