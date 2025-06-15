import { useRouteError } from "react-router-dom";

interface ErrorResponse {
	statusText?: string;
	message?: string;
}

export default function ErrorPage() {
	const error = useRouteError() as ErrorResponse;
	console.error(error);

	return (
		<div>
			<h1>Oops!</h1>
			<p>죄송합니다. 예상치 못한 오류가 발생했습니다.</p>
			<p>
				<i>{error.statusText || error.message}</i>
			</p>
		</div>
	);
}
