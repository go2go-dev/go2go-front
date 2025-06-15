"use client";

import { Suspense, forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "./ErrorBoundary";

// chain 함수 직접 구현
const chain = (...fns: Array<((...args: any[]) => void) | undefined>) => {
	return (...args: any[]) => {
		fns.forEach((fn) => fn?.(...args));
	};
};

type ErrorBoundaryProps = Omit<
	ComponentProps<typeof ErrorBoundary>,
	"renderFallback"
>;
type SuspenseProps = Omit<ComponentProps<typeof Suspense>, "fallback">;

type StrictPropsWithChildren = {
	children: React.ReactNode;
};

type AsyncBoundrayProps = StrictPropsWithChildren &
	ErrorBoundaryProps &
	SuspenseProps & {
		errorFallback?: ComponentProps<typeof ErrorBoundary>["renderFallback"];
		pendingFallback?: ComponentProps<typeof Suspense>["fallback"];
	};

const SSRSafeSuspense = Suspense;

export const AsyncBoundary = forwardRef<
	ComponentRef<typeof ErrorBoundary>,
	AsyncBoundrayProps
>(
	(
		{ errorFallback, pendingFallback, children, ...errorBoundaryProps },
		ref
	) => {
		return (
			<ErrorBoundary
				ref={ref}
				renderFallback={errorFallback}
				{...errorBoundaryProps}
			>
				<SSRSafeSuspense fallback={pendingFallback}>{children}</SSRSafeSuspense>
			</ErrorBoundary>
		);
	}
);

AsyncBoundary.displayName = "crayon-AsyncBoundary";

export const AsyncBoundaryWithQuery = forwardRef<
	ComponentRef<typeof ErrorBoundary>,
	AsyncBoundrayProps
>((props, ref) => {
	const { children, ...otherProps } = props;
	const { reset } = useQueryErrorResetBoundary();

	return (
		<AsyncBoundary
			ref={ref}
			{...otherProps}
			onReset={chain(props.onReset, reset)}
		>
			{children}
		</AsyncBoundary>
	);
});

AsyncBoundaryWithQuery.displayName = "crayon-AsyncBoundaryWithQuery";
