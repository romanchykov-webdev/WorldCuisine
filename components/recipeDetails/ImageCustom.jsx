import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AvatarCustom from '../AvatarCustom';

function ImageCustom({
    image,
    isPreview,
    refactorScrean = false,
    isOpenImageInModal = false,
}) {
    const [modalVisible, setModalVisible] = useState(false);

    const imageUri =
        Array.isArray(image) && image.length > 0 ? image[0] : image;
    if (!imageUri) return null;

    const handlePress = () => {
        if (isOpenImageInModal) {
            setModalVisible(true);
        }
    };

    return (
        <View>
            {/* Картинка на экране */}
            <TouchableOpacity onPress={handlePress}>
                <View style={[styles.imageWrapper]}>
                    <AvatarCustom
                        isPreview={isPreview}
                        refactorScrean={refactorScrean}
                        uri={imageUri}
                        style={styles.avatarStyle}
                    />
                </View>
            </TouchableOpacity>

            {/* Модальное окно для полноэкранного просмотра */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <AvatarCustom
                        uri={imageUri}
                        style={styles.fullscreenImage}
                        size={null}
                        rounded={0}
                        contentFit="contain"
                        isOpenImageInModal={isOpenImageInModal}
                    />
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    imageWrapper: {
        height: 300,
        width: '100%',
        borderRadius: 40,
        overflow: 'hidden',
    },
    avatarStyle: {
        width: '100%',
        height: 300,
        borderRadius: 40,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '100%',
        height: '100%',
    },
});

export default ImageCustom;
