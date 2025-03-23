import { Animated, LayoutAnimation, Platform } from "react-native";

// Анимация появления
const createFadeAnimation = ({
	id,
	animationRef,
	direction = "fromTop", // fromTop, fromBottom, fromLeft, fromRight
	duration = 300, // Длительность
	offset = 20, // Смещение
	delay = 0, // Задержка
	useNativeDriver = true,
}) => {
	if (!animationRef.current[id]) {
		animationRef.current[id] = {
			opacity: new Animated.Value(0),
			translate: new Animated.Value(
				direction === "fromTop"
					? -offset
					: direction === "fromBottom"
					? offset
					: direction === "fromLeft"
					? -offset
					: direction === "fromRight"
					? offset
					: 0
			),
		};
	}

	const animations = [
		Animated.timing(animationRef.current[id].opacity, {
			toValue: 1,
			duration,
			useNativeDriver,
		}),
		Animated.timing(animationRef.current[id].translate, {
			toValue: 0,
			duration,
			useNativeDriver,
		}),
	];

	setTimeout(() => Animated.parallel(animations).start(), delay);
};

// Анимация уменьшения высоты
const createHeightCollapseAnimation = ({
	id,
	animationRef,
	fromHeight = 130,
	duration = 300,
	onComplete = () => {},
}) => {
	if (!animationRef.current[id]) {
		animationRef.current[id] = new Animated.Value(fromHeight);
	}

	if (Platform.OS !== "web") {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}

	Animated.timing(animationRef.current[id], {
		toValue: 0,
		duration,
		useNativeDriver: false, // Явно отключаем нативный драйвер
	}).start(onComplete);
};

// export { createFadeAnimation, createHeightCollapseAnimation };

// Анимация пульсации
const createPulseAnimation = ({
	id,
	animationRef,
	duration = 1000, // Длительность одного цикла пульсации
	scaleFrom = 1, // Начальный масштаб
	scaleTo = 1.2, // Конечный масштаб (увеличение)
	useNativeDriver = true,
}) => {
	if (!animationRef.current[id]) {
		animationRef.current[id] = new Animated.Value(scaleFrom);
	}

	const pulse = Animated.sequence([
		Animated.timing(animationRef.current[id], {
			toValue: scaleTo,
			duration: duration / 2,
			useNativeDriver,
		}),
		Animated.timing(animationRef.current[id], {
			toValue: scaleFrom,
			duration: duration / 2,
			useNativeDriver,
		}),
	]);

	// Зацикливаем анимацию
	Animated.loop(pulse).start();
};

export { createFadeAnimation, createHeightCollapseAnimation, createPulseAnimation };
