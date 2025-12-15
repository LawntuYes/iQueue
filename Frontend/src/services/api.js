const BASE_URL = "http://localhost:3000/api";

const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Important: sends cookies with requests
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || "Something went wrong",
      data: data,
    };
  }

  return data;
};

export default request;
