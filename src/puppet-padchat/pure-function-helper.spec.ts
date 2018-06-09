#!/usr/bin/env ts-node

// tslint:disable:max-line-length
// tslint:disable:no-shadowed-variable

import test  from 'blue-tape'

import {
  PadchatPureFunctionHelper as pfHelper,
}                                         from './pure-function-helper'

import {
  PadchatContactMsgType,
  PadchatContinue,
  PadchatContactPayload,
  PadchatContactRoomStatus,

  PadchatMessagePayload,
}                                         from './padchat-schemas'

import {
  ContactGender,
  ContactType,
  ContactPayload,
  FriendRequestPayload,
  FriendRequestType,
  // MessagePayload,
}                                         from '../puppet/'

test('isRoomId()', async t => {
  const ROOM_ID     = 'xxx@chatroom'
  const NOT_ROOM_ID = 'xxxxxxx'

  t.ok(pfHelper.isRoomId(ROOM_ID), 'should return true for ROOM_ID')
  t.notOk(pfHelper.isRoomId(NOT_ROOM_ID), 'should return false for ROOM_ID')
  t.throws(() => pfHelper.isRoomId(undefined), 'should throw exception for undifined')
  t.doesNotThrow(() => pfHelper.isRoomId('test'), 'should not throw for string')
})

test('isContactId()', async t => {
  const CONTACT_ID     = 'sxxfdsa'
  const NOT_CONTACT_ID = 'fdsafasd@chatroom'

  t.ok(pfHelper.isContactId(CONTACT_ID), 'should return true for CONTACT_ID')
  t.notOk(pfHelper.isContactId(NOT_CONTACT_ID), 'should return false for CONTACT_ID')
  t.throws(() => pfHelper.isContactId(undefined), 'should throw exception for undifined')
  t.doesNotThrow(() => pfHelper.isContactId('test'), 'should not throw for string')
})

test('isContactOfficialId()', async t => {
  const OFFICIAL_CONTACT_ID     = 'gh_sxxfdsa'
  const NOT_OFFICIAL_CONTACT_ID = 'fdsafasd@chatroom'

  t.ok(pfHelper.isContactOfficialId(OFFICIAL_CONTACT_ID), 'should return true for OFFICIAL_CONTACT_ID')
  t.notOk(pfHelper.isContactOfficialId(NOT_OFFICIAL_CONTACT_ID), 'should return false for NOT_OFFICIAL_CONTACT_ID')
  t.throws(() => pfHelper.isContactOfficialId(undefined), 'should throw exception for undifined')
  t.doesNotThrow(() => pfHelper.isContactOfficialId('test'), 'should not throw for string')
})

test('isStrangerV1()', async t => {
  const STRANGER_V1     = 'v1_999999'
  const NOT_STRANGER_V1 = '9999991'

  t.equal(pfHelper.isStrangerV1(STRANGER_V1),      true,   'should return true for STRANGER_V1')
  t.equal(pfHelper.isStrangerV1(NOT_STRANGER_V1),  false,  'should return false for NOT_STRANGER_V1')
})

test('isStrangerV2()', async t => {
  const STRANGER_V2     = 'v2_999999'
  const NOT_STRANGER_V2 = '999999v2'

  t.equal(pfHelper.isStrangerV2(STRANGER_V2),     true, 'should return true for STRANGER_V2')
  t.equal(pfHelper.isStrangerV2(NOT_STRANGER_V2), false, 'should return false for NOT_STRANGER_V2')
})

test('contactRawPayloadParser', async t => {
  const PADCHAT_CONTACT_PAYLOAD_PERSONAL: PadchatContactPayload = {
    msg_type          : PadchatContactMsgType.Contact,
    continue          : PadchatContinue.Done,
    ticket            : '',
    big_head          : 'http://wx.qlogo.cn/mmhead/ver_1/xfCMmibHH74xGLoyeDFJadrZXX3eOEznPefiaCa3iczxZGMwPtDuSbRQKx3Xdm18un303mf0NFia3USY2nO2VEYILw/0',
    city              : 'Haidian',
    country           : 'CN',
    intro             : '',
    label             : '1',
    nick_name         : '梦君君',
    provincia         : 'Beijing',
    py_initial        : 'LJR',
    remark            : '女儿',
    remark_py_initial : 'lijiaruibeizhu',
    remark_quan_pin   : 'LJRBZ',
    sex               : ContactGender.Female,
    signature         : 'Stay+Foolish',
    small_head        : 'http://wx.qlogo.cn/mmhead/ver_1/xfCMmibHH74xGLoyeDFJadrZXX3eOEznPefiaCa3iczxZGMwPtDuSbRQKx3Xdm18un303mf0NFia3USY2nO2VEYILw/132',
    status            : PadchatContactRoomStatus.Get,
    stranger          : 'v1_0468f2cd3f0efe7ca2589d57c3f9ba952a3789e41b6e78ee00ed53d1e6096b88@stranger',
    user_name         : 'mengjunjun001',
  }

  const PADCHAT_CONTACT_PAYLOAD_OFFICIAL: PadchatContactPayload = {
    big_head          : 'http://wx.qlogo.cn/mmhead/ver_1/TR8EDh3MgMsu20pxjrDPBpaGySuEAGf3MUuoeUOV2LiaqvZxeMqb1U7hgiciaQZBC8LYN0boVLCKOIYg71pxdl1fQabiaxsn7CnNeGWVrK3jSIY/0',
    city              : 'Haidian',
    country           : 'CN',
    intro             : 'CARPE+DIEM+-+if+not+us,+who?+if+not+now,+when?',
    label             : '',
    message           : '',
    nick_name         : '李卓桓',
    provincia         : 'Beijing',
    py_initial        : 'LZH',
    quan_pin          : 'lizhuohuan',
    remark            : '',
    remark_py_initial : '',
    remark_quan_pin   : '',
    sex               : 0,
    signature         : 'CARPE+DIEM+-+if+not+us,+who?+if+not+now,+when?',
    small_head        : 'http://wx.qlogo.cn/mmhead/ver_1/TR8EDh3MgMsu20pxjrDPBpaGySuEAGf3MUuoeUOV2LiaqvZxeMqb1U7hgiciaQZBC8LYN0boVLCKOIYg71pxdl1fQabiaxsn7CnNeGWVrK3jSIY/132',
    status            : 0,
    stranger          : 'v1_cd6656d42f505e5ffbb7eab65fed448fc8f02eade29a873ec3e758c7553db424@stranger',
    ticket            : '',
    user_name         : 'gh_59d7c8ad720c',
  }

  const EXPECTED_CONTACT_PAYLOAD_PERSONAL: ContactPayload = {
    id        : 'mengjunjun001',
    gender    : ContactGender.Female,
    type      : ContactType.Personal,
    alias     : '女儿',
    avatar    : 'http://wx.qlogo.cn/mmhead/ver_1/xfCMmibHH74xGLoyeDFJadrZXX3eOEznPefiaCa3iczxZGMwPtDuSbRQKx3Xdm18un303mf0NFia3USY2nO2VEYILw/0',
    city      : 'Haidian',
    name      : '梦君君',
    province  : 'Beijing',
    signature : 'Stay Foolish',
  }

  const EXPECTED_CONTACT_PAYLOAD_OFFICIAL: ContactPayload = {
    id        : 'gh_59d7c8ad720c',
    gender    : ContactGender.Unknown,
    type      : ContactType.Official,
    alias     : '',
    avatar    : 'http://wx.qlogo.cn/mmhead/ver_1/TR8EDh3MgMsu20pxjrDPBpaGySuEAGf3MUuoeUOV2LiaqvZxeMqb1U7hgiciaQZBC8LYN0boVLCKOIYg71pxdl1fQabiaxsn7CnNeGWVrK3jSIY/0',
    city      : 'Haidian',
    name      : '李卓桓',
    province  : 'Beijing',
    signature : 'CARPE DIEM+-+if+not+us,+who?+if+not+now,+when?',
  }

  const resultPersonal = pfHelper.contactRawPayloadParser(PADCHAT_CONTACT_PAYLOAD_PERSONAL)
  t.deepEqual(resultPersonal, EXPECTED_CONTACT_PAYLOAD_PERSONAL, 'should parse ContactPayload for personal account payload')

  const resultOfficial = pfHelper.contactRawPayloadParser(PADCHAT_CONTACT_PAYLOAD_OFFICIAL)
  t.deepEqual(resultOfficial, EXPECTED_CONTACT_PAYLOAD_OFFICIAL, 'should parse ContactPayload for official account payload')

  t.throws(() => pfHelper.contactRawPayloadParser({} as any), 'should throw exception for invalid object')
  t.throws(() => pfHelper.contactRawPayloadParser(undefined as any), 'should throw exception for undifined')
})

test('friendRequestRawPayloadParser()', async t => {
  const DATA = '%5B%7B%22content%22%3A%22%3Cmsg+fromusername%3D%5C%22lizhuohuan%5C%22+encryptusername%3D%5C%22v1_cf269def9b946093f9d131a5e733ba169351013c95e46a860cddecaf485c4b10%40stranger%5C%22+fromnickname%3D%5C%22%E6%9D%8E%E5%8D%93%E6%A1%93%5C%22+content%3D%5C%22xixixi%5C%22+fullpy%3D%5C%22lizhuohuan%5C%22+shortpy%3D%5C%22LZH%5C%22+imagestatus%3D%5C%223%5C%22+scene%3D%5C%226%5C%22+country%3D%5C%22CN%5C%22+province%3D%5C%22Beijing%5C%22+city%3D%5C%22Haidian%5C%22+sign%3D%5C%22PreAngel%E6%8A%95%E8%B5%84%E4%BA%BA%E3%80%82%E6%B0%B4%E6%9C%A8%E6%B8%85%E5%8D%8EBBS%E7%AB%99%E9%95%BF%E3%80%82%E6%8A%95%E8%B5%84%E4%BA%BA%E4%B8%AD%E6%9C%80%E4%BC%9A%E9%A3%9E%E7%9A%84AI%E7%A8%8B%E5%BA%8F%E5%91%98%E3%80%82%5C%22+percard%3D%5C%221%5C%22+sex%3D%5C%221%5C%22+alias%3D%5C%22%5C%22+weibo%3D%5C%22%5C%22+weibonickname%3D%5C%22%5C%22+albumflag%3D%5C%220%5C%22+albumstyle%3D%5C%220%5C%22+albumbgimgid%3D%5C%22913943270785024_913943270785024%5C%22+snsflag%3D%5C%22177%5C%22+snsbgimgid%3D%5C%22http%3A%2F%2Fshmmsns.qpic.cn%2Fmmsns%2FNoFChqEQomEyhyNjzExH3v78BHSVmIzHBIdOECg9jgcTpRNwThgXJicCsGicI6Kib4xLETc2PuKwhM%2F0%5C%22+snsbgobjectid%3D%5C%2212683064081608282338%5C%22+mhash%3D%5C%22d98b28f4cb1708bb584f3e66078e0a0d%5C%22+mfullhash%3D%5C%22d98b28f4cb1708bb584f3e66078e0a0d%5C%22+bigheadimgurl%3D%5C%22http%3A%2F%2Fwx.qlogo.cn%2Fmmhead%2Fver_1%2FciaaFRTCqfHIKLY0wBjv3h0LSPkCEEcJ0fo6kQkMxQLBiahJWFk7rS9G4VLU5n9OfAnXWlMaIV01oeTITYS0OHlg%2F0%5C%22+smallheadimgurl%3D%5C%22http%3A%2F%2Fwx.qlogo.cn%2Fmmhead%2Fver_1%2FciaaFRTCqfHIKLY0wBjv3h0LSPkCEEcJ0fo6kQkMxQLBiahJWFk7rS9G4VLU5n9OfAnXWlMaIV01oeTITYS0OHlg%2F96%5C%22+ticket%3D%5C%22v2_1a0d2cf325e64b6f74bed09e944529e7cc7a7580cb323475050664566dd0302d89b8e2ed95b596b459cf762d94a0ce606da39babbae0dc26b18a62e079bfc120%40stranger%5C%22+opcode%3D%5C%222%5C%22+googlecontact%3D%5C%22%5C%22+qrticket%3D%5C%22%5C%22+chatroomusername%3D%5C%22%5C%22+sourceusername%3D%5C%22%5C%22+sourcenickname%3D%5C%22%5C%22%3E%3Cbrandlist+count%3D%5C%220%5C%22+ver%3D%5C%22652101432%5C%22%3E%3C%2Fbrandlist%3E%3C%2Fmsg%3E%22%2C%22continue%22%3A1%2C%22description%22%3A%22%22%2C%22from_user%22%3A%22fmessage%22%2C%22msg_id%22%3A%222957327798149218888%22%2C%22msg_source%22%3A%22%22%2C%22msg_type%22%3A5%2C%22status%22%3A1%2C%22sub_type%22%3A37%2C%22timestamp%22%3A1528557626%2C%22to_user%22%3A%22wxid_5zj4i5htp9ih22%22%2C%22uin%22%3A1928023446%7D%5D%0A'
  const TENCENT_PAYLOAD_LIST: PadchatMessagePayload[] = JSON.parse(decodeURIComponent(DATA))
  const PADCHAT_MESSAGE_PAYLOAD = TENCENT_PAYLOAD_LIST[0]
  const EXPECTED_FRIEND_REQUEST_PAYLOAD = {
    id        : '2957327798149218888',
    contactId : 'lizhuohuan',
    hello     : 'xixixi',
    ticket    : 'v2_1a0d2cf325e64b6f74bed09e944529e7cc7a7580cb323475050664566dd0302d89b8e2ed95b596b459cf762d94a0ce606da39babbae0dc26b18a62e079bfc120@stranger',
    type      : FriendRequestType.Receive,
  }

  // console.log(PADCHAT_MESSAGE_PAYLOAD)

  const friendRequestPayload: FriendRequestPayload = await pfHelper.friendRequestRawPayloadParser(PADCHAT_MESSAGE_PAYLOAD)
  // console.log(friendRequestPayload)

  t.deepEqual(friendRequestPayload, EXPECTED_FRIEND_REQUEST_PAYLOAD, 'should parse friendRequestPayload right')
})
// TODO
// test('roomRawPayloadParser', async t => {

// })

// test('messageRawPayloadParser', async t => {
//   const PADCHAT_MESSAGE_PAYLOAD_TEXT: PadchatMessagePayload = {
//     content     : '1111',
//     continue    : 1,
//     description : 'c7259a70-212f-11e8-b67d-57995e2021bf : 1111',
//     from_user   : 'qq512436430',
//     msg_id      : '8394773793402534033',
//     msg_source  : '<msgsource />\n',
//     msg_type    : 5,
//     status      : 1,
//     sub_type    : 1,
//     timestamp   : 1526958809,
//     to_user     : 'wxid_zj2cahpwzgie12',
//     uin         : 324216852,
//   }

//   const PADCHAT_MESSAGE_PAYLOAD_VOICE: PadchatMessagePayload = {
//     // tslint:disable-next-line:max-line-length
//     content     : '<msg><voicemsg endflag=\"1\" length=\"5095\" voicelength=\"2700\" clientmsgid=\"49c81578fd517c7679f143e8cf0be116wxid_zj2cahpwzgie12104_1526984920\" fromusername=\"qq512436430\" downcount=\"0\" cancelflag=\"0\" voiceformat=\"4\" forwardflag=\"0\" bufid=\"434549088970015139\" /></msg>',
//     continue    : 1,
//     // tslint:disable-next-line:max-line-length
//     data        : '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',
//     description : '李佳芮 : [语音]',
//     from_user   : 'qq512436430',
//     msg_id      : '8502371723610127059',
//     msg_source  : '',
//     msg_type    : 5,
//     status      : 1,
//     sub_type    : 34,
//     timestamp   : 1526984922,
//     to_user     : 'wxid_zj2cahpwzgie12',
//     uin         : 324216852,
//   }

// })

// test('friendRequestRawPayloadParser', async t => {

// })

// test('imageBase64ToQrCode', async t => {

// })
