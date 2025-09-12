import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { PaperAirplaneIcon, TrashIcon } from 'react-native-heroicons/mini'
import { formatDateTime } from '../../constants/halperFunctions'
import { hp } from '../../constants/responsiveScreen'
import i18n from '../../lang/i18n'
import AvatarCustom from '../AvatarCustom'
import LoadingComponent from '../loadingComponent'

// zustand
import { useAuthStore } from '../../stores/authStore'

// react-query hooks
import { useComments, useAddComment, useDeleteComment } from '../../queries/comments'
import { truncateText } from '../../utils/truncateText'

function CommentsComponent({ recepId, updateLikeCommentCount, publishedId, colors }) {
  const user = useAuthStore((s) => s.user)
  const [inputText, setInputText] = useState('')

  const { data: comments, isLoading, isFetching } = useComments(recepId)
  const addMutation = useAddComment(recepId, user, {
    onServerCountBump: updateLikeCommentCount,
  })
  const delMutation = useDeleteComment(recepId)

  const canDeleteComment = (comment) =>
    user?.id === comment?.user_id_commented || user?.id === publishedId

  const onSend = () => {
    const text = inputText.trim()
    if (!text) {
      Alert.alert(i18n.t('Comment'), i18n.t('Write a comment'))
      return
    }
    if (!user?.id) {
      Alert.alert(i18n.t('Error'), i18n.t('Please sign in to comment'))
      return
    }
    addMutation.mutate({ text })
    setInputText('')
  }

  const onDelete = (id) => {
    Alert.alert(
      i18n.t('Remove comment'),
      i18n.t('Are you sure you want to delete this comment?'),
      [
        { text: i18n.t('Cancel'), style: 'cancel' },
        {
          text: 'Ok',
          style: 'destructive',
          onPress: () => delMutation.mutate(id),
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <View className="rounded-[10]   ">
      {/* input */}
      {user !== null && (
        <View
          // style={shadowBoxBlack()}
          className="flex-row items-center p-2 rounded-[10] mb-5 bg-black/5 "
        >
          <TextInput
            placeholder={i18n.t('Your comment')}
            placeholderTextColor="gray"
            multiline={true}
            value={inputText}
            onChangeText={setInputText}
            style={[
              {
                fontSize: hp(1.7),
              },
            ]}
            className="flex-1 text-base tracking-wider p-5 mb-1 bg-white rounded-[10]"
          />
          <TouchableOpacity
            onPress={onSend}
            className="bg-white rounded-full p-5 ml-2 к"
            style={{ transform: [{ rotate: '-45deg' }] }}
          >
            {addMutation.isPending ? (
              <ActivityIndicator />
            ) : (
              <PaperAirplaneIcon size={hp(2.5)} color="blue" />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/*    comments list*/}
      <View className="gap-y-2">
        {isLoading ? (
          <LoadingComponent />
        ) : (
          (comments || []).map((comment) => (
            <View
              key={comment.id}
              className="border-[1px] border-neutral-300 rounded-[20] p-3 bg-black/5 "
            >
              {/* data of comment */}
              <Text
                style={{
                  fontSize: 8,
                  marginBottom: 5,
                  color: colors?.secondaryTextColor,
                }}
              >
                {formatDateTime(comment?.created_at)}
              </Text>

              <View className="flex-row gap-x-2">
                {/* avatar */}
                <View className=" w-[50] overflow-hidden">
                  <AvatarCustom
                    uri={comment?.user?.avatar}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      // marginTop: wp(1),
                      borderWidth: 1,
                      borderColor: 'gray',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 8,
                      maxWidth: 50,
                      textAlign: 'center',
                      color: colors?.secondaryTextColor,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {truncateText(comment?.user?.user_name, 7, true)}
                    {/*{comment?.user?.user_name || '—'}*/}
                  </Text>
                </View>

                {/* comment */}
                <Text
                  style={{
                    fontSize: hp(1.7),
                    color: colors?.secondaryTextColor,
                  }}
                  className="border-[1px] border-neutral-300 flex-1 p-2 rounded-[10]"
                >
                  {comment?.comment}
                </Text>
              </View>

              {/*   remove comment */}
              {/* actions */}
              {user && canDeleteComment(comment) && (
                <View className="mt-2 flex-row justify-end">
                  <TouchableOpacity
                    onPress={() => onDelete(comment.id)}
                    disabled={delMutation.isPending}
                  >
                    <TrashIcon size={hp(2.5)} color="red" />
                  </TouchableOpacity>
                </View>
              )}

              {/*    block like dislike delete comment */}
            </View>
          ))
        )}
      </View>
    </View>
  )
}

export default CommentsComponent
