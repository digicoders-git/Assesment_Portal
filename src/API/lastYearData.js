import api  from "./axios";


export const importLastYearExcelApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    "/admin/last-year-data-add", // backend POST route
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const getLastYearData = async () => {
  const res = await api.get("/admin/last-year-data-get");
  return res.data;
};