import { atom } from 'jotai'

export const posFormStateAtom = atom<Record<string, any>>({
  overview: {},
  properties: {},
  payments: {},
  slot: {},
  permission: {},
  product: {},
  appearance: {},
  screen: {},
  ebarimt: {},
  finance: {},
  delivery: {},
  sync: {}
})