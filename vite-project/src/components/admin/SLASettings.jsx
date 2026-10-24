import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE_URL = "http://localhost:3000/api";
const SLA_API_URL = `${API_BASE_URL}/sla`;
const DEPARTMENT_API_URL = `${API_BASE_URL}/departments`;

// ======================================================
// AUTH
// ======================================================

const getToken = () => {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    ""
  );
};

// ======================================================
// API REQUEST
// ======================================================

const apiRequest = async (url, options = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Admin token not found. Please log in again."
    );
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong with the request."
    );
  }

  return data;
};

// ======================================================
// DEFAULT FORM
// ======================================================

const getDefaultForm = () => ({
  department: "",
  defaultSLAHours: 24,
  warningBeforeHours: 2,
  autoEscalation: true,

  escalationLevels: [
    {
      level: 1,
      afterHours: 24,
      escalateTo: "Department Head",
      notifyEmail: true,
      notifySystem: true,
    },
  ],

  emailNotifications: true,
  systemNotifications: true,
  status: "Active",
});

// ======================================================
// MAIN COMPONENT
// ======================================================

const SLASettings = () => {
  // ----------------------------------------------------
  // SLA SETTINGS
  // ----------------------------------------------------

  const [settings, setSettings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  // ----------------------------------------------------
  // DEPARTMENTS
  // ----------------------------------------------------

  const [departments, setDepartments] =
    useState([]);

  const [
    loadingDepartments,
    setLoadingDepartments,
  ] = useState(true);

  // ----------------------------------------------------
  // ERROR
  // ----------------------------------------------------

  const [error, setError] = useState("");

  // ----------------------------------------------------
  // SEARCH / FILTER
  // ----------------------------------------------------

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  // ----------------------------------------------------
  // MODAL
  // ----------------------------------------------------

  const [showModal, setShowModal] =
    useState(false);

  const [editingSetting, setEditingSetting] =
    useState(null);

  // ----------------------------------------------------
  // FORM
  // ----------------------------------------------------

  const [form, setForm] = useState(
    getDefaultForm()
  );

  // ====================================================
  // FETCH SLA SETTINGS
  // ====================================================

  const fetchSLASettings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        SLA_API_URL
      );

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.settings)
        ? data.settings
        : [];

      setSettings(list);
    } catch (err) {
      console.error(
        "Fetch SLA settings error:",
        err
      );

      setError(
        err.message ||
          "Unable to load SLA settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // FETCH DEPARTMENTS
  // ====================================================

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);

      const data = await apiRequest(
        DEPARTMENT_API_URL
      );

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.departments)
        ? data.departments
        : [];

      setDepartments(list);
    } catch (err) {
      console.error(
        "Fetch departments error:",
        err
      );

      setError(
        err.message ||
          "Unable to load departments."
      );
    } finally {
      setLoadingDepartments(false);
    }
  };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchSLASettings();
    fetchDepartments();
  }, []);

  // ====================================================
  // FILTER SETTINGS
  // ====================================================

  const filteredSettings = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    return settings.filter((item) => {
      const department = String(
        item.department || ""
      ).toLowerCase();

      const matchesSearch =
        !term ||
        department.includes(term);

      const matchesStatus =
        !statusFilter ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    settings,
    search,
    statusFilter,
  ]);

  // ====================================================
  // STATISTICS
  // ====================================================

  const totalSettings = settings.length;

  const activeSettings =
    settings.filter(
      (item) =>
        item.status === "Active"
    ).length;

  const autoEscalationCount =
    settings.filter(
      (item) =>
        item.autoEscalation === true
    ).length;

  const averageSLA = useMemo(() => {
    if (settings.length === 0) {
      return 0;
    }

    const total = settings.reduce(
      (sum, item) =>
        sum +
        Number(
          item.defaultSLAHours || 0
        ),
      0
    );

    return Math.round(
      total / settings.length
    );
  }, [settings]);

  // ====================================================
  // OPEN ADD MODAL
  // ====================================================

  const openAddModal = () => {
    setEditingSetting(null);

    setForm(getDefaultForm());

    setError("");

    setShowModal(true);
  };

  // ====================================================
  // OPEN EDIT MODAL
  // ====================================================

  const openEditModal = (setting) => {
    setEditingSetting(setting);

    setForm({
      department:
        setting.department || "",

      defaultSLAHours:
        setting.defaultSLAHours ?? 24,

      warningBeforeHours:
        setting.warningBeforeHours ?? 2,

      autoEscalation:
        setting.autoEscalation ?? true,

      escalationLevels:
        Array.isArray(
          setting.escalationLevels
        ) &&
        setting.escalationLevels.length > 0
          ? setting.escalationLevels.map(
              (level, index) => ({
                level:
                  level.level ??
                  index + 1,

                afterHours:
                  level.afterHours ?? 24,

                escalateTo:
                  level.escalateTo ||
                  "Department Head",

                notifyEmail:
                  level.notifyEmail ??
                  true,

                notifySystem:
                  level.notifySystem ??
                  true,
              })
            )
          : [],

      emailNotifications:
        setting.emailNotifications ??
        true,

      systemNotifications:
        setting.systemNotifications ??
        true,

      status:
        setting.status || "Active",
    });

    setError("");

    setShowModal(true);
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingSetting(null);

    setForm(getDefaultForm());
  };

  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ====================================================
  // NUMBER CHANGE
  // ====================================================

  const handleNumberChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        value === ""
          ? ""
          : Number(value),
    }));
  };

  // ====================================================
  // ADD ESCALATION LEVEL
  // ====================================================

  const addEscalationLevel = () => {
    setForm((previous) => {
      const levels =
        previous.escalationLevels;

      const nextLevel =
        levels.length + 1;

      return {
        ...previous,

        escalationLevels: [
          ...levels,

          {
            level: nextLevel,
            afterHours:
              Number(
                previous.defaultSLAHours ||
                  24
              ) * nextLevel,

            escalateTo:
              "Department Head",

            notifyEmail: true,

            notifySystem: true,
          },
        ],
      };
    });
  };

  // ====================================================
  // REMOVE ESCALATION LEVEL
  // ====================================================

  const removeEscalationLevel = (
    index
  ) => {
    setForm((previous) => {
      const updated =
        previous.escalationLevels
          .filter(
            (_, i) => i !== index
          )
          .map(
            (level, i) => ({
              ...level,
              level: i + 1,
            })
          );

      return {
        ...previous,
        escalationLevels:
          updated,
      };
    });
  };

  // ====================================================
  // UPDATE ESCALATION LEVEL
  // ====================================================

  const updateEscalationLevel = (
    index,
    field,
    value
  ) => {
    setForm((previous) => {
      const updated = [
        ...previous.escalationLevels,
      ];

      updated[index] = {
        ...updated[index],
        [field]:
          field === "afterHours"
            ? value === ""
              ? ""
              : Number(value)
            : value,
      };

      return {
        ...previous,
        escalationLevels:
          updated,
      };
    });
  };

  // ====================================================
  // SAVE SLA SETTINGS
  // ====================================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.department.trim()) {
      window.alert(
        "Please select a department."
      );
      return;
    }

    if (
      form.defaultSLAHours === "" ||
      Number(form.defaultSLAHours) <= 0
    ) {
      window.alert(
        "Default SLA hours must be greater than 0."
      );
      return;
    }

    if (
      form.warningBeforeHours === "" ||
      Number(form.warningBeforeHours) < 0
    ) {
      window.alert(
        "Warning hours cannot be negative."
      );
      return;
    }

    // Validate escalation levels
    for (
      const level of form.escalationLevels
    ) {
      if (
        level.afterHours === "" ||
        Number(level.afterHours) < 0
      ) {
        window.alert(
          `Please enter valid hours for escalation level ${level.level}.`
        );
        return;
      }

      if (!level.escalateTo) {
        window.alert(
          `Please select who should receive escalation level ${level.level}.`
        );
        return;
      }
    }

    const payload = {
      department:
        form.department.trim(),

      defaultSLAHours:
        Number(
          form.defaultSLAHours
        ),

      warningBeforeHours:
        Number(
          form.warningBeforeHours
        ),

      autoEscalation:
        Boolean(
          form.autoEscalation
        ),

      escalationLevels:
        form.escalationLevels.map(
          (level, index) => ({
            level:
              index + 1,

            afterHours:
              Number(
                level.afterHours
              ),

            escalateTo:
              level.escalateTo,

            notifyEmail:
              Boolean(
                level.notifyEmail
              ),

            notifySystem:
              Boolean(
                level.notifySystem
              ),
          })
        ),

      emailNotifications:
        Boolean(
          form.emailNotifications
        ),

      systemNotifications:
        Boolean(
          form.systemNotifications
        ),

      status:
        form.status,
    };

    try {
      setSaving(true);
      setError("");

      // ----------------------------------------------
      // UPDATE
      // ----------------------------------------------

      if (editingSetting) {
        const data =
          await apiRequest(
            `${SLA_API_URL}/${editingSetting._id}`,
            {
              method: "PUT",
              body: JSON.stringify(
                payload
              ),
            }
          );

        const updated =
          data.settings;

        setSettings(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                editingSetting._id
                  ? updated
                  : item
            )
        );
      }

      // ----------------------------------------------
      // CREATE
      // ----------------------------------------------

      else {
        const data =
          await apiRequest(
            SLA_API_URL,
            {
              method: "POST",
              body: JSON.stringify(
                payload
              ),
            }
          );

        const created =
          data.settings;

        setSettings(
          (previous) => [
            ...previous,
            created,
          ]
        );
      }

      closeModal();
    } catch (err) {
      console.error(
        "Save SLA settings error:",
        err
      );

      window.alert(
        err.message ||
          "Unable to save SLA settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // DELETE SLA
  // ====================================================

  const handleDelete = async (
    setting
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete SLA settings for "${setting.department}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        setting._id
      );

      setError("");

      await apiRequest(
        `${SLA_API_URL}/${setting._id}`,
        {
          method: "DELETE",
        }
      );

      setSettings(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
              setting._id
          )
      );
    } catch (err) {
      console.error(
        "Delete SLA error:",
        err
      );

      window.alert(
        err.message ||
          "Unable to delete SLA settings."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ====================================================
  // RESET FILTER
  // ====================================================

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  // ====================================================
  // BODY SCROLL LOCK
  // ====================================================

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [showModal]);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-slate-200 bg-white px-5 py-4 md:px-7">

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
              placeholder="Search..."
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

              <span className="hidden text-sm font-semibold text-slate-800 sm:block">
                Admin
              </span>

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

        {/* TITLE */}

        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              SLA & Escalation Settings
            </h1>

            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Configure complaint resolution time, warning periods and automatic escalation rules.
            </p>

          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <span className="text-xl">
              +
            </span>

            Add SLA Setting
          </button>

        </div>

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total SLA Settings"
            value={totalSettings}
            subtitle="Departments configured"
            icon="⚙️"
            bg="bg-blue-100"
            text="text-blue-600"
          />

          <StatCard
            title="Active"
            value={activeSettings}
            subtitle="Active configurations"
            icon="✓"
            bg="bg-emerald-100"
            text="text-emerald-600"
          />

          <StatCard
            title="Auto Escalation"
            value={autoEscalationCount}
            subtitle="Configurations enabled"
            icon="⚡"
            bg="bg-orange-100"
            text="text-orange-600"
          />

          <StatCard
            title="Average SLA"
            value={`${averageSLA}h`}
            subtitle="Average resolution time"
            icon="⏱️"
            bg="bg-purple-100"
            text="text-purple-600"
          />

        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                fetchSLASettings();
                fetchDepartments();
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>

          </div>
        )}

        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <div className="mt-7 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px_auto]">

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search department..."
                className="h-11 w-full rounded-lg border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
            >

              <option value="">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="h-11 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>

          </div>

        </div>

        {/* ==================================================
            LIST HEADING
        ================================================== */}

        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Department SLA Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage SLA and escalation policies for each department.
            </p>

          </div>

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredSettings.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {settings.length}
            </span>
          </p>

        </div>

        {/* ==================================================
            SLA CARDS
        ================================================== */}

        {loading ? (

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-12 text-center">

            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading SLA settings...
            </p>

          </div>

        ) : filteredSettings.length === 0 ? (

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-12 text-center">

            <div className="text-4xl">
              ⚙️
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No SLA settings found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add an SLA configuration for a department.
            </p>

          </div>

        ) : (

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">

            {filteredSettings.map(
              (setting) => (

                <SLACard
                  key={setting._id}
                  setting={setting}
                  onEdit={
                    openEditModal
                  }
                  onDelete={
                    handleDelete
                  }
                  deleting={
                    deletingId ===
                    setting._id
                  }
                />

              )
            )}

          </div>

        )}

      </main>

      {/* ==================================================
          ADD / EDIT MODAL
      ================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center">

          <div className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  {editingSetting
                    ? "Edit SLA Settings"
                    : "Add SLA Settings"}

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  {editingSetting
                    ? "Update SLA and escalation configuration."
                    : "Configure SLA rules for a department."}

                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSave}
              className="min-h-0 overflow-y-auto p-6"
            >

              {/* BASIC SETTINGS */}

              <div>

                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  Basic SLA Settings
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* Department */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Department
                    </label>

                    <select
                      name="department"
                      value={
                        form.department
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        loadingDepartments
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    >

                      <option value="">
                        {loadingDepartments
                          ? "Loading departments..."
                          : "Select department"}
                      </option>

                      {departments.map(
                        (department) => (
                          <option
                            key={
                              department._id
                            }
                            value={
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

                  {/* Status */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Status
                    </label>

                    <select
                      name="status"
                      value={
                        form.status
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >

                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                    </select>

                  </div>

                  {/* Default SLA */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Default SLA Hours
                    </label>

                    <div className="relative">

                      <input
                        type="number"
                        name="defaultSLAHours"
                        value={
                          form.defaultSLAHours
                        }
                        onChange={
                          handleNumberChange
                        }
                        min="1"
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                        hrs
                      </span>

                    </div>

                  </div>

                  {/* Warning */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Warning Before
                    </label>

                    <div className="relative">

                      <input
                        type="number"
                        name="warningBeforeHours"
                        value={
                          form.warningBeforeHours
                        }
                        onChange={
                          handleNumberChange
                        }
                        min="0"
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                        hrs
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* NOTIFICATIONS */}

              <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-5">

                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  Notification Settings
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white p-4">

                    <div>

                      <p className="text-sm font-semibold text-slate-800">
                        Email Notifications
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Send SLA notifications by email.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={
                        form.emailNotifications
                      }
                      onChange={
                        handleChange
                      }
                      className="h-5 w-5 accent-blue-600"
                    />

                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white p-4">

                    <div>

                      <p className="text-sm font-semibold text-slate-800">
                        System Notifications
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Show notifications in the admin system.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      name="systemNotifications"
                      checked={
                        form.systemNotifications
                      }
                      onChange={
                        handleChange
                      }
                      className="h-5 w-5 accent-blue-600"
                    />

                  </label>

                </div>

              </div>

              {/* AUTO ESCALATION */}

              <div className="mt-7 rounded-xl border border-slate-200 p-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-sm font-bold text-slate-800">
                      Automatic Escalation
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Automatically escalate unresolved complaints after the configured time.
                    </p>

                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">

                    <input
                      type="checkbox"
                      name="autoEscalation"
                      checked={
                        form.autoEscalation
                      }
                      onChange={
                        handleChange
                      }
                      className="peer sr-only"
                    />

                    <div className="h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />

                  </label>

                </div>

                {/* ESCALATION LEVELS */}

                {form.autoEscalation && (

                  <div className="mt-5">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          Escalation Levels
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Define who should receive unresolved complaints.
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={
                          addEscalationLevel
                        }
                        className="w-fit rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        + Add Level
                      </button>

                    </div>

                    {form.escalationLevels.length ===
                    0 ? (

                      <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-5 text-center">

                        <p className="text-sm text-slate-500">
                          No escalation levels configured.
                        </p>

                        <button
                          type="button"
                          onClick={
                            addEscalationLevel
                          }
                          className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
                        >
                          Add first escalation level
                        </button>

                      </div>

                    ) : (

                      <div className="mt-4 space-y-4">

                        {form.escalationLevels.map(
                          (
                            level,
                            index
                          ) => (

                            <div
                              key={
                                index
                              }
                              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >

                              <div className="flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                                    {
                                      index +
                                      1
                                    }
                                  </div>

                                  <p className="text-sm font-bold text-slate-800">
                                    Escalation Level{" "}
                                    {
                                      index +
                                      1
                                    }
                                  </p>

                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeEscalationLevel(
                                      index
                                    )
                                  }
                                  className="text-sm font-semibold text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>

                              </div>

                              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                                {/* AFTER HOURS */}

                                <div>

                                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                                    Escalate After
                                  </label>

                                  <div className="relative">

                                    <input
                                      type="number"
                                      min="0"
                                      value={
                                        level.afterHours
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateEscalationLevel(
                                          index,
                                          "afterHours",
                                          e.target
                                            .value
                                        )
                                      }
                                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                      hrs
                                    </span>

                                  </div>

                                </div>

                                {/* ESCALATE TO */}

                                <div>

                                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                                    Escalate To
                                  </label>

                                  <select
                                    value={
                                      level.escalateTo
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateEscalationLevel(
                                        index,
                                        "escalateTo",
                                        e.target
                                          .value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                  >

                                    <option value="Department Head">
                                      Department Head
                                    </option>

                                    <option value="Senior Staff">
                                      Senior Staff
                                    </option>

                                    <option value="Admin">
                                      Admin
                                    </option>

                                  </select>

                                </div>

                              </div>

                              {/* LEVEL NOTIFICATIONS */}

                              <div className="mt-4 flex flex-wrap gap-5">

                                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">

                                  <input
                                    type="checkbox"
                                    checked={
                                      level.notifyEmail
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateEscalationLevel(
                                        index,
                                        "notifyEmail",
                                        e.target
                                          .checked
                                      )
                                    }
                                    className="h-4 w-4 accent-blue-600"
                                  />

                                  Email notification

                                </label>

                                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">

                                  <input
                                    type="checkbox"
                                    checked={
                                      level.notifySystem
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateEscalationLevel(
                                        index,
                                        "notifySystem",
                                        e.target
                                          .checked
                                      )
                                    }
                                    className="h-4 w-4 accent-blue-600"
                                  />

                                  System notification

                                </label>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                )}

              </div>

              {/* FOOTER BUTTONS */}

              <div className="mt-7 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving
                    ? "Saving..."
                    : editingSetting
                    ? "Save Changes"
                    : "Create SLA"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  bg,
  text,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${bg} ${text}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

// ======================================================
// SLA CARD
// ======================================================

const SLACard = ({
  setting,
  onEdit,
  onDelete,
  deleting,
}) => {
  const {
    department,
    defaultSLAHours,
    warningBeforeHours,
    autoEscalation,
    escalationLevels,
    emailNotifications,
    systemNotifications,
    status,
  } = setting;

  const isActive =
    status === "Active";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* CARD HEADER */}

      <div className="border-b border-slate-100 p-5">

        <div className="flex items-start justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
              ⚙️
            </div>

            <div>

              <h3 className="text-base font-bold text-slate-900">
                {department}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                SLA Configuration
              </p>

            </div>

          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {status}
          </span>

        </div>

      </div>

      {/* SLA INFO */}

      <div className="grid grid-cols-2 gap-3 p-5">

        <InfoBox
          label="Default SLA"
          value={`${defaultSLAHours} hrs`}
          icon="⏱️"
        />

        <InfoBox
          label="Warning Before"
          value={`${warningBeforeHours} hrs`}
          icon="⚠️"
        />

        <InfoBox
          label="Auto Escalation"
          value={
            autoEscalation
              ? "Enabled"
              : "Disabled"
          }
          icon="⚡"
        />

        <InfoBox
          label="Escalation Levels"
          value={
            escalationLevels?.length ||
            0
          }
          icon="📈"
        />

      </div>

      {/* NOTIFICATIONS */}

      <div className="mx-5 rounded-lg bg-slate-50 p-4">

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Notifications
        </p>

        <div className="mt-3 flex flex-wrap gap-2">

          {emailNotifications && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              ✉ Email
            </span>
          )}

          {systemNotifications && (
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">
              🔔 System
            </span>
          )}

          {!emailNotifications &&
            !systemNotifications && (
              <span className="text-xs text-slate-400">
                No notifications enabled
              </span>
            )}

        </div>

      </div>

      {/* ESCALATION */}

      {autoEscalation &&
        escalationLevels?.length >
          0 && (

          <div className="p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Escalation Flow
            </p>

            <div className="mt-3 space-y-2">

              {escalationLevels.map(
                (level) => (

                  <div
                    key={
                      level.level
                    }
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                  >

                    <div className="flex items-center gap-2">

                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                        {
                          level.level
                        }
                      </span>

                      <div>

                        <p className="text-xs font-semibold text-slate-700">
                          {
                            level.escalateTo
                          }
                        </p>

                        <p className="text-[11px] text-slate-400">
                          After{" "}
                          {
                            level.afterHours
                          }{" "}
                          hours
                        </p>

                      </div>

                    </div>

                    <div className="flex gap-1">

                      {level.notifyEmail && (
                        <span className="text-xs">
                          ✉
                        </span>
                      )}

                      {level.notifySystem && (
                        <span className="text-xs">
                          🔔
                        </span>
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          </div>
        )}

      {/* ACTIONS */}

      <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">

        <button
          type="button"
          onClick={() =>
            onEdit(setting)
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          ✎ Edit
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(setting)
          }
          disabled={deleting}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          🗑{" "}
          {deleting
            ? "Deleting..."
            : "Delete"}
        </button>

      </div>

    </div>
  );
};

// ======================================================
// INFO BOX
// ======================================================

const InfoBox = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">

      <div className="flex items-center gap-2">

        <span className="text-sm">
          {icon}
        </span>

        <p className="text-xs text-slate-500">
          {label}
        </p>

      </div>

      <p className="mt-2 text-sm font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
};

export default SLASettings;