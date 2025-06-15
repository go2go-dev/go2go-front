import { RouterProvider } from "react-router-dom";
import {
	QueryClient,
	QueryClientProvider,
	QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { router } from "./router";
import { ErrorBoundary } from "react-error-boundary";
import FallbackUI from "./pages/FallbackUI/FallbackUI";
import { Suspense } from "react";
import Loading from "./pages/Loading/Loading";

function App() {
	const queryClient = new QueryClient();

	return (
		<div className="min-h-screen bg-gray-50 font-sans antialiased">
			<QueryClientProvider client={queryClient}>
				<QueryErrorResetBoundary>
					{({ reset }) => (
						<ErrorBoundary
							onReset={() => reset()}
							FallbackComponent={FallbackUI}
						>
							<Suspense fallback={<Loading />}>
								<RouterProvider router={router} />
							</Suspense>
						</ErrorBoundary>
					)}
				</QueryErrorResetBoundary>
			</QueryClientProvider>
		</div>
	);
}

export default App;
