import api from "./axios";

// Assign questions to assessment
export const addQuestionsToAssessmentApi = async (assessmentId, payload) => {
  const res = await api.post(
    `/admin/assesment/assign-questions/${assessmentId}`,
    payload
  );
  return res.data;
};

// Get assessment questions by assesmentQuestionId
export const getAssessmentQuestionsApi = async (assesmentCode) => {
  const res = await api.get(
    `/admin/assesment/get-question/${assesmentCode}`
  );
  return res.data;
};

// Get assessment questions by assessment code (for student login)
export const getAssessmentByCodeApi = async (code) => {
  const res = await api.get(
    `/admin/assesment/get-question/${code}`
  );

  return res.data;
};


// Delete single question from assessment
export const deleteQuestionFromAssessmentApi = async (
  assesmentQuestionId,
  questionId
) => {
  const res = await api.put(
    `/admin/assesment/delete-questions/${assesmentQuestionId}/${questionId}`
  );
  return res.data;
};
