//* Retrieve the userInfo and accessToken from localStorage
export function userAccessToken() {
  const accessToken = localStorage.getItem('accessToken') !== 'undefined'
    ? JSON.parse(localStorage.getItem('accessToken'))
    : localStorage.clear();

  return accessToken;
}

export function fetchUser() {
  const userInfo = localStorage.getItem('user') !== 'undefined'
    ? JSON.parse(localStorage.getItem('user'))
    : localStorage.clear();

  return userInfo;
}
