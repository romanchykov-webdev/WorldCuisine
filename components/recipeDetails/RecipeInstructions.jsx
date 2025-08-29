import { StyleSheet, Text, View } from 'react-native';
import { hp } from '../../constants/responsiveScreen';
import { shadowTextSmall } from '../../constants/shadow';
import { themes } from '../../constants/themes';
import { useAuth } from '../../contexts/AuthContext';
import i18n from '../../lang/i18n';
import LoadingComponent from '../loadingComponent';
import ImageCustom from './ImageCustom';
import ImageSliderCustom from './ImageSliderCustom';

function RecipeInstructions({ instructions, langDev, isPreview }) {
    const { currentTheme } = useAuth();

    if (!instructions || instructions.length === 0) {
        return <LoadingComponent />;
    }

    return (
        <View>
            <Text
                style={[
                    {
                        fontSize: hp(2.5),
                        color: themes[currentTheme]?.secondaryTextColor,
                    },
                    shadowTextSmall(),
                ]}
                className="font-bold px-4 mb-3"
            >
                {i18n.t('Recipe Description')}
            </Text>

            {instructions.map((item, index) => {
                // текст на текущем языке или fallback на английский
                const text = item[langDev] || item['en'] || '';

                return (
                    <View key={index} className="w-full mb-5">
                        <Text
                            className="flex-wrap mb-3 px-4"
                            style={{
                                fontSize: hp(2.3),
                                color: themes[currentTheme]?.secondaryTextColor,
                            }}
                        >
                            <Text className="text-amber-500">
                                {index + 1}){' '}
                            </Text>
                            {text}
                        </Text>

                        {Array.isArray(item?.images) &&
                            item.images.length > 0 &&
                            (item.images.length === 1 ? (
                                <ImageCustom
                                    image={item.images}
                                    isPreview={isPreview}
                                    isOpenImageInModal={true}
                                />
                            ) : (
                                <ImageSliderCustom
                                    images={item.images}
                                    isPreview={isPreview}
                                    isOpenImageInModal={true}
                                />
                            ))}
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({});

export default RecipeInstructions;
