import { useEffect, useState } from 'react'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MapPinIcon, TrashIcon } from 'react-native-heroicons/mini'
import MapView, { Marker } from 'react-native-maps'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { shadowBoxBlack } from '../../constants/shadow'
import i18n from '../../lang/i18n'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import TitleDescriptionComponent from './TitleDescriptionComponent'

/** Сборка обычной карты-ссылки из координат */
const coordsToLink = ({ latitude, longitude }) =>
  `https://www.google.com/maps?q=${latitude},${longitude}`

/** Пытаемся вытащить lat/lng из популярных вариаций ссылок Google Maps */
async function extractCoordsFromUrl(url) {
  try {
    // 1) ?q=lat,lng
    const qMatch = url.match(/[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i)
    if (qMatch) return { latitude: Number(qMatch[1]), longitude: Number(qMatch[2]) }

    // 2) .../@lat,lng,zoom
    const atMatch = url.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:,|$)/)
    if (atMatch) return { latitude: Number(atMatch[1]), longitude: Number(atMatch[2]) }

    // 3) короткая maps.app.goo.gl — пытаемся получить финальный URL после редиректа
    if (/maps\.app\.goo\.gl/i.test(url)) {
      const res = await fetch(url, { method: 'GET' })
      if (res?.url && res.url !== url) {
        return await extractCoordsFromUrl(res.url)
      }
    }
  } catch {}
  return null
}

function AddPointGoogleMaps({
  setTotalRecipe,
  refactorRecipescrean = false,
  mapCoordinatesLinksForUpdate,
  updateCoordinates, // оставим для совместимости (будет получать coords или null)
}) {
  const [marker, setMarker] = useState(null) // { latitude, longitude } | null
  const [mapVisible, setMapVisible] = useState(false)
  const [mapLink, setMapLink] = useState(mapCoordinatesLinksForUpdate || '') // ССЫЛКА, которую поднимем наверх

  // Инициализация из ссылки (редактирование)
  useEffect(() => {
    ;(async () => {
      if (
        refactorRecipescrean &&
        typeof mapCoordinatesLinksForUpdate === 'string' &&
        mapCoordinatesLinksForUpdate.length > 0
      ) {
        setMapLink(mapCoordinatesLinksForUpdate)
        const parsed = await extractCoordsFromUrl(mapCoordinatesLinksForUpdate)
        if (parsed) setMarker(parsed)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Клик по карте — ставим маркер и сразу создаём ссылку
  const handleMapPress = (event) => {
    const coords = event.nativeEvent.coordinate
    setMarker(coords)
    setMapLink(coordsToLink(coords)) // формируем нормальную карту-ссылку
  }

  // Открыть внешние карты
  const openMap = () => {
    if (mapLink) {
      Linking.openURL(mapLink)
    } else if (marker) {
      Linking.openURL(coordsToLink(marker))
    }
  }

  // Поднимаем наверх только map_coordinates (строка). Для обратной совместимости кидаем и coords в коллбек.
  useEffect(() => {
    setTotalRecipe((prev) => ({
      ...prev,
      map_coordinates: mapLink || null,
    }))
    if (refactorRecipescrean && typeof updateCoordinates === 'function') {
      updateCoordinates(marker) // если нужно, родитель может сохранить ещё и coords
    }
  }, [mapLink, marker, refactorRecipescrean, setTotalRecipe, updateCoordinates])

  const initialRegion = marker
    ? {
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : { latitude: 48.8566, longitude: 2.3522, latitudeDelta: 10, longitudeDelta: 10 }

  return (
    <View className="mb-5">
      {(marker || mapLink) && (
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="flex-row items-center justify-between mb-3"
        >
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={openMap}>
              <MapPinIcon size={50} color="blue" />
            </TouchableOpacity>
            <Text>{i18n.t('There is a store here')}</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setMarker(null)
              setMapLink('') // очищаем ссылку
            }}
          >
            <ButtonSmallCustom tupeButton="remove" icon={TrashIcon} w={60} h={60} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <TitleDescriptionComponent
        titleText={i18n.t('If you have a store')}
        titleVisual
        descriptionVisual
        descriptionText={i18n.t('You can add it to the map, and customers can find it')}
      />

      <TouchableOpacity style={shadowBoxBlack()} onPress={() => setMapVisible((v) => !v)}>
        <ButtonSmallCustom
          tupeButton="add"
          h={60}
          w="100%"
          title={
            mapVisible
              ? `${i18n.t('Hide')} ${i18n.t('the map')}`
              : `${i18n.t('Open')} ${i18n.t('the map')}`
          }
          buttonText
        />
      </TouchableOpacity>

      {mapVisible && (
        <MapView
          style={styles.map}
          mapType="hybrid"
          initialRegion={initialRegion}
          onPress={handleMapPress}
        >
          {marker && <Marker coordinate={marker} title={i18n.t('Selected point')} />}
        </MapView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
    marginTop: 10,
    borderRadius: 10,
  },
})

export default AddPointGoogleMaps
