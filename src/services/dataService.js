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
  const session = { id: user.id, name: user.name, email: user.email, role: user.role };
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