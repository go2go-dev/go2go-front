import { createContext, useContext } from "react";

export default function generateContext<T>({
	name,
	defaultContextValue,
}: {
	name: string;
	defaultContextValue: T;
}) {
	const Context = createContext<T>(defaultContextValue);
	Context.displayName = name;

	const Provider = Context.Provider;
	const useContextValue = () => useContext(Context);

	return [Provider, useContextValue] as const;
}
