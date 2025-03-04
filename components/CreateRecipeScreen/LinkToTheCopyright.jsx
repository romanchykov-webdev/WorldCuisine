import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { LinkIcon, PlusIcon, TrashIcon } from "react-native-heroicons/mini";
import { shadowBoxBlack } from "../../constants/shadow";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import InputComponent from "../InputComponent";

import LinkCopyrightComponent from "../../components/recipeDetails/LinkCopyrightComponent";

// import my hook
import { useDebounce } from "../../constants/halperFunctions";
import i18n from "../../lang/i18n";
import TitleDescriptionComponent from "./TitleDescriptionComponent";

const LinkToTheCopyright = ({ setTotalRecipe }) => {
	const [inputText, setInputText] = useState("");

	const [linkCopyright, setLinkCopyright] = useState("");

	const debouncedValue = useDebounce(linkCopyright, 1000);

	const addLinkCopyright = () => {
		// console.log("addLinkCopyright");
		setLinkCopyright(inputText);
	};

	const removeLinkCopyright = () => {
		setInputText("");
		setLinkCopyright("");
	};

	useEffect(() => {
		setTotalRecipe((prevRecipe) => ({
			...prevRecipe,
			link_copyright: debouncedValue,
		}));
	}, [debouncedValue]);

	return (
		<View className="mb-5">
			<TitleDescriptionComponent titleText={i18n.t("Add link")} titleVisual={true} discriptionVisual={true} descriptionText={i18n.t("If this recipe is available on another resource, you can add a link to it")} />

			{linkCopyright !== "" && (
				<View className="flex-row  items-center mb-3 ">
					<LinkCopyrightComponent linkCopyright={linkCopyright} />

					<TouchableOpacity style={shadowBoxBlack()} onPress={removeLinkCopyright}>
						<ButtonSmallCustom w={30} h={30} icon={TrashIcon} bg={"red"} />
					</TouchableOpacity>
				</View>
			)}

			<View className="flex-row gap-x-1">
				<InputComponent placeholder={i18n.t("Link to the author")} onChangeText={setInputText} value={inputText} icon={<LinkIcon size={20} color={"grey"} />} containerStyle={{ flex: 1 }} />
				<TouchableOpacity style={shadowBoxBlack()} onPress={addLinkCopyright}>
					<ButtonSmallCustom icon={PlusIcon} bg={"green"} h={60} w={60} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({});

export default LinkToTheCopyright;
