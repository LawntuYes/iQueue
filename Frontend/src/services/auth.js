import request from "./api";

export const login = async (email, password) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (name, email, password, userType) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, userType }),
  });
};

export const logout = async () => {
  return request("/auth/logout", {
    method: "POST",
  });
};
