// app/(main)/AllRecipesPointScreen.jsx
import { useLocalSearchParams } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native'
import MasonryList from '@react-native-seoul/masonry-list'
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated'
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
import WrapperComponent from '../../components/WrapperComponent'
import { shadowBoxBlack, shadowText } from '../../constants/shadow'
import i18n from '../../lang/i18n'
import { useThemeStore, useThemeColors } from '../../stores/themeStore'
import { useLangStore } from '../../stores/langStore'
import { useRecipesByPointInfinite } from '../../queries/recipes'

function AllRecipesPointScreen() {
  const { point } = useLocalSearchParams()
  const colors = useThemeColors()
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const langApp = useLangStore((s) => s.lang)

  // сортировки (одно активно)
  const [sort, setSort] = useState({ sortBy: 'created_at', ascending: false })
  const [filterOpen, setFilterOpen] = useState(false)

  // колонки адаптивно (без window.innerWidth)
  const { width } = useWindowDimensions()
  const numColumns = width >= 900 ? 3 : 2

  // TQuery infinite
  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useRecipesByPointInfinite(point, sort, /*pageSize*/ 20)

  const flat = useMemo(() => (data?.pages || []).flat(), [data])

  // helpers UI
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

  const onEnd = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }

  return (
    <WrapperComponent>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.headerWrap}>
          <Animated.View
            entering={FadeInLeft.delay(300).springify().damping(30)}
            className="absolute left-0"
            style={shadowBoxBlack()}
          >
            <ButtonBack />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).springify().damping(30)}>
            <TitleScreen title={i18n.t('Recipes')} />
          </Animated.View>

          <Animated.View
            className="absolute right-0"
            entering={FadeInRight.delay(700).springify().damping(30)}
          >
            <TouchableOpacity
              onPress={() => setFilterOpen(true)}
              style={[
                {
                  height: 50,
                  width: 50,
                  borderWidth: 0.2,
                  borderColor: 'black',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                },
                shadowBoxBlack(),
              ]}
            >
              <AdjustmentsVerticalIcon color="grey" size={30} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* content */}
        {isLoading ? (
          <LoadingComponent size="large" color="green" />
        ) : flat.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Text style={{ textAlign: 'center', color: colors.textColor, fontSize: 18 }}>
              {i18n.t('There are no recipes yet')}
            </Text>
          </Animated.View>
        ) : (
          <MasonryList
            data={flat}
            keyExtractor={(item) => String(item.id)}
            numColumns={numColumns}
            contentContainerStyle={styles.masonry}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, i }) => (
              <RecipePointItemComponent item={item} index={i} langApp={langApp} />
            )}
            onEndReached={onEnd}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={styles.footer}>
                  <LoadingComponent color="green" />
                </View>
              ) : null
            }
            refreshing={isFetching && !isFetchingNextPage}
            onRefresh={refetch}
          />
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
            <View style={[styles.modalContent, { backgroundColor: colors.backgroundColor }]}>
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
      <Text style={[shadowText({ offset: { width: 1, height: 1 }, radius: 1 }), { flex: 1 }]}>
        {text}
      </Text>
      {icon}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 30,
  },
  headerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 56,
  },
  masonry: {
    paddingBottom: 50,
  },
  footer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
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
