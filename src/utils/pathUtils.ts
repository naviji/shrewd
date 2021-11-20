
export function basename(path: string) {
	if (!path) throw new Error('Path is empty');
	const s = path.split(/\/|\\/);
	return s[s.length - 1];
}

export function isHidden(path: string) {
	const b = basename(path);
	if (!b.length) throw new Error(`Path empty or not a valid path: ${path}`);
	return b[0] === '.';
}