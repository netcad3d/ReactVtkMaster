import { useState,useEffect } from "react";
import axios from "axios";
import styles from "../Styling/forgotPass.module.css";
import { useNavigate } from "react-router-dom";
const ForgotPass = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");

	
		const handleSubmit = async (e) => {
			e.preventDefault();
	
			try {
				const url = `http://localhost:3000/api/password-reset`;
				const { data } = await axios.post(url, { email });
				setMsg(data.message);
				
				setError("");
				//navigate(`/s`)
			} catch (error) {
				if (
					error.response &&
					error.response.status >= 400 &&
					error.response.status <= 500
				) {
					setError(error.response.data.message);
					setMsg("");
				}
			}
		};



	

	return (
		<div className={styles.container}>
			<form className={styles.form_container} onSubmit={handleSubmit}>
				<h1>Şifremi Unuttum</h1>
				<input
					type="email"
					placeholder="Email"
					name="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					required
					className={styles.input}
				/>
				{error && <div className={styles.error_msg}>{error}</div>}
				{msg && <div className={styles.success_msg}>{msg}</div>}
				<button  className="btn-secondary p-1 w-full md:w-[200px] mt-6" type="submit">
					Submit
				</button>
			</form>
		</div>
	);
};

export default ForgotPass;