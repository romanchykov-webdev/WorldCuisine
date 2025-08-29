import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInRight,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import { hp } from '../constants/responsiveScreen';
import { shadowText } from '../constants/shadow';

function WelcomeScreen() {
    const ring1Padding = useSharedValue(0);
    const ring2Padding = useSharedValue(0);

    const router = useRouter();

    useEffect(() => {
        ring1Padding.value = 0;
        ring2Padding.value = 0;

        const timer1 = setTimeout(() => {
            ring1Padding.value = withSpring(ring1Padding.value + hp(5));
        }, 100);

        const timer2 = setTimeout(() => {
            ring2Padding.value = withSpring(ring2Padding.value + hp(5.5));
        }, 300);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <View className="flex-1 justify-center items-center gap-y-10 bg-amber-500">
            <StatusBar style="dark" />

            {/*  logo image  with rings */}
            <Animated.View
                className="bg-white/20 rounded-full"
                style={{ padding: ring2Padding }}
            >
                <Animated.View
                    className="bg-white/20 rounded-full"
                    style={{ padding: ring1Padding }}
                >
                    <Image
                        source={require('../assets/img/logoBig2.png')}
                        style={{ width: hp(20), height: hp(20) }}
                        contentFit="cover"
                        transition={1000}
                    />
                </Animated.View>
            </Animated.View>

            {/*  title and punchline */}
            <View className="flex items-center justify-center gap-y-2">
                <Animated.Text
                    entering={FadeInRight.delay(1200).duration(300).springify()}
                    style={[{ fontSize: hp(7) }, shadowText()]}
                    className="font-bold text-white tracking-widest text-6xl"
                >
                    Food
                </Animated.Text>
                <Animated.Text
                    entering={FadeInLeft.delay(1400).duration(300).springify()}
                    style={[{ fontSize: hp(2) }, shadowText()]}
                    className="font-bold text-white tracking-widest text-lg mb-10"
                >
                    Food is always right
                </Animated.Text>
                <Animated.View entering={FadeInDown.delay(1600).springify()}>
                    <ActivityIndicator size={30} color="yellow" />
                </Animated.View>
            </View>
        </View>
    );
}

export default WelcomeScreen;
