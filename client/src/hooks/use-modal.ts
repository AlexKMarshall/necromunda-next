import { useState } from 'react'
import { useId } from 'react-aria'

export function useModal(initialIsOpen = false) {
  const [showModal, setShowModal] = useState(initialIsOpen)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  const titleId = useId()
  const getTitleProps = () => ({ id: titleId })

  const getDialogProps = () => ({
    isOpen: showModal,
    onDismiss: closeModal,
    'aria-labelledby': titleId,
  })

  return { showModal, openModal, closeModal, getTitleProps, getDialogProps }
}
