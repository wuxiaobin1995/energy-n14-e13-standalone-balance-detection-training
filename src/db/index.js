/*
 * @Author      : Mr.bin
 * @Date        : 2021-09-13 17:13:27
 * @LastEditTime: 2022-03-05 19:11:51
 * @Description : Dexie
 */
import Dexie from 'dexie'

export function initDB() {
  const db = new Dexie('Energy_N14_E13_Standalone_Balance_Detection_Training') // 与项目名保持一致
  db.version(1).stores({
    user: 'userId,userName',
    test_data:
      '++,userId,pdfTime,type,[userId+type],[userId+pdfTime],[userId+pdfTime+type]',
    train_data:
      '++,userId,pdfTime,type,[userId+type],[userId+pdfTime],[userId+pdfTime+type]'
  })
  return db
}
