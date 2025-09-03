import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
import { shadowBoxBlack, shadowText } from '../../constants/shadow'
import i18n from '../../lang/i18n'
import { useThemeStore, useThemeColors } from '../../stores/themeStore'
import { useLangStore } from '../../stores/langStore'
import { useRecipesByPointInfinite } from '../../queries/recipes'
import { StatusBar } from 'expo-status-bar'
import { createTheme } from '@rneui/themed'
import colors from 'tailwindcss/colors'

function AllRecipesPointScreen() {
  const { point } = useLocalSearchParams()
  const colors = useThemeColors()
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const langApp = useLangStore((s) => s.lang)
  const [filterOpen, setFilterOpen] = useState(false)

  // сорт по умолчанию — новые сверху
  const [sort, setSort] = React.useState({ sortBy: 'created_at', ascending: false })
  const PAGE_SIZE = 6

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useRecipesByPointInfinite(String(point), sort, PAGE_SIZE)

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
    <View
      style={{
        flex: 1,
        backgroundColor: colors.backgroundColor,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 10 : 120,
        marginBottom: 20,
        marginTop: Platform.OS === 'ios' ? 10 : 60,
      }}
    >
      <StatusBar style={currentTheme === 'light' ? 'dark' : 'light'} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* header */}
          <View
            style={[
              styles.headerWrap,
              shadowBoxBlack(),
              { backgroundColor: colors.backgroundColor },
            ]}
          >
            <Animated.View
              entering={FadeInLeft.delay(300).springify().damping(30)}
              // className="absolute left-0"
              // style={shadowBoxBlack()}
            >
              <ButtonBack />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500).springify().damping(30)}>
              <TitleScreen title={i18n.t('Recipes')} />
            </Animated.View>

            <Animated.View
              // className="absolute right-0"
              entering={FadeInRight.delay(700).springify().damping(30)}
            >
              {items.length > 0 ? (
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
              ) : null}
            </Animated.View>
          </View>

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
            <View style={styles.screen}>
              <FlatList
                data={items}
                keyExtractor={(item) => String(item.id)}
                numColumns={2}
                columnWrapperStyle={{ gap: 8, paddingTop: 56 }}
                contentContainerStyle={{ padding: 8, paddingBottom: 120 }}
                renderItem={({ item, index }) => (
                  <View style={{ flex: 1, marginBottom: 8 }}>
                    <RecipePointItemComponent item={item} index={index} langApp={langApp} />
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.6}
                onEndReached={() => {
                  if (hasNextPage && !isFetchingNextPage) fetchNextPage()
                }}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <View style={{ paddingVertical: 16 }}>
                      <LoadingComponent color="green" />
                    </View>
                  ) : null
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
      </SafeAreaView>
    </View>
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
    position: 'relative',
  },
  headerWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 16,
    height: 56,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    opacity: 0.9,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // overflow: 'hidden',
    paddingHorizontal: 2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
  //
  screen: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 30,
    // backgroundColor: 'red',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', opacity: 0.6, fontSize: 16, marginTop: 24 },
  reloadBtn: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  reloadText: { fontSize: 14 },
})

export default AllRecipesPointScreen
