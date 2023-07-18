import axios from "axios";

export const displayCorners = (side) => {
  return (window.matchMedia( "(max-width: 768px)" ).matches ?
    ""
  :
    "rounded-" + side + "-1-5"
  )
};

export function shuffle(input_array) {
  var array = structuredClone(input_array)
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array
};


export function authHeaders() {
  const access_token = localStorage.getItem("access-token");
  const uid = localStorage.getItem("uid");
  const client = localStorage.getItem("client");
  if (access_token && uid && client) {
    return {
      "access-token": access_token,
      "uid": uid,
      "client": client
    };
  } else {
    return {};
  }
};



function validateHeaders() {

  const API_VALIDATE_HEADERS = process.env.REACT_APP_API_URL + '/api/v1/auth/validate_token';

  return axios
  .post(API_VALIDATE_HEADERS, {}, { headers: authHeaders() })
  .then(response => {
    return response.data;
    },
    error => {
    return error.errors;
    });
}

export function formatDate(created_at) {
  const d = new Date(created_at)
  const formatedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
  return formatedDate
}
