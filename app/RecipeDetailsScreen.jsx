import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import ButtonBack from "../components/ButtonBack";
import LoadingComponent from "../components/loadingComponent";
import { hp, wp } from "../constants/responsiveScreen";
import { shadowBoxBlack, shadowTextSmall } from "../constants/shadow";

import {
	ClockIcon,
	FireIcon,
	Square3Stack3DIcon,
	UsersIcon,
} from "react-native-heroicons/mini";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import ButtonLike from "../components/ButtonLike";

import LinkCopyrightComponent from "../components/recipeDetails/LinkCopyrightComponent";
import MapСoordinatesComponent from "../components/recipeDetails/MapСoordinatesComponent";

import {
	ChatBubbleOvalLeftIcon,
	StarIcon,
} from "react-native-heroicons/outline";
import RatingComponents from "../components/RatingComponents";

import AvatarCustom from "../components/AvatarCustom";
import CommentsComponent from "../components/recipeDetails/CommentsComponent";
import { useAuth } from "../contexts/AuthContext";
import {
	getRecipesDescriptionLikeRatingMyDB,
	getRecipesDescriptionMyDB,
} from "../service/getDataFromDB";

// translate
import RecipeIngredients from "../components/recipeDetails/RecipeIngredients";
import RecipeInstructions from "../components/recipeDetails/RecipeInstructions";
import SubscriptionsComponent from "../components/recipeDetails/SubscriptionsComponent";
import VideoCustom from "../components/recipeDetails/video/VideoCustom";
import i18n from "../lang/i18n";

const RecipeDetailsScreen = () => {
	// const {language: langDev} = useAuth();

	// console.log('RecipeDetailsScreen langDev',langDev)

	const [loading, setLoading] = useState(false);

	const [recipeDish, setRecipeDish] = useState(null);

	console.log(
		"RecipeDetailsScreen recipeDish",
		JSON.stringify(recipeDish, null, 2)
	);

	const { user } = useAuth();

	// console.log('RecipeDetailsScreen setAuth',user);

	const { id, langApp } = useLocalSearchParams();
	console.log("RecipeDetailsScreen langDev", langApp);
	// i18n.locale = langApp; // Устанавливаем текущий язык

	const [rating, setRating] = useState("0");

	// console.log('RecipeDetailsScreen id ',id)
	// console.log('RecipeDetailsScreen langApp ',langApp)

	// update like comment count
	const updateLikeCommentCount = async (payload) => {
		const res = await getRecipesDescriptionLikeRatingMyDB({ id, payload });

		if (payload === "updateCommentsCount") {
			// console.log('updateLikeCommentCount res', res.data);  // Это выводит [{ "comments": 18 }]
			// console.log('updateLikeCommentCount recipeDish', recipeDish);  // Это выводит текущие данные

			// Обновляем состояние с новым количеством комментариев
			setRecipeDish((prevRecipeDish) => ({
				...prevRecipeDish,
				comments: res.data[0].comments, // Обновляем только поле comments
			}));
		}
	};
	// update like comment count

	useEffect(() => {
		if (recipeDish?.rating !== undefined) {
			const averageScoreString = recipeDish?.rating;
			console.log(
				"averageScoreString recipeDish?.rating",
				recipeDish?.rating
			);
			setRating(averageScoreString); // Устанавливаем строковое значение
			// console.log('recipeDish.rating.averageScore (as string):', averageScoreString);
			// console.log('rating (as string):', rating);
		}
	}, [recipeDish]);

	// let rating = recipeDish?.rating?.averageScore;

	const handleStarPress = (starIndex) => {
		// console.log('Star pressed:', starIndex); // Индекс звезды
		// setChangeRating(starIndex); // Установить рейтинг
		// ratings.push(starIndex);
		//add rating to db
		// Alert.alert('Rating',`You have rated this recipe: ${starIndex}`)
		//update rating to the item on dataBAse
	};
	// rating xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

	// scroll xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
	const scrollViewRef = useRef(null);
	const commentsRef = useRef(null);

	const scrollToComments = () => {
		commentsRef.current?.measureLayout(
			scrollViewRef.current.getNativeScrollRef(),
			(x, y) => {
				scrollViewRef.current.scrollTo({ y, animated: true }); // Плавный скролл
			}
		);
	};
	// scroll xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

	// console.log('id', id);
	// console.log('recipeDish', recipeDish);

	useEffect(() => {
		const fetchRecipeDish = async () => {
			try {
				// console.log('Fetching with ID:', id, 'and tableCategory:', tableCategory);
				setLoading(true);
				const response = await getRecipesDescriptionMyDB(id);
				// console.log('API Response:', response);
				setRecipeDish(response?.data[0] || null);

				setTimeout(() => {
					setLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Error fetching recipe:", error);
			} finally {
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			}
		};

		fetchRecipeDish();
	}, [id]);
	// console.log('recipeDish', recipeDish);

	// get video id
	// console.log('RecipeDetailsScreen recipeDish',JSON.stringify(recipeDish,null,2))
	// console.log('recipeDish.imageHeader',recipeDish.imageHeader)
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView
				ref={scrollViewRef} //for scroll
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 30,
					backgroundColor: "white",
					paddingHorizontal: wp(3),
				}}
			>
				<StatusBar style="dark" />
				{loading || recipeDish === null ? (
					<View style={{ height: hp(100) }}>
						<LoadingComponent size="large" color="green" />
					</View>
				) : (
					<View className="gap-y-5" key={id}>
						{/* top image button back and like*/}
						<View
							className="flex-row justify-center relative"
							style={shadowBoxBlack()}
						>
							<Animated.View
								entering={FadeInUp.duration(400).delay(100)}
							>
								<AvatarCustom
									uri={recipeDish.imageHeader}
									style={{
										width: wp(98),
										height: hp(50),
										borderRadius: 40,
										marginTop: wp(1),
										borderWidth: 0.5,
										borderColor: "gray",
									}}
								/>
							</Animated.View>
							<LinearGradient
								colors={["transparent", "#18181b"]}
								style={{
									width: wp(98),
									height: "20%",
									position: "absolute",
									top: wp(1),
									borderRadius: 40,
									borderBottomRightRadius: 0,
									borderBottomLeftRadius: 0,
								}}
								start={{ x: 0.5, y: 1 }}
								end={{ x: 0.5, y: 0 }}
							/>
							<Animated.View
								entering={FadeInUp.duration(400).delay(500)}
								className="absolute flex-row justify-between top-[60] pl-5 pr-5  w-full
                                    {/*bg-red-500*/}
                                    "
							>
								<ButtonBack />

								<ButtonLike
									user={user ?? null}
									recipeId={recipeDish?.id}
								/>
							</Animated.View>

							{/*    rating and comments*/}
							<Animated.View
								entering={FadeInDown.duration(400).delay(500)}
								className="absolute flex-row justify-between bottom-[20] pl-5 pr-5  w-full
                                    {/*bg-red-500*/}
                                    "
							>
								{/*    StarIcon*/}
								<View
									className="items-center justify-center flex-row w-[60] h-[60] rounded-full relative"
									style={{
										backgroundColor:
											"rgba(255,255,255,0.5)",
									}}
								>
									<View
										style={{
											position: "absolute",
											alignItems: "center",
											justifyContent: "center",
											width: "100%",
											height: "100%",
										}}
									>
										<Text
											style={{
												fontSize: 12,
												color: "black",
												fontWeight: "bold",
											}}
										>
											{rating}
										</Text>
									</View>
									<StarIcon size={45} color="gold" />
								</View>

								{/*    comments quantity*/}
								<View
									className="items-center justify-center flex-row w-[60] h-[60] rounded-full"
									style={{
										backgroundColor:
											"rgba(255,255,255,0.5)",
									}}
								>
									<TouchableOpacity
										className="items-center justify-center flex-row"
										onPress={scrollToComments}
									>
										<ChatBubbleOvalLeftIcon
											size={45}
											color="gray"
										/>
										<Text
											style={{ fontSize: 8 }}
											className="text-neutral-700 absolute"
										>
											{recipeDish?.comments}
										</Text>
									</TouchableOpacity>
								</View>
							</Animated.View>
						</View>
						{/* top image button back and like end*/}

						{/*ratings */}
						<RatingComponents
							rating={rating}
							handleStarPress={handleStarPress}
							user={user ?? null}
							recipeId={id}
						/>

						{/*section Subscriptions*/}
						<Animated.View entering={FadeInDown.delay(550)}>
							<SubscriptionsComponent
								subscriberId={user?.id ?? null}
								creatorId={recipeDish?.publishedId}
							/>
						</Animated.View>

						{/*    dish and description*/}
						<Animated.View
							entering={FadeInDown.delay(600)}
							className="px-4 flex justify-between gap-y-5 "
						>
							{/*    name and area*/}
							<View className="gap-y-2">
								<Text
									style={[
										{ fontSize: hp(2.7) },
										shadowTextSmall(),
									]}
									className="font-bold  text-neutral-700"
								>
									{/*{recipeDish?.strMeal}*/}
									{recipeDish?.title?.lang.find(
										(it) => it.lang === langApp
									)?.name || recipeDish?.title?.strTitle}
								</Text>
								<Text
									style={{ fontSize: hp(1.8) }}
									className="font-medium text-neutral-500"
								>
									{/*{recipeDish?.strArea}*/}
									{recipeDish?.area}
								</Text>
							</View>
						</Animated.View>
						{/*    dish and description  end*/}

						{/*    misc     */}
						<Animated.View
							entering={FadeInDown.delay(700)}
							className="flex-row justify-around"
						>
							{/*ClockIcon*/}
							<View
								className="flex rounded-full bg-amber-300  p-1 items-center"
								style={shadowBoxBlack()}
							>
								<View
									className="bg-white rounded-full flex items-center justify-around"
									style={{ width: hp(6.5), height: hp(6.5) }}
								>
									<ClockIcon
										size={hp(4)}
										strokeWidth={2.5}
										color="gray"
									/>
								</View>

								{/*    descriptions*/}
								<View className="flex items-center py-2 gap-y-1">
									<Text
										style={{ fontSize: hp(2) }}
										className="font-bold  text-neutral-700"
									>
										{/*35*/}
										{recipeDish?.recipeMetrics?.time?.value}
									</Text>
									<Text
										style={{ fontSize: hp(1.2) }}
										className="font-bold  text-neutral-500"
									>
										{i18n.t("Mins")}
									</Text>
								</View>
							</View>

							{/*users*/}
							<View
								className="flex rounded-full bg-amber-300  p-1 items-center"
								style={shadowBoxBlack()}
							>
								<View
									className="bg-white rounded-full flex items-center justify-around"
									style={{ width: hp(6.5), height: hp(6.5) }}
								>
									<UsersIcon
										size={hp(4)}
										strokeWidth={2.5}
										color="gray"
									/>
								</View>

								{/*    descriptions*/}
								<View className="flex items-center py-2 gap-y-1">
									<Text
										style={{ fontSize: hp(2) }}
										className="font-bold  text-neutral-700"
									>
										{
											recipeDish?.recipeMetrics?.persons
												?.value
										}
									</Text>
									<Text
										style={{ fontSize: hp(1.2) }}
										className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        "
									>
										{i18n.t("Person")}
									</Text>
								</View>
							</View>

							{/*calories*/}
							<View
								className="flex rounded-full bg-amber-300  p-1 items-center

                                "
								style={shadowBoxBlack()}
							>
								<View
									className="bg-white rounded-full flex items-center justify-around"
									style={{ width: hp(6.5), height: hp(6.5) }}
								>
									<FireIcon
										size={hp(4)}
										strokeWidth={2.5}
										color="gray"
									/>
								</View>

								{/*    descriptions*/}
								<View className="flex items-center py-2 gap-y-1">
									<Text
										style={{ fontSize: hp(2) }}
										className="font-bold  text-neutral-700"
									>
										{
											recipeDish?.recipeMetrics?.calories
												?.value
										}
									</Text>
									<Text
										style={{ fontSize: hp(1.2) }}
										className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        "
									>
										{i18n.t("Cal")}
									</Text>
								</View>
							</View>

							{/*level*/}
							<View
								className="flex rounded-full bg-amber-300  p-1 items-center"
								style={shadowBoxBlack()}
							>
								<View
									className="bg-white rounded-full flex items-center justify-around"
									style={{ width: hp(6.5), height: hp(6.5) }}
								>
									<Square3Stack3DIcon
										size={hp(4)}
										strokeWidth={2.5}
										color="gray"
									/>
								</View>

								{/*    descriptions*/}
								<View className="flex items-center py-2 gap-y-1">
									<Text
										style={{ fontSize: hp(2) }}
										className="font-bold  text-neutral-700"
									></Text>
									<Text
										style={{ fontSize: hp(1.2) }}
										className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        "
									>
										{i18n.t(
											`${recipeDish?.recipeMetrics?.difficulty?.value}`
										)}
										{/*{recipeDish?.recipeMetrics?.difficulty?.value}*/}
									</Text>
								</View>
							</View>
						</Animated.View>
						{/*misc end*/}

						{/*    ingredients*/}
						<Animated.View
							entering={FadeInDown.delay(800)}
							className="gap-y-4 "
						>
							<Text
								style={[
									{ fontSize: hp(2.5) },
									shadowTextSmall(),
								]}
								className="font-bold px-4 text-neutral-700"
							>
								{i18n.t("Ingredients")}
							</Text>

							{/*    */}
							<View className="gap-y-2">
								<RecipeIngredients
									recIng={recipeDish?.ingredients?.lang}
									langDev={langApp}
								/>
							</View>
						</Animated.View>
						{/*    ingredients  end*/}

						{/*    instructions*/}
						<Animated.View
							entering={FadeInDown.delay(800)}
							className="gap-y-4 "
						>
							<Text
								style={[
									{ fontSize: hp(2.5) },
									shadowTextSmall(),
								]}
								className="font-bold px-4 text-neutral-700"
							>
								{i18n.t("Recipe Description")}
							</Text>

							{/*    */}
							<RecipeInstructions
								instructions={recipeDish?.instructions}
								langDev={langApp}
							/>
							{/*<Text style={{fontSize: hp(1.6)}} className="text-neutral-700">*/}
							{/*    {recipeDish?.strInstructions} 1*/}
							{/*</Text>*/}
						</Animated.View>
						{/*    instructions  end*/}

						{/*    recipe video*/}
						<View className="mb-5">
							{recipeDish?.video !== null && (
								<VideoCustom video={recipeDish?.video} />
							)}
						</View>
						{/*    recipe video end*/}

						{/* LinkCopyrightComponent */}
						{recipeDish?.linkCopyright && (
							<LinkCopyrightComponent
								linkCopyright={recipeDish?.linkCopyright}
							/>
						)}

						{/* MapСoordinatesComponent */}
						{recipeDish?.mapСoordinates && (
							<MapСoordinatesComponent
								mapСoordinates={recipeDish?.mapСoordinates}
							/>
						)}

						{/*accordion comments*/}

						<View ref={commentsRef}>
							<CommentsComponent
								recepId={id}
								user={user ?? null}
								updateLikeCommentCount={updateLikeCommentCount}
								publishedId={recipeDish?.publishedId}
							/>
						</View>
					</View>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default RecipeDetailsScreen;
