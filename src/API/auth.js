import api from "./axios";

export const adminLogin = async ({ userName, password }) => {
  const { data } = await api.post("/admin/login", {
    userName,
    password,
  });

  return data;
};

// logout

export const adminLogout = async () => {
  const { data } = await api.post("/admin/logout");
  return data;
};


// dashboard-data 

export const getDashboardDataApi = async () => {
  const { data } = await api.get("/admin/dashboard-data");
  return data;
};


