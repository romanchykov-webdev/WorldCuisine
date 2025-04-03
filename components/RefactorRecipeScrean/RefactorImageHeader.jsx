import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { hp, wp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { useSingleImagePicker } from "../../lib/imageUtils";
import AvatarCustom from "../AvatarCustom";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import LoadingComponent from "../loadingComponent";

const RefactorImageHeader = ({ imageUri, Icon, onImageUpdate }) => {
	const [loading, setLoading] = useState(false);
	const [newImage, setNewImage] = useState(false);

	const { image, pickImage } = useSingleImagePicker(imageUri, setLoading, 0.5);

	const handleRefactorImage = async () => {
		const newImageUri = await pickImage();
		if (newImageUri) {
			onImageUpdate(newImageUri);
			setNewImage(true);
		}
	};
	return (
		<View className="flex-row justify-center items-center relative" style={shadowBoxBlack()}>
			<View>
				<View style={styles.wrapperImage}>
					{loading ? (
						<LoadingComponent />
					) : (
						<AvatarCustom
							RefactorImageHeader={newImage}
							uri={image?.uri || imageUri}
							style={{
								width: "100%",
								height: "100%",
							}}
						/>
					)}
				</View>
			</View>
			<TouchableOpacity
				onPress={handleRefactorImage}
				style={shadowBoxBlack()}
				className="absolute top-[10px] right-[-10px]"
			>
				<ButtonSmallCustom icon={Icon} bg="red" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapperImage: {
		width: wp(98),
		height: hp(50),
		borderRadius: 40,
		marginTop: wp(1),
		borderWidth: 0.5,
		borderColor: "gray",
	},
});

export default RefactorImageHeader;
