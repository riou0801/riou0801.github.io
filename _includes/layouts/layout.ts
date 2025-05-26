import navigation from "./nav.ts";

export default ({ title, content }: Lume.Data, helper: Lume.Helpers) => {
  const menuHtml = navigation(helper);

  return `
  <html>
    <head>
      <title>${title}</title>
      <link rel="stylesheet" href="/css/catppuccin-overrides.css">
    </head>
    <body>
      ${menuHtml} ${content}
    </body>
    
  </html> `;
};