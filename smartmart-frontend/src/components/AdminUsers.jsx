import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Search,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/api/users"
      );

      console.log("Users from backend:", response.data);

      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);

      setError(
        "Unable to load users. Make sure the Spring Boot backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText)
    );
  });

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700";

      case "SELLER":
        return "bg-purple-100 text-purple-700";

      case "CUSTOMER":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Users Management
          </h2>

          <p className="text-gray-500 mt-1">
            View and manage all registered SmartMart users
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh Users
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {users.length}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Customers
              </p>

              <h3 className="text-2xl font-bold text-blue-600 mt-1">
                {
                  users.filter(
                    (user) => user.role === "CUSTOMER"
                  ).length
                }
              </h3>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <UserCheck size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Sellers
              </p>

              <h3 className="text-2xl font-bold text-purple-600 mt-1">
                {
                  users.filter(
                    (user) => user.role === "SELLER"
                  ).length
                }
              </h3>
            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Admins
              </p>

              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {
                  users.filter(
                    (user) => user.role === "ADMIN"
                  ).length
                }
              </h3>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <UserX size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email or role..."
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 text-lg">
            All Users
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Users loaded directly from your MySQL database
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw
              className="mx-auto animate-spin text-blue-600"
              size={30}
            />

            <p className="text-gray-500 mt-3">
              Loading users...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users
              className="mx-auto text-gray-300"
              size={50}
            />

            <h3 className="font-semibold text-gray-900 mt-4">
              No users found
            </h3>

            <p className="text-gray-500 mt-1">
              Try changing your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    User
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Role
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Registered
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* USER */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                          {getInitials(user.name)}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            ID #{user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-5 py-4 text-gray-600">
                      {user.email}
                    </td>

                    {/* ROLE */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-5 py-4 text-gray-500">
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;