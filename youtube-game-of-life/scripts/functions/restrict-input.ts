export function restrictInputValue(input: HTMLInputElement, min: number, max: number) {
	let value = parseInt(input.value);

	if (isNaN(value)) {
		value = min;
	} else if (value < min) {
		value = min;
	} else if (value > max) {
		value = max;
	}

	input.value = value.toString();

	return value;
}
