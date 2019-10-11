import axios from 'axios'

const service = axios.create({
  baseURL: '',
  timeout: 200000
})

service.interceptors.request.use(config => {
  return config
})

service.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

export default service
