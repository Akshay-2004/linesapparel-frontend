import { useApi } from "@/hooks/useApi";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: "client" | "admin" | "super_admin";
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: IUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserStats {
  total: number;
  clients: number;
  admins: number;
  superAdmins: number;
  recentSignups: number;
  breakdown: {
    clientPercentage: string;
    adminPercentage: string;
    superAdminPercentage: string;
  };
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface ChangeRoleData {
  role: "client" | "admin" | "super_admin";
}

export function useUserService() {
  const { fetchData, loading, error } = useApi<any>();
  const baseUrl = "/users";

  const getAllUsers = async (params?: {
    role?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UsersResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.role && params.role !== "all") {
      queryParams.append("role", params.role);
    }
    if (params?.page && params.page > 0) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit && params.limit > 0) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.search && params.search.trim()) {
      queryParams.append("search", params.search.trim());
    }

    const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;

    const response = await fetchData(url, {
      method: "GET",
      timeout: 30000,
    });

    return response;
  };

  const getUserById = async (id: string): Promise<IUser> => {
    return await fetchData(`${baseUrl}/${id}`, {
      method: "GET",
      timeout: 30000,
    });
  };

  const getUserStats = async (): Promise<UserStats> => {
    return await fetchData(`${baseUrl}/stats/overview`, {
      method: "GET",
      timeout: 30000,
    });
  };

  const updateUserProfile = async (
    id: string,
    data: UpdateUserData
  ): Promise<IUser> => {
    return await fetchData(`${baseUrl}/${id}`, {
      method: "PUT",
      data,
      timeout: 30000,
    });
  };

  const changeUserRole = async (
    id: string,
    data: ChangeRoleData
  ): Promise<IUser> => {
    return await fetchData(`${baseUrl}/${id}/role`, {
      method: "PATCH",
      data,
      timeout: 30000,
    });
  };

  const deleteUser = async (id: string): Promise<void> => {
    return await fetchData(`${baseUrl}/${id}`, {
      method: "DELETE",
      timeout: 30000,
    });
  };

  return {
    getAllUsers,
    getUserById,
    getUserStats,
    updateUserProfile,
    changeUserRole,
    deleteUser,
    loading,
    error,
  };
}
