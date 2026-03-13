import API from "./api";
import { STORAGE_KEYS } from "../utils/constants";

export const getMyOrganization = () => {
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
  return API.get(`/organizations/${user.userId}`);
};

export const updateOrganization = (id, data) => {
  return API.put(`/organizations/${id}`, data);
};

export const getAllOrganizations = () => {
  return API.get("/organizations");
};

export const activateOrganization = (id) => {
  return API.patch(`/organizations/${id}/activate`);
};

export const deactivateOrganization = (id) => {
  return API.patch(`/organizations/${id}/deactivate`);
};