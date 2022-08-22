import { useState,useEffect,Fragment } from "react";
import {styles}  from "../Styling/verify.module.css";
import success from "../../public/verify-success.png"

const EmailVerify = () => {
	const [validUrl,setValidUrl] = useState(false);
	return(
		<Fragment>
			{validUrl ? (<div className={styles.verify}>
				<img src={success} alt="success_img" className={styles.success_img}/>
				<h1>Email Verified Successfully</h1>
			</div>) :
			(<h1>

			</h1>)
			}
		
		</Fragment>
	)
}

export default EmailVerify;