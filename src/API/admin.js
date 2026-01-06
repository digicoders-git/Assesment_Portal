import api from "./axios";

export const updateAdminApi = async (adminId, payload) => {
  try {
    const formData = new FormData();

    // text fields
    if (payload.userName) formData.append("userName", payload.userName);
    if (payload.currentPassword) formData.append("currentPassword", payload.currentPassword);
    if (payload.newPassword) formData.append("newPassword", payload.newPassword);
    if (payload.confirmPassword) formData.append("confirmPassword", payload.confirmPassword);

    // image file
    if (payload.image) {
      formData.append("image", payload.image);
    }

    const response = await api.put(
      `/admin/update/${adminId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    );

    return response.data;

  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const getAdminApi = async () => {
  try {
    const response = await api.get("/admin/get");
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to fetch admin data"
    };
  }
};
