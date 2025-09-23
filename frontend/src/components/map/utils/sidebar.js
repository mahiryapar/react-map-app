function isSidebarOpen() {
  const el = document.getElementById('polygon-form-sidebar');
  if (!el) return false;
  const cs = window.getComputedStyle(el);
  const right = cs?.right || '';
  return right === '24px' || right === '1.5rem';
}



export { isSidebarOpen };