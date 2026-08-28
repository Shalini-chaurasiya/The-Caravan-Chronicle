import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();

  const roles = [
    {
      id: "citizen",
      title: "Citizen",
      description: "I want to submit or track a complaint.",
    },
    {
      id: "staff",
      title: "Staff",
      description: "I want to manage and resolve complaints.",
    },
    {
      id: "owner",
      title: "Owner",
      description: "I want to manage the complete system.",
    },
  ];

  const handleLogin = () => {
    if (!selectedRole) {
      alert("Please select your role first.");
      return;
    }

    navigate(`/${selectedRole}/login`);
  };

  const handleRegister = () => {
    if (!selectedRole) {
      alert("Please select your role first.");
      return;
    }

    navigate(`/${selectedRole}/register`);
  };

  return (
    <div className="w-full max-w-md mx-auto">

      {/* Heading */}
      <div className="text-center mb-5">

        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
          Select Your Role
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Choose your role to continue
        </p>

      </div>

      {/* Role Options */}
      <div className="space-y-3">

        {roles.map((role) => {
          const isSelected = selectedRole === role.id;

          return (
            <label
              key={role.id}
              className={`
                flex items-center gap-4
                p-4
                border rounded-lg
                cursor-pointer
                transition-all duration-200
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }
              `}
            >

              {/* Radio Button */}
              <input
                type="radio"
                name="role"
                value={role.id}
                checked={isSelected}
                onChange={() => setSelectedRole(role.id)}
                className="w-4 h-4 accent-blue-600 shrink-0"
              />

              {/* Role Text */}
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {role.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {role.description}
                </p>
              </div>

            </label>
          );
        })}

      </div>

      {/* Login and Register Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-5">

        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-lg font-semibold transition"
        >
          Login
        </button>

        <button
          onClick={handleRegister}
          className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm py-2.5 rounded-lg font-semibold transition"
        >
          Register
        </button>

      </div>

      {/* Bottom Message */}
      <p className="text-xs text-slate-500 mt-4 text-center">
        Please select your role to proceed to login or registration.
      </p>

    </div>
  );
};

export default RoleSelection;