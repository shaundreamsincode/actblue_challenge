export default function fetchWithCSRF(url, options = {}) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

  const headers = {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
