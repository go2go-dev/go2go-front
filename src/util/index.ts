export const isDifferentArray = (a: unknown[] = [], b: unknown[] = []) => {
	return a.length !== b.length || a.some((item, index) => item !== b[index]);
};
