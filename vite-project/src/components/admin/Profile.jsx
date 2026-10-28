
import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  VenusAndMars,
  ShieldCheck,
  Building2,
  LockKeyhole,
  Clock3,
  CalendarDays,
  Pencil,
  Camera,
  KeyRound,
  ChevronRight,
  X,
  Save,
  CheckCircle2,
  Activity,
} from "lucide-react";

const initialProfile = {
  name: "Admin",
  email: "admin@municipal.gov.in",
  phone: "",
  gender: "",
  role: "Administrator",
  department: "General Administration",
  status: "Active",
  permissions: "Full Access",
  lastLogin: "Not available",
  accountCreated: "Not available",
};

const personalFields = [
  {
    label: "Full Name",
    key: "name",
    icon: UserRound,
  },
  {
    label: "Email Address",
    key: "email",
    icon: Mail,
  },
  {
    label: "Phone Number",
    key: "phone",
    icon: Phone,
  },
  {
    label: "Gender",
    key: "gender",
    icon: VenusAndMars,
  },
];

function InfoCard({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={22} />
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  last = false,
  children,
}) {
  return (
    <div
      className={`flex min-w-0 items-start gap-3 py-4 ${
        last ? "" : "border-b border-slate-100"
      }`}
    >
      <Icon
        size={19}
        className="mt-0.5 shrink-0 text-slate-500"
      />

      <div className="grid min-w-0 flex-1 grid-cols-1 gap-1 sm:grid-cols-[minmax(100px,0.8fr)_minmax(0,1.2fr)] sm:items-center sm:gap-3">
        <span className="text-sm text-slate-500">
          {label}
        </span>

        <div className="min-w-0 break-words text-sm font-medium text-slate-800">
          {children || value || "Not provided"}
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </label>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const updateField = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveProfile = (e) => {
    e.preventDefault();

    // UI only: connect your profile update API here.
    setEditOpen(false);
    setMessage("Profile changes updated in this session.");
  };

  const changePassword = (e) => {
    e.preventDefault();

    if (passwords.next.length < 8) {
      setMessage("New password must contain at least 8 characters.");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    // UI only: submit to your authenticated password-change API.
    setPasswordOpen(false);
    setPasswords({
      current: "",
      next: "",
      confirm: "",
    });
    setMessage(
      "Password form validated. Connect your password-change API to save it."
    );
  };

  const closeEdit = () => setEditOpen(false);
  const closePassword = () => setPasswordOpen(false);

  return (
    <div className="min-h-full bg-slate-50/80 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-400">
            Admin Panel
          </p>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Profile
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your personal details and account security.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Account {profile.status}
            </span>
          </div>
        </div>

        {/* Success / information message */}
        {message && (
          <div
            role="status"
            className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"
          >
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
              className="shrink-0 rounded p-0.5 hover:bg-blue-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Profile banner */}
        <section className="relative mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-100/80 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border-[35px] border-blue-100/50" />
          <div className="pointer-events-none absolute -bottom-32 right-1/3 h-56 w-80 rounded-full bg-blue-100/40 blur-2xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-5">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-blue-700 text-3xl font-bold text-white shadow-md sm:h-32 sm:w-32 sm:text-4xl">
                {profile.name.trim().charAt(0).toUpperCase() || "A"}

                <span
                  title="Profile avatar"
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white"
                >
                  <Camera size={17} />
                </span>
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-2xl font-bold text-slate-900 sm:text-3xl">
                  {profile.name}
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-600">
                  {profile.role}
                </p>

                <p className="mt-3 flex min-w-0 items-center gap-2 break-all text-sm text-slate-600">
                  <Mail size={16} className="shrink-0 text-blue-600" />
                  {profile.email}
                </p>

                <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-600"
                  />
                  Municipal Administration
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setMessage("");
                setEditOpen(true);
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </section>

        {/* Details grid */}
        <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
          {/* Personal information */}
          <InfoCard
            icon={UserRound}
            title="Personal Information"
            subtitle="Your basic personal details"
          >
            <div>
              {personalFields.map(({ label, key, icon: Icon }, index) => (
                <DetailRow
                  key={key}
                  icon={Icon}
                  label={label}
                  value={profile[key]}
                  last={index === personalFields.length - 1}
                />
              ))}
            </div>
          </InfoCard>

          {/* Account information */}
          <InfoCard
            icon={ShieldCheck}
            title="Account Information"
            subtitle="Your role and access details"
          >
            <DetailRow
              icon={UserRound}
              label="Role"
              value={profile.role}
            />

            <DetailRow
              icon={Building2}
              label="Department"
              value={profile.department}
            />

            <DetailRow
              icon={Activity}
              label="Account Status"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {profile.status}
              </span>
            </DetailRow>

            <DetailRow
              icon={ShieldCheck}
              label="Permissions"
              value={profile.permissions}
              last
            />
          </InfoCard>

          {/* Security */}
          <InfoCard
            icon={LockKeyhole}
            title="Security"
            subtitle="Keep your account secure"
          >
            <div className="rounded-xl border border-blue-50 bg-blue-50/60 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white p-2.5 text-blue-600 shadow-sm">
                    <KeyRound size={20} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Change Password
                    </h3>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                      Update your password regularly to help protect your account.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMessage("");
                    setPasswordOpen(true);
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Change Password
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-100 p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-emerald-600"
              />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Account protection
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Never share your password. Always sign out when using a shared device.
                </p>
              </div>
            </div>
          </InfoCard>

          {/* Activity */}
          <InfoCard
            icon={Clock3}
            title="Activity & Login Information"
            subtitle="Your account activity and access details"
          >
            <DetailRow
              icon={CalendarDays}
              label="Last Login"
              value={profile.lastLogin}
            />

            <DetailRow
              icon={CalendarDays}
              label="Account Created"
              value={profile.accountCreated}
              last
            />

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <Clock3
                  size={19}
                  className="mt-0.5 shrink-0 text-blue-600"
                />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Recent activity
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Login history and account activity will appear here when connected to your backend.
                  </p>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Edit profile modal */}
        {editOpen && (
          <Modal title="Edit Profile" onClose={closeEdit}>
            <form onSubmit={saveProfile} className="space-y-4">
              <FormField
                label="Full Name"
                value={profile.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter full name"
                required
              />

              <FormField
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="Enter email address"
                required
              />

              <FormField
                label="Phone Number"
                type="tel"
                value={profile.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Enter phone number"
              />

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Gender
                </span>
                <select
                  value={profile.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">Prefer not to specify</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Change password modal */}
        {passwordOpen && (
          <Modal title="Change Password" onClose={closePassword}>
            <form onSubmit={changePassword} className="space-y-4">
              <FormField
                label="Current Password"
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    current: e.target.value,
                  }))
                }
                placeholder="Enter current password"
                required
              />

              <FormField
                label="New Password"
                type="password"
                value={passwords.next}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    next: e.target.value,
                  }))
                }
                placeholder="At least 8 characters"
                required
              />

              <FormField
                label="Confirm New Password"
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    confirm: e.target.value,
                  }))
                }
                placeholder="Re-enter new password"
                required
              />

              <p className="text-xs leading-5 text-slate-500">
                Password changes must be verified and saved by your backend.
                This form does not change the actual account password yet.
              </p>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closePassword}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <LockKeyhole size={16} />
                  Update Password
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
