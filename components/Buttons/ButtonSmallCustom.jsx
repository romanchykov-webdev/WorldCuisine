import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ButtonSmallCustom = ({
	styleWrapperButton,
	w = 40,
	h = 40,
	icon: Icon,
	size = 20,
	color = "white",
	bg = "white",
	title,
	styleText,
	styleIcon,
	buttonText = false,
	iconVisual = false,
}) => {
	return (
		<View
			className="border-2  border-neutral-300 rounded-[10] justify-center items-center flex-row overflow-hidden bg-red-500"
			style={{
				backgroundColor: bg,
				width: w,
				height: h,
				...styleWrapperButton,
			}}
		>
			<View style={[styles.icon, styleIcon]}>{Icon && <Icon size={size} color={color} />}</View>

			{buttonText && (
				<Text numberOfLines={1} style={[styles.buttonText, styleText]}>
					{title}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	icon: {},
	buttonText: {
		textAlign: "center",
		fontSize: 20,
		fontWeight: "bold",
		color: "black",
		marginLeft: 10,
		textAlign: "center",
	},
});

export default ButtonSmallCustom;
