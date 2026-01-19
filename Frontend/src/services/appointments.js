import request from "./api";

export const createAppointment = async (dateOrObj, time) => {
  let body;
  if (typeof dateOrObj === "object") {
    body = dateOrObj;
  } else {
    body = { date: dateOrObj, time };
  }

  return request("/appointments", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const getMyAppointments = async () => {
  return request("/appointments/my-appointments");
};

export const deleteAppointment = async (id) => {
  return request(`/appointments/${id}`, {
    method: "DELETE",
  });
};
