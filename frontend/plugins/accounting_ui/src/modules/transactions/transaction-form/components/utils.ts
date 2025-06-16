import { nanoid } from 'nanoid';
export const getTempId = () => {
  return nanoid()
}

export const getTrSide = (mainSide?: 'dt' | 'ct' | string, isInverse?: boolean) => {
  if (isInverse) {
    if (mainSide === 'dt') {
      return 'ct'
    }
    return 'dt'
  }

  return mainSide || 'dt';
}
