export const setToken = (token) => {
  localStorage.setItem('adminToken', token)
}

export const getToken = () => {
  return localStorage.getItem('adminToken')
}
