/**
 * Authenticated product surface. No auth guard is wired yet — authentication
 * implementation is explicitly out of scope for this milestone (see repo-root
 * mission scope). This layout exists so the auth boundary has a clear,
 * pre-agreed home instead of being retrofitted later.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div data-app-shell>{children}</div>;
}
