import React, { useMemo, useState } from "react";

// ======================================================
// SAMPLE DATA
// ======================================================

const departmentData = [
  { name: "Water Supply", complaints: 320 },
  { name: "Roads & Infrastructure", complaints: 245 },
  { name: "Sanitation", complaints: 180 },
  { name: "Drainage & Sewerage", complaints: 150 },
  { name: "Electrical & Street Lighting", complaints: 120 },
  { name: "Traffic Management", complaints: 85 },
  { name: "Parks & Horticulture", complaints: 72 },
  { name: "Building & Construction", complaints: 55 },
  { name: "General Administration", complaints: 21 },
];

const statusData = [
  {
    name: "Resolved",
    value: 842,
    percentage: 67.5,
    icon: "✓",
    bg: "bg-emerald-500",
  },
  {
    name: "Pending",
    value: 276,
    percentage: 22.1,
    icon: "◷",
    bg: "bg-orange-500",
  },
  {
    name: "In Progress",
    value: 138,
    percentage: 11.1,
    icon: "◌",
    bg: "bg-purple-500",
  },
  {
    name: "Rejected",
    value: 32,
    percentage: 2.6,
    icon: "×",
    bg: "bg-red-500",
  },
];

const priorityData = [
  {
    name: "High",
    value: 320,
    bg: "bg-red-400",
  },
  {
    name: "Medium",
    value: 510,
    bg: "bg-orange-400",
  },
  {
    name: "Low",
    value: 418,
    bg: "bg-emerald-500",
  },
];

const staffData = [
  {
    name: "Amit Sharma",
    department: "Water Supply",
    assigned: 45,
    resolved: 38,
    pending: 7,
    slaRate: 84,
  },
  {
    name: "Priya Singh",
    department: "Roads & Infrastructure",
    assigned: 52,
    resolved: 40,
    pending: 12,
    slaRate: 77,
  },
  {
    name: "Rohan Mehta",
    department: "Sanitation",
    assigned: 38,
    resolved: 35,
    pending: 3,
    slaRate: 92,
  },
  {
    name: "Sneha Patel",
    department: "Drainage & Sewerage",
    assigned: 47,
    resolved: 36,
    pending: 11,
    slaRate: 77,
  },
  {
    name: "Vikram Joshi",
    department: "Electrical & Street Lighting",
    assigned: 31,
    resolved: 26,
    pending: 5,
    slaRate: 84,
  },
];

