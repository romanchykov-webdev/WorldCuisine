import { useEffect, useState } from 'react'

/**
 * Дебаунсит значение с заданной задержкой.
 * @param {*} value - любое значение (строка, число, объект).
 * @param {number} delay - задержка в мс.
 * @param {boolean} [leading=false] - если true, вернёт значение сразу, а потом уже будет ждать задержку.
 */
export function useDebounce(value, delay = 500, leading = false) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if (leading && debouncedValue === value) return // уже выдали сразу

    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
