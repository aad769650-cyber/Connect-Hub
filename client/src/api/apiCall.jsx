import axios from "axios";


export const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // automatically send cookies for all requests
});



export const apiCall=async () => {
    
    // for (let [key, val] of .entries()) console.log(key, val)

    const resp=await api.get("/api")
    console.log("resp",resp);
    
}


export const Register=async (formData) => {

    
    for (let [key, val] of formData.entries()) console.log(key, val)

    const resp=await api.post("/register",formData)
    console.log("resp",resp);
    
}

