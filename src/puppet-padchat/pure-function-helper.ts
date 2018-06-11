/**
 *
 * Pure Function Helpers
 *
 * Huan LI <zixia@zixia.net> https://github.com/zixia
 * License: Apache 2.0
 *
 * See: What's Pure Function Programming
 *  [Functional Programming Concepts: Pure Functions](https://hackernoon.com/functional-programming-concepts-pure-functions-cafa2983f757)
 *  [What Are Pure Functions And Why Use Them?](https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c)
 *  [Master the JavaScript Interview: What is a Pure Function?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976)
 *
 */
import jsQR             from 'jsqr'
import Jimp             from 'jimp'
import { parseString }  from 'xml2js'

import {
  ContactPayload,
  ContactType,

  MessagePayload,
  MessageType,

  RoomPayload,

  FriendRequestPayload,
  FriendRequestType,
}                       from '../puppet/'

import {
  PadchatContactPayload,
  PadchatMessagePayload,
  // PadchatContactMsgType,

  // PadchatMessageStatus,
  PadchatMessageType,

  PadchatRoomPayload,
  PadchatFriendRequestPayload,
  // PadchatRoomMemberPayload,
}                             from './padchat-schemas'

export interface RoomJoinType {
  inviteeNameList : string[],
  inviterName     : string,
  roomId          : string,
}

export interface RoomLeaveType {
  leaverNameList : string[],
  removerName    : string,
  roomId         : string,
}

export interface RoomTopicType {
  changeName : string,
  topic      : string,
  roomId     : string,
}

export class PadchatPureFunctionHelper {
  private constructor() {
    throw new Error('should not be instanciated. use static methods only.')
  }

  public static isRoomId(id?: string): boolean {
    if (!id) {
      throw new Error('no id')
    }
    return /@chatroom$/.test(id)
  }

  public static isContactId(id?: string): boolean {
    if (!id) {
      throw new Error('no id')
    }
    return !this.isRoomId(id)
  }

  public static isContactOfficialId(id?: string): boolean {
    if (!id) {
      throw new Error('no id')
    }
    return /^gh_/i.test(id)
  }

  public static isStrangerV1(strangerId?: string): boolean {
    if (!strangerId) {
      throw new Error('no id')
    }
    return /^v1_/i.test(strangerId)
  }

  public static isStrangerV2(strangerId?: string): boolean {
    if (!strangerId) {
      throw new Error('no id')
    }
    return /^v2_/i.test(strangerId)
  }

  public static contactRawPayloadParser(
    rawPayload: PadchatContactPayload,
  ): ContactPayload {
    if (!rawPayload.user_name) {
      /**
       * { big_head: '',
       *  city: '',
       *  country: '',
       *  intro: '',
       *  label: '',
       *  message: '',
       *  nick_name: '',
       *  provincia: '',
       *  py_initial: '',
       *  quan_pin: '',
       *  remark: '',
       *  remark_py_initial: '',
       *  remark_quan_pin: '',
       *  sex: 0,
       *  signature: '',
       *  small_head: '',
       *  status: 0,
       *  stranger: '',
       *  ticket: '',
       *  user_name: '' }
       */
      // console.log(rawPayload)
      throw Error('cannot get user_name for payload: ' + JSON.stringify(rawPayload))
    }

    if (this.isRoomId(rawPayload.user_name)) {
      throw Error('Room Object instead of Contact!')
    }

    let contactType = ContactType.Unknown
    if (this.isContactOfficialId(rawPayload.user_name)) {
      contactType = ContactType.Official
    } else {
      contactType = ContactType.Personal
    }

    const payload: ContactPayload = {
      id        : rawPayload.user_name,
      gender    : rawPayload.sex,
      type      : contactType,
      alias     : rawPayload.remark,
      avatar    : rawPayload.big_head,
      city      : rawPayload.city,
      name      : rawPayload.nick_name,
      province  : rawPayload.provincia,
      signature : (rawPayload.signature).replace('+', ' '),   // Stay+Foolish
    }

    return payload
  }

  public static messageRawPayloadParser(
    rawPayload: PadchatMessagePayload,
  ): MessagePayload {

    // console.log('messageRawPayloadParser:', rawPayload)

    let type: MessageType

    switch (rawPayload.sub_type) {

      case PadchatMessageType.Text:
        type = MessageType.Text
        break

      case PadchatMessageType.Image:
        type = MessageType.Image
        // console.log(rawPayload)
        break

      case PadchatMessageType.Voice:
        type = MessageType.Audio
        // console.log(rawPayload)
        break

      case PadchatMessageType.Emoticon:
        type = MessageType.Emoticon
        // console.log(rawPayload)
        break

      case PadchatMessageType.App:
        type = MessageType.Attachment
        // console.log(rawPayload)
        break

      case PadchatMessageType.Video:
        type = MessageType.Video
        // console.log(rawPayload)
        break

      case PadchatMessageType.Sys:
        type = MessageType.Unknown
        break

      case PadchatMessageType.Recalled:
      case PadchatMessageType.StatusNotify:
      case PadchatMessageType.SysNotice:
        type = MessageType.Unknown
        break

      default:
        throw new Error('unsupported type: ' + PadchatMessageType[rawPayload.sub_type] + '(' + rawPayload.sub_type + ')')
    }

    const payloadBase = {
      id        : rawPayload.msg_id,
      timestamp : rawPayload.timestamp,  // Padchat message timestamp is seconds
      text      : rawPayload.content,
      // toId      : rawPayload.to_user,
      type      : type,
    }

    let fromId: undefined | string = undefined
    let roomId: undefined | string = undefined
    let toId:   undefined | string = undefined

    // Msg from room
    if (this.isRoomId(rawPayload.from_user)) {

      roomId = rawPayload.from_user

      const parts = rawPayload.content.split(':\n')
      if (parts.length > 1) {
        /**
         * there's from id in content.
         */
        // update fromId to actual sender instead of the room
        fromId = parts[0]
        // update the text to actual text of the message
        payloadBase.text = parts[1]

      }
      if (!roomId && !fromId) {
        throw Error('empty roomId and empty fromId!')
      }
    } else {
      fromId = rawPayload.from_user
    }

    // Msg to room
    if (this.isRoomId(rawPayload.to_user)) {
      roomId = rawPayload.to_user

      // TODO: if the message @someone, the toId should set to the mentioned contact id(?)
      toId   = undefined
    } else {
      toId = rawPayload.to_user
    }

    let payload: MessagePayload

    // Two branch is the same code.
    // Only for making TypeScript happy
    if (fromId && toId) {
      payload = {
        ...payloadBase,
        fromId,
        toId,
        roomId,
      }
    } else if (roomId) {
      payload = {
        ...payloadBase,
        fromId,
        toId,
        roomId,
      }
    } else {
      throw new Error('neither toId nor roomId')
    }

    return payload
  }

  public static roomRawPayloadParser(
    rawPayload        : PadchatRoomPayload,
  ): RoomPayload {
    const payload: RoomPayload = {
      id      : rawPayload.user_name,
      topic   : rawPayload.nick_name,
      ownerId : rawPayload.chatroom_owner,
    }

    return payload
  }

  public static async friendRequestRawPayloadParser(
    rawPayload: PadchatMessagePayload,
  ) : Promise<FriendRequestPayload> {

    let tryXmlText = rawPayload.content
    tryXmlText = tryXmlText.replace(/\+/g, ' ')

    interface XmlSchema {
      msg?: {
        $?: PadchatFriendRequestPayload,
      }
    }

    const padchatFriendRequestPayload = await new Promise<PadchatFriendRequestPayload>((resolve, reject) => {
      parseString(tryXmlText, { explicitArray: false }, (err, obj: XmlSchema) => {
        if (err) {  // HTML can not be parsed to JSON
          return reject(err)
        }
        if (!obj) {
          // FIXME: when will this happen?
          return reject(new Error('parseString() return empty obj'))
        }
        if (!obj.msg || !obj.msg.$) {
          return reject(new Error('parseString() return unknown obj'))
        }
        return resolve(obj.msg.$)
      })
    })

    // console.log(padchatFriendRequestPayload)

    const friendRequestPayload: FriendRequestPayload = {
      id        : rawPayload.msg_id,
      contactId : padchatFriendRequestPayload.fromusername,
      hello     : padchatFriendRequestPayload.content,
      stranger  : padchatFriendRequestPayload.encryptusername,
      ticket    : padchatFriendRequestPayload.ticket,
      type      : FriendRequestType.Receive,
    }

    return friendRequestPayload

    // switch (rawPayload.sub_type) {
    //   case PadchatMessageType.VerifyMsg:
    //     if (!rawPayload.RecommendInfo) {
    //       throw new Error('no RecommendInfo')
    //     }
    //     const recommendInfo: WebRecomendInfo = rawPayload.RecommendInfo

    //     if (!recommendInfo) {
    //       throw new Error('no recommendInfo')
    //     }

    //     const payloadReceive: FriendRequestPayloadReceive = {
    //       id        : rawPayload.MsgId,
    //       contactId : recommendInfo.UserName,
    //       hello     : recommendInfo.Content,
    //       ticket    : recommendInfo.Ticket,
    //       type      : FriendRequestType.Receive,
    //     }
    //     return payloadReceive

    //   case PadchatMessageType.Sys:
    //     const payloadConfirm: FriendRequestPayloadConfirm = {
    //       id        : rawPayload.MsgId,
    //       contactId : rawPayload.FromUserName,
    //       type      : FriendRequestType.Confirm,
    //     }
    //     return payloadConfirm

    //   default:
    //     throw new Error('not supported friend request message raw payload')
    // }
  }

  public static async imageBase64ToQrcode(base64: string): Promise<string> {
    // console.log('base64: ', typeof base64, String(base64).substr(0, 500))

    const imageBuffer = Buffer.from(base64, 'base64')

    const future = new Promise<string>((resolve, reject) => {
      Jimp.read(imageBuffer, (err, image) => {
        if (err) {
          return reject(err)
        }

        const qrCodeImageArray = new Uint8ClampedArray(image.bitmap.data.buffer)

        const qrCodeResult = jsQR(
          qrCodeImageArray,
          image.bitmap.width,
          image.bitmap.height,
        )

        if (qrCodeResult) {
          return resolve(qrCodeResult.data)
        } else {
          return reject(new Error('WXGetQRCode() qrCode decode fail'))
        }
      })
    })

    try {
      const qrCode = await future
      return qrCode
    } catch (e) {
      throw new Error('no qrcode in image: ' + e.message)
    }
  }

  // https://stackoverflow.com/a/24417399/1123955
  public static padchatDecode<T = Object>(encodedText: string): T {
    if (!encodedText) {
      throw new Error('no encodedText')
    }

    let decodedText: string

    // it seems the different server API version (bond with different wechat accounts)
    // is not consistent of the protocol: some time return URIEncoded, and some time return Plain JSON Text.
    try {
      // Server return data need decodeURIComponent
      decodedText = encodedText.replace(/\+/g, '%20')
      decodedText = decodeURIComponent(decodedText)
    } catch (e) {
      // Server return data no need decodeURIComponent
      decodedText = encodedText
    }

    const decodedObject: T = JSON.parse(decodedText)
    return decodedObject
  }

  public roomJoinMessageParser(rawPayload: PadchatMessagePayload): RoomJoinPayload {
    const roomJoinPayload
    = roomJoin.inviteeNameList
          const inviterName     = roomJoin.inviterName
          const roomId          = roomJoin.roomId
  }
  public roomLeaveMessageParser(rawPayload: PadchatMessagePayload): RoomLeavePayload {
    const roomJoinPayload
    roomLeave.leaverNameList
          const removerName    = roomLeave.removerName
          const roomId         = roomLeave.roomId
  }
  public roomTopicMessageParser(rawPayload: PadchatMessagePayload): RoomTopicPayload {
    const roomJoinPayload
    roomTopic.changerName
    const newTopic    = roomTopic.topic
    const roomId      = roomTopic.roomId
  }

  public static roomJoinMessageParser(rawPayload: PadchatMessagePayload): RoomJoinType {
    const content = rawPayload.content
  }
}

export default PadchatPureFunctionHelper
