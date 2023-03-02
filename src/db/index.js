/*
 * @Author      : Mr.bin
 * @Date        : 2021-09-13 17:13:27
 * @LastEditTime: 2023-03-02 10:39:30
 * @Description : Dexie
 */
import Dexie from 'dexie'

export function initDB() {
  const db = new Dexie('Energy_N14_E13_Standalone_Balance_Detection_Training') // 与项目名保持一致
  db.version(2).stores({
    user: 'userId,userName',
    test_data:
      '++,userId,pdfTime,type,[userId+type],[userId+pdfTime],[userId+type+pdfTime]',
    train_data:
      '++,userId,pdfTime,type,[userId+type],[userId+pdfTime],[userId+type+pdfTime]'
  })
  return db
}