const resolutionData = [
  {
    department: "Overall",
    hours: 18.4,
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    department: "Water Supply",
    hours: 14.2,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    department: "Roads & Infrastructure",
    hours: 21.8,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    department: "Sanitation",
    hours: 16.5,
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
  {
    department: "Drainage",
    hours: 25.3,
    bg: "bg-red-50",
    text: "text-red-600",
  },
  {
    department: "Electrical",
    hours: 17.1,
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

const ReportsAnalytics = () => {
  // ====================================================
  // FILTER STATE
  // ====================================================

  const [dateRange, setDateRange] =
    useState("Last 30 Days");

  const [departmentFilter, setDepartmentFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [priorityFilter, setPriorityFilter] =
    useState("");

  const [trendRange, setTrendRange] =
    useState("30D");

  // ====================================================
  // MAX VALUES
  // ====================================================

  const maxDepartmentComplaints =
    Math.max(
      ...departmentData.map(
        (item) => item.complaints
      )
    );

  const maxPriorityValue =
    Math.max(
      ...priorityData.map(
        (item) => item.value
      )
    );

  // ====================================================
  // RESET FILTERS
  // ====================================================

  const resetFilters = () => {
    setDateRange("Last 30 Days");
    setDepartmentFilter("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  // ====================================================
  // RESOLUTION RATE
  // ====================================================

  const resolutionRate =
    842 / 1248 * 100;

  // ====================================================
  // SVG DONUT
  // ====================================================

  const donutSegments = useMemo(() => {
    const total = statusData.reduce(
      (sum, item) => sum + item.value,
      0
    );

    let current = 0;

    return statusData.map((item) => {
      const start = current;

      const percentage =
        item.value / total;

      current += percentage;

      return {
        ...item,
        start,
        end: current,
      };
    });
  }, []);

  const polarToCartesian = (
    centerX,
    centerY,
    radius,
    angle
  ) => {
    const angleInRadians =
      ((angle - 90) * Math.PI) / 180;

    return {
      x:
        centerX +
        radius *
          Math.cos(angleInRadians),
      y:
        centerY +
        radius *
          Math.sin(angleInRadians),
    };
  };

  const describeArc = (
    startPercentage,
    endPercentage
  ) => {
    const startAngle =
      startPercentage * 360;

    const endAngle =
      endPercentage * 360;

    const start =
      polarToCartesian(
        100,
        100,
        75,
        endAngle
      );

    const end =
      polarToCartesian(
        100,
        100,
        75,
        startAngle
      );

    const largeArcFlag =
      endAngle - startAngle <= 180
        ? "0"
        : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      75,
      75,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* ==================================================
          TOP HEADER
      ================================================== */}

      <div className="border-b border-slate-200 bg-white px-5 py-4 md:px-7">

        <div className="flex items-center gap-4">

          {/* MENU */}

          <button
            type="button"
            className="text-2xl text-slate-700"
          >
            ☰
          </button>

          {/* SEARCH */}

          <div className="relative max-w-xl flex-1">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search reports, complaints, staff..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* ADMIN */}

          <div className="ml-auto flex items-center gap-4">

            <button
              type="button"
              className="relative hidden text-xl text-slate-600 sm:block"
            >
              🔔

              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-2">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg">
                👤
              </div>

              <div className="hidden sm:block">

                <p className="text-sm font-semibold text-slate-800">
                  Admin
                </p>

                <p className="text-[11px] text-slate-500">
                  System Administrator
                </p>

              </div>

              <span className="hidden text-slate-500 sm:block">
                ▾
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="p-5 md:p-7 lg:p-8">

        {/* ==================================================
            PAGE TITLE
        ================================================== */}

        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Reports & Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Monitor complaint performance and municipal operations.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              window.print()
            }
            className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <span>⇩</span>
            Export Report
          </button>

        </div>

        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <div className="mt-7 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]">

            {/* DATE */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-500">
                Date Range
              </label>

              <select
                value={dateRange}
                onChange={(e) =>
                  setDateRange(
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option>
                  Last 7 Days
                </option>

                <option>
                  Last 30 Days
                </option>

                <option>
                  Last 3 Months
                </option>

                <option>
                  Last 6 Months
                </option>

                <option>
                  Last 1 Year
                </option>

              </select>

            </div>

            {/* DEPARTMENT */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-500">
                Department
              </label>

              <select
                value={departmentFilter}
                onChange={(e) =>
                  setDepartmentFilter(
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
              >

                <option value="">
                  All Departments
                </option>

                {departmentData.map(
                  (department) => (
                    <option
                      key={
                        department.name
                      }
                    >
                      {
                        department.name
                      }
                    </option>
                  )
                )}

              </select>

            </div>

            {/* STATUS */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-500">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
              >

                <option value="">
                  All Status
                </option>

                <option>
                  Pending
                </option>

                <option>
                  In Progress
                </option>

                <option>
                  Resolved
                </option>

                <option>
                  Rejected
                </option>

              </select>

            </div>

            {/* PRIORITY */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-500">
                Priority
              </label>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
              >

                <option value="">
                  All Priorities
                </option>

                <option>
                  High
                </option>

                <option>
                  Medium
                </option>

                <option>
                  Low
                </option>

              </select>

            </div>

            {/* APPLY */}

            <button
              type="button"
              className="self-end rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              ⚱ Apply
            </button>

            {/* RESET */}

            <button
              type="button"
              onClick={resetFilters}
              className="self-end rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>

          </div>

        </div>

        {/* ==================================================
            KPI CARDS
        ================================================== */}

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">

          <KpiCard
            title="Total Complaints"
            value="1,248"
            subtitle="vs. previous 30 days"
            change="+12%"
            icon="📄"
            iconBg="bg-blue-100"
            iconText="text-blue-600"
          />

          <KpiCard
            title="Resolved Complaints"
            value="842"
            subtitle="of total complaints"
            change="67.5%"
            icon="✓"
            iconBg="bg-emerald-100"
            iconText="text-emerald-600"
          />

          <KpiCard
            title="Pending Complaints"
            value="276"
            subtitle="of total complaints"
            change="22.1%"
            icon="◷"
            iconBg="bg-orange-100"
            iconText="text-orange-600"
          />

          <KpiCard
            title="In Progress"
            value="138"
            subtitle="of total complaints"
            change="11.1%"
            icon="◌"
            iconBg="bg-purple-100"
            iconText="text-purple-600"
          />

          <KpiCard
            title="Rejected"
            value="32"
            subtitle="of total complaints"
            change="2.6%"
            icon="×"
            iconBg="bg-red-100"
            iconText="text-red-600"
          />

          <KpiCard
            title="SLA Breached"
            value="224"
            subtitle="of total complaints"
            change="18.0%"
            icon="⚠"
            iconBg="bg-red-100"
            iconText="text-red-600"
          />

        </div>

        {/* ==================================================
            CHART ROW
        ================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">

          {/* COMPLAINT TRENDS */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="font-bold text-slate-900">
                  Complaint Trends
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Complaints received over time
                </p>

              </div>

              <div className="flex gap-1 rounded-lg bg-slate-100 p-1">

                {[
                  "7D",
                  "30D",
                  "3M",
                  "6M",
                  "1Y",
                ].map((range) => (

                  <button
                    key={range}
                    type="button"
                    onClick={() =>
                      setTrendRange(
                        range
                      )
                    }
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                      trendRange === range
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-white"
                    }`}
                  >
                    {range}
                  </button>

                ))}

              </div>

            </div>

            <div className="mt-6">

              <TrendChart />

            </div>

          </div>

          {/* STATUS DISTRIBUTION */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div>

              <h2 className="font-bold text-slate-900">
                Status Distribution
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current complaint status
              </p>

            </div>

            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row xl:flex-col">

              {/* DONUT */}

              <div className="relative h-48 w-48 shrink-0">

                <svg
                  viewBox="0 0 200 200"
                  className="h-full w-full -rotate-0"
                >

                  {donutSegments.map(
                    (segment, index) => {

                      const segmentColors = [
                        "#10b981",
                        "#f59e0b",
                        "#8b5cf6",
                        "#ef4444",
                      ];

                      return (
                        <path
                          key={
                            segment.name
                          }
                          d={describeArc(
                            segment.start,
                            segment.end
                          )}
                          fill="none"
                          stroke={
                            segmentColors[
                              index
                            ]
                          }
                          strokeWidth="28"
                          strokeLinecap="butt"
                        />
                      );
                    }
                  )}

                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <span className="text-2xl font-bold text-slate-900">
                    1,248
                  </span>

                  <span className="text-xs text-slate-500">
                    Total Complaints
                  </span>

                </div>

              </div>

              {/* LEGEND */}

              <div className="w-full space-y-3">

                {statusData.map(
                  (item) => (

                    <div
                      key={
                        item.name
                      }
                      className="flex items-center justify-between gap-3"
                    >

                      <div className="flex items-center gap-2">

                        <span
                          className={`h-3 w-3 rounded-full ${item.bg}`}
                        />

                        <span className="text-sm text-slate-600">
                          {item.name}
                        </span>

                      </div>

                      <div className="text-right">

                        <span className="text-sm font-bold text-slate-800">
                          {
                            item.percentage
                          }%
                        </span>

                        <span className="ml-2 text-xs text-slate-400">
                          (
                          {
                            item.value
                          }
                          )
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            DEPARTMENT + PRIORITY
        ================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* DEPARTMENT */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold text-slate-900">
                  Complaints by Department
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Distribution across departments
                </p>

              </div>

              <button className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </button>

            </div>

            <div className="mt-6 space-y-4">

              {departmentData.map(
                (department) => {

                  const width =
                    (department.complaints /
                      maxDepartmentComplaints) *
                    100;

                  return (

                    <div
                      key={
                        department.name
                      }
                    >

                      <div className="mb-1.5 flex items-center justify-between gap-3">

                        <span className="text-xs font-medium text-slate-600">
                          {
                            department.name
                          }
                        </span>

                        <span className="text-xs font-bold text-slate-800">
                          {
                            department.complaints
                          }
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{
                            width: `${width}%`,
                          }}
                        />

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          </div>

          {/* PRIORITY */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold text-slate-900">
                  Priority Analysis
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Complaints by priority level
                </p>

              </div>

              <button className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </button>

            </div>

            <div className="mt-8 flex h-64 items-end justify-around gap-5 border-b border-l border-slate-200 px-6 pb-0">

              {priorityData.map(
                (item) => {

                  const height =
                    (item.value /
                      maxPriorityValue) *
                    100;

                  return (

                    <div
                      key={
                        item.name
                      }
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >

                      <span className="mb-2 text-sm font-bold text-slate-700">
                        {
                          item.value
                        }
                      </span>

                      <div
                        className={`w-full max-w-20 rounded-t-lg ${item.bg}`}
                        style={{
                          height: `${height}%`,
                        }}
                      />

                      <span className="mt-3 text-sm font-medium text-slate-500">
                        {
                          item.name
                        }
                      </span>

                    </div>

                  );
                }
              )}

            </div>

          </div>

        </div>

        {/* ==================================================
            SLA + ESCALATION
        ================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* SLA */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold text-slate-900">
                  SLA Performance
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Service level agreement performance
                </p>

              </div>

              <button className="text-xs font-semibold text-blue-600 hover:underline">
                View Details
              </button>

            </div>

            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* SLA CIRCLE */}

              <div className="relative mx-auto h-40 w-40 shrink-0">

                <svg
                  viewBox="0 0 120 120"
                  className="h-full w-full -rotate-90"
                >

                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="301.59"
                    strokeDashoffset="54.29"
                  />

                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <span className="text-2xl font-bold text-slate-900">
                    82%
                  </span>

                  <span className="text-xs text-slate-500">
                    Compliance
                  </span>

                </div>

              </div>

              {/* SLA STATS */}

              <div className="w-full space-y-4">

                <SlaRow
                  icon="✓"
                  label="SLA Met"
                  value="1,024"
                  iconClass="bg-emerald-100 text-emerald-600"
                />

                <SlaRow
                  icon="⚠"
                  label="SLA Breached"
                  value="224"
                  iconClass="bg-red-100 text-red-600"
                />

                <SlaRow
                  icon="◷"
                  label="Avg. Resolution Time"
                  value="18.4 hrs"
                  iconClass="bg-blue-100 text-blue-600"
                />

              </div>

            </div>

          </div>

          {/* ESCALATION */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold text-slate-900">
                  Escalation Analytics
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Escalated unresolved complaints
                </p>

              </div>

              <button className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </button>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Total Escalated
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  143
                </p>

              </div>

              <EscalationCard
                level="Level 1"
                value="92"
                icon="👤"
              />

              <EscalationCard
                level="Level 2"
                value="38"
                icon="⚠"
              />

              <EscalationCard
                level="Level 3"
                value="13"
                icon="🔴"
              />

            </div>

            <div className="mt-5 rounded-lg border border-slate-200 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
                  🏢
                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Most Escalated Department
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    Water Supply
                    <span className="ml-2 text-xs font-medium text-red-500">
                      (34)
                    </span>
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            STAFF + LOCATION
        ================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_1fr]">

          {/* STAFF PERFORMANCE */}

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">

              <div>

                <h2 className="font-bold text-slate-900">
                  Staff Performance
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Complaint handling performance
                </p>

              </div>

              <button className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px]">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Staff Name
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Department
                    </th>

                    <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Assigned
                    </th>

                    <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Resolved
                    </th>

                    <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Pending
                    </th>

                    <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      SLA Rate
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {staffData.map(
                    (member) => (

                      <tr
                        key={
                          member.name
                        }
                        className="hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                              {member.name
                                .charAt(0)}
                            </div>

                            <span className="text-sm font-semibold text-slate-700">
                              {
                                member.name
                              }
                            </span>

                          </div>

                        </td>

                        <td className="px-5 py-4 text-xs text-slate-500">
                          {
                            member.department
                          }
                        </td>

                        <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">
                          {
                            member.assigned
                          }
                        </td>

                        <td className="px-5 py-4 text-center text-sm font-semibold text-emerald-600">
                          {
                            member.resolved
                          }
                        </td>

                        <td className="px-5 py-4 text-center text-sm font-semibold text-orange-500">
                          {
                            member.pending
                          }
                        </td>

                        <td className="px-5 py-4 text-center">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              member.slaRate >=
                              85
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {
                              member.slaRate
                            }%
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* LOCATION */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold text-slate-900">
                  Complaint Location Analysis
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Complaint hotspots
                </p>

              </div>

              <button className="text-xs font-semibold text-blue-600 hover:underline">
                View Map
              </button>

            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">

              <select className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500">

                <option>
                  All Departments
                </option>

              </select>

              <select className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500">

                <option>
                  All Status
                </option>

              </select>

              <select className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500">

                <option>
                  Last 30 Days
                </option>

              </select>

            </div>

            {/* MAP PLACEHOLDER */}

            <div className="relative mt-4 h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

              <div className="absolute inset-0 opacity-40">

                <div className="absolute left-1/4 top-0 h-full w-10 rotate-12 bg-white" />

                <div className="absolute left-1/2 top-0 h-full w-6 -rotate-12 bg-white" />

                <div className="absolute left-0 top-1/3 h-7 w-full rotate-6 bg-white" />

                <div className="absolute left-0 top-2/3 h-5 w-full -rotate-3 bg-white" />

              </div>

              {/* MAP PINS */}

              <MapPin
                left="22%"
                top="28%"
                type="high"
              />

              <MapPin
                left="48%"
                top="42%"
                type="medium"
              />

              <MapPin
                left="68%"
                top="30%"
                type="low"
              />

              <MapPin
                left="36%"
                top="65%"
                type="high"
              />

              <MapPin
                left="75%"
                top="68%"
                type="medium"
              />

              <MapPin
                left="55%"
                top="75%"
                type="low"
              />

              <div className="absolute bottom-3 right-3 rounded-lg bg-white p-3 shadow-md">

                <p className="mb-2 text-[11px] font-bold text-slate-700">
                  Complaints
                </p>

                <Legend
                  color="bg-red-500"
                  text="High"
                />

                <Legend
                  color="bg-orange-400"
                  text="Medium"
                />

                <Legend
                  color="bg-emerald-500"
                  text="Low"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            RESOLUTION TIME
        ================================================== */}

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-bold text-slate-900">
                Average Resolution Time
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Average time taken to resolve complaints
              </p>

            </div>

            <button className="text-xs font-semibold text-blue-600 hover:underline">
              View All
            </button>

          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {resolutionData.map(
              (item) => (

                <div
                  key={
                    item.department
                  }
                  className={`rounded-xl border border-slate-100 p-4 ${item.bg}`}
                >

                  <p
                    className={`truncate text-xs font-medium ${item.text}`}
                  >
                    {
                      item.department
                    }
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold ${item.text}`}
                  >
                    {
                      item.hours
                    }

                    <span className="ml-1 text-xs font-medium">
                      hrs
                    </span>

                  </p>

                </div>

              )
            )}

          </div>

        </div>

        {/* ==================================================
            FOOTER REPORT BUTTON
        ================================================== */}

        <div className="mt-5 flex justify-end">

          <button
            type="button"
            onClick={() =>
              window.print()
            }
            className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
          >
            ⇩ Download Full Report
          </button>

        </div>

      </main>

    </div>
  );
};

// ======================================================
// KPI CARD
// ======================================================

const KpiCard = ({
  title,
  value,
  subtitle,
  change,
  icon,
  iconBg,
  iconText,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p className="truncate text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${iconBg} ${iconText}`}
        >
          {icon}
        </div>

      </div>

      <div className="mt-3 flex items-center gap-1">

        <span className="text-xs font-bold text-emerald-600">
          {change}
        </span>

        <span className="text-[10px] text-slate-400">
          {subtitle}
        </span>

      </div>

    </div>
  );
};

// ======================================================
// TREND CHART
// ======================================================

const TrendChart = () => {

  const points = [
    [0, 145],
    [20, 132],
    [40, 150],
    [60, 118],
    [80, 130],
    [100, 92],
    [120, 108],
    [140, 86],
    [160, 95],
    [180, 68],
    [200, 82],
    [220, 55],
    [240, 70],
    [260, 42],
    [280, 62],
    [300, 35],
    [320, 48],
    [340, 25],
    [360, 42],
    [380, 15],
  ];

  const chartWidth = 400;
  const chartHeight = 190;

  const linePoints =
    points
      .map(
        ([x, y]) =>
          `${x},${y}`
      )
      .join(" ");

  return (
    <div className="relative h-64 w-full">

      {/* GRID */}

      <div className="absolute inset-0 flex flex-col justify-between">

        {[200, 150, 100, 50, 0].map(
          (value) => (

            <div
              key={value}
              className="flex items-center gap-3"
            >

              <span className="w-7 text-right text-[10px] text-slate-400">
                {value}
              </span>

              <div className="h-px flex-1 bg-slate-100" />

            </div>

          )
        )}

      </div>

      {/* SVG */}

      <div className="absolute bottom-7 left-10 right-0 top-0">

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >

          <defs>

            <linearGradient
              id="trendFill"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#3b82f6"
                stopOpacity="0.20"
              />

              <stop
                offset="100%"
                stopColor="#3b82f6"
                stopOpacity="0"
              />

            </linearGradient>

          </defs>

          <polygon
            points={`0,190 ${linePoints} 400,190`}
            fill="url(#trendFill)"
          />

          <polyline
            points={linePoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />

          {points.map(
            ([x, y], index) => (

              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />

            )
          )}

        </svg>

      </div>

      {/* X AXIS */}

      <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[10px] text-slate-400">

        <span>Apr 1</span>
        <span>Apr 5</span>
        <span>Apr 10</span>
        <span>Apr 15</span>
        <span>Apr 20</span>
        <span>Apr 25</span>
        <span>Apr 30</span>

      </div>

    </div>
  );
};

// ======================================================
// SLA ROW
// ======================================================

const SlaRow = ({
  icon,
  label,
  value,
  iconClass,
}) => {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${iconClass}`}
        >
          {icon}
        </div>

        <span className="text-sm text-slate-600">
          {label}
        </span>

      </div>

      <span className="text-sm font-bold text-slate-800">
        {value}
      </span>

    </div>
  );
};

// ======================================================
// ESCALATION CARD
// ======================================================

const EscalationCard = ({
  level,
  value,
  icon,
}) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">

      <div className="flex items-center justify-between">

        <span className="text-lg">
          {icon}
        </span>

        <span className="text-xl font-bold text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-2 text-xs text-slate-500">
        {level}
      </p>

    </div>
  );
};

// ======================================================
// MAP PIN
// ======================================================

const MapPin = ({
  left,
  top,
  type,
}) => {

  const classes = {
    high: "bg-red-500",
    medium: "bg-orange-400",
    low: "bg-emerald-500",
  };

  return (
    <div
      className="absolute"
      style={{
        left,
        top,
      }}
    >

      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs text-white shadow-lg ${classes[type]}`}
      >
        ●
      </div>

    </div>
  );
};

// ======================================================
// MAP LEGEND
// ======================================================

const Legend = ({
  color,
  text,
}) => {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`h-2.5 w-2.5 rounded-full ${color}`}
      />

      <span className="text-[10px] text-slate-500">
        {text}
      </span>

    </div>
  );
};

export default ReportsAnalytics;