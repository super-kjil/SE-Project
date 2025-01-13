export const setAcccessToken = (value) => {
  localStorage.setItem("access_token", value);
};
export const getAcccessToken = () => {
  return localStorage.getItem("access_token");
};

export const setAcccessTokenCustomer = (value) => {
  localStorage.setItem("access_token_customer", value);
};
export const getAcccessTokenCustomer = () => {
  return localStorage.getItem("access_token_customer");
};

export const setProfile = (value) => {
  localStorage.setItem("profile", value);
};
export const getProfile = () => {
  // convert string json to object
  try {
    var profile = localStorage.getItem("profile");
    if (profile !== "" && profile !== null && profile !== undefined) {
      return JSON.parse(profile);
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const setPermission = (value) => {
  localStorage.setItem("permission", value);
};
export const getPermission = () => {
  // convert string json to object
  try {
    var permission = localStorage.getItem("permission");
    if (permission !== "" && permission !== null && permission !== undefined) {
      return JSON.parse(permission);
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const setCustomerProfile = (value) => {
  localStorage.setItem("customerProfile", value);
};

export const getCustomerProfile = () => {
  // convert string json to object
  try {
    var customerProfile = localStorage.getItem("customerProfile");
    if (
      customerProfile !== "" &&
      customerProfile !== null &&
      customerProfile !== undefined
    ) {
      return JSON.parse(customerProfile);
    }
    return null;
  } catch (err) {
    return null;
  }
};
