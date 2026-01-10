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

// update student certificaet 
export const uploadStudentCertificateApi = async (id, file) => {
  const formData = new FormData();
  formData.append("certificate", file);

  const res = await api.put(
    `/registration/admin/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

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

// getSingle
export const getSingleStudentApi = async (id) => {
  const res = await api.get(`/registration/admin/getSingle/${id}`);
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


// download excel studend by assesment

export const downloadStudentsByAssessmentApi = async (assesmentCode) => {
  const res = await api.get(
    `registration/admin/student-excel-byassesment/${assesmentCode}`,
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([res.data], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `students-${assesmentCode}.xlsx`);
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};

