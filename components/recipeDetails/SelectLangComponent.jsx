import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { shadowBoxBlack } from "../../constants/shadow";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";

const SelectLangComponent = ({ recipeDishArea, handleLangChange, langApp }) => {
	console.log("SelectLangComponent langApp", langApp);
	console.log("SelectLangComponent recipeDishArea", recipeDishArea);

	const areaKeys = Object.keys(recipeDishArea);
	return (
		<View className="flex-row flex-wrap gap-3">
			{areaKeys &&
				areaKeys.length > 1 &&
				areaKeys.map((item) => (
					<TouchableOpacity
						onPress={() => handleLangChange(item)}
						key={item}
						className="flex-1"
						style={shadowBoxBlack()}
					>
						<ButtonSmallCustom
							w="auto"
							bg={langApp === item ? "yellow" : "green"}
							buttonText={true}
							title={item}
							styleText={{
								marginLeft: 0,
							}}
						/>
					</TouchableOpacity>
				))}

			{/* {recipeDishArea &&
				Object.entries(recipeDishArea).map(([key, val]) => (
					<TouchableOpacity
						onPress={() => handleLangChange(key)}
						key={key}
						className="flex-1"
						style={shadowBoxBlack()}
					>
						<ButtonSmallCustom
							w="auto"
							bg={langApp === key ? "yellow" : "green"}
							buttonText={true}
							title={key}
							styleText={{
								marginLeft: 0,
							}}
						/>
					</TouchableOpacity>
				))} */}
		</View>
	);
};

const styles = StyleSheet.create({});

export default SelectLangComponent;
