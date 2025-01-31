import { useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4040/api";

export const getProject_detail = async (token) => {
  console.log(token);
  console.log("---");
  let users = [];
  // console.log(axios.get(ALL_EMPLOYEE_DETAILS_URL))
  //   console.log(axios.get("/project/index", { token: token }), "---project--");
  axios.post(`http://localhost:4040/api/project/index`, {token: token,
    })
    .then((res) => {
      console.log("ok");
      console.log(res);
      console.log(res.data);
      console.log(res.data.data);
      users = res.data.data;
    });
  //   return axios.get("/project/index", token);
  return users;
};
export const DeleteProject = (id) => {
  // console.log(axios.get(ALL_EMPLOYEE_DETAILS_URL))
  return axios.post("/project/destroy" + id);
};
