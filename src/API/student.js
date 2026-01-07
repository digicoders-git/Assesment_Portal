import api from "./axios";

// Student Register
export const studentRegisterApi = async (payload) => {
  const res = await api.post("/registration/create", payload);
  return res.data;
};

// Update Student
export const updateStudentApi = async (id, payload) => {
  const res = await api.put(`/registration/admin/update/${id}`, payload);
  return res.data;
};

// Check Existing Student (by mobile)
export const existStudentApi = async (payload) => {
  const res = await api.post("/registration/exist", payload);
  return res.data;
};

// Get All Students
export const getAllStudentApi = async () => {
  const res = await api.get("/registration/admin/getAll");
  return res.data;
};

// Get Students by Assessment Code
export const getStudentByAssessmentApi = async (assesmentCode) => {
  const res = await api.get(`/registration/admin/getByAssesment/${assesmentCode}`);
  return res.data;
};


// Academic data

export const getAcademicDataApi = async () => {
  const { data } = await api.get("/registration/admin/getAcademicData");
  return data;
};

