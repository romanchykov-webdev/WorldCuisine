import React from "react";
import { Text, View } from "react-native";

const StərɪskCustomComponent = ({
	size = 30,
	color = "red",
	top = 0,
	left,
	right = 0,
}) => {
	return (
		<View
			style={{
				position: "absolute",
				top: top,
				left: left,
				right: right,
				width: size,
				height: size,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text style={{ fontSize: size, color: color, textAlign: "center" }}>
				*
			</Text>
		</View>
	);
};

export default StərɪskCustomComponent;
