export function restrictInputValue(input, min, max) {
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
