import { ExperienceBar } from "./experience-bar";

const inputAurumNode: HTMLInputElement | null = document.querySelector('.input-aurum');
const injectedBarNode: HTMLElement | null = document.querySelector('.injected-bar');

if (injectedBarNode === null || inputAurumNode === null) {
	throw new Error('Что-то не найдено');
}

const experienceBar = new ExperienceBar(injectedBarNode);

experienceBar.setInitBalance(30);

inputAurumNode.addEventListener('input', () => {
	const newBalance = inputAurumNode.value;

	if (parseFloat(newBalance) >= 0 && !isNaN(parseFloat(newBalance))) {
		experienceBar.addBalance(parseFloat(newBalance));
	} else if (newBalance === '') {
		experienceBar.addBalance(0);
	}
});

export {};
