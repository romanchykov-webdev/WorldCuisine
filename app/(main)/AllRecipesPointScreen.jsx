import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { BlurView } from 'expo-blur'

import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated'
import {
  AdjustmentsVerticalIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  HeartIcon,
  StarIcon,
} from 'react-native-heroicons/mini'

import ButtonBack from '../../components/ButtonBack'
import LoadingComponent from '../../components/loadingComponent'
import RecipePointItemComponent from '../../components/RecipesMasonry/AllRecipesPoint/RecipePointItemComponent'
import TitleScreen from '../../components/TitleScreen'
import { shadowBoxBlack, shadowText } from '../../constants/shadow'
import i18n from '../../lang/i18n'
import { useThemeStore, useThemeColors } from '../../stores/themeStore'
import { useLangStore } from '../../stores/langStore'
import { useRecipesByPointInfinite } from '../../queries/recipes'

import MasonryList from '@react-native-seoul/masonry-list'
import { HEADER_HEIGHT } from '../../constants/constants'
import WrapperComponent from '../../components/WrapperComponent'

function AllRecipesPointScreen() {
  const { point } = useLocalSearchParams()
  const colors = useThemeColors()
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const langApp = useLangStore((s) => s.lang)
  const [filterOpen, setFilterOpen] = useState(false)

  // сорт по умолчанию — новые сверху
  const [sort, setSort] = React.useState({ sortBy: 'created_at', ascending: false })

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useRecipesByPointInfinite(String(point), sort)

  const pages = data?.pages ?? []
  const items = React.useMemo(() => pages.flat(), [pages])

  // индикаторы
  const showLoading = isLoading || (isFetching && items.length === 0)
  const showEmpty = !showLoading && items.length === 0

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

  return (
    <WrapperComponent scroll={false} marginTopAnd={10}>
      <View style={styles.container}>
        {/* header */}
        <BlurView
          intensity={30}
          tint="dark"
          reducedTransparencyFallbackColor="rgba(0,0,0,0.06)"
          style={[styles.headerWrap]}
        >
          <Animated.View entering={FadeInLeft.delay(200).springify().damping(30)}>
            <ButtonBack />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).springify().damping(30)}>
            <TitleScreen title={i18n.t('Recipes')} />
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(400).springify().damping(30)}>
            {items.length > 0 && (
              <TouchableOpacity
                onPress={() => setFilterOpen(true)}
                style={[styles.filterBtn, shadowBoxBlack()]}
              >
                <AdjustmentsVerticalIcon color="grey" size={22} />
              </TouchableOpacity>
            )}
          </Animated.View>
        </BlurView>

        {/* content */}
        {showLoading ? (
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
              data={items}
              keyExtractor={(item) => String(item.id)}
              numColumns={2}
              contentContainerStyle={{ paddingTop: 70 }}
              renderItem={({ item, i }) => (
                <RecipePointItemComponent item={item} index={i} langApp={langApp} />
              )}
              onEndReachedThreshold={0.2}
              onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
              ListFooterComponent={
                isFetchingNextPage ? <LoadingComponent color="green" /> : null
              }
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={() => {
                refetch()
              }}
            />
          </View>
        )}
      </View>

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
                  theme={currentTheme}
                />
                <FilterItem
                  active={sort.sortBy === 'created_at' && sort.ascending}
                  onPress={() => applyFilter('oldNew')}
                  icon={<ArrowUpIcon size={20} color="blue" />}
                  text={i18n.t('From old to new')}
                  theme={currentTheme}
                />
                <FilterItem
                  active={sort.sortBy === 'likes'}
                  onPress={() => applyFilter('likes')}
                  icon={<HeartIcon size={20} color="red" />}
                  text={i18n.t('Popular')}
                  theme={currentTheme}
                />
                <FilterItem
                  active={sort.sortBy === 'rating'}
                  onPress={() => applyFilter('rating')}
                  icon={<StarIcon size={20} color="gold" />}
                  text={i18n.t('High rating')}
                  theme={currentTheme}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </WrapperComponent>
  )
}

function FilterItem({ active, onPress, icon, text, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.itemFilter, active && styles.itemFilterActive]}
    >
      <Text
        style={[shadowText({ offset: { width: 1, height: 1 }, radius: 1 }), { flex: 1 }]}
      >
        {text}
      </Text>
      {icon}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  // СТЕКЛЯННЫЙ ХЕДЕР
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
    justifyContent: 'space-between',

    // Полупрозрачность + скругление
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  filterBtn: {
    height: 50,
    width: 50,
    borderRadius: 40,
    borderWidth: 0.2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  listWrap: {
    flex: 1,
    // paddingTop: HEADER_HEIGHT + 8,
  },

  masonryContent: {
    // paddingBottom: 120,
  },

  // Модалка-фильтр
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

export default AllRecipesPointScreen
