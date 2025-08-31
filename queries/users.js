import { useMutation } from '@tanstack/react-query'
import { loginUserTQ, signUpUserTQ } from '../service/auth/auth'

export function useLogin() {
  return useMutation({
    mutationFn: loginUserTQ,
  })
}

export function useSignUp() {
  return useMutation({ mutationFn: signUpUserTQ })
}
