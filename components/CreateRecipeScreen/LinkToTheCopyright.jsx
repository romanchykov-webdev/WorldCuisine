import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinkIcon, PlusIcon, TrashIcon } from "react-native-heroicons/mini";
import { shadowBoxBlack } from "../../constants/shadow";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import InputComponent from "../InputComponent";

import LinkCopyrightComponent from "../../components/recipeDetails/LinkCopyrightComponent";

// import my hook
import { useDebounce } from "../../constants/halperFunctions";

const LinkToTheCopyright = ({ setTotalRecipe }) => {
	const [inputText, setInputText] = useState("");

	const [linkCopyright, setLinkCopyright] = useState("");

	const debouncedValue = useDebounce(linkCopyright, 1000);

	const addLinkCopyright = () => {
		console.log("addLinkCopyright");
		setLinkCopyright(inputText);
	};

	const removeLinkCopyright = () => {
		setInputText("");
		setLinkCopyright("");
	};

	return (
		<View className="mb-5">
			<Text className="text-xl font-bold mb-2">
				Если вы позаимствовали рецепт можете оставить ссылку на автора
			</Text>

			{linkCopyright !== "" && (
				<View className="flex-row  items-center mb-3 ">
					{/* <View
						style={{ height: 20, width: 20 }}
						className="bg-amber-300 rounded-full"
					/>
					<View className="flex-row gap-x-2 items-center justify-between  flex-1">
						<Link
							href={linkCopyright}
							className="text-blue-900 font-bold text-xl underline"
						>
							Ссылка на автора
						</Link> */}

					<LinkCopyrightComponent linkCopyright={linkCopyright} />

					<TouchableOpacity
						style={shadowBoxBlack()}
						onPress={removeLinkCopyright}
					>
						<ButtonSmallCustom
							w={30}
							h={30}
							icon={TrashIcon}
							bg={"red"}
						/>
					</TouchableOpacity>
					{/* </View> */}
				</View>
			)}

			<View className="flex-row gap-x-1">
				<InputComponent
					placeholder="Ссылка на автора"
					onChangeText={setInputText}
					value={inputText}
					icon={<LinkIcon size={20} color={"grey"} />}
					containerStyle={{ flex: 1 }}
				/>
				<TouchableOpacity
					style={shadowBoxBlack()}
					onPress={addLinkCopyright}
				>
					<ButtonSmallCustom
						icon={PlusIcon}
						bg={"green"}
						h={60}
						w={60}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({});

export default LinkToTheCopyright;
