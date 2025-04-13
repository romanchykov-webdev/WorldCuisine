import React from "react";
import { StyleSheet, Text } from "react-native";
import { hp } from "../constants/responsiveScreen";
import { shadowText } from "../constants/shadow";

const TitleScrean = ({ title, styleTitle }) => {
	return (
		<Text
			style={[
				{ fontSize: hp(4) },
				shadowText({ color: "rgba(0,0,0,0.4)", offset: { width: 1.5, height: 1.5 }, radius: 1 }),
				styleTitle,
			]}
			className="font-semibold text-neutral-700 "
		>
			{title}
		</Text>
	);
};

const styles = StyleSheet.create({});

export default TitleScrean;
