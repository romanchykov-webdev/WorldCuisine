import React from 'react'
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { PlusIcon } from 'react-native-heroicons/mini'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import i18n from '../../lang/i18n'

export default function AddLangComponent({
  colors,
  languages,
  selectedNames,
  devLangCode,
  modalVisible,
  setModalVisible,
  onSelect,
}) {
  const filtered = React.useMemo(() => {
    return (languages || [])
      .filter(
        (l) => l?.code && l.code.toLowerCase() !== (devLangCode || '').toLowerCase(),
      )
      .filter((l) =>
        selectedNames?.every((n) => n?.toLowerCase() !== l.name?.toLowerCase()),
      )
  }, [languages, selectedNames, devLangCode])

  return (
    <View>
      <TouchableOpacity
        className="w-[100%]"
        onPress={() => setModalVisible(true)}
        style={{ borderRadius: 15, overflow: 'hidden' }}
      >
        <ButtonSmallCustom
          icon={PlusIcon}
          w="100%"
          h={60}
          bg="green"
          title={i18n.t('Add translation language')}
          buttonText
          styleWrapperButton={{ borderRadius: 15 }}
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.backgroundColor }]}
            >
              <Text style={[styles.modalTitle, { color: colors.textColor }]}>
                {i18n.t('Select Language')}
              </Text>

              <FlatList
                data={filtered}
                keyExtractor={(item) => item.code}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => onSelect?.(item)}
                    style={[
                      styles.langOption,
                      index === filtered.length - 1 && {
                        borderBottomColor: 'transparent',
                      },
                    ]}
                  >
                    <Text style={[styles.langText, { color: colors.textColor }]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  langOption: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  langText: { fontSize: 16 },
  cancelButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelText: { color: '#fff', fontSize: 16 },
})
