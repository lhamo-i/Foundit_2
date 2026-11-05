// Small helpers for dates, times and ids.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// A unique id. With Firebase, Firestore creates ids for you.
export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export const todayISO = () => toISODate(new Date());
export function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
}
export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// "3 Nov 2026"
export function formatDate(iso) {
  if (!iso) return '';
  const d = parseISO(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// "Today", "Yesterday", or "Mon, 3 Nov"
export function dateLabel(iso) {
  if (iso === todayISO()) return 'Today';
  if (iso === daysAgoISO(1)) return 'Yesterday';
  const d = parseISO(iso);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// "Just now", "5m ago", "2h ago", "3d ago"
export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

// "10:24 AM"
export function formatTime(ts) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

// Contact privacy: show only the first 4 characters of a student ID, e.g. "0224xxxx"
export function maskStudentId(id) {
  if (!id) return '';
  return id.length <= 4 ? id : id.slice(0, 4) + 'x'.repeat(id.length - 4);
}
