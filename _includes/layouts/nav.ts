export default (helper: Lume.Helpers) => {
  const menu = helper.nav.menu();
  // Now you can use `menu` to build your navigation structure
  // Iterate over the menu items and generate HTML accordingly
  let menuHtml = '<ul>';
  for (const item of menu.children) {
    menuHtml += `<li>
      ${item.data ? `<a href="${item.data.url}">${item.data.title}</a>` : `<span>${item.slug}</span>`}
    </li>`;
  }
  menuHtml += '</ul>';

  return `<nav>${menuHtml}</nav>`;
};