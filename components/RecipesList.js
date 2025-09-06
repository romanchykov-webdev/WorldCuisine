import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MasonryList from '@react-native-seoul/masonry-list'
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { HEADER_HEIGHT } from '../constants/constants'
import LoadingComponent from './loadingComponent'
import ButtonBack from './ButtonBack'
import TitleScreen from './TitleScreen'
import { useThemeColors } from '../stores/themeStore'
import RecipePointItemComponent from './RecipesMasonry/AllRecipesPoint/RecipePointItemComponent'

function RecipesList({
  title,
  data,
  isLoading,
  showEmpty,
  hasNextPage,
  fetchNextPage,
  isFetching,
  isFetchingNextPage,
  refetch,
  langApp,
}) {
  const colors = useThemeColors()

  return (
    <View style={styles.container}>
      {/* header */}
      <BlurView
        intensity={30}
        tint="dark"
        reducedTransparencyFallbackColor="rgba(0,0,0,0.06)"
        style={styles.headerWrap}
      >
        <Animated.View
          entering={FadeInLeft.delay(200).springify().damping(30)}
          style={{ position: 'absolute', left: 2, zIndex: 10 }}
        >
          <ButtonBack />
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(300).springify().damping(30)}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <TitleScreen title={title} />
        </Animated.View>
      </BlurView>

      {/* content */}
      {isLoading ? (
        <LoadingComponent size="large" color="green" />
      ) : showEmpty ? (
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.textColor,
              fontSize: 18,
              paddingTop: 100,
            }}
          >
            There are no recipes yet
          </Text>
        </Animated.View>
      ) : (
        <View style={styles.listWrap}>
          <MasonryList
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 14 }}
            renderItem={({ item, i }) => (
              <RecipePointItemComponent item={item} index={i} langApp={langApp} />
            )}
            onEndReachedThreshold={0.2}
            onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
            ListFooterComponent={
              isFetchingNextPage ? <LoadingComponent color="green" /> : null
            }
            refreshing={isFetching && !isFetchingNextPage}
            onRefresh={refetch}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    height: HEADER_HEIGHT,
    width: '100%',
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  listWrap: {
    flex: 1,
  },
})

export default RecipesList
