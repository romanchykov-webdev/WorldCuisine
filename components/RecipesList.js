import React, { useState } from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native'
import MasonryList from '@react-native-seoul/masonry-list'
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { HEADER_HEIGHT } from '../constants/constants'
import LoadingComponent from './loadingComponent'
import ButtonBack from './ButtonBack'
import TitleScreen from './TitleScreen'
import { useThemeColors } from '../stores/themeStore'
import RecipePointItemComponent from './RecipesMasonry/AllRecipesPoint/RecipePointItemComponent'
import {
  AdjustmentsVerticalIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  HeartIcon,
  StarIcon,
} from 'react-native-heroicons/mini'
import i18n from '../lang/i18n'
import { shadowBoxBlack, shadowText } from '../constants/shadow'

function RecipesList({
  title,
  data,
  isLoading,
  showEmpty,
  hasNextPage,
  fetchNextPage,
  isFetching,
  isFetchingNextPage,
  isRefetching, // ← приходит из экрана
  refetch,
  langApp,
  contentTopPadding,
  sort,
  setSort,
}) {
  const colors = useThemeColors()

  const [filterOpen, setFilterOpen] = useState(false)

  const refreshing = Boolean(isRefetching || (isFetching && !isFetchingNextPage))

  const topPad = contentTopPadding ?? HEADER_HEIGHT + 24

  // filters
  const applyFilter = (type) => {
    switch (type) {
      case 'newOld':
        setSort({ sortBy: 'created_at', ascending: false })
        break
      case 'oldNew':
        setSort({ sortBy: 'created_at', ascending: true })
        break
      case 'likes':
        setSort({ sortBy: 'likes', ascending: false })
        break
      case 'rating':
        setSort({ sortBy: 'rating', ascending: false })
        break
    }
    setFilterOpen(false)
  }

  const isDisabled = data.length === 0
  // фильтр кнопка в хедере
  const rightAction = (
    <TouchableOpacity
      onPress={() => !isDisabled && setFilterOpen(true)}
      activeOpacity={isDisabled && 1}
      style={[
        styles.filterBtn,
        shadowBoxBlack(),
        isDisabled ? styles.btnDisabled : styles.btnEnabled,
      ]}
    >
      <AdjustmentsVerticalIcon color="gray" size={22} />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* header */}
      <BlurView
        intensity={30}
        tint="dark"
        reducedTransparencyFallbackColor="rgba(0,0,0,0.06)"
        style={styles.headerWrap}
      >
        {/* back */}
        <Animated.View
          entering={FadeInLeft.delay(200).springify().damping(30)}
          style={{ position: 'absolute', top: 3, left: 3, zIndex: 10 }}
        >
          <ButtonBack />
        </Animated.View>

        {/* title */}
        <Animated.View
          entering={FadeInUp.delay(300).springify().damping(30)}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <TitleScreen title={title} />
        </Animated.View>

        {/* optional right action */}
        <Animated.View
          entering={FadeInRight.delay(300).springify().damping(30)}
          style={{ position: 'absolute', top: 3, right: 3, zIndex: 10 }}
        >
          {rightAction}
        </Animated.View>
      </BlurView>
      {/* оверлей под хедером во время refresh */}
      {refreshing && !isFetchingNextPage && (
        <View style={[styles.refreshOverlay, { top: topPad }]}>
          <ActivityIndicator size="large" color="green" />
        </View>
      )}

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
            contentContainerStyle={{
              paddingTop: contentTopPadding ?? HEADER_HEIGHT + 14,
            }}
            renderItem={({ item, i }) => (
              <RecipePointItemComponent item={item} index={i} langApp={langApp} />
            )}
            onEndReachedThreshold={0.2}
            onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
            ListFooterComponent={
              isFetchingNextPage ? <LoadingComponent color="green" /> : null
            }
            refreshing={refreshing}
            onRefresh={refetch}
            alwaysBounceVertical
            bounces
            overScrollMode="always"
          />
        </View>
      )}
      {/* Filter modal */}
      <Modal
        animationType="fade"
        transparent
        visible={filterOpen}
        onRequestClose={() => setFilterOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterOpen(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.backgroundColor }]}
            >
              <View style={{ gap: 12 }}>
                <FilterItem
                  active={sort.sortBy === 'created_at' && !sort.ascending}
                  onPress={() => applyFilter('newOld')}
                  icon={<ArrowDownIcon size={20} color="green" />}
                  text={i18n.t('From newest to oldest')}
                  colors={colors}
                />
                <FilterItem
                  active={sort.sortBy === 'created_at' && sort.ascending}
                  onPress={() => applyFilter('oldNew')}
                  icon={<ArrowUpIcon size={20} color="blue" />}
                  text={i18n.t('From old to new')}
                  colors={colors}
                />
                <FilterItem
                  active={sort.sortBy === 'likes'}
                  onPress={() => applyFilter('likes')}
                  icon={<HeartIcon size={20} color="red" />}
                  text={i18n.t('Popular')}
                  colors={colors}
                />
                <FilterItem
                  active={sort.sortBy === 'rating'}
                  onPress={() => applyFilter('rating')}
                  icon={<StarIcon size={20} color="gold" />}
                  text={i18n.t('High rating')}
                  colors={colors}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}
function FilterItem({ active, onPress, icon, text, colors }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.itemFilter, active && styles.itemFilterActive]}
    >
      <Text
        style={[
          shadowText({ offset: { width: 1, height: 1 }, radius: 1 }),
          { flex: 1, color: colors.textColor },
        ]}
      >
        {text}
      </Text>
      {icon}
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    height: HEADER_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  listWrap: { flex: 1 },
  // TOP overlay для refresh
  refreshOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 32,
    zIndex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  refreshText: { color: '#fff', fontSize: 12 },
  //   filter
  filterBtn: {
    height: 50,
    width: 50,
    borderRadius: 40,
    borderWidth: 0.2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
    // backgroundColor: 'red',
  },
  btnEnabled: { backgroundColor: 'white' },
  btnDisabled: {
    backgroundColor: 'rgba(113,113,113,0.9)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  itemFilter: {
    padding: 12,
    borderWidth: 0.2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemFilterActive: {
    backgroundColor: 'gold',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
})

export default RecipesList
