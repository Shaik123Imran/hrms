import seedData from '../data/data.json';

const STORAGE_KEY = 'hrms_data';
const SESSION_KEY = 'hrms_session';

const isBrowser = typeof window !== 'undefined';
const delay = (data, ms = 150) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

function readDb() {
  if (!isBrowser) return seedData;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to seed data
    }
  }
  const fresh = JSON.parse(JSON.stringify(seedData));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

function writeDb(db) {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function nextEntityId(db, entity, prefix) {
  const existing = db[entity].map((item) => item.id);
  let i = existing.length + 1;
  let id = `${prefix}${i}`;
  while (existing.includes(id)) {
    i += 1;
    id = `${prefix}${i}`;
  }
  return id;
}

export async function fetchEmployees() {
  return delay(readDb().employees);
}

export async function fetchEmployeeById(id) {
  const db = readDb();
  return delay(db.employees.find((employee) => employee.id === id) || null);
}

export async function fetchDepartments() {
  return delay(readDb().departments);
}

export async function fetchDesignations() {
  return delay(readDb().designations);
}

export async function fetchAttendance() {
  return delay(readDb().attendance);
}

export async function fetchLeaves() {
  return delay(readDb().leaves);
}

export async function fetchDashboardData() {
  const db = readDb();
  const today = seedData.meta.generatedAt;
  const employees = db.employees;
  const attendance = db.attendance;
  const leaves = db.leaves;

  const departmentDistribution = employees.reduce((acc, employee) => {
    const existing = acc.find((item) => item.name === employee.department);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: employee.department, value: 1 });
    }
    return acc;
  }, []);

  const todayRecords = attendance.filter((record) => record.date === today);
  const presentToday = todayRecords.filter(
    (record) => record.status === 'Present' || record.status === 'WFH'
  ).length;
  const onLeaveToday = todayRecords.filter(
    (record) => record.status === 'On Leave'
  ).length;
  const lateToday = todayRecords.filter((record) => record.status === 'Late').length;
  const pendingLeaves = leaves.filter((leave) => leave.status === 'Pending').length;

  const stats = {
    totalEmployees: employees.length,
    presentToday,
    onLeaveToday,
    lateToday,
    pendingLeaves,
    departments: departmentDistribution.length,
    avgAttendance: 94,
  };

  const todayRecordsWithNames = todayRecords.map((record) => {
    const employee = employees.find((item) => item.id === record.employeeId);
    return {
      ...record,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : record.employeeId,
    };
  });

  return delay({
    stats,
    departmentDistribution,
    attendanceTrend: db.dashboard.attendanceTrend,
    recentActivities: db.dashboard.recentActivities,
    todayRecords: todayRecordsWithNames,
  });
}

// --- Personal (Employee-role) dashboard -----------------------------------

const LEAVE_TYPES_COUNTED_TOWARD_BALANCE = ['Casual Leave', 'Sick Leave', 'Earned Leave'];

function scoreForAttendanceStatus(status) {
  if (status === 'Present' || status === 'WFH') return 100;
  if (status === 'Late') return 85;
  if (status === 'Half Day') return 50;
  return 0; // Absent, On Leave
}

function formatShortDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export async function fetchMyDashboardData(employeeId) {
  const db = readDb();
  const employee = db.employees.find((item) => item.id === employeeId) || null;
  const myAttendance = db.attendance
    .filter((record) => record.employeeId === employeeId)
    .sort((a, b) => a.date.localeCompare(b.date));
  const myLeaves = db.leaves.filter((leave) => leave.employeeId === employeeId);

  const presentDays = myAttendance.filter(
    (record) => record.status === 'Present' || record.status === 'WFH'
  ).length;
  const attendancePct = myAttendance.length
    ? Math.round((presentDays / myAttendance.length) * 100)
    : 0;
  const lateCount = myAttendance.filter((record) => record.status === 'Late').length;

  const usedLeaveDays = myLeaves
    .filter((leave) => leave.status === 'Approved' && LEAVE_TYPES_COUNTED_TOWARD_BALANCE.includes(leave.type))
    .reduce((sum, leave) => sum + leave.days, 0);
  const annualEntitlement = db.settings?.annualLeaveEntitlement ?? 18;
  const leaveBalance = Math.max(annualEntitlement - usedLeaveDays, 0);

  const pendingRequests = myLeaves.filter((leave) => leave.status === 'Pending').length;

  const attendanceStrip = myAttendance.slice(-6).map((record) => ({
    day: formatShortDate(record.date),
    score: scoreForAttendanceStatus(record.status),
    status: record.status,
  }));

  const leaveTypeBreakdown = myLeaves.reduce((acc, leave) => {
    const existing = acc.find((item) => item.name === leave.type);
    if (existing) {
      existing.value += leave.days;
    } else {
      acc.push({ name: leave.type, value: leave.days });
    }
    return acc;
  }, []);

  const recentLeaves = [...myLeaves]
    .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
    .slice(0, 5);

  return delay({
    employee,
    stats: { attendancePct, presentDays, lateCount, leaveBalance, pendingRequests },
    attendanceStrip,
    leaveTypeBreakdown,
    recentLeaves,
    recentActivities: db.dashboard.recentActivities.slice(0, 4),
  });
}

const ORG_VIEW_ROLES = ['Admin', 'HR Manager'];

/**
 * Single entry point the Dashboard page calls. Branches on the logged-in
 * user's role: Admin/HR Manager get the org-wide view, everyone else
 * (Employee, and any future role) gets their personal view.
 */
export async function fetchDashboardForUser(user) {
  if (!user) return null;
  if (ORG_VIEW_ROLES.includes(user.role)) {
    const data = await fetchDashboardData();
    return { viewType: 'org', ...data };
  }
  const data = await fetchMyDashboardData(user.employeeId);
  return { viewType: 'self', ...data };
}

// ---------------------------------------------------------------------------

export async function createEmployee(employee) {
  const db = readDb();
  const newEmployee = {
    id: nextEntityId(db, 'employees', 'e'),
    status: 'Active',
    ...employee,
  };
  db.employees.push(newEmployee);
  writeDb(db);
  return delay(newEmployee);
}

export async function updateEmployee(id, employee) {
  const db = readDb();
  const index = db.employees.findIndex((item) => item.id === id);
  if (index === -1) return delay(null);
  db.employees[index] = { ...db.employees[index], ...employee };
  writeDb(db);
  return delay(db.employees[index]);
}

export async function deleteEmployee(id) {
  const db = readDb();
  db.employees = db.employees.filter((item) => item.id !== id);
  writeDb(db);
  return delay(true);
}

export async function createLeave(leave) {
  const db = readDb();
  const newLeave = {
    id: nextEntityId(db, 'leaves', 'lv'),
    status: 'Pending',
    appliedOn: seedData.meta.generatedAt,
    ...leave,
  };
  db.leaves.push(newLeave);
  writeDb(db);
  return delay(newLeave);
}

export async function updateLeaveStatus(id, status) {
  const db = readDb();
  const index = db.leaves.findIndex((item) => item.id === id);
  if (index === -1) return delay(null);
  db.leaves[index].status = status;
  writeDb(db);
  return delay(db.leaves[index]);
}

export async function login(email, password) {
  const db = readDb();
  const user = db.users.find(
    (item) =>
      item.email.toLowerCase() === String(email).toLowerCase() &&
      item.password === password
  );
  if (!user) return delay(null, 300);
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId ?? null,
  };
  if (isBrowser) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return delay(session, 300);
}

export function readSession() {
  if (!isBrowser) return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logout() {
  if (isBrowser) localStorage.removeItem(SESSION_KEY);
}

export function resetData() {
  if (isBrowser) localStorage.removeItem(STORAGE_KEY);
}