import request from "./api";

export const createBusiness = async (data) => {
  return request("/business", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getMyBusiness = async () => {
  return request("/business/mybusiness");
};

export const getBusinessAppointments = async () => {
  return request("/business/appointments");
};
