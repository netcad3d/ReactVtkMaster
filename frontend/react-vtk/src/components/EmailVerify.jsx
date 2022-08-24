import { useState,useEffect,Fragment } from "react";
import styles  from "../Styling/verify.module.css";

import { Link,useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/authSlice";

const EmailVerify = () => {
	const [validUrl,setValidUrl] = useState(false);
	const param=useParams();


	useEffect(() => {
		const verifyEmailUrl= async () => {
			try {
				const url=`http://localhost:3000/${param.id}/verify/${param.token}`;
				const { data } = await axios.get(url);
				console.log(data);
				localStorage.setItem('verify', data.verified);
				setValidUrl(true);
			} 
			catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		}

		verifyEmailUrl();
	},[param])

	return(
		<Fragment>
			{validUrl ? (<div className={styles.container}>
				<img src="../../public/verify-success.png" alt="success_img" className={styles.success_img}/>
				<h1>Email Verified Successfully</h1>
				<Link to="/login" className={styles.link}>
					<button className="btn-secondary text-sm w-full" >Login</button>
				</Link>
			</div>) :
			(<h1 className="text-white">
				404 Not Found
			</h1>)
			}
		
		</Fragment>
	)
}

export default EmailVerify;