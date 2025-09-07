import React, { memo } from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { shadowBoxBlack } from '../constants/shadow'

function ModalClearCustom({
  colors,
  isModalVisible,
  animationType = 'fade',
  handleSave,
  closeModal,
  titleHeader,
  titleHeaderVisible = true,
  buttonVisible = true,
  textButton,
  childrenSubheader,
  children,
  fullWidth = false,
}) {
  return (
    <Modal
      animationType={animationType}
      transparent
      visible={isModalVisible}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                fullWidth && { width: '98%' },
                { backgroundColor: colors?.backgroundColor },
              ]}
            >
              {titleHeaderVisible && (
                <Text style={[styles.modalTitle, { color: colors?.textColor }]}>
                  {titleHeader}
                </Text>
              )}

              {childrenSubheader}

              <View style={{ flexShrink: 1 }}>{children}</View>

              {buttonVisible && (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={[styles.actionBtn, shadowBoxBlack()]}
                    onPress={handleSave}
                  >
                    <Text style={styles.actionText}>{textButton}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  actionBtn: {
    marginTop: 15,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  actionText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
})

export default memo(ModalClearCustom)
