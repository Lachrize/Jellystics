export function useCurrentUser() {
  const username = localStorage.getItem('jellystat-username') ?? ''
  return { username }
}
