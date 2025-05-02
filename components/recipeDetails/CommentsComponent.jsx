import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PaperAirplaneIcon, TrashIcon } from "react-native-heroicons/mini";
import { formatDateTime } from "../../constants/halperFunctions";
import { hp } from "../../constants/responsiveScreen";
import {
	addNewCommentToRecipeMyDB,
	deleteCommentByIdToRecipeMyDB,
	getAllCommentsMyDB,
	getAllUserIdCommentedMyDB,
} from "../../service/getDataFromDB";
import AvatarCustom from "../AvatarCustom";
import LoadingComponent from "../loadingComponent";

// translate
import i18n from "../../lang/i18n";
import { themes } from "../../constants/themes";
import { useAuth } from "../../contexts/AuthContext";

const CommentsComponent = ({ recepId, user, updateLikeCommentCount, publishedId }) => {
	// console.log('CommentsComponent recepId',recepId)
	// console.log('CommentsComponent user',user)

	const { currentTheme } = useAuth();

	// user?.id===comment?.userIdCommented || user?.id===publishedId

	const [commentsAll, setCommentsAll] = useState(null);
	const [userIdCommented, setUserIdCommented] = useState(null);

	// полный объект комментариев
	const [allDataComments, setAllDataComments] = useState(null);

	const [inputText, setInputText] = useState("");

	const [loading, setLoading] = useState(false);

	// get all comments for recep
	const fetchComments = async () => {
		try {
			const res = await getAllCommentsMyDB(recepId);
			setCommentsAll(res.data);

			// Извлекаем все userIdCommented из массива commentsAll
			const usersId = res.data.map((comment) => comment.user_id_commented);
			setUserIdCommented(usersId);

			// if (user?.id === comment?.userIdCommented || user?.id === publishedId) {
			//
			// }
		} catch (error) {
			console.error("Ошибка при получении комментариев:", error);
		}
	};
	const fetchUserIdCommented = async (userIdCommented) => {
		// console.log('fetchUserIdCommented userIds' ,userIds)
		const res = await getAllUserIdCommentedMyDB(userIdCommented);
		// console.log('commentsAll',commentsAll)
		// console.log('res.data',res.data)

		// Объединение данных
		const mergedData = commentsAll.map((comment) => {
			const user = res.data.find((user) => user.id === comment.user_id_commented);
			return {
				...comment,
				...(user ? { avatar: user.avatar, user_name: user.user_name } : {}),
			};
		});

		console.log("Merged Data:", mergedData);

		setAllDataComments(mergedData);
	};

	useEffect(() => {
		fetchComments();
	}, [recepId]);

	useEffect(() => {
		// console.log('useEfect userIdCommented',userIdCommented)
		fetchUserIdCommented(userIdCommented);
	}, [userIdCommented]);

	// Check if the current user is the owner
	useEffect(() => {}, [allDataComments]);

	// const addNewComment = async () => {
	// 	// console.log('inputText recepId',recepId)
	// 	// console.log('inputText user.id',user.id)
	// 	// console.log('inputText comment',inputText)

	// 	// addNewCommentToRecipeMyDB(postId,userIdCommented,comment)

	// 	setLoading(true);
	// 	if (inputText === "") {
	// 		Alert.alert("Comment", "Write a comment");
	// 	} else {
	// 		if (recepId && user?.id && inputText) {
	// 			await addNewCommentToRecipeMyDB({ postId: recepId, userIdCommented: user?.id, comment: inputText });
	// 		}

	// 		setTimeout(() => {
	// 			setLoading(false);
	// 			setCommentsAll([inputText, ...commentsAll]);

	// 			setInputText("");
	// 		}, 1000);

	// 		updateLikeCommentCount("updateCommentsCount");
	// 		await fetchComments();
	// 	}

	// 	// console.log('commentsAll',commentsAll)

	// 	// add comments to the server
	// };

	//
	const addNewComment = async () => {
		setLoading(true);
		if (inputText === "") {
			Alert.alert("Comment", "Write a comment");
		} else {
			if (recepId && user?.id && inputText) {
				const { success, data } = await addNewCommentToRecipeMyDB({
					postId: recepId,
					userIdCommented: user?.id,
					comment: inputText,
				});
				if (success && data) {
					setCommentsAll((prev) => [data[0], ...prev]); // Обновляем состояние с данными из базы
					setInputText("");
				}
			}
			setTimeout(() => {
				setLoading(false);
			}, 1000);
			updateLikeCommentCount("updateCommentsCount");
			await fetchComments(); // Синхронизация с сервером
		}
	};

	//
	const changeText = (value) => {
		setInputText(value);
		// console.log(inputText)
	};

	// delete comment
	const deleteComment = async (commentId) => {
		// console.log('deleteComment commentId', commentId)
		// console.log('deleteComment userIdCommented', userIdCommented)
		// console.log('deleteComment userId', user?.id)
		// console.log('deleteComment publishedId', publishedId)
		// user?.id === comment?.userIdCommented || user?.id === publishedId
		// Alert.alert("Remove comment", "Tu serio voi emilare komment");
		// await deleteCommentByIdToRecipeMyDB(commentId);
		// await fetchComments();
		try {
			// Показать диалог подтверждения
			Alert.alert(
				`${i18n.t("Remove comment")}`,
				`${i18n.t("Are you sure you want to delete this comment?")}`,
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Ok",
						onPress: async () => {
							try {
								// Выполняем удаление комментария
								await deleteCommentByIdToRecipeMyDB(commentId);
								// Перезагружаем список комментариев
								await fetchComments();
								//   Alert.alert("Success", "Comment deleted successfully.");
							} catch (error) {
								console.error("Error deleting comment:", error);
								Alert.alert("Error", "Failed to delete comment. Please try again.");
							}
						},
						style: "destructive",
					},
				],
				{ cancelable: true },
			);
		} catch (error) {
			console.error("Unexpected error in deleteComment:", error);
			Alert.alert("Error", "An unexpected error occurred.");
		}
	};

	// Проверьте, является ли пользователь владельцем поста или автором комментария
	const canDeleteComment = (comment) => {
		// console.log("CommentsComponent canDeleteComment user?.id", user?.id);
		// console.log("CommentsComponent canDeleteComment comment?.userIdCommented", comment?.userIdCommented);
		// console.log("CommentsComponent canDeleteComment publishedId", publishedId);

		return user?.id === comment?.user_id_commented || user?.id === publishedId;
	};

	return (
		<View className="rounded-[10]   ">
			{/*input */}
			{user !== null && (
				<View
					// style={shadowBoxBlack()}
					className="flex-row items-center p-2 rounded-[10] mb-5 bg-black/5 "
				>
					<TextInput
						placeholder={i18n.t("Your comment")}
						placeholderTextColor="gray"
						multiline={true}
						value={inputText}
						onChangeText={(value) => changeText(value)}
						style={[
							{
								fontSize: hp(1.7),
								// backgroundColor: `rgba(${themes[currentTheme].secondaryTextColor}, 1)`,
							},
						]}
						className="flex-1 text-base tracking-wider p-5 mb-1 bg-white rounded-[10]"
					/>
					<TouchableOpacity
						onPress={addNewComment}
						className="bg-white rounded-full p-5 ml-2 к"
						style={{ transform: [{ rotate: "-45deg" }] }}
					>
						{loading ? <ActivityIndicator /> : <PaperAirplaneIcon size={hp(2.5)} color="blue" />}
					</TouchableOpacity>
				</View>
			)}

			{/*    comments*/}
			<View className="gap-y-2">
				{allDataComments !== null ? (
					<>
						{allDataComments?.map((comment, index) => {
							return (
								<View
									key={index}
									className="border-[1px] border-neutral-300 rounded-[20] p-3 bg-black/5 "
								>
									{/*data of comment*/}
									<Text
										style={{
											fontSize: 8,
											marginBottom: 5,
											color: themes[currentTheme]?.secondaryTextColor,
										}}
									>
										{formatDateTime(comment?.created_at)}
									</Text>

									<View className="flex-row gap-x-2">
										{/*avatar*/}
										<View className=" w-[50] overflow-hidden">
											<AvatarCustom
												uri={comment?.avatar}
												style={{
													width: 50,
													height: 50,
													borderRadius: 50,
													// marginTop: wp(1),
													borderWidth: 1,
													borderColor: "gray",
												}}
											/>
											<Text
												style={{
													fontSize: 8,
													maxWidth: 50,
													textAlign: "center",
													color: themes[currentTheme]?.secondaryTextColor,
												}}
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												{comment?.user_name}
											</Text>
										</View>

										{/*comment*/}
										<Text
											style={{
												fontSize: hp(1.7),
												color: themes[currentTheme]?.secondaryTextColor,
											}}
											className="border-[1px] border-neutral-300 flex-1 p-2 rounded-[10]"
										>
											{comment?.comment}
										</Text>
									</View>

									{/*  block like dislike  and remove comment */}
									{user != null && (
										<View className="mt-2 flex-row justify-between items-center">
											{/*  block like dislike   */}
											<View className="flex-row gap-x-10 pl-5">
												{/*<TouchableOpacity>*/}

												{/*    <HandThumbUpIcon size={hp(2.5)} color="green"/>*/}
												{/*</TouchableOpacity>*/}

												{/*<TouchableOpacity>*/}

												{/*    <HandThumbDownIcon size={hp(2.5)} color="red"/>*/}
												{/*</TouchableOpacity>*/}
											</View>

											{/*  block delete comment   */}

											{canDeleteComment(comment) && (
												<View>
													<TouchableOpacity onPress={() => deleteComment(comment?.id)}>
														<TrashIcon size={hp(2.5)} color="red" />
													</TouchableOpacity>
												</View>
											)}
										</View>
									)}

									{/*    block like dislike delete comment*/}
								</View>
							);
						})}
					</>
				) : (
					<View>
						<LoadingComponent />
					</View>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({});

export default CommentsComponent;
