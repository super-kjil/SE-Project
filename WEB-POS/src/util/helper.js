import axios from "axios";
import { Config } from "./config";
import { setServerSatus } from "../store/server.store";
import { getAcccessToken } from "../store/profile.store";
import dayjs from "dayjs";

export const request = (url = "", method = "get", data = {}) => {
  var access_token = getAcccessToken();
  // in react
  var headers = { "Content-Type": "application/json" };
  if (data instanceof FormData) {
    // check if param data is FormData
    headers = { "Content-Type": "multipart/form-data" };
  }
  //param query filter
  var param_query = "?";
  if (method == "get" && data instanceof Object) {
    Object.keys(data).map((key, index) => {
      if (data[key] != "" && data[key] != null) {
        param_query += "&" + key + "=" + data[key];
        // (index == 0 ? "?" : "&")
      }
      //?:txt_search=P001&brand=Apple&category=A
      //product?&category_id=1&brand=Dell
    });
  }
  return axios({
    url: Config.base_url + url + param_query,
    method: method,
    data: data,
    headers: {
      ...headers,
      Authorization: "Bearer " + access_token,
    },
  })
    .then((res) => {
      setServerSatus(200);
      return res.data;
    })
    .catch((err) => {
      var response = err.response;
      if (response) {
        var status = response.status;
        if (status == "401") {
          status = 403;
        }
        setServerSatus(status);
      } else if (err.code == "ERR_NETWORK") {
        setServerSatus("error");
      }
      console.log(">>>", err);
      return false;
    });
};

export const formatDateClient = (date, format = "DD/MM/YYYY") => {
  if (date) return dayjs(date).format(format);
  return null;
};
export const formatDateServer = (date, format = "YYYY-MM-DD") => {
  if (date) return dayjs(date).format(format);
  return null;
};
