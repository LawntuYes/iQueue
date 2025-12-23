import request from "./api";

export const createAppointment = async (date, time) => {
  return request("/appointments", {
    method: "POST",
    body: JSON.stringify({ date, time }),
  });
};

export const getMyAppointments = async () => {
  return request("/appointments/my-appointments");
};
