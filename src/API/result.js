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



// download excel file 

export const downloadAssessmentResultsApi = async (assessmentId) => {
  const res = await api.get(
    `/admin/result-excel/${assessmentId}`,
    {
      responseType: "blob" // IMPORTANT
    }
  );

  const blob = new Blob(
    [res.data],
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  );

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "assessment-results.xlsx";
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
};

