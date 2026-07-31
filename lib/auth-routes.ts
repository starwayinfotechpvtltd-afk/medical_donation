export type AuthRole =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'patient'
  | 'lab_technician'
  | 'doctor_admin'
  | 'patient_admin'
  | 'ground_staff_admin'
  | 'ground_staff'
  | 'lab_admin'
  | 'nurse_admin'
  | 'offline_patient'
  | 'reception';

const ROLE_ROUTES: Record<AuthRole, { login: string; dashboard: string }> = {
  admin: { login: '/adminLogin', dashboard: '/admin' },
  doctor: { login: '/doctorLogin', dashboard: '/doctor' },
  nurse: { login: '/nurseLogin', dashboard: '/nurse' },
  patient: { login: '/patient/login', dashboard: '/patient' },
  lab_technician: { login: '/labtechLogin', dashboard: '/labtech' },
  doctor_admin: { login: '/doctor-admin-dashboardLogin', dashboard: '/doctor-admin-dashboard' },
  patient_admin: { login: '/patient-admin-dashboardLogin', dashboard: '/patient-admin-dashboard' },
  ground_staff_admin: { login: '/ground-staff-dashboardLogin', dashboard: '/ground-staff-dashboard' },
  ground_staff: { login: '/ground-staff-dashboardLogin', dashboard: '/ground-staff-dashboard' },
  lab_admin: { login: '/lab-admin-dashboardLogin', dashboard: '/lab-admin-dashboard' },
  nurse_admin: { login: '/nurse-admin-dashboardLogin', dashboard: '/nurse-admin-dashboard' },
  offline_patient: { login: '/offline-patient-dashboardLogin', dashboard: '/offline-patient-dashboard' },
  reception: { login: '/reception-dashboardLogin', dashboard: '/reception-dashboard' },
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
  if (pathname.startsWith('/doctor-admin-dashboard')) return 'doctor_admin';
  if (pathname.startsWith('/patient-admin-dashboard')) return 'patient_admin';
  if (pathname.startsWith('/doctor')) return 'doctor';
  if (pathname.startsWith('/lab-admin-dashboard')) return 'lab_admin';
  if (pathname.startsWith('/labtech')) return 'lab_technician';
  if (pathname.startsWith('/nurse-admin-dashboard')) return 'nurse_admin';
  if (pathname.startsWith('/nurse')) return 'nurse';
  if (pathname.startsWith('/patient')) return 'patient';
  if (pathname.startsWith('/ground-staff-dashboard')) return 'ground_staff_admin';
  if (pathname.startsWith('/offline-patient-dashboard')) return 'offline_patient';
  if (pathname.startsWith('/reception-dashboard')) return 'reception';
  return null;
};

export const getDefaultLoginPath = (pathname?: string) =>
  getLoginPathForRole(pathname ? detectRoleFromPath(pathname) : null);
