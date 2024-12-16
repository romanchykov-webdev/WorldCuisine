export const getUserImageSrc = imagePath => {
    if (imagePath) {
        return {uri: imagePath};
    } else {
        return require('../assets/img/user_icon.png');
    }
}