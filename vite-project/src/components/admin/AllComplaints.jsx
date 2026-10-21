import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api";

const STATUSES = [
  "Pending",
  "In Progress",
  "Resolved",
  "Rejected",
];

// ==================================================
// AUTH HELPERS
// ==================================================

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

// ==================================================
// PRIORITY
// ==================================================

const getComplaintPriority = (complaint) => {
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

// ==================================================
// DEPARTMENT FOR STAFF SELECTION
// ==================================================

const getDepartmentForAssignment = (
  complaintType = ""
) => {
  const type =
    String(complaintType).toLowerCase();

  if (
    /water|pipeline|leakage|supply/.test(type)
  )
    return "Water Supply";

  if (
    /road|pothole|footpath/.test(type)
  )
    return "Roads & Infrastructure";

  if (
    /electric|electrical|street.?light|lighting|lamp/.test(
      type
    )
  )
    return "Electrical & Street Lighting";

  if (
    /drain|sewer|flood/.test(type)
  )
    return "Drainage & Sewerage";

  if (
    /garbage|sanitation|waste|cleanliness/.test(
      type
    )
  )
    return "Sanitation";

  if (
    /park|garden|horticulture/.test(type)
  )
    return "Parks & Horticulture";

  if (
    /traffic|signal/.test(type)
  )
    return "Traffic Management";

  if (
    /building|construction/.test(type)
  )
    return "Building & Construction";

  return "General Administration";
};

// ==================================================
// ASSIGNED STAFF DEPARTMENT
// ==================================================

const getAssignedDepartment = (
  assignedStaff
) => {
  if (
    assignedStaff &&
    typeof assignedStaff === "object" &&
    assignedStaff.department
  ) {
    return assignedStaff.department;
  }

  return "Not assigned";
};

// ==================================================
// NORMALIZE COMPLAINT
// ==================================================

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
    typeof complaint.assignedStaff === "object"
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
            rawLocation?.lat ??
            null,

          longitude:
            complaint.longitude ??
            rawLocation?.longitude ??
            rawLocation?.lng ??
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
      "",

    email:
      user.email || "",

    contact:
      user.contact ||
      user.phone ||
      "",

    title:
      complaint.title ||
      complaintType,

    complaintType,

    department:
      getAssignedDepartment(
        assignedStaff
      ),

    priority:
      complaint.priority ||
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
  };
};

// ==================================================
// NUMBER HELPER
// ==================================================

const toNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
};

// ==================================================
// GET STAFF COORDINATES
// ==================================================

const getStaffCoordinates = (
  member
) => {
  const latitude =
    member?.latitude ??
    member?.lat ??
    member?.location?.latitude ??
    member?.location?.lat ??
    member?.coordinates?.latitude ??
    member?.coordinates?.lat;

  const longitude =
    member?.longitude ??
    member?.lng ??
    member?.location?.longitude ??
    member?.location?.lng ??
    member?.coordinates?.longitude ??
    member?.coordinates?.lng;

  return {
    latitude: toNumber(latitude),
    longitude: toNumber(longitude),
  };
};

// ==================================================
// HAVERSINE DISTANCE
// ==================================================

const calculateDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const latitude1 =
    toNumber(lat1);

  const longitude1 =
    toNumber(lon1);

  const latitude2 =
    toNumber(lat2);

  const longitude2 =
    toNumber(lon2);

  if (
    latitude1 === null ||
    longitude1 === null ||
    latitude2 === null ||
    longitude2 === null
  ) {
    return null;
  }

  const R = 6371;

  const dLat =
    ((latitude2 - latitude1) *
      Math.PI) /
    180;

  const dLon =
    ((longitude2 - longitude1) *
      Math.PI) /
    180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (latitude1 * Math.PI) /
        180
    ) *
      Math.cos(
        (latitude2 * Math.PI) /
          180
      ) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};

// ==================================================
// STAFF ADDRESS
// ==================================================

const getStaffFullAddress = (
  member
) => {
  return [
    member?.address,
    member?.city,
    member?.state,
    member?.pincode,
  ]
    .filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    )
    .map((value) =>
      String(value).trim()
    )
    .join(", ");
};

// ==================================================
// GEOCODE STAFF ADDRESS
// ==================================================

const geocodeStaff = async (
  member
) => {
  const coordinates =
    getStaffCoordinates(member);

  // FIRST: use stored coordinates
  if (
    coordinates.latitude !== null &&
    coordinates.longitude !== null
  ) {
    return {
      ...member,
      latitude:
        coordinates.latitude,
      longitude:
        coordinates.longitude,
    };
  }

  const fullAddress =
    getStaffFullAddress(member);

  if (!fullAddress) {
    return {
      ...member,
      latitude: null,
      longitude: null,
      distance: null,
    };
  }

  try {
    const url =
      "https://nominatim.openstreetmap.org/search" +
      `?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(
        fullAddress
      )}`;

    const response =
      await fetch(url, {
        headers: {
          Accept:
            "application/json",
        },
      });

    if (!response.ok) {
      throw new Error(
        "Geocoding request failed"
      );
    }

    const results =
      await response.json();

    if (
      !Array.isArray(results) ||
      results.length === 0
    ) {
      return {
        ...member,
        latitude: null,
        longitude: null,
        distance: null,
      };
    }

    const latitude =
      Number(results[0].lat);

    const longitude =
      Number(results[0].lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return {
        ...member,
        latitude: null,
        longitude: null,
        distance: null,
      };
    }

    return {
      ...member,
      latitude,
      longitude,
    };
  } catch (error) {
    console.error(
      `Geocoding failed for ${member?.name}:`,
      error
    );

    return {
      ...member,
      latitude: null,
      longitude: null,
      distance: null,
    };
  }
};

