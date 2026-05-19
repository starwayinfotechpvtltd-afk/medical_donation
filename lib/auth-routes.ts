export type AuthRole = 'admin' | 'doctor' | 'nurse' | 'patient' | 'lab_technician';

const ROLE_ROUTES: Record<AuthRole, { login: string; dashboard: string }> = {
  admin: { login: '/adminLogin', dashboard: '/admin' },
  doctor: { login: '/doctorLogin', dashboard: '/doctor' },
  nurse: { login: '/nurse/login', dashboard: '/nurse' },
  patient: { login: '/patient/login', dashboard: '/patient' },
  lab_technician: { login: '/labtechLogin', dashboard: '/labtech' },
};

export const getLoginPathForRole = (role?: AuthRole | null) => {
  if (!role) return '/patient/login';
  return ROLE_ROUTES[role].login;
};

export const getDashboardPathForRole = (role?: AuthRole | null) => {
  if (!role) return '/';
  return ROLE_ROUTES[role].dashboard;
};

export const detectRoleFromPath = (pathname: string): AuthRole | null => {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/doctor')) return 'doctor';
  if (pathname.startsWith('/labtech')) return 'lab_technician';
  if (pathname.startsWith('/nurse')) return 'nurse';
  if (pathname.startsWith('/patient')) return 'patient';
  return null;
};

export const getDefaultLoginPath = (pathname?: string) =>
  getLoginPathForRole(pathname ? detectRoleFromPath(pathname) : null);
