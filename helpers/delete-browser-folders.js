import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Массив папок ng-test-notes
const ngTestNotesFolders = ['../dist/ng-test-notes'];

// Функция для перемещения файлов из папки browser
function moveFilesAndRemoveBrowser(folderPath) {
	const sourceFolderPath = path.join(folderPath, 'browser');
	const destinationFolderPath = folderPath;

	// Проверяем существование папки browser в текущей ng-test-notes
	fs.access(sourceFolderPath, fs.constants.F_OK, (err) => {
		if (err) {
			console.error(`Папка browser не найдена в ${folderPath}`);
			return;
		}

		// Функция для перемещения файлов
		function moveFiles(source, destination) {
			fs.readdir(source, (err, files) => {
				if (err) {
					console.error(`Ошибка чтения папки ${source}:`, err);
					return;
				}

				files.forEach(file => {
					const filePath = path.join(source, file);
					const destPath = path.join(destination, file);

					fs.rename(filePath, destPath, err => {
						if (err) {
							console.error(`Ошибка перемещения файла ${file}:`, err);
						} else {
							console.log(`Файл ${file} успешно перемещен.`);
						}
					});
				});

				fs.rmdir(source, err => {
					if (err) {
						console.error(`Ошибка удаления папки ${source}:`, err);
					} else {
						console.log(`Папка ${source} успешно удалена.`);
					}
				});
			});
		}

		// Вызываем функцию для перемещения файлов и удаления папки browser
		moveFiles(sourceFolderPath, destinationFolderPath);
	});
}
// Проходим по каждой папке ng-test-notes и выполняем действия
ngTestNotesFolders.forEach(folder => {
	moveFilesAndRemoveBrowser(path.join(__dirname, folder));
});