// ==================================================
// FORMAT DISTANCE
// ==================================================

const formatDistance = (
  distance
) => {
  if (
    distance === null ||
    distance === undefined ||
    !Number.isFinite(distance)
  ) {
    return "Distance unavailable";
  }

  if (distance < 1) {
    return `${Math.round(
      distance * 1000
    )} m away`;
  }

  return `${distance.toFixed(
    2
  )} km away`;
};

// ==================================================
// MAIN COMPONENT
// ==================================================

const AllComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [staff, setStaff] =
    useState([]);

  const [
    staffWithDistance,
    setStaffWithDistance,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [staffLoading, setStaffLoading] =
    useState(false);

  const [
    distanceLoading,
    setDistanceLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [
    departmentFilter,
    setDepartmentFilter,
  ] = useState("");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("");

  const [
    selectedComplaint,
    setSelectedComplaint,
  ] = useState(null);

  const [
    selectedStaff,
    setSelectedStaff,
  ] = useState("");

  const [
    showDetailsModal,
    setShowDetailsModal,
  ] = useState(false);

  const [
    showAssignModal,
    setShowAssignModal,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  // ==================================================
  // FETCH COMPLAINTS
  // ==================================================

  const fetchComplaints =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE_URL}/admin/complaints`,
            {
              method: "GET",
              headers:
                getAuthHeaders(),
              credentials:
                "include",
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
      } finally {
        setLoading(false);
      }
    };

  // ==================================================
  // FETCH STAFF
  // ==================================================

  const fetchStaff =
    async () => {
      try {
        setStaffLoading(true);

        const response =
          await fetch(
            `${API_BASE_URL}/staff`,
            {
              method: "GET",
              headers:
                getAuthHeaders(),
              credentials:
                "include",
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
      } finally {
        setStaffLoading(false);
      }
    };

  // ==================================================
  // INITIAL FETCH
  // ==================================================

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, []);

  // ==================================================
  // STATISTICS
  // ==================================================

  const total =
    complaints.length;

  const pending =
    complaints.filter(
      (item) =>
        item.status ===
        "Pending"
    ).length;

  const inProgress =
    complaints.filter(
      (item) =>
        item.status ===
        "In Progress"
    ).length;

  const resolved =
    complaints.filter(
      (item) =>
        item.status ===
        "Resolved"
    ).length;

  const rejected =
    complaints.filter(
      (item) =>
        item.status ===
        "Rejected"
    ).length;

  const unassigned =
    complaints.filter(
      (item) =>
        !item.assignedStaff
    ).length;

  // ==================================================
  // DEPARTMENTS
  // ==================================================

  const departments =
    useMemo(
      () =>
        [
          ...new Set(
            complaints
              .filter(
                (item) =>
                  item.assignedStaff
                    ?.department
              )
              .map(
                (item) =>
                  item.assignedStaff
                    .department
              )
          ),
        ],
      [complaints]
    );

  // ==================================================
  // FILTER COMPLAINTS
  // ==================================================

  const filteredComplaints =
    useMemo(() => {
      const term =
        search
          .toLowerCase()
          .trim();

      return complaints.filter(
        (complaint) => {
          const matchesSearch =
            !term ||
            String(
              complaint.complaintId
            )
              .toLowerCase()
              .includes(term) ||
            String(
              complaint.citizenName
            )
              .toLowerCase()
              .includes(term) ||
            String(
              complaint.title
            )
              .toLowerCase()
              .includes(term) ||
            String(
              complaint.complaintType
            )
              .toLowerCase()
              .includes(term);

          const matchesStatus =
            !statusFilter ||
            complaint.status ===
              statusFilter;

          const matchesDepartment =
            !departmentFilter ||
            complaint.assignedStaff
              ?.department ===
              departmentFilter;

          const matchesPriority =
            !priorityFilter ||
            complaint.priority ===
              priorityFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesDepartment &&
            matchesPriority
          );
        }
      );
    }, [
      complaints,
      search,
      statusFilter,
      departmentFilter,
      priorityFilter,
    ]);

  // ==================================================
  // OPEN DETAILS
  // ==================================================

  const openDetailsModal = (
    complaint
  ) => {
    setSelectedComplaint(
      complaint
    );

    setShowDetailsModal(
      true
    );
  };

  // ==================================================
  // OPEN ASSIGN MODAL
  // ==================================================

  const openAssignModal = (
    complaint
  ) => {
    setSelectedComplaint(
      complaint
    );

    setSelectedStaff(
      complaint?.assignedStaff?._id ||
        complaint?.assignedStaff ||
        ""
    );

    setStaffWithDistance(
      []
    );

    setShowAssignModal(
      true
    );
  };

  // ==================================================
  // CLOSE ASSIGN MODAL
  // ==================================================

  const closeAssignModal = () => {
    if (actionLoading) {
      return;
    }

    setShowAssignModal(
      false
    );

    setSelectedStaff("");

    setSelectedComplaint(
      null
    );

    setStaffWithDistance(
      []
    );
  };

  // ==================================================
  // AVAILABLE STAFF
  // ==================================================

  const availableStaff =
    useMemo(() => {
      if (!selectedComplaint) {
        return [];
      }

      const requiredDepartment =
        getDepartmentForAssignment(
          selectedComplaint.complaintType
        );

      const activeStaff =
        staff.filter(
          (member) =>
            member.status ===
            "Active"
        );

      if (
        requiredDepartment ===
        "General Administration"
      ) {
        return activeStaff;
      }

      return activeStaff.filter(
        (member) =>
          member.department ===
          requiredDepartment
      );
    }, [
      staff,
      selectedComplaint,
    ]);

  // ==================================================
  // CALCULATE STAFF DISTANCES
  // ==================================================

  useEffect(() => {
    let cancelled = false;

    const calculateStaffDistances =
      async () => {
        if (
          !showAssignModal ||
          !selectedComplaint
        ) {
          return;
        }

        if (
          availableStaff.length ===
          0
        ) {
          setStaffWithDistance(
            []
          );
          return;
        }

        const complaintLatitude =
          selectedComplaint.location
            ?.latitude;

        const complaintLongitude =
          selectedComplaint.location
            ?.longitude;

        if (
          toNumber(
            complaintLatitude
          ) === null ||
          toNumber(
            complaintLongitude
          ) === null
        ) {
          setStaffWithDistance(
            availableStaff.map(
              (member) => ({
                ...member,
                distance:
                  null,
              })
            )
          );

          return;
        }

        try {
          setDistanceLoading(
            true
          );

          const geocodedStaff =
            [];

          for (
            const member of availableStaff
          ) {
            if (cancelled) {
              return;
            }

            const result =
              await geocodeStaff(
                member
              );

            const distance =
              calculateDistance(
                complaintLatitude,
                complaintLongitude,
                result.latitude,
                result.longitude
              );

            geocodedStaff.push({
              ...result,
              distance,
            });

            // Small delay only when
            // address geocoding is needed.
            const coords =
              getStaffCoordinates(
                member
              );

            if (
              coords.latitude ===
                null ||
              coords.longitude ===
                null
            ) {
              await new Promise(
                (resolve) =>
                  setTimeout(
                    resolve,
                    350
                  )
              );
            }
          }

          if (cancelled) {
            return;
          }

          // Nearest first
          geocodedStaff.sort(
            (a, b) => {
              if (
                a.distance === null &&
                b.distance === null
              ) {
                return String(
                  a.name || ""
                ).localeCompare(
                  String(
                    b.name || ""
                  )
                );
              }

              if (
                a.distance === null
              ) {
                return 1;
              }

              if (
                b.distance === null
              ) {
                return -1;
              }

              return (
                a.distance -
                b.distance
              );
            }
          );

          setStaffWithDistance(
            geocodedStaff
          );
        } catch (error) {
          console.error(
            "Distance calculation error:",
            error
          );

          if (!cancelled) {
            setStaffWithDistance(
              availableStaff.map(
                (member) => ({
                  ...member,
                  distance:
                    null,
                })
              )
            );
          }
        } finally {
          if (!cancelled) {
            setDistanceLoading(
              false
            );
          }
        }
      };

    calculateStaffDistances();

    return () => {
      cancelled = true;
    };
  }, [
    showAssignModal,
    selectedComplaint,
    availableStaff,
  ]);

  // ==================================================
  // ASSIGN STAFF
  // ==================================================

  const handleAssignStaff =
    async () => {
      if (!selectedStaff) {
        alert(
          "Please select a staff member."
        );
        return;
      }

      if (
        !selectedComplaint?._id
      ) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        const response =
          await fetch(
            `${API_BASE_URL}/admin/complaints/${selectedComplaint._id}/assign`,
            {
              method: "PUT",
              headers:
                getAuthHeaders(),
              credentials:
                "include",
              body: JSON.stringify({
                staffId:
                  selectedStaff,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to assign staff."
          );
        }

        const returnedComplaint =
          data?.complaint ||
          data?.data ||
          data;

        let assignedRecord =
          returnedComplaint?.assignedStaff;

        if (
          !assignedRecord ||
          typeof assignedRecord !==
            "object"
        ) {
          assignedRecord =
            staff.find(
              (member) =>
                member._id ===
                selectedStaff
            ) || null;
        }

        const updatedComplaint =
          normalizeComplaint({
            ...returnedComplaint,

            _id:
              returnedComplaint?._id ||
              selectedComplaint._id,

            assignedStaff:
              assignedRecord,

            status:
              returnedComplaint?.status ||
              (selectedComplaint.status ===
              "Pending"
                ? "In Progress"
                : selectedComplaint.status),
          });

        setComplaints(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                selectedComplaint._id
                  ? updatedComplaint
                  : item
            )
        );

        setSelectedComplaint(
          updatedComplaint
        );

        setShowAssignModal(
          false
        );

        setSelectedStaff("");

        setStaffWithDistance(
          []
        );

        alert(
          "Staff assigned successfully."
        );

        await fetchComplaints();
      } catch (err) {
        console.error(
          "Assign staff error:",
          err
        );

        alert(
          err.message ||
            "Unable to assign staff."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  // ==================================================
  // UPDATE STATUS
  // ==================================================

  const handleStatusChange =
    async (
      complaintId,
      newStatus
    ) => {
      try {
        setActionLoading(
          true
        );

        const response =
          await fetch(
            `${API_BASE_URL}/admin/complaints/${complaintId}/status`,
            {
              method: "PUT",
              headers:
                getAuthHeaders(),
              credentials:
                "include",
              body: JSON.stringify({
                status:
                  newStatus,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to update status."
          );
        }

        const returnedComplaint =
          data?.complaint ||
          data?.data ||
          null;

        setComplaints(
          (previous) =>
            previous.map(
              (item) => {
                if (
                  item._id !==
                  complaintId
                ) {
                  return item;
                }

                return normalizeComplaint(
                  {
                    ...item,
                    ...(returnedComplaint ||
                      {}),

                    assignedStaff:
                      returnedComplaint?.assignedStaff ??
                      item.assignedStaff,

                    status:
                      newStatus,
                  }
                );
              }
            )
        );

        setSelectedComplaint(
          (previous) => {
            if (
              previous?._id !==
              complaintId
            ) {
              return previous;
            }

            return normalizeComplaint(
              {
                ...previous,
                ...(returnedComplaint ||
                  {}),

                assignedStaff:
                  returnedComplaint?.assignedStaff ??
                  previous.assignedStaff,

                status:
                  newStatus,
              }
            );
          }
        );
      } catch (err) {
        console.error(
          "Update status error:",
          err
        );

        alert(
          err.message ||
            "Unable to update complaint status."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete =
    async (complaintId) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this complaint?"
        )
      ) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        const response =
          await fetch(
            `${API_BASE_URL}/admin/complaints/${complaintId}`,
            {
              method: "DELETE",
              headers:
                getAuthHeaders(),
              credentials:
                "include",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to delete complaint."
          );
        }

        setComplaints(
          (previous) =>
            previous.filter(
              (item) =>
                item._id !==
                complaintId
            )
        );

        if (
          selectedComplaint?._id ===
          complaintId
        ) {
          setSelectedComplaint(
            null
          );

          setShowDetailsModal(
            false
          );

          setShowAssignModal(
            false
          );
        }

        alert(
          "Complaint deleted successfully."
        );
      } catch (err) {
        console.error(
          "Delete complaint error:",
          err
        );

        alert(
          err.message ||
            "Unable to delete complaint."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  // ==================================================
  // RESET
  // ==================================================

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setDepartmentFilter("");
    setPriorityFilter("");
  };

  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh =
    async () => {
      await Promise.all([
        fetchComplaints(),
        fetchStaff(),
      ]);
    };

  // ==================================================
  // MAP
  // ==================================================

  const openMap = (
    location
  ) => {
    if (
      location?.latitude ==
        null ||
      location?.longitude ==
        null
    ) {
      alert(
        "Location coordinates are not available."
      );

      return;
    }

    const url =
      `https://www.google.com/maps/search/?api=1&query=` +
      `${location.latitude},${location.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 p-5 md:p-8">

      {/* HEADER */}

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Complaint Management
        </p>

        <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              All Complaints
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View, manage, assign and track all citizen complaints.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={
                handleRefresh
              }
              disabled={
                loading ||
                staffLoading
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              ↻ Refresh
            </button>

            <div className="rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
              Admin Panel
            </div>

          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <div className="flex items-center justify-between gap-4">
            <span>{error}</span>

            <button
              onClick={
                fetchComplaints
              }
              className="font-bold underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        <StatCard
          title="Total Complaints"
          value={total}
          icon="📋"
        />

        <StatCard
          title="Pending"
          value={pending}
          icon="⏳"
        />

        <StatCard
          title="In Progress"
          value={inProgress}
          icon="🔄"
        />

        <StatCard
          title="Resolved"
          value={resolved}
          icon="✓"
        />

        <StatCard
          title="Rejected"
          value={rejected}
          icon="✕"
        />

        <StatCard
          title="Unassigned"
          value={unassigned}
          icon="👤"
        />

      </div>

      {/* FILTERS */}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">

          <div>
            <h2 className="font-semibold text-slate-900">
              Search & Filter
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Find complaints quickly.
            </p>
          </div>

          <button
            onClick={
              resetFilters
            }
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear Filters
          </button>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="ID, citizen, title..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Status
            </label>

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
            >
              <option value="">
                All Status
              </option>

              {STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Assigned Staff Department
            </label>

            <select
              value={
                departmentFilter
              }
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
            >
              <option value="">
                All Departments
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Priority
            </label>

            <select
              value={
                priorityFilter
              }
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
            >
              <option value="">
                All Priorities
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* TABLE */}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-5 md:flex-row md:items-center">

          <div>
            <h2 className="font-semibold text-slate-900">
              Complaint Records
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Showing{" "}
              {
                filteredComplaints.length
              }{" "}
              of{" "}
              {
                complaints.length
              }{" "}
              complaints
            </p>
          </div>

          <button
            onClick={
              resetFilters
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            ↻ Reset
          </button>

        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading complaints...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px]">

              <thead className="bg-slate-50">

                <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                  <th className="px-5 py-4">
                    Complaint
                  </th>

                  <th className="px-5 py-4">
                    Citizen
                  </th>

                  <th className="px-5 py-4">
                    Department
                  </th>

                  <th className="px-5 py-4">
                    Priority
                  </th>

                  <th className="px-5 py-4">
                    Assigned Staff
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredComplaints.map(
                  (complaint) => (
                    <tr
                      key={
                        complaint._id
                      }
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-5 py-5">

                        <div className="flex items-start gap-3">

                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">

                            {complaint.complaintImage ? (
                              <img
                                src={getImageUrl(
                                  complaint.complaintImage
                                )}
                                alt="Complaint"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-lg">
                                📋
                              </div>
                            )}

                          </div>

                          <div>
                            <p className="font-bold text-slate-800">
                              {
                                complaint.complaintId
                              }
                            </p>

                            <p className="mt-1 max-w-[220px] truncate text-sm font-medium text-slate-700">
                              {
                                complaint.title
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(
                                complaint.createdAt
                              )}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-5">

                        {complaint.citizenName ? (
                          <>
                            <p className="font-semibold text-slate-700">
                              {
                                complaint.citizenName
                              }
                            </p>

                            {complaint.email && (
                              <p className="mt-1 text-xs text-slate-400">
                                {
                                  complaint.email
                                }
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-slate-400">
                            Citizen details unavailable
                          </p>
                        )}

                      </td>

                      <td className="px-5 py-5">

                        {complaint.assignedStaff?.department ? (
                          <span className="inline-block max-w-[190px] rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {
                              complaint.assignedStaff.department
                            }
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Not assigned
                          </span>
                        )}

                      </td>

                      <td className="px-5 py-5">
                        <PriorityBadge
                          priority={
                            complaint.priority
                          }
                        />
                      </td>

                      <td className="px-5 py-5">

                        {complaint.assignedStaff ? (
                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                              {String(
                                complaint.assignedStaff.name ||
                                  "S"
                              )
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div>

                              <p className="font-semibold text-slate-700">
                                {
                                  complaint.assignedStaff.name ||
                                  "Staff"
                                }
                              </p>

                              <p className="text-xs text-slate-400">
                                {
                                  complaint.assignedStaff.staffId ||
                                  ""
                                }
                              </p>

                            </div>

                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            No staff assigned
                          </span>
                        )}

                      </td>

                      <td className="px-5 py-5">

                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          {
                            complaint.status
                          }
                        </span>

                      </td>

                      <td className="px-5 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              openDetailsModal(
                                complaint
                              )
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              openAssignModal(
                                complaint
                              )
                            }
                            className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                          >
                            {complaint.assignedStaff
                              ? "Change"
                              : "Assign"}
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                complaint._id
                              )
                            }
                            disabled={
                              actionLoading
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>
            </table>
          </div>
        )}

        {!loading &&
          filteredComplaints.length ===
            0 && (
            <div className="p-12 text-center">
              <div className="text-4xl">
                📋
              </div>

              <h3 className="mt-3 font-semibold text-slate-700">
                No complaints found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}

      </div>

      {/* ==================================================
          DETAILS MODAL
          ================================================== */}

      {showDetailsModal &&
        selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">

            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    Complaint Details
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {
                      selectedComplaint.complaintId
                    }
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setShowDetailsModal(
                      false
                    );
                    setSelectedComplaint(
                      null
                    );
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100"
                >
                  ×
                </button>

              </div>

              <div className="space-y-6 p-6">

                <div className="flex flex-col justify-between gap-4 rounded-xl bg-slate-50 p-5 md:flex-row md:items-center">

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {
                        selectedComplaint.title
                      }
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Submitted on{" "}
                      {formatDate(
                        selectedComplaint.createdAt
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <PriorityBadge
                      priority={
                        selectedComplaint.priority
                      }
                    />

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        selectedComplaint.status
                      )}`}
                    >
                      {
                        selectedComplaint.status
                      }
                    </span>
                  </div>

                </div>

                <InfoSection title="Complaint Information">

                  <InfoRow
                    label="Complaint Type"
                    value={
                      selectedComplaint.complaintType
                    }
                  />

                  <InfoRow
                    label="Citizen"
                    value={
                      selectedComplaint.citizenName
                    }
                  />

                  <InfoRow
                    label="Email"
                    value={
                      selectedComplaint.email
                    }
                  />

                  <InfoRow
                    label="Contact"
                    value={
                      selectedComplaint.contact
                    }
                  />

                  <InfoRow
                    label="Assigned Staff Department"
                    value={getAssignedDepartment(
                      selectedComplaint.assignedStaff
                    )}
                  />

                  <InfoRow
                    label="Priority"
                    value={
                      selectedComplaint.priority
                    }
                  />

                  <InfoRow
                    label="Status"
                    value={
                      selectedComplaint.status
                    }
                  />

                </InfoSection>

                <InfoSection title="Complaint Description">

                  <p className="text-sm leading-7 text-slate-600">
                    {
                      selectedComplaint.description
                    }
                  </p>

                </InfoSection>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                  <div>

                    <h3 className="mb-3 text-sm font-bold text-slate-800">
                      📷 Complaint Image
                    </h3>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

                      {selectedComplaint.complaintImage ? (
                        <img
                          src={getImageUrl(
                            selectedComplaint.complaintImage
                          )}
                          alt="Citizen complaint"
                          className="h-[280px] w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-[280px] items-center justify-center text-sm text-slate-400">
                          No complaint image uploaded
                        </div>
                      )}

                    </div>

                  </div>

                  <div>

                    <h3 className="mb-3 text-sm font-bold text-slate-800">
                      📍 Complaint Location
                    </h3>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                      <p className="font-semibold text-slate-800">
                        {
                          selectedComplaint.location?.address ||
                          "Location not available"
                        }
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="rounded-lg bg-white p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Latitude
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {
                              selectedComplaint.location?.latitude ??
                              "Not available"
                            }
                          </p>
                        </div>

                        <div className="rounded-lg bg-white p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Longitude
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {
                              selectedComplaint.location?.longitude ??
                              "Not available"
                            }
                          </p>
                        </div>

                      </div>

                      <button
                        onClick={() =>
                          openMap(
                            selectedComplaint.location
                          )
                        }
                        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
                      >
                        📍 View on Google Maps
                      </button>

                    </div>

                  </div>

                </div>

                <InfoSection title="Assigned Staff">

                  {selectedComplaint.assignedStaff ? (
                    <div className="flex flex-col justify-between gap-4 rounded-xl border border-green-100 bg-green-50 p-4 sm:flex-row sm:items-center">

                      <div>
                        <p className="font-bold text-slate-800">
                          {
                            selectedComplaint.assignedStaff.name
                          }
                        </p>

                        <p className="text-xs text-slate-500">
                          {
                            selectedComplaint.assignedStaff.staffId ||
                            ""
                          }

                          {selectedComplaint.assignedStaff.role
                            ? ` • ${selectedComplaint.assignedStaff.role}`
                            : ""}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-green-700">
                          Department:{" "}
                          {getAssignedDepartment(
                            selectedComplaint.assignedStaff
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setShowDetailsModal(
                            false
                          );

                          openAssignModal(
                            selectedComplaint
                          );
                        }}
                        className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                      >
                        Change Staff
                      </button>

                    </div>
                  ) : (
                    <div className="flex flex-col justify-between gap-4 rounded-xl border border-orange-100 bg-orange-50 p-4 md:flex-row md:items-center">

                      <div>
                        <p className="font-semibold text-orange-700">
                          No staff assigned
                        </p>

                        <p className="mt-1 text-xs text-orange-600">
                          Assign a staff member to this complaint.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setShowDetailsModal(
                            false
                          );

                          openAssignModal(
                            selectedComplaint
                          );
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                      >
                        + Assign Staff
                      </button>

                    </div>
                  )}

                </InfoSection>

                <InfoSection title="Update Complaint Status">

                  <div className="flex flex-wrap gap-3">

                    {STATUSES.map(
                      (status) => (
                        <button
                          key={status}
                          disabled={
                            actionLoading
                          }
                          onClick={() =>
                            handleStatusChange(
                              selectedComplaint._id,
                              status
                            )
                          }
                          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                            selectedComplaint.status ===
                            status
                              ? getStatusButtonClass(
                                  status
                                )
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          } disabled:opacity-50`}
                        >
                          {status}
                        </button>
                      )
                    )}

                  </div>

                </InfoSection>

              </div>

              <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

                <button
                  onClick={() => {
                    setShowDetailsModal(
                      false
                    );

                    setSelectedComplaint(
                      null
                    );
                  }}
                  className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
                >
                  Close
                </button>

              </div>

            </div>
          </div>
        )}

      {/* ==================================================
          ASSIGN / CHANGE STAFF MODAL
          ================================================== */}

      {showAssignModal &&
        selectedComplaint && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-3 sm:p-6">

            <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

              {/* HEADER */}

              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      👤
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                        Staff Assignment
                      </p>

                      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                        {selectedComplaint.assignedStaff
                          ? "Change Assigned Staff"
                          : "Assign Staff"}
                      </h2>
                    </div>

                  </div>

                </div>

                <button
                  onClick={
                    closeAssignModal
                  }
                  disabled={
                    actionLoading
                  }
                  className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                >
                  ×
                </button>

              </div>

              {/* BODY */}

              <div className="min-h-0 flex-1 overflow-y-auto">

                <div className="space-y-5 px-5 py-5 sm:px-6">

                  {/* COMPLAINT SUMMARY */}

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                      <div className="min-w-0">

                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Complaint
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {
                            selectedComplaint.complaintId
                          }
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {
                            selectedComplaint.title
                          }
                        </p>

                      </div>

                      <PriorityBadge
                        priority={
                          selectedComplaint.priority
                        }
                      />

                    </div>

                  </div>

                  {/* REQUIRED DEPARTMENT */}

                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        🏢
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                          Required Department
                        </p>

                        <p className="mt-1 text-sm font-bold text-blue-800">
                          {getDepartmentForAssignment(
                            selectedComplaint.complaintType
                          )}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* LOCATION */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                        📍
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Complaint Location
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                          {
                            selectedComplaint.location?.address ||
                            "Location unavailable"
                          }
                        </p>

                        {selectedComplaint.location?.latitude !=
                          null &&
                          selectedComplaint.location?.longitude !=
                            null && (
                            <p className="mt-1 text-xs text-slate-400">
                              Coordinates:{" "}
                              {
                                selectedComplaint.location.latitude
                              }
                              ,{" "}
                              {
                                selectedComplaint.location.longitude
                              }
                            </p>
                          )}

                      </div>

                    </div>

                  </div>

                  {/* STAFF HEADING */}

                  <div>

                    <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">

                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Select Staff Member
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Staff are automatically arranged from nearest to farthest.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                        <span className="h-2 w-2 rounded-full bg-green-500" />

                        {staffWithDistance.length}{" "}
                        available

                      </div>

                    </div>

                    {/* STAFF LIST */}

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                      {staffLoading ||
                      distanceLoading ? (
                        <div className="px-5 py-12 text-center">

                          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                          <p className="mt-4 text-sm font-semibold text-slate-600">
                            {staffLoading
                              ? "Loading available staff..."
                              : "Calculating staff distances..."}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Finding the nearest staff members
                          </p>

                        </div>
                      ) : staffWithDistance.length ===
                        0 ? (
                        <div className="px-5 py-12 text-center">

                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
                            !
                          </div>

                          <p className="mt-4 text-sm font-bold text-slate-700">
                            No active staff available
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            No active staff member belongs to the required department.
                          </p>

                        </div>
                      ) : (
                        <div className="max-h-[360px] divide-y divide-slate-200 overflow-y-auto">

                          {staffWithDistance.map(
                            (
                              member,
                              index
                            ) => {
                              const isSelected =
                                selectedStaff ===
                                member._id;

                              const isCurrentStaff =
                                selectedComplaint
                                  .assignedStaff?._id ===
                                member._id;

                              return (
                                <button
                                  key={
                                    member._id
                                  }
                                  type="button"
                                  onClick={() =>
                                    setSelectedStaff(
                                      member._id
                                    )
                                  }
                                  disabled={
                                    actionLoading
                                  }
                                  className={`group w-full border-l-4 px-4 py-4 text-left transition sm:px-5 ${
                                    isSelected
                                      ? "border-blue-600 bg-blue-50"
                                      : "border-transparent bg-white hover:bg-slate-50"
                                  } disabled:cursor-not-allowed disabled:opacity-60`}
                                >

                                  <div className="flex items-center gap-3">

                                    {/* NUMBER */}

                                    <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 sm:flex">
                                      {index +
                                        1}
                                    </div>

                                    {/* AVATAR */}

                                    <div
                                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                        isSelected
                                          ? "bg-blue-600 text-white"
                                          : "bg-blue-100 text-blue-700"
                                      }`}
                                    >
                                      {String(
                                        member.name ||
                                          "S"
                                      )
                                        .charAt(
                                          0
                                        )
                                        .toUpperCase()}
                                    </div>

                                    {/* INFORMATION */}

                                    <div className="min-w-0 flex-1">

                                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="flex min-w-0 flex-wrap items-center gap-2">

                                          <p className="truncate font-bold text-slate-800">
                                            {
                                              member.name ||
                                              "Staff Member"
                                            }
                                          </p>

                                          {isCurrentStaff && (
                                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                                              CURRENT
                                            </span>
                                          )}

                                        </div>

                                        {/* DISTANCE */}

                                        <div className="shrink-0">

                                          {member.distance !==
                                          null ? (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                                              📍{" "}
                                              {formatDistance(
                                                member.distance
                                              )}
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                                              Distance unavailable
                                            </span>
                                          )}

                                        </div>

                                      </div>

                                      <p className="mt-1 text-xs text-slate-500">
                                        {member.staffId ||
                                          "No Staff ID"}

                                        {member.role
                                          ? ` • ${member.role}`
                                          : ""}
                                      </p>

                                      <p className="mt-1 text-xs font-medium text-slate-400">
                                        {
                                          member.department
                                        }
                                      </p>

                                      {getStaffFullAddress(
                                        member
                                      ) && (
                                        <p className="mt-1 truncate text-xs text-slate-400">
                                          🏠{" "}
                                          {getStaffFullAddress(
                                            member
                                          )}
                                        </p>
                                      )}

                                    </div>

                                    {/* SELECTED */}

                                    <div
                                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                                        isSelected
                                          ? "border-blue-600 bg-blue-600 text-white"
                                          : "border-slate-300 bg-white text-transparent group-hover:border-blue-300"
                                      }`}
                                    >
                                      ✓
                                    </div>

                                  </div>

                                </button>
                              );
                            }
                          )}

                        </div>
                      )}

                    </div>

                  </div>

                  {/* SELECTED STAFF PREVIEW */}

                  {selectedStaff &&
                    staffWithDistance.length >
                      0 && (
                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                            ✓
                          </div>

                          <div className="min-w-0">

                            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                              Selected Staff
                            </p>

                            <p className="truncate text-sm font-bold text-blue-900">
                              {
                                staffWithDistance.find(
                                  (member) =>
                                    member._id ===
                                    selectedStaff
                                )?.name
                              }
                            </p>

                          </div>

                          <div className="ml-auto">

                            {(() => {
                              const selectedMember =
                                staffWithDistance.find(
                                  (member) =>
                                    member._id ===
                                    selectedStaff
                                );

                              return selectedMember?.distance !==
                                null &&
                                selectedMember?.distance !==
                                  undefined ? (
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-green-600">
                                  📍{" "}
                                  {formatDistance(
                                    selectedMember.distance
                                  )}
                                </span>
                              ) : null;
                            })()}

                          </div>

                        </div>

                      </div>
                    )}

                  {/* CURRENT STAFF */}

                  {selectedComplaint.assignedStaff && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                          ✓
                        </div>

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">
                            Currently Assigned
                          </p>

                          <p className="mt-1 text-sm font-bold text-green-800">
                            {
                              selectedComplaint.assignedStaff.name
                            }
                          </p>

                          <p className="mt-1 text-xs text-green-600">
                            {getAssignedDepartment(
                              selectedComplaint.assignedStaff
                            )}
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

                <button
                  onClick={
                    closeAssignModal
                  }
                  disabled={
                    actionLoading
                  }
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleAssignStaff
                  }
                  disabled={
                    actionLoading ||
                    staffLoading ||
                    distanceLoading ||
                    !selectedStaff
                  }
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading
                    ? "Saving..."
                    : selectedComplaint.assignedStaff
                    ? "Change Staff"
                    : "Assign Staff"}
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

// ==================================================
// REUSABLE COMPONENTS
// ==================================================

const StatCard = ({
  title,
  value,
  icon,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-xs font-medium text-slate-500">
          {title}
        </p>

        <p className="mt-2 text-2xl font-bold text-slate-900">
          {value}
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-lg">
        {icon}
      </div>

    </div>

  </div>
);

const InfoSection = ({
  title,
  children,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white">

    <div className="border-b border-slate-100 px-5 py-4">

      <h3 className="text-sm font-bold text-slate-800">
        {title}
      </h3>

    </div>

    <div className="space-y-3 p-5">
      {children}
    </div>

  </div>
);

const InfoRow = ({
  label,
  value,
}) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">

    <span className="text-xs font-medium text-slate-400">
      {label}
    </span>

    <span className="text-sm font-semibold text-slate-700 sm:text-right">
      {value ||
        "Not available"}
    </span>

  </div>
);

const PriorityBadge = ({
  priority,
}) => {
  const classes = {
    High:
      "bg-red-50 text-red-600",
    Medium:
      "bg-yellow-50 text-yellow-600",
    Low:
      "bg-green-50 text-green-600",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
        classes[priority] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {priority}
    </span>
  );
};

const getStatusClass = (
  status
) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-50 text-yellow-700";

    case "In Progress":
      return "bg-blue-50 text-blue-700";

    case "Resolved":
      return "bg-green-50 text-green-700";

    case "Rejected":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getStatusButtonClass = (
  status
) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500 text-white";

    case "In Progress":
      return "bg-blue-600 text-white";

    case "Resolved":
      return "bg-green-600 text-white";

    case "Rejected":
      return "bg-red-600 text-white";

    default:
      return "bg-slate-700 text-white";
  }
};

const formatDate = (
  date
) => {
  if (!date) {
    return "No date";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "No date";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getImageUrl = (
  image
) => {
  if (!image) {
    return "";
  }

  if (
    /^https?:\/\//i.test(
      image
    )
  ) {
    return image;
  }

  return `http://localhost:3000${
    image.startsWith("/")
      ? image
      : `/${image}`
  }`;
};

export default AllComplaints;