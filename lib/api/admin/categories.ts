import { fetchClient } from "@/lib/api/fetch-client";
import type { CategoryListParams, CategoryListResponse } from "@/types/admin";

const ADMIN_API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || "";

export const categoriesApi = {
  async list(params?: CategoryListParams): Promise<CategoryListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${ADMIN_API_BASE}/api/admin/categories${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await fetchClient<CategoryListResponse>(url, {
      method: "GET",
      requiresAuth: true,
    });

    return response;
  },
};
