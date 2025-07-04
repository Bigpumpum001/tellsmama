import axios from 'axios'
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})
export default api

// axios.get('http://localhost:5000/api/category')
//    ->     api.get('/api/category')