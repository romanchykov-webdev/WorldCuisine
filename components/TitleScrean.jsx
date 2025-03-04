import React from "react";
import { StyleSheet, Text } from "react-native";
import { hp } from "../constants/responsiveScreen";
import { shadowText } from "../constants/shadow";

const TitleScrean = ({ title }) => {
	return (
		<Text style={[{ fontSize: hp(4) }, shadowText({ color: "rgba(0,0,0,0.4)", offset: { width: 1.5, height: 1.5 }, radius: 1 })]} className="font-semibold text-neutral-700 mb-2">
			{title}
		</Text>
	);
};

const styles = StyleSheet.create({});

export default TitleScrean;
