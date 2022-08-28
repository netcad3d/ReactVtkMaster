import axios from "axios";

const BASE_URL='https://netcad-vtk.herokuapp.com';



export const fetchFromAPI = async(url,token) => {
	
	const config = { headers: { Authorization: `Bearer ${token}` } };

	const {data} = await axios.get(`${BASE_URL}/${url}`, config);
return data;

}

export const signupToAPI = async(url,values) => {
	const token = await axios.post(`${url}/signup`, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
	return token;
}

export const loginToAPI = async(url,values) => {
	const token = await axios.post(`${url}/signin`, {
        email: values.email,
        password: values.password,
      });
	return token;
}

export const verifyToAPI = async(url) => {
	const { data } = await axios.get(url);
	return data;
}


