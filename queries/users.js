import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginUserTQ, logoutTQ, signUpUserTQ } from '../service/TQuery/auth'
import { deleteUserTQ, updateUserTQ } from '../service/TQuery/users'

//
export function useLogin() {
  return useMutation({
    mutationFn: loginUserTQ,
  })
}
//
export function useSignUp() {
  return useMutation({ mutationFn: signUpUserTQ })
}

//
export function useLogout() {
  return useMutation({ mutationFn: logoutTQ })
}

//
export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateUserTQ,
    onSuccess: (updatedData) => {
      try {
        const { useAuthStore } = require('../stores/authStore')
        const { setUserData } = useAuthStore.getState()
        if (typeof setUserData === 'function') {
          setUserData(updatedData)
        } else {
          useAuthStore.setState((s) => ({ user: s.user ? { ...s.user, ...updatedData } : s.user }))
        }
      } catch {}
      qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

//
export function useDeleteUser() {
  return useMutation({ mutationFn: deleteUserTQ })
}
