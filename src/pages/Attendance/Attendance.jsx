import { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck2,
  Clock,
  CalendarOff,
  Home,
  Plus,
  Search,
  Users,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
} from 'lucide-react';
import * as dataService from '../../services/dataService.js';
import { getInitials } from '../../utils/formatters.js';

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState('2026-09-11');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    employeeId: '',
    date: '2026-09-11',
    status: 'Present',
    checkIn: '',
    checkOut: '',
  });

  useEffect(() => {
    Promise.all([
      dataService.fetchEmployees(),
      dataService.fetchAttendance(),
    ])
      .then(([employeeRows, attendanceRows]) => {
        setEmployees(employeeRows);
        setRecords(attendanceRows);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load attendance:', error);
        setLoading(false);
      });
  }, []);

  const dates = useMemo(
    () =>
      [...new Set(records.map((record) => record.date))]
        .sort()
        .reverse(),
    [records]
  );

  const rows = useMemo(() => {
    return records
      .filter((record) => record.date === date)
      .filter(
        (record) =>
          statusFilter === 'All' ||
          record.status === statusFilter
      )
      .map((record) => {
        const employee = employees.find(
          (item) => item.id === record.employeeId
        );

        return {
          ...record,
          employeeName: employee
            ? `${employee.firstName} ${employee.lastName}`
            : record.employeeId,
          department: employee
            ? employee.department
            : '—',
          initials: employee
            ? getInitials(
                employee.firstName,
                employee.lastName
              )
            : '?',
        };
      })
      .filter((record) =>
        record.employeeName
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [
    records,
    employees,
    date,
    statusFilter,
    search,
  ]);

  const summary = useMemo(() => {
    const daily = records.filter(
      (record) => record.date === date
    );

    return {
      present: daily.filter(
        (record) => record.status === 'Present'
      ).length,

      wfh: daily.filter(
        (record) => record.status === 'WFH'
      ).length,

      late: daily.filter(
        (record) => record.status === 'Late'
      ).length,

      absent: daily.filter(
        (record) => record.status === 'Absent'
      ).length,

      leave: daily.filter(
        (record) => record.status === 'On Leave'
      ).length,
    };
  }, [records, date]);

  const totalPages = Math.max(
    1,
    Math.ceil(rows.length / rowsPerPage)
  );

  const paginatedRows = useMemo(() => {
    const start =
      (currentPage - 1) * rowsPerPage;

    return rows.slice(
      start,
      start + rowsPerPage
    );
  }, [rows, currentPage, rowsPerPage]);

  const startRow =
    rows.length === 0
      ? 0
      : (currentPage - 1) * rowsPerPage + 1;

  const endRow = Math.min(
    currentPage * rowsPerPage,
    rows.length
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    date,
    statusFilter,
    search,
    rowsPerPage,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    setStatusFilter('All');
    setSearch('');
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setForm({
      employeeId: employees[0]?.id || '',
      date,
      status: 'Present',
      checkIn: '',
      checkOut: '',
    });

    setShowModal(true);
  };

  const saveAttendance = () => {
    if (
      !form.employeeId ||
      !form.date ||
      !form.status
    ) {
      return;
    }

    const database = JSON.parse(
      localStorage.getItem('hrms_data') || '{}'
    );

    if (!database.attendance) {
      database.attendance = [];
    }

    const existingIndex =
      database.attendance.findIndex(
        (record) =>
          record.employeeId === form.employeeId &&
          record.date === form.date
      );

    const attendanceRecord = {
      id:
        existingIndex >= 0
          ? database.attendance[existingIndex].id
          : `att${Date.now()}`,

      employeeId: form.employeeId,
      date: form.date,
      status: form.status,
      checkIn: form.checkIn || '',
      checkOut: form.checkOut || '',
    };

    if (existingIndex >= 0) {
      database.attendance[existingIndex] =
        attendanceRecord;
    } else {
      database.attendance.push(
        attendanceRecord
      );
    }

    localStorage.setItem(
      'hrms_data',
      JSON.stringify(database)
    );

    setRecords(database.attendance);
    setDate(form.date);
    setShowModal(false);
  };

  const calculateHours = (
    checkIn,
    checkOut
  ) => {
    if (!checkIn || !checkOut) {
      return '—';
    }

    const parseTime = (time) => {
      const value = String(time).trim();

      const match24 = value.match(
        /^(\d{1,2}):(\d{2})$/
      );

      if (match24) {
        return {
          hours: Number(match24[1]),
          minutes: Number(match24[2]),
        };
      }

      const match12 = value.match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
      );

      if (match12) {
        let hours = Number(match12[1]);
        const minutes = Number(match12[2]);
        const period =
          match12[3].toUpperCase();

        if (
          period === 'PM' &&
          hours !== 12
        ) {
          hours += 12;
        }

        if (
          period === 'AM' &&
          hours === 12
        ) {
          hours = 0;
        }

        return {
          hours,
          minutes,
        };
      }

      return null;
    };

    const start = parseTime(checkIn);
    const end = parseTime(checkOut);

    if (!start || !end) {
      return '—';
    }

    const startMinutes =
      start.hours * 60 + start.minutes;

    const endMinutes =
      end.hours * 60 + end.minutes;

    let difference =
      endMinutes - startMinutes;

    if (difference < 0) {
      difference += 24 * 60;
    }

    const hours = Math.floor(
      difference / 60
    );

    const minutes =
      difference % 60;

    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p className="muted">
          Loading attendance…
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1500px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '5px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                background: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarCheck2 size={21} />
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: '1.55rem',
                fontWeight: 800,
                color: '#172033',
              }}
            >
              Attendance
            </h2>
          </div>

          <p
            style={{
              margin: 0,
              color: '#64748b',
              fontSize: '0.86rem',
            }}
          >
            Track and manage employee attendance
            records.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openAddModal}
          style={{
            minHeight: '42px',
            padding: '0 18px',
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={17} />
          Add Attendance
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4, minmax(0, 1fr))',
          gap: '14px',
          marginBottom: '16px',
        }}
      >
        <SummaryCard
          label="Present"
          value={summary.present}
          description="Employees present today"
          icon={<CalendarCheck2 size={21} />}
          color="#16a34a"
          background="#ecfdf3"
        />

        <SummaryCard
          label="Work From Home"
          value={summary.wfh}
          description="Working remotely today"
          icon={<Home size={21} />}
          color="#2563eb"
          background="#eff6ff"
        />

        <SummaryCard
          label="Late"
          value={summary.late}
          description="Late arrivals today"
          icon={<Clock size={21} />}
          color="#d97706"
          background="#fffbeb"
        />

        <SummaryCard
          label="On Leave / Absent"
          value={
            summary.leave +
            summary.absent
          }
          description="On leave or absent today"
          icon={<CalendarOff size={21} />}
          color="#dc2626"
          background="#fef2f2"
        />
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '13px',
          marginBottom: '14px',
          boxShadow:
            '0 4px 18px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '155px minmax(0, 1fr) 245px auto',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <select
            className="form-select"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
          >
            {dates.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {[
              'All',
              'Present',
              'WFH',
              'Late',
              'Absent',
              'On Leave',
              'Half Day',
            ].map((item) => (
              <StatusFilter
                key={item}
                status={item}
                active={
                  statusFilter === item
                }
                onClick={() =>
                  setStatusFilter(item)
                }
              />
            ))}
          </div>

          <div
            style={{
              position: 'relative',
              minWidth: 0,
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '11px',
                top: '50%',
                transform:
                  'translateY(-50%)',
                color: '#64748b',
              }}
            />

            <input
              className="form-input"
              style={{
                paddingLeft: '35px',
              }}
              placeholder="Search employee..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                fontSize: '0.73rem',
                color: '#64748b',
              }}
            >
              Rows per page
            </span>

            <select
              className="form-select"
              value={rowsPerPage}
              onChange={(event) =>
                setRowsPerPage(
                  Number(event.target.value)
                )
              }
              style={{
                width: '65px',
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
              title="Clear filters"
              style={{
                height: '38px',
                padding: '0 11px',
                borderRadius: '8px',
                border:
                  '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                fontSize: '0.76rem',
                fontWeight: 600,
              }}
            >
              <RotateCcw size={14} />
              Clear
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow:
            '0 4px 18px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div
          style={{
            padding: '13px 15px',
            borderBottom:
              '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                background: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={17} />
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 750,
                  color: '#172033',
                }}
              >
                Attendance Records
              </div>

              <div
                style={{
                  fontSize: '0.7rem',
                  color: '#64748b',
                  marginTop: '2px',
                }}
              >
                {rows.length}{' '}
                {rows.length === 1
                  ? 'record'
                  : 'records'}{' '}
                found
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: '0.72rem',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Users size={14} />
            {employees.length} employees
          </div>
        </div>

        <div
          style={{
            width: '100%',
            overflowX: 'auto',
          }}
        >
          <table
            className="table"
            style={{
              minWidth: '900px',
            }}
          >
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Working Hours</th>
                <th
                  style={{
                    width: '45px',
                    textAlign: 'center',
                  }}
                >
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                      }}
                    >
                      <div className="avatar avatar-sm">
                        {row.initials}
                      </div>

                      <div>
                        <div className="cell-title">
                          {row.employeeName}
                        </div>

                        <div
                          className="cell-subtitle"
                          style={{
                            fontSize: '0.67rem',
                          }}
                        >
                          {row.employeeId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {row.department}
                  </td>

                  <td>
                    {row.date}
                  </td>

                  <td>
                    <StatusBadge
                      status={row.status}
                    />
                  </td>

                  <td>
                    <TimeValue
                      value={row.checkIn}
                    />
                  </td>

                  <td>
                    <TimeValue
                      value={row.checkOut}
                    />
                  </td>

                  <td>
                    <span
                      style={{
                        color: '#475569',
                        fontWeight: 600,
                      }}
                    >
                      {calculateHours(
                        row.checkIn,
                        row.checkOut
                      )}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      title="More actions"
                      style={{
                        width: '29px',
                        height: '29px',
                        borderRadius: '8px',
                        border:
                          '1px solid #e2e8f0',
                        background:
                          '#f8fafc',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        margin: '0 auto',
                      }}
                    >
                      <MoreHorizontal
                        size={15}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div
            style={{
              padding: '45px 20px',
              textAlign: 'center',
              color: '#64748b',
            }}
          >
            <CalendarCheck2
              size={32}
              style={{
                margin: '0 auto 10px',
                opacity: 0.5,
              }}
            />

            <div
              style={{
                fontWeight: 700,
                color: '#334155',
                marginBottom: '4px',
              }}
            >
              No attendance records
            </div>

            <div
              style={{
                fontSize: '0.8rem',
              }}
            >
              Try changing the date or
              filters.
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div
            style={{
              padding: '10px 14px',
              borderTop:
                '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontSize: '0.7rem',
                color: '#64748b',
              }}
            >
              Showing {startRow} to {endRow}{' '}
              of {rows.length} records
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1
                  )
                }
                style={paginationButtonStyle(
                  currentPage === 1
                )}
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '7px',
                    border:
                      page === currentPage
                        ? '1px solid #4f46e5'
                        : '1px solid #e2e8f0',
                    background:
                      page === currentPage
                        ? '#4f46e5'
                        : '#ffffff',
                    color:
                      page === currentPage
                        ? '#ffffff'
                        : '#475569',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page + 1
                  )
                }
                style={paginationButtonStyle(
                  currentPage === totalPages
                )}
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowModal(false);
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background:
              'rgba(15, 23, 42, 0.48)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '390px',
              maxHeight:
                'calc(100vh - 32px)',
              overflowY: 'auto',
              background: '#ffffff',
              borderRadius: '12px',
              border:
                '1px solid #e2e8f0',
              boxShadow:
                '0 25px 70px rgba(15, 23, 42, 0.25)',
            }}
          >
            <div
              style={{
                padding: '11px 13px',
                borderBottom:
                  '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#172033',
                  }}
                >
                  Add / Update Attendance
                </div>

                <div
                  style={{
                    marginTop: '2px',
                    fontSize: '0.63rem',
                    color: '#64748b',
                  }}
                >
                  Enter attendance details
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                style={{
                  width: '27px',
                  height: '27px',
                  borderRadius: '7px',
                  border:
                    '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            </div>

            <div
              style={{
                padding: '12px 13px',
                display: 'grid',
                gap: '9px',
              }}
            >
              <div>
                <label
                  className="form-label"
                  style={{
                    fontSize: '0.64rem',
                  }}
                >
                  Employee
                </label>

                <select
                  className="form-select"
                  value={form.employeeId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      employeeId:
                        event.target.value,
                    })
                  }
                  style={{
                    minHeight: '31px',
                    fontSize: '0.68rem',
                  }}
                >
                  <option value="">
                    Select employee
                  </option>

                  {employees.map(
                    (employee) => (
                      <option
                        key={employee.id}
                        value={employee.id}
                      >
                        {employee.firstName}{' '}
                        {employee.lastName}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap: '9px',
                }}
              >
                <div>
                  <label
                    className="form-label"
                    style={{
                      fontSize: '0.64rem',
                    }}
                  >
                    Date
                  </label>

                  <input
                    type="date"
                    className="form-input"
                    value={form.date}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        date: event.target.value,
                      })
                    }
                    style={{
                      minHeight: '31px',
                      fontSize: '0.68rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    className="form-label"
                    style={{
                      fontSize: '0.64rem',
                    }}
                  >
                    Status
                  </label>

                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status:
                          event.target.value,
                      })
                    }
                    style={{
                      minHeight: '31px',
                      fontSize: '0.68rem',
                    }}
                  >
                    <option value="Present">
                      Present
                    </option>
                    <option value="WFH">
                      WFH
                    </option>
                    <option value="Late">
                      Late
                    </option>
                    <option value="Absent">
                      Absent
                    </option>
                    <option value="On Leave">
                      On Leave
                    </option>
                    <option value="Half Day">
                      Half Day
                    </option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap: '9px',
                }}
              >
                <div>
                  <label
                    className="form-label"
                    style={{
                      fontSize: '0.64rem',
                    }}
                  >
                    Check-in
                  </label>

                  <input
                    type="time"
                    className="form-input"
                    value={form.checkIn}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        checkIn:
                          event.target.value,
                      })
                    }
                    style={{
                      minHeight: '31px',
                      fontSize: '0.68rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    className="form-label"
                    style={{
                      fontSize: '0.64rem',
                    }}
                  >
                    Check-out
                  </label>

                  <input
                    type="time"
                    className="form-input"
                    value={form.checkOut}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        checkOut:
                          event.target.value,
                      })
                    }
                    style={{
                      minHeight: '31px',
                      fontSize: '0.68rem',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'flex-end',
                  gap: '7px',
                  paddingTop: '3px',
                }}
              >
                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                  style={{
                    minHeight: '30px',
                    padding: '0 11px',
                    fontSize: '0.67rem',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveAttendance}
                  style={{
                    minHeight: '30px',
                    padding: '0 11px',
                    fontSize: '0.67rem',
                  }}
                >
                  Save Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  color,
  background,
}) {
  return (
    <div
      style={{
        minHeight: '100px',
        padding: '14px',
        borderRadius: '12px',
        border: `1px solid ${color}25`,
        borderLeft: `4px solid ${color}`,
        background:
          'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow:
          '0 4px 16px rgba(15, 23, 42, 0.045)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '46px',
          height: '46px',
          minWidth: '46px',
          borderRadius: '50%',
          background,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color,
            marginBottom: '3px',
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: '1.45rem',
            lineHeight: 1,
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          {value}
        </div>

        <div
          style={{
            marginTop: '5px',
            fontSize: '0.59rem',
            color: '#94a3b8',
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Present: {
      background: '#dcfce7',
      color: '#15803d',
      dot: '#16a34a',
    },

    WFH: {
      background: '#dbeafe',
      color: '#1d4ed8',
      dot: '#2563eb',
    },

    Late: {
      background: '#fef3c7',
      color: '#b45309',
      dot: '#f59e0b',
    },

    Absent: {
      background: '#fee2e2',
      color: '#b91c1c',
      dot: '#ef4444',
    },

    'On Leave': {
      background: '#fee2e2',
      color: '#b91c1c',
      dot: '#ef4444',
    },

    'Half Day': {
      background: '#fef3c7',
      color: '#b45309',
      dot: '#f59e0b',
    },
  };

  const style =
    styles[status] || {
      background: '#f1f5f9',
      color: '#475569',
      dot: '#64748b',
    };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 9px',
        borderRadius: '999px',
        background: style.background,
        color: style.color,
        fontSize: '0.65rem',
        fontWeight: 750,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: style.dot,
        }}
      />

      {status}
    </span>
  );
}

function StatusFilter({
  status,
  active,
  onClick,
}) {
  const colors = {
    All: '#4f46e5',
    Present: '#16a34a',
    WFH: '#2563eb',
    Late: '#d97706',
    Absent: '#dc2626',
    'On Leave': '#dc2626',
    'Half Day': '#d97706',
  };

  const color =
    colors[status] || '#4f46e5';

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: '30px',
        padding: '0 11px',
        borderRadius: '999px',
        border: active
          ? `1px solid ${color}`
          : '1px solid #e2e8f0',
        background: active
          ? `${color}12`
          : '#ffffff',
        color: active
          ? color
          : '#64748b',
        fontSize: '0.66rem',
        fontWeight: active ? 750 : 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </button>
  );
}

function TimeValue({ value }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        color: '#64748b',
        fontSize: '0.7rem',
        whiteSpace: 'nowrap',
      }}
    >
      <Clock size={13} />

      {value || '—'}
    </span>
  );
}

function paginationButtonStyle(
  disabled
) {
  return {
    height: '30px',
    padding: '0 8px',
    borderRadius: '7px',
    border: '1px solid #e2e8f0',
    background: disabled
      ? '#f8fafc'
      : '#ffffff',
    color: disabled
      ? '#cbd5e1'
      : '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    cursor: disabled
      ? 'not-allowed'
      : 'pointer',
    fontSize: '0.68rem',
    fontWeight: 600,
  };
}