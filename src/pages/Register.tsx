export default function Register() {
	return (
		<div>
			<h1>Register Page</h1>
			<form>
				<div>
					<label htmlFor="email">Email:</label>
					<input type="email" id="email" />
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input type="password" id="password" />
				</div>
				<div>
					<label htmlFor="confirmPassword">Confirm Password:</label>
					<input type="password" id="confirmPassword" />
				</div>
				<button type="submit">Register</button>
			</form>
		</div>
	);
}
