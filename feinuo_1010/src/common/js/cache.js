import storage from 'good-storage'

export function loadUid() {
  return storage.get('user_id', '')
}
export function loadIMEI() {
  return storage.get('imei', '')
}
export function saveUid(uid) {
  storage.set('user_id', uid)
  return storage.get('user_id', '')
}
export function saveIMEI(id) {
  storage.set('imei', id)
  return storage.get('imei', '')
}