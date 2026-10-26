import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

// ======================================================
// API
// ======================================================

const API_BASE_URL = "http://localhost:3000/api";

// ======================================================
// CONSTANTS
// ======================================================

const STATUSES = [
  "Pending",
  "In Progress",
  "Resolved",
  "Rejected",
];

const PRIORITIES = [
  "High",
  "Medium",
  "Low",
];

const DEPARTMENTS = [
  "Water Supply",
  "Roads & Infrastructure",
  "Electrical & Street Lighting",
  "Drainage & Sewerage",
  "Sanitation",
  "Parks & Horticulture",
  "Traffic Management",
  "Building & Construction",
  "General Administration",
];

// ======================================================
// AUTH HELPERS
// ======================================================

const getToken = () =>
  localStorage.getItem("adminToken") ||
  localStorage.getItem("admin_token") ||
  localStorage.getItem("token") ||
  "";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken()
    ? {
        Authorization: `Bearer ${getToken()}`,
      }
    : {}),
});

// ======================================================
// DATE HELPERS
// ======================================================

const getDateRangeStart = (range) => {
  const now = new Date();

  switch (range) {
    case "Last 7 Days":
      now.setDate(now.getDate() - 7);
      break;

    case "Last 30 Days":
      now.setDate(now.getDate() - 30);
      break;

    case "Last 3 Months":
      now.setMonth(now.getMonth() - 3);
      break;

    case "Last 6 Months":
      now.setMonth(now.getMonth() - 6);
      break;

    case "Last 1 Year":
      now.setFullYear(now.getFullYear() - 1);
      break;

    default:
      now.setDate(now.getDate() - 30);
  }

  return now;
};

const getTrendStart = (range) => {
  const now = new Date();

  switch (range) {
    case "7D":
      now.setDate(now.getDate() - 7);
      break;

    case "30D":
      now.setDate(now.getDate() - 30);
      break;

    case "3M":
      now.setMonth(now.getMonth() - 3);
      break;

    case "6M":
      now.setMonth(now.getMonth() - 6);
      break;

    case "1Y":
      now.setFullYear(now.getFullYear() - 1);
      break;

    default:
      now.setDate(now.getDate() - 30);
  }

  return now;
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  );
};

// ======================================================
// PRIORITY
// ======================================================

const getComplaintPriority = (complaint) => {
  if (complaint?.priority) {
    return complaint.priority;
  }

  const type = String(
    complaint?.complaintType ||
      complaint?.title ||
      ""
  ).toLowerCase();

  const highPriority = [
    "water",
    "pipeline",
    "leakage",
    "road",
    "pothole",
    "drainage",
    "sewer",
    "flood",
    "electric",
    "street light",
    "fire",
  ];

  if (
    highPriority.some((item) =>
      type.includes(item)
    )
  ) {
    return "High";
  }

  const mediumPriority = [
    "garbage",
    "sanitation",
    "waste",
    "construction",
    "building",
    "traffic",
    "park",
    "horticulture",
  ];

  if (
    mediumPriority.some((item) =>
      type.includes(item)
    )
  ) {
    return "Medium";
  }

  return "Low";
};

// ======================================================
// DEPARTMENT MAPPING
// ======================================================

const getDepartmentForComplaint = (
  complaint
) => {
  const assignedStaff =
    complaint?.assignedStaff;

  if (
    assignedStaff &&
    typeof assignedStaff === "object" &&
    assignedStaff.department
  ) {
    return assignedStaff.department;
  }

  if (complaint?.department) {
    return complaint.department;
  }

  const type = String(
    complaint?.complaintType ||
      complaint?.title ||
      ""
  ).toLowerCase();

  if (
    /water|pipeline|leakage|supply/.test(
      type
    )
  ) {
    return "Water Supply";
  }

  if (
    /road|pothole|footpath/.test(type)
  ) {
    return "Roads & Infrastructure";
  }

  if (
    /electric|electrical|street.?light|lighting|lamp/.test(
      type
    )
  ) {
    return "Electrical & Street Lighting";
  }

  if (
    /drain|sewer|flood/.test(type)
  ) {
    return "Drainage & Sewerage";
  }

  if (
    /garbage|sanitation|waste|cleanliness/.test(
      type
    )
  ) {
    return "Sanitation";
  }

  if (
    /park|garden|horticulture/.test(
      type
    )
  ) {
    return "Parks & Horticulture";
  }

  if (
    /traffic|signal/.test(type)
  ) {
    return "Traffic Management";
  }

  if (
    /building|construction/.test(
      type
    )
  ) {
    return "Building & Construction";
  }

  return "General Administration";
};

// ======================================================
// NORMALIZE COMPLAINT
// ======================================================

const normalizeComplaint = (
  complaint = {}
) => {
  const user =
    complaint.user &&
    typeof complaint.user === "object"
      ? complaint.user
      : {};

  const assignedStaff =
    complaint.assignedStaff &&
    typeof complaint.assignedStaff ===
      "object"
      ? complaint.assignedStaff
      : null;

  const complaintType =
    complaint.complaintType ||
    complaint.title ||
    "Complaint";

  const rawLocation =
    complaint.location;

  const location =
    typeof rawLocation === "string"
      ? {
          address:
            rawLocation ||
            "Location not available",
          latitude:
            complaint.latitude ??
            null,
          longitude:
            complaint.longitude ??
            null,
        }
      : {
          address:
            rawLocation?.address ||
            "Location not available",

          latitude:
            complaint.latitude ??
            rawLocation?.latitude ??
            null,

          longitude:
            complaint.longitude ??
            rawLocation?.longitude ??
            null,
        };

  const rawPhoto =
    complaint.photo;

  const complaintImage =
    typeof rawPhoto === "string"
      ? rawPhoto
      : rawPhoto?.url ||
        complaint.complaintImage ||
        "";

  return {
    ...complaint,

    complaintId:
      complaint.complaintId ||
      `CMP-${String(
        complaint._id || ""
      )
        .slice(-6)
        .toUpperCase()}`,

    citizenName:
      user.name ||
      user.fullName ||
      user.username ||
      complaint.citizenName ||
      "",

    email:
      user.email ||
      complaint.email ||
      "",

    contact:
      user.contact ||
      complaint.contact ||
      "",

    title:
      complaint.title ||
      complaintType,

    complaintType,

    department:
      getDepartmentForComplaint(
        complaint
      ),

    priority:
      getComplaintPriority(
        complaint
      ),

    description:
      complaint.description ||
      "No description provided.",

    complaintImage,

    location,

    assignedStaff,

    status:
      complaint.status ||
      "Pending",

    createdAt:
      complaint.createdAt ||
      complaint.updatedAt ||
      null,

    resolvedAt:
      complaint.resolvedAt ||
      complaint.updatedAt ||
      null,
  };
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const ReportsAnalytics = () => {
  // ====================================================
  // DATA
  // ====================================================

  const [complaints, setComplaints] =
    useState([]);

  const [staff, setStaff] =
    useState([]);

  const [slaSettings, setSlaSettings] =
    useState([]);

  // ====================================================
  // LOADING / ERROR
  // ====================================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================================
  // FILTERS
  // ====================================================

  const [dateRange, setDateRange] =
    useState("Last 30 Days");

  const [
    departmentFilter,
    setDepartmentFilter,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("");

  const [trendRange, setTrendRange] =
    useState("30D");

  // ====================================================
  // FETCH COMPLAINTS
  // ====================================================

  const fetchComplaints = async () => {
    try {
      const response =
        await fetch(
          `${API_BASE_URL}/admin/complaints`,
          {
            method: "GET",
            headers:
              getAuthHeaders(),
            credentials: "include",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch complaints."
        );
      }

      const records =
        Array.isArray(data)
          ? data
          : data?.complaints ||
            data?.data ||
            [];

      setComplaints(
        records.map(
          normalizeComplaint
        )
      );
    } catch (err) {
      console.error(
        "Fetch complaints error:",
        err
      );

      setError(
        err.message ||
          "Unable to load complaints."
      );
    }
  };

  // ====================================================
  // FETCH STAFF
  // ====================================================

  const fetchStaff = async () => {
    try {
      const response =
        await fetch(
          `${API_BASE_URL}/staff`,
          {
            method: "GET",
            headers:
              getAuthHeaders(),
            credentials: "include",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch staff."
        );
      }

      const records =
        Array.isArray(data)
          ? data
          : data?.staff ||
            data?.data ||
            [];

      setStaff(records);
    } catch (err) {
      console.error(
        "Fetch staff error:",
        err
      );
    }
  };

  // ====================================================
  // FETCH SLA SETTINGS
  // ====================================================

  const fetchSLASettings =
    async () => {
      try {
        const response =
          await fetch(
            `${API_BASE_URL}/sla`,
            {
              method: "GET",
              headers:
                getAuthHeaders(),
              credentials: "include",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch SLA settings."
          );
        }

        const records =
          Array.isArray(data)
            ? data
            : data?.settings ||
              data?.data ||
              [];

        setSlaSettings(records);
      } catch (err) {
        console.error(
          "Fetch SLA settings error:",
          err
        );
      }
    };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    const loadData =
      async () => {
        setLoading(true);
        setError("");

        await Promise.all([
          fetchComplaints(),
          fetchStaff(),
          fetchSLASettings(),
        ]);

        setLoading(false);
      };

    loadData();
  }, []);

  // ====================================================
  // FILTERED COMPLAINTS
  // ====================================================

  const filteredComplaints =
    useMemo(() => {
      const startDate =
        getDateRangeStart(
          dateRange
        );

      return complaints.filter(
        (complaint) => {
          const created =
            complaint.createdAt
              ? new Date(
                  complaint.createdAt
                )
              : null;

          const matchesDate =
            !created ||
            created >= startDate;

          const matchesDepartment =
            !departmentFilter ||
            complaint.department ===
              departmentFilter;

          const matchesStatus =
            !statusFilter ||
            complaint.status ===
              statusFilter;

          const matchesPriority =
            !priorityFilter ||
            complaint.priority ===
              priorityFilter;

          return (
            matchesDate &&
            matchesDepartment &&
            matchesStatus &&
            matchesPriority
          );
        }
      );
    }, [
      complaints,
      dateRange,
      departmentFilter,
      statusFilter,
      priorityFilter,
    ]);

  // ====================================================
  // BASIC COUNTS
  // ====================================================

  const total =
    filteredComplaints.length;

  const resolved =
    filteredComplaints.filter(
      (item) =>
        item.status === "Resolved"
    ).length;

  const pending =
    filteredComplaints.filter(
      (item) =>
        item.status === "Pending"
    ).length;

  const inProgress =
    filteredComplaints.filter(
      (item) =>
        item.status ===
        "In Progress"
    ).length;

  const rejected =
    filteredComplaints.filter(
      (item) =>
        item.status === "Rejected"
    ).length;

  // ====================================================
  // RESOLUTION RATE
  // ====================================================

  const resolutionRate =
    total > 0
      ? (resolved / total) * 100
      : 0;

  // ====================================================
  // STATUS DATA
  // ====================================================

  const statusData =
    useMemo(() => {
      const values =
        STATUSES.map(
          (status) => {
            const value =
              filteredComplaints.filter(
                (item) =>
                  item.status ===
                  status
              ).length;

            return {
              name: status,
              value,
              percentage:
                total > 0
                  ? Number(
                      (
                        (value /
                          total) *
                        100
                      ).toFixed(1)
                    )
                  : 0,
            };
          }
        );

      return values.map(
        (item) => {
          if (
            item.name ===
            "Resolved"
          ) {
            return {
              ...item,
              icon: "✓",
              bg: "bg-emerald-500",
            };
          }

          if (
            item.name ===
            "Pending"
          ) {
            return {
              ...item,
              icon: "◷",
              bg: "bg-orange-500",
            };
          }

          if (
            item.name ===
            "In Progress"
          ) {
            return {
              ...item,
              icon: "◌",
              bg: "bg-purple-500",
            };
          }

          return {
            ...item,
            icon: "×",
            bg: "bg-red-500",
          };
        }
      );
    }, [
      filteredComplaints,
      total,
    ]);

  // ====================================================
  // PRIORITY DATA
  // ====================================================

  const priorityData =
    useMemo(() => {
      return PRIORITIES.map(
        (priority) => ({
          name: priority,

          value:
            filteredComplaints.filter(
              (item) =>
                item.priority ===
                priority
            ).length,

          bg:
            priority === "High"
              ? "bg-red-400"
              : priority ===
                "Medium"
              ? "bg-orange-400"
              : "bg-emerald-500",
        })
      );
    }, [
      filteredComplaints,
    ]);

  // ====================================================
  // DEPARTMENT DATA
  // ====================================================

  const departmentData =
    useMemo(() => {
      return DEPARTMENTS.map(
        (department) => ({
          name: department,

          complaints:
            filteredComplaints.filter(
              (item) =>
                item.department ===
                department
            ).length,
        })
      ).filter(
        (item) =>
          item.complaints > 0
      );
    }, [
      filteredComplaints,
    ]);

  const maxDepartmentComplaints =
    Math.max(
      ...departmentData.map(
        (item) =>
          item.complaints
      ),
      1
    );

  const maxPriorityValue =
    Math.max(
      ...priorityData.map(
        (item) =>
          item.value
      ),
      1
    );

  // ====================================================
  // SLA HELPERS
  // ====================================================

  const getSLAForComplaint =
    (complaint) => {
      const department =
        complaint.department;

      return (
        slaSettings.find(
          (setting) =>
            String(
              setting.department
            ).trim()
              .toLowerCase() ===
            String(
              department
            )
              .trim()
              .toLowerCase()
        ) || null
      );
    };

  const getComplaintAgeHours =
    (complaint) => {
      if (
        !complaint.createdAt
      ) {
        return 0;
      }

      const created =
        new Date(
          complaint.createdAt
        );

      const end =
        complaint.status ===
          "Resolved" &&
        complaint.resolvedAt
          ? new Date(
              complaint.resolvedAt
            )
          : new Date();

      return Math.max(
        0,
        (end - created) /
          (1000 * 60 * 60)
      );
    };

  const isSLABreached =
    (complaint) => {
      if (
        complaint.status ===
        "Rejected"
      ) {
        return false;
      }

      const setting =
        getSLAForComplaint(
          complaint
        );

      if (!setting) {
        return false;
      }

      return (
        getComplaintAgeHours(
          complaint
        ) >
        Number(
          setting.defaultSLAHours
        )
      );
    };

  const isSLAWarning =
    (complaint) => {
      if (
        complaint.status ===
          "Resolved" ||
        complaint.status ===
          "Rejected"
      ) {
        return false;
      }

      const setting =
        getSLAForComplaint(
          complaint
        );

      if (!setting) {
        return false;
      }

      const age =
        getComplaintAgeHours(
          complaint
        );

      const slaHours =
        Number(
          setting.defaultSLAHours
        );

      const warningHours =
        Number(
          setting.warningBeforeHours ||
            0
        );

      return (
        age >=
          slaHours -
            warningHours &&
        age <= slaHours
      );
    };

  // ====================================================
  // SLA STATS
  // ====================================================

  const slaBreached =
    filteredComplaints.filter(
      isSLABreached
    ).length;

  const slaMet =
    filteredComplaints.filter(
      (complaint) =>
        !isSLABreached(
          complaint
        ) &&
        complaint.status ===
          "Resolved"
    ).length;

  const slaCompliance =
    resolved > 0
      ? (slaMet / resolved) *
        100
      : 0;

  // ====================================================
  // AVERAGE RESOLUTION TIME
  // ====================================================

  const averageResolutionHours =
    useMemo(() => {
      const resolvedComplaints =
        filteredComplaints.filter(
          (item) =>
            item.status ===
              "Resolved" &&
            item.createdAt &&
            item.resolvedAt
        );

      if (
        resolvedComplaints.length ===
        0
      ) {
        return 0;
      }

      const totalHours =
        resolvedComplaints.reduce(
          (sum, item) => {
            const start =
              new Date(
                item.createdAt
              );

            const end =
              new Date(
                item.resolvedAt
              );

            const hours =
              (end - start) /
              (1000 * 60 * 60);

            return (
              sum +
              Math.max(
                0,
                hours
              )
            );
          },
          0
        );

      return (
        totalHours /
        resolvedComplaints.length
      );
    }, [
      filteredComplaints,
    ]);

  // ====================================================
  // RESOLUTION BY DEPARTMENT
  // ====================================================

  const resolutionData =
    useMemo(() => {
      const departments =
        departmentData.map(
          (item) =>
            item.name
        );

      const rows =
        departments.map(
          (department) => {
            const records =
              filteredComplaints.filter(
                (item) =>
                  item.department ===
                  department
              );

            const resolvedRecords =
              records.filter(
                (item) =>
                  item.status ===
                  "Resolved"
              );

            const withTime =
              resolvedRecords.filter(
                (item) =>
                  item.createdAt &&
                  item.resolvedAt
              );

            let hours = 0;

            if (
              withTime.length
            ) {
              hours =
                withTime.reduce(
                  (sum, item) => {
                    const start =
                      new Date(
                        item.createdAt
                      );

                    const end =
                      new Date(
                        item.resolvedAt
                      );

                    return (
                      sum +
                      Math.max(
                        0,
                        (end -
                          start) /
                          (1000 *
                            60 *
                            60)
                      )
                    );
                  },
                  0
                ) /
                withTime.length;
            }

            return {
              department,
              hours:
                Number(
                  hours.toFixed(
                    1
                  )
                ),
            };
          }
        );

      return [
        {
          department:
            "Overall",
          hours:
            Number(
              averageResolutionHours.toFixed(
                1
              )
            ),
          bg: "bg-purple-50",
          text: "text-purple-600",
        },

        ...rows.map(
          (
            item,
            index
          ) => {
            const styles = [
              [
                "bg-blue-50",
                "text-blue-600",
              ],
              [
                "bg-emerald-50",
                "text-emerald-600",
              ],
              [
                "bg-orange-50",
                "text-orange-600",
              ],
              [
                "bg-red-50",
                "text-red-600",
              ],
              [
                "bg-indigo-50",
                "text-indigo-600",
              ],
            ];

            const style =
              styles[
                index %
                  styles.length
              ];

            return {
              ...item,
              bg: style[0],
              text: style[1],
            };
          }
        ),
      ];
    }, [
      departmentData,
      filteredComplaints,
      averageResolutionHours,
    ]);

  // ====================================================
  // STAFF PERFORMANCE
  // ====================================================

  const staffData =
    useMemo(() => {
      return staff
        .map((member) => {
          const staffId =
            member._id ||
            member.id ||
            member.staffId;

          const assigned =
            filteredComplaints.filter(
              (complaint) => {
                const assignedId =
                  complaint
                    .assignedStaff
                    ?._id ||
                  complaint
                    .assignedStaff;

                return (
                  String(
                    assignedId
                  ) ===
                  String(
                    staffId
                  )
                );
              }
            );

          const resolvedCount =
            assigned.filter(
              (item) =>
                item.status ===
                "Resolved"
            ).length;

          const pendingCount =
            assigned.filter(
              (item) =>
                item.status ===
                  "Pending" ||
                item.status ===
                  "In Progress"
            ).length;

          const staffSlaRecords =
            assigned.filter(
              (item) =>
                item.status ===
                  "Resolved" ||
                item.status ===
                  "Pending" ||
                item.status ===
                  "In Progress"
            );

          const staffSlaMet =
            staffSlaRecords.filter(
              (item) =>
                !isSLABreached(
                  item
                )
            ).length;

          const slaRate =
            staffSlaRecords.length >
            0
              ? Math.round(
                  (staffSlaMet /
                    staffSlaRecords.length) *
                    100
                )
              : 0;

          return {
            name:
              member.name ||
              member.fullName ||
              "Unknown Staff",

            department:
              member.department ||
              "Not assigned",

            assigned:
              assigned.length,

            resolved:
              resolvedCount,

            pending:
              pendingCount,

            slaRate,
          };
        })
        .filter(
          (member) =>
            member.assigned > 0
        )
        .sort(
          (a, b) =>
            b.assigned -
            a.assigned
        )
        .slice(0, 10);
    }, [
      staff,
      filteredComplaints,
      slaSettings,
    ]);

  // ====================================================
  // ESCALATION ANALYTICS
  // ====================================================

  const escalationData =
    useMemo(() => {
      const unresolved =
        filteredComplaints.filter(
          (item) =>
            item.status !==
              "Resolved" &&
            item.status !==
              "Rejected"
        );

      const level1 =
        unresolved.filter(
          (item) => {
            const setting =
              getSLAForComplaint(
                item
              );

            if (!setting) {
              return false;
            }

            const firstLevel =
              setting
                .escalationLevels?.[0];

            if (!firstLevel) {
              return false;
            }

            return (
              getComplaintAgeHours(
                item
              ) >=
              Number(
                firstLevel.afterHours
              )
            );
          }
        ).length;

      const level2 =
        unresolved.filter(
          (item) => {
            const setting =
              getSLAForComplaint(
                item
              );

            const level =
              setting
                ?.escalationLevels?.[1];

            if (!level) {
              return false;
            }

            return (
              getComplaintAgeHours(
                item
              ) >=
              Number(
                level.afterHours
              )
            );
          }
        ).length;

      const level3 =
        unresolved.filter(
          (item) => {
            const setting =
              getSLAForComplaint(
                item
              );

            const level =
              setting
                ?.escalationLevels?.[2];

            if (!level) {
              return false;
            }

            return (
              getComplaintAgeHours(
                item
              ) >=
              Number(
                level.afterHours
              )
            );
          }
        ).length;

      const departmentCounts =
        {};

      unresolved.forEach(
        (item) => {
          const department =
            item.department ||
            "General Administration";

          departmentCounts[
            department
          ] =
            (departmentCounts[
              department
            ] || 0) + 1;
        }
      );

      const mostEscalated =
        Object.entries(
          departmentCounts
        ).sort(
          (a, b) =>
            b[1] - a[1]
        )[0];

      return {
        total:
          level1 +
          level2 +
          level3,

        level1,

        level2,

        level3,

        mostEscalated:
          mostEscalated
            ? mostEscalated[0]
            : "No data",

        mostEscalatedCount:
          mostEscalated
            ? mostEscalated[1]
            : 0,
      };
    }, [
      filteredComplaints,
      slaSettings,
    ]);

  // ====================================================
  // TREND DATA
  // ====================================================

  const trendData =
    useMemo(() => {
      const start =
        getTrendStart(
          trendRange
        );

      const now =
        new Date();

      const days =
        trendRange === "7D"
          ? 7
          : trendRange === "30D"
          ? 30
          : trendRange === "3M"
          ? 12
          : trendRange === "6M"
          ? 24
          : 12;

      const result = [];

      if (
        trendRange ===
        "7D"
      ) {
        for (
          let i = 0;
          i < 7;
          i++
        ) {
          const date =
            new Date(
              start
            );

          date.setDate(
            start.getDate() +
              i
          );

          const next =
            new Date(date);

          next.setDate(
            date.getDate() +
              1
          );

          const count =
            filteredComplaints.filter(
              (item) => {
                if (
                  !item.createdAt
                ) {
                  return false;
                }

                const created =
                  new Date(
                    item.createdAt
                  );

                return (
                  created >=
                    date &&
                  created <
                    next
                );
              }
            ).length;

          result.push({
            label:
              date.toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                }
              ),

            value: count,
          });
        }

        return result;
      }

      const interval =
        Math.max(
          1,
          Math.ceil(
            (now -
              start) /
              (1000 *
                60 *
                60 *
                24 *
                days)
          )
        );

      for (
        let i = 0;
        i < days;
        i++
      ) {
        const bucketStart =
          new Date(
            start
          );

        bucketStart.setDate(
          start.getDate() +
            i * interval
        );

        const bucketEnd =
          new Date(
            bucketStart
          );

        bucketEnd.setDate(
          bucketStart.getDate() +
            interval
        );

        const count =
          filteredComplaints.filter(
            (item) => {
              if (
                !item.createdAt
              ) {
                return false;
              }

              const created =
                new Date(
                  item.createdAt
                );

              return (
                created >=
                  bucketStart &&
                created <
                  bucketEnd
              );
            }
          ).length;

        result.push({
          label:
            formatDate(
              bucketStart
            ),

          value: count,
        });
      }

      return result;
    }, [
      filteredComplaints,
      trendRange,
    ]);

  // ====================================================
  // RESET FILTERS
  // ====================================================

  const resetFilters =
    () => {
      setDateRange(
        "Last 30 Days"
      );

      setDepartmentFilter(
        ""
      );

      setStatusFilter(
        ""
      );

      setPriorityFilter(
        ""
      );
    };

  // ====================================================
  // EXPORT
  // ====================================================

  const exportReport = () => {
    // The report uses print-specific CSS so the browser's
    // "Save as PDF" output is clean, paginated and A4-sized.
    document.body.classList.add("printing-report");

    const cleanup = () => {
      document.body.classList.remove("printing-report");
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);
    window.print();
  };

  // ====================================================
  // DONUT SEGMENTS
  // ====================================================

  const donutSegments =
    useMemo(() => {
      const totalValue =
        statusData.reduce(
          (sum, item) =>
            sum + item.value,
          0
        );

      if (!totalValue) {
        return [];
      }

      let current = 0;

      return statusData.map(
        (item) => {
          const start =
            current;

          const percentage =
            item.value /
            totalValue;

          current +=
            percentage;

          return {
            ...item,
            start,
            end: current,
          };
        }
      );
    }, [
      statusData,
    ]);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="reports-page min-h-screen bg-[#f6f8fc]">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          html,
          body {
            width: 210mm;
            min-height: 297mm;
            background: #ffffff !important;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .reports-page {
            min-height: auto !important;
            background: #ffffff !important;
            color: #0f172a !important;
          }

          .reports-header,
          .reports-filter,
          .reports-export,
          .reports-footer {
            display: none !important;
          }

          .reports-main {
            padding: 0 !important;
            margin: 0 !important;
          }

          .reports-title {
            display: block !important;
            margin: 0 0 8mm !important;
            padding: 0 0 5mm !important;
            border-bottom: 1px solid #cbd5e1 !important;
          }

          .reports-title h1 {
            font-size: 22pt !important;
            line-height: 1.15 !important;
          }

          .reports-title p {
            margin-top: 2mm !important;
            font-size: 9pt !important;
            color: #64748b !important;
          }

          .reports-print-meta {
            display: block !important;
            margin-top: 3mm !important;
            font-size: 8pt !important;
            color: #64748b !important;
          }

          .reports-section {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            box-shadow: none !important;
            border-color: #cbd5e1 !important;
          }

          .reports-kpis {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 3mm !important;
            margin-top: 0 !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .reports-kpi {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            box-shadow: none !important;
          }

          .reports-chart-row,
          .reports-two-column,
          .reports-staff-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 4mm !important;
            margin-top: 4mm !important;
          }

          .reports-chart-row > *,
          .reports-two-column > *,
          .reports-staff-row > * {
            min-width: 0 !important;
          }

          .reports-full-width {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .reports-page .rounded-xl,
          .reports-page .rounded-lg {
            box-shadow: none !important;
          }

          .reports-page table {
            font-size: 7.5pt !important;
          }

          .reports-page th,
          .reports-page td {
            padding: 2.5mm 2mm !important;
          }

          .reports-page .overflow-x-auto {
            overflow: visible !important;
          }

          .reports-page .min-w-\[650px\] {
            min-width: 0 !important;
          }

          .reports-page svg {
            max-width: 100% !important;
          }

          .reports-page .h-64 {
            height: 52mm !important;
          }

          .reports-page .h-72 {
            height: 55mm !important;
          }

          .reports-page .h-48,
          .reports-page .w-48 {
            height: 42mm !important;
            width: 42mm !important;
          }

          .reports-page button {
            cursor: default !important;
          }

          .reports-page .text-2xl {
            line-height: 1.1 !important;
          }
        }

        .reports-print-meta {
          display: none;
        }
      `}</style>
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="reports-header border-b border-slate-200 bg-white px-5 py-4 md:px-7">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-2xl text-slate-700"
          >
            ☰
          </button>

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

      <main className="reports-main p-5 md:p-7 lg:p-8">
        {/* ==================================================
            TITLE
        ================================================== */}

        <div className="reports-title flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Reports & Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Monitor complaint performance and municipal operations.
            </p>
            <p className="reports-print-meta">
              Generated: {new Date().toLocaleString("en-IN")}
            </p>
          </div>

          <button
            type="button"
            onClick={
              exportReport
            }
            className="reports-export flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <span>⇩</span>
            Export Report
          </button>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div className="mt-10 flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading reports and analytics...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ==================================================
                FILTER BAR
            ================================================== */}

            <div className="reports-filter mt-7 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    Date Range
                  </label>

                  <select
                    value={
                      dateRange
                    }
                    onChange={(
                      e
                    ) =>
                      setDateRange(
                        e.target
                          .value
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

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    Department
                  </label>

                  <select
                    value={
                      departmentFilter
                    }
                    onChange={(
                      e
                    ) =>
                      setDepartmentFilter(
                        e.target
                          .value
                      )
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">
                      All Departments
                    </option>

                    {DEPARTMENTS.map(
                      (
                        department
                      ) => (
                        <option
                          key={
                            department
                          }
                          value={
                            department
                          }
                        >
                          {
                            department
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    Status
                  </label>

                  <select
                    value={
                      statusFilter
                    }
                    onChange={(
                      e
                    ) =>
                      setStatusFilter(
                        e.target
                          .value
                      )
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">
                      All Status
                    </option>

                    {STATUSES.map(
                      (
                        status
                      ) => (
                        <option
                          key={
                            status
                          }
                        >
                          {
                            status
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    Priority
                  </label>

                  <select
                    value={
                      priorityFilter
                    }
                    onChange={(
                      e
                    ) =>
                      setPriorityFilter(
                        e.target
                          .value
                      )
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">
                      All Priorities
                    </option>

                    {PRIORITIES.map(
                      (
                        priority
                      ) => (
                        <option
                          key={
                            priority
                          }
                        >
                          {
                            priority
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    // Filters are applied live.
                  }}
                  className="self-end rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Apply
                </button>

                <button
                  type="button"
                  onClick={
                    resetFilters
                  }
                  className="self-end rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* ==================================================
                KPI CARDS
            ================================================== */}

            <div className="reports-kpis mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <KpiCard
                title="Total Complaints"
                value={total}
                subtitle="selected period"
                change={
                  total > 0
                    ? "Live"
                    : "No data"
                }
                icon="📄"
                iconBg="bg-blue-100"
                iconText="text-blue-600"
              />

              <KpiCard
                title="Resolved Complaints"
                value={resolved}
                subtitle="of total complaints"
                change={`${resolutionRate.toFixed(
                  1
                )}%`}
                icon="✓"
                iconBg="bg-emerald-100"
                iconText="text-emerald-600"
              />

              <KpiCard
                title="Pending Complaints"
                value={pending}
                subtitle="of total complaints"
                change={
                  total
                    ? `${(
                        (pending /
                          total) *
                        100
                      ).toFixed(
                        1
                      )}%`
                    : "0%"
                }
                icon="◷"
                iconBg="bg-orange-100"
                iconText="text-orange-600"
              />

              <KpiCard
                title="In Progress"
                value={inProgress}
                subtitle="of total complaints"
                change={
                  total
                    ? `${(
                        (inProgress /
                          total) *
                        100
                      ).toFixed(
                        1
                      )}%`
                    : "0%"
                }
                icon="◌"
                iconBg="bg-purple-100"
                iconText="text-purple-600"
              />

              <KpiCard
                title="Rejected"
                value={rejected}
                subtitle="of total complaints"
                change={
                  total
                    ? `${(
                        (rejected /
                          total) *
                        100
                      ).toFixed(
                        1
                      )}%`
                    : "0%"
                }
                icon="×"
                iconBg="bg-red-100"
                iconText="text-red-600"
              />

              <KpiCard
                title="SLA Breached"
                value={
                  slaBreached
                }
                subtitle="based on SLA settings"
                change={
                  total
                    ? `${(
                        (slaBreached /
                          total) *
                        100
                      ).toFixed(
                        1
                      )}%`
                    : "0%"
                }
                icon="⚠"
                iconBg="bg-red-100"
                iconText="text-red-600"
              />
            </div>

            {/* ==================================================
                TREND + STATUS
            ================================================== */}

            <div className="reports-chart-row mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
              {/* TREND */}

              <div className="reports-section rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
                    ].map(
                      (
                        range
                      ) => (
                        <button
                          key={
                            range
                          }
                          type="button"
                          onClick={() =>
                            setTrendRange(
                              range
                            )
                          }
                          className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                            trendRange ===
                            range
                              ? "bg-blue-600 text-white"
                              : "text-slate-500 hover:bg-white"
                          }`}
                        >
                          {
                            range
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <TrendChart
                    data={
                      trendData
                    }
                  />
                </div>
              </div>

              {/* STATUS */}

              <div className="reports-section rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Status Distribution
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Current complaint status
                  </p>
                </div>

                <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row xl:flex-col">
                  <div className="relative h-48 w-48 shrink-0">
                    <svg
                      viewBox="0 0 200 200"
                      className="h-full w-full"
                    >
                      {donutSegments.length >
                      0 ? (
                        donutSegments.map(
                          (
                            segment,
                            index
                          ) => {
                            const colors =
                              [
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
                                  colors[
                                    index
                                  ]
                                }
                                strokeWidth="28"
                              />
                            );
                          }
                        )
                      ) : (
                        <circle
                          cx="100"
                          cy="100"
                          r="75"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="28"
                        />
                      )}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">
                        {
                          total
                        }
                      </span>

                      <span className="text-xs text-slate-500">
                        Total Complaints
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    {statusData.map(
                      (
                        item
                      ) => (
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
                              {
                                item.name
                              }
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-slate-800">
                              {
                                item.percentage
                              }
                              %
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

            <div className="reports-two-column mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
              {/* DEPARTMENT */}

              <div className="reports-section rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Complaints by Department
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Distribution across departments
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {departmentData.length ===
                  0 ? (
                    <EmptyState />
                  ) : (
                    departmentData.map(
                      (
                        department
                      ) => {
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
                    )
                  )}
                </div>
              </div>

              {/* PRIORITY */}

              <div className="reports-section rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Priority Analysis
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Complaints by priority level
                  </p>
                </div>

                <div className="mt-8 flex h-64 items-end justify-around gap-5 border-b border-l border-slate-200 px-6 pb-0">
                  {priorityData.map(
                    (
                      item
                    ) => {
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

              <div className="reports-section rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h2 className="font-bold text-slate-900">
                    SLA Performance
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Service level agreement performance
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
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
                        strokeDashoffset={
                          301.59 -
                          (301.59 *
                            Math.min(
                              100,
                              slaCompliance
                            )) /
                            100
                        }
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">
                        {Math.round(
                          slaCompliance
                        )}
                        %
                      </span>

                      <span className="text-xs text-slate-500">
                        Compliance
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <SlaRow
                      icon="✓"
                      label="SLA Met"
                      value={
                        slaMet
                      }
                      iconClass="bg-emerald-100 text-emerald-600"
                    />

                    <SlaRow
                      icon="⚠"
                      label="SLA Breached"
                      value={
                        slaBreached
                      }
                      iconClass="bg-red-100 text-red-600"
                    />

                    <SlaRow
                      icon="◷"
                      label="Avg. Resolution Time"
                      value={`${averageResolutionHours.toFixed(
                        1
                      )} hrs`}
                      iconClass="bg-blue-100 text-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* ESCALATION */}

              <div className="reports-section rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Escalation Analytics
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Complaints reaching configured escalation levels
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Total Escalated
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {
                        escalationData.total
                      }
                    </p>
                  </div>

                  <EscalationCard
                    level="Level 1"
                    value={
                      escalationData.level1
                    }
                    icon="👤"
                  />

                  <EscalationCard
                    level="Level 2"
                    value={
                      escalationData.level2
                    }
                    icon="⚠"
                  />

                  <EscalationCard
                    level="Level 3"
                    value={
                      escalationData.level3
                    }
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
                        {
                          escalationData.mostEscalated
                        }

                        <span className="ml-2 text-xs font-medium text-red-500">
                          (
                          {
                            escalationData.mostEscalatedCount
                          }
                          )
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

            <div className="reports-staff-row mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_1fr]">
              {/* STAFF */}

              <div className="reports-section rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                  <h2 className="font-bold text-slate-900">
                    Staff Performance
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Complaint handling performance
                  </p>
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
                      {staffData.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-5 py-10 text-center text-sm text-slate-400"
                          >
                            No staff performance data available.
                          </td>
                        </tr>
                      ) : (
                        staffData.map(
                          (
                            member
                          ) => (
                            <tr
                              key={`${member.name}-${member.department}`}
                              className="hover:bg-slate-50"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                    {member.name
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()}
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
                                  }
                                  %
                                </span>
                              </td>
                            </tr>
                          )
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* LOCATION */}

              <div className="reports-section rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Complaint Location Analysis
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Complaint locations from submitted reports
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <select
                    value={
                      departmentFilter
                    }
                    onChange={(
                      e
                    ) =>
                      setDepartmentFilter(
                        e.target
                          .value
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
                  >
                    <option value="">
                      All Departments
                    </option>

                    {DEPARTMENTS.map(
                      (
                        department
                      ) => (
                        <option
                          key={
                            department
                          }
                        >
                          {
                            department
                          }
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={
                      statusFilter
                    }
                    onChange={(
                      e
                    ) =>
                      setStatusFilter(
                        e.target
                          .value
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
                  >
                    <option value="">
                      All Status
                    </option>

                    {STATUSES.map(
                      (
                        status
                      ) => (
                        <option
                          key={
                            status
                          }
                        >
                          {
                            status
                          }
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={
                      dateRange
                    }
                    onChange={(
                      e
                    ) =>
                      setDateRange(
                        e.target
                          .value
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
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

                <div className="relative mt-4 h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute left-1/4 top-0 h-full w-10 rotate-12 bg-white" />

                    <div className="absolute left-1/2 top-0 h-full w-6 -rotate-12 bg-white" />

                    <div className="absolute left-0 top-1/3 h-7 w-full rotate-6 bg-white" />

                    <div className="absolute left-0 top-2/3 h-5 w-full -rotate-3 bg-white" />
                  </div>

                  {filteredComplaints
                    .filter(
                      (item) =>
                        item.location
                          ?.latitude !==
                          null &&
                        item.location
                          ?.longitude !==
                          null
                    )
                    .slice(
                      0,
                      20
                    )
                    .map(
                      (
                        complaint,
                        index
                      ) => (
                        <MapPin
                          key={
                            complaint._id ||
                            index
                          }
                          left={`${15 + ((index * 17) % 70)}%`}
                          top={`${15 + ((index * 29) % 65)}%`}
                          type={
                            complaint.priority?.toLowerCase()
                          }
                        />
                      )
                    )}

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

            <div className="reports-section mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="font-bold text-slate-900">
                  Average Resolution Time
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Average time taken to resolve complaints
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {resolutionData.map(
                  (
                    item
                  ) => (
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
                FOOTER
            ================================================== */}

            <div className="reports-footer mt-5 flex justify-end">
              <button
                type="button"
                onClick={
                  exportReport
                }
                className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
              >
                ⇩ Download Full Report
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReportsAnalytics;

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
    <div className="reports-kpi rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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

const TrendChart = ({
  data = [],
}) => {
  const maxValue =
    Math.max(
      ...data.map(
        (item) =>
          item.value
      ),
      1
    );

  const chartWidth = 400;
  const chartHeight = 190;

  const points =
    data.map(
      (item, index) => {
        const x =
          data.length <= 1
            ? 0
            : (index /
                (data.length -
                  1)) *
              chartWidth;

        const y =
          chartHeight -
          (item.value /
            maxValue) *
            165;

        return [
          x,
          Math.max(
            10,
            y
          ),
        ];
      }
    );

  const linePoints =
    points
      .map(
        ([x, y]) =>
          `${x},${y}`
      )
      .join(" ");

  return (
    <div className="relative h-64 w-full">
      <div className="absolute inset-0 flex flex-col justify-between">
        {[
          maxValue,
          Math.round(
            maxValue * 0.75
          ),
          Math.round(
            maxValue * 0.5
          ),
          Math.round(
            maxValue * 0.25
          ),
          0,
        ].map(
          (value, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <span className="w-10 text-right text-[10px] text-slate-400">
                {value}
              </span>

              <div className="h-px flex-1 bg-slate-100" />
            </div>
          )
        )}
      </div>

      <div className="absolute bottom-7 left-12 right-0 top-0">
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

          {points.length >
            0 && (
            <>
              <polygon
                points={`0,190 ${linePoints} 400,190`}
                fill="url(#trendFill)"
              />

              <polyline
                points={
                  linePoints
                }
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />

              {points.map(
                (
                  [x, y],
                  index
                ) => (
                  <circle
                    key={
                      index
                    }
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
            </>
          )}
        </svg>
      </div>

      <div className="absolute bottom-0 left-12 right-0 flex justify-between overflow-hidden text-[10px] text-slate-400">
        {data
          .filter(
            (_, index) =>
              index === 0 ||
              index ===
                Math.floor(
                  data.length /
                    4
                ) ||
              index ===
                Math.floor(
                  data.length /
                    2
                ) ||
              index ===
                Math.floor(
                  (data.length *
                    3) /
                    4
                ) ||
              index ===
                data.length - 1
          )
          .map(
            (
              item,
              index
            ) => (
              <span
                key={
                  index
                }
              >
                {item.label}
              </span>
            )
          )}
      </div>
    </div>
  );
};

// ======================================================
// ARC
// ======================================================

const polarToCartesian = (
  centerX,
  centerY,
  radius,
  angle
) => {
  const angleInRadians =
    ((angle - 90) *
      Math.PI) /
    180;

  return {
    x:
      centerX +
      radius *
        Math.cos(
          angleInRadians
        ),

    y:
      centerY +
      radius *
        Math.sin(
          angleInRadians
        ),
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
    endAngle -
      startAngle <=
    180
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
    medium:
      "bg-orange-400",
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
        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs text-white shadow-lg ${
          classes[type] ||
          classes.low
        }`}
      >
        ●
      </div>
    </div>
  );
};

// ======================================================
// LEGEND
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

// ======================================================
// EMPTY STATE
// ======================================================

const EmptyState = () => {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center">
      <p className="text-sm font-medium text-slate-500">
        No complaint data available.
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Try changing the selected filters.
      </p>
    </div>
  );
};