import { useMutation } from '@tanstack/react-query'
import { loginUserTQ, logoutTQ, signUpUserTQ } from '../service/TQuery/auth'

export function useLogin() {
  return useMutation({
    mutationFn: loginUserTQ,
  })
}

export function useSignUp() {
  return useMutation({ mutationFn: signUpUserTQ })
}

export function useLogout() {
  return useMutation({ mutationFn: logoutTQ })
}
