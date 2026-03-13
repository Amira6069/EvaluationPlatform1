import API from "./api";

// Get all principles
export const getAllPrinciples = () => {
  return API.get("/principles");
};

// Get principle by ID
export const getPrincipleById = (id) => {
  return API.get(`/principles/${id}`);
};