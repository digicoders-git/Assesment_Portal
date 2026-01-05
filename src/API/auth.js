import api from "./axios";

export const adminLogin = async ({ userName, password }) => {
  const { data } = await api.post("/admin/login", {
    userName,
    password,
  });

  return data; 
};
