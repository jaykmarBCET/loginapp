import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE ==="development"?  'https://loginappb.onrender.com/api/v1/users':'/api/v1/users',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});


const axiosInstance1 = axios.create({
  baseURL: import.meta.env.MODE==='development'? "https://loginappb.onrender.com/api/v1/users":'/api/v1/users',
  headers:{
    'Content-Type':'application/json'
  }
})

export { axiosInstance, axiosInstance1}
