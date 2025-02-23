import { useEffect, useState } from "react";

// Функция для форматирования чисел  1299 in 1.2K
export const myFormatNumber = (num) => {
	if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K"; // Убирает ".0" для целых чисел
	}
	return num.toString(); // Возвращает число как строку, если меньше 1000
};

// Функция для форматирования date
export const formatDateTime = (isoDateString) => {
	const date = new Date(isoDateString);

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы в JS начинаются с 0
	const year = date.getFullYear();

	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Функция для  видео с Youtobe
// export const getYoutobeVideoId = (url) => {
// 	console.log("getYoutobeVideoId url", url);

// 	// if(url!=null){
// 	const regex = /[?&]v=([^&]+)/;
// 	const match = url.match(regex);

// 	if (match && match[1]) {
// 		console.log("match[1]", match[1]);
// 		return match[1];
// 	}
// 	return null;
// 	// }else{
// 	//     return null;
// 	// }
// };
export const getYoutubeVideoId = (url) => {
	// console.log("getYoutubeVideoId url", url);

	if (!url || typeof url !== "string") {
		return null;
	}

	// Регулярное выражение для полной ссылки (youtube.com/watch?v=)
	const fullUrlRegex = /[?&]v=([^&]+)/;
	const fullUrlMatch = url.match(fullUrlRegex);

	if (fullUrlMatch && fullUrlMatch[1]) {
		return fullUrlMatch[1];
	}

	// Регулярное выражение для сокращенной ссылки (youtu.be)
	const shortUrlRegex = /youtu\.be\/([^?]+)/;
	const shortUrlMatch = url.match(shortUrlRegex);

	if (shortUrlMatch && shortUrlMatch[1]) {
		return shortUrlMatch[1];
	}

	return null;
};

// Функция для  видео с google disk
export const convertGoogleDriveLink = (url) => {
	// console.log('convertGoogleDriveLink url', url);
	if (url != null) {
		return url.replace(
			/\/file\/d\/(.*?)\/view.*/,
			"/uc?export=download&id=$1"
		);
	}
	return null;
};

// Кастомный хук для debounce
export const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
};
