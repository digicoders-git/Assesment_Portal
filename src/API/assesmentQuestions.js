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
export const getAssessmentQuestionsApi = async (assesmentQuestionId) => {
  const res = await api.get(
    `/admin/assesment/get-question/${assesmentQuestionId}`
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
