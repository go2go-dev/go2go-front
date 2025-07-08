import type { FallbackProps } from "react-error-boundary";

export default function FallbackUI({
	error,
	resetErrorBoundary,
}: FallbackProps) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="text-center">
				<h1 className="text-2xl font-bold text-gray-900 mb-4">
					오류가 발생했습니다
				</h1>
				<p className="text-gray-600 mb-4">{error.message}</p>
				<button
					onClick={resetErrorBoundary}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
				>
					다시 시도
				</button>
			</div>
		</div>
	);
}
