import lume from "lume/mod.ts";
import blog from "https://deno.land/x/lume_theme_simple_blog@v0.14.0/mod.ts"

const site = lume();

site.use(blog())

// Preprocessor to set layout for all markdown pages
site.preprocess(['.md'], (page) => {
  page.data.layout = 'layouts/layout.ts';
});

export default site;
