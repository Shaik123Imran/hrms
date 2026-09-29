import { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck2,
  CalendarOff,
  Clock,
  Home,
  Plus,
  RotateCcw,
  Search,
  Users,
} from 'lucide-react';
import * as dataService from '../../services/dataService.js';
import Card from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { getInitials, hoursBetween } from '../../utils/formatters.js';

const STATUSES = ['All', 'Present', 'WFH', 'Late', 'Absent', 'On Leave', 'Half Day'];

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState('2026-09-11');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    employeeId: '',
    date: '2026-09-11',
    status: 'Present',
    checkIn: '',
    checkOut: '',
  });

  useEffect(() => {
    Promise.all([dataService.fetchEmployees(), dataService.fetchAttendance()])
      .then(([employeeRows, attendanceRows]) => {
        setEmployees(employeeRows);
        setRecords(attendanceRows);
      })
      .catch((error) => console.error('Failed to load attendance:', error))
      .finally(() => setLoading(false));
  }, []);

  const dates = useMemo(
    () => [...new Set(records.map((record) => record.date))].sort().reverse(),
    [records]
  );

  const rows = useMemo(() => {
    const employeeMap = new Map(
      employees.map((employee) => [employee.id, employee])
    );

    return records
      .filter((record) => record.date === date)
      .filter((record) => status === 'All' || record.status === status)
      .map((record) => {
        const employee = employeeMap.get(record.employeeId);
        return {
          ...record,
          employeeName: employee
            ? `${employee.firstName} ${employee.lastName}`
            : record.employeeId,
          department: employee?.department || '—',
          initials: employee
            ? getInitials(employee.firstName, employee.lastName)
            : '?',
        };
      })
      .filter((record) =>
        record.employeeName.toLowerCase().includes(search.toLowerCase())
      );
  }, [records, employees, date, status, search]);

  const summary = useMemo(() => {
    const daily = records.filter((record) => record.date === date);
    return {
      present: daily.filter((r) => r.status === 'Present').length,
      wfh: daily.filter((r) => r.status === 'WFH').length,
      late: daily.filter((r) => r.status === 'Late').length,
      absent: daily.filter((r) => r.status === 'Absent').length,
      leave: daily.filter((r) => r.status === 'On Leave').length,
    };
  }, [records, date]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [date, status, search, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const clearFilters = () => {
    setStatus('All');
    setSearch('');
  };

  const openForm = () => {
    setForm({
      employeeId: employees[0]?.id || '',
      date,
      status: 'Present',
      checkIn: '',
      checkOut: '',
    });
    setOpen(true);
  };

  const saveAttendance = async () => {
    if (!form.employeeId || !form.date || !form.status) return;

    const updated = await dataService.saveAttendance({
      ...form,
      checkIn: form.checkIn || '',
      checkOut: form.checkOut || '',
    });

    setRecords(updated);
    setDate(form.date);
    setOpen(false);
  };

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {row.initials}
          </div>
          <div>
            <div className="font-medium">{row.employeeName}</div>
            <div className="text-xs text-secondary">{row.employeeId}</div>
          </div>
        </div>
      ),
    },
    { key: 'department', header: 'Department' },
    { key: 'date', header: 'Date' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'checkIn',
      header: 'Check-in',
      render: (row) => <TimeValue value={row.checkIn} />,
    },
    {
      key: 'checkOut',
      header: 'Check-out',
      render: (row) => <TimeValue value={row.checkOut} />,
    },
    {
      key: 'hours',
      header: 'Working Hours',
      render: (row) => hoursBetween(row.checkIn, row.checkOut) || '—',
    },
  ];

  if (loading) {
    return <div className="page-container text-muted">Loading attendance…</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="text-secondary">Track and manage employee attendance records.</p>
        </div>
        <Button icon={Plus} onClick={openForm}>Add Attendance</Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={CalendarCheck2} label="Present" value={summary.present} />
        <SummaryCard icon={Home} label="Work From Home" value={summary.wfh} />
        <SummaryCard icon={Clock} label="Late" value={summary.late} />
        <SummaryCard icon={CalendarOff} label="On Leave / Absent" value={summary.leave + summary.absent} />
      </div>

      <Card className="mb-6">
        <div className="grid gap-4 lg:grid-cols-[160px_1fr_280px_auto]">
          <select
            className="field-input"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          >
            {dates.map((item) => <option key={item}>{item}</option>)}
          </select>

          <div className="flex flex-wrap gap-2">
            {STATUSES.map((item) => (
              <Button
                key={item}
                variant={status === item ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setStatus(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input
              className="field-input pl-9"
              placeholder="     Search employee..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              className="field-input w-20"
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
            >
              {[5, 10, 15, 20].map((size) => <option key={size}>{size}</option>)}
            </select>
            <Button variant="ghost" size="sm" icon={RotateCcw} onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <Card
        title="Attendance Records"
        subtitle={`${rows.length} record${rows.length === 1 ? '' : 's'} found • ${employees.length} employees`}
      >
        {rows.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No attendance records"
            description="Try changing the date or filters."
          />
        ) : (
          <>
            <Table columns={columns} rows={pageRows} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-secondary">
              <span>
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, rows.length)} of {rows.length}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-2">{page} / {totalPages}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add / Update Attendance"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={saveAttendance}>Save Attendance</Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="Employee">
            <select
              className="field-input"
              value={form.employeeId}
              onChange={(event) => setForm({ ...form, employeeId: event.target.value })}
            >
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Date">
              <input
                className="field-input"
                type="date"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            </Field>

            <Field label="Status">
              <select
                className="field-input"
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                {STATUSES.slice(1).map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Check-in">
              <input
                className="field-input"
                type="time"
                value={form.checkIn}
                onChange={(event) => setForm({ ...form, checkIn: event.target.value })}
              />
            </Field>

            <Field label="Check-out">
              <input
                className="field-input"
                type="time"
                value={form.checkOut}
                onChange={(event) => setForm({ ...form, checkOut: event.target.value })}
              />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="surface-card p-5">
      <div className="mb-3 flex items-center gap-3 text-secondary">
        <Icon size={20} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const className = {
    Present: 'badge-success',
    WFH: 'badge-info',
    Late: 'badge-warning',
    'Half Day': 'badge-warning',
    Absent: 'badge-error',
    'On Leave': 'badge-error',
  }[status] || '';

  return <span className={`badge ${className}`}>{status}</span>;
}

function TimeValue({ value }) {
  return (
    <span className="inline-flex items-center gap-1 text-secondary">
      <Clock size={14} />
      {value || '—'}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
