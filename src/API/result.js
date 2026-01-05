import api from "./axios";

// Create Result
export const createResultApi = async (payload) => {
  const res = await api.post("/admin/result", payload);
  return res.data;
};

// Get Results by Assessment ID
export const getResultsByAssessmentIdApi = async (assessmentId) => {
  const res = await api.get(`/admin/result/${assessmentId}`);
  return res.data;
};

// Get Results by Student ID
export const getResultsByStudentApi = async (studentId) => {
  const res = await api.get(`/admin/result-single/${studentId}`);
  return res.data;
};
