<script setup lang="ts">
import { App } from '@/models/app'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { chatAPI, deleteMessageAPI, initDevelopAPI, listMessageAPI, updateMessageAPI } from '@/api/chat'
import { ChatResp, ListMessageReq, Message, MessageContent, MessageRole, MessageType } from '@/models/chat'
import { Message as ArcoMessage } from '@arco-design/web-vue'
import { NewTime, Time } from '@/models/base'
import { mark } from '@/assets/marked'
import { IconPlugin } from '@arco-iconbox/vue-aiagt'
import { clipboardCopy } from '@/utils/copy.ts'
import { debounce } from '@arco-design/web-vue/es/_utils/debounce'

const props = defineProps<{
  app: App;
  dev?: boolean;
  conversation_id?: number;
  scrollBy?: any;  // for scrolling to the bottom
}>()

const emits = defineEmits(['newConversation'])

const appInfo = reactive({} as App)
const conversation = reactive({
  messages: [],
  inputMessage: ''
} as {
  id?: number;
  messages: Message[];
  inputMessage: string;
})

watch(props.app, async () => {
  Object.assign(appInfo, props.app)

  if (props.dev) {
    const resp = await initDevelopAPI({ app_id: props.app.id })

    conversation.id = resp.conversation.id
    conversation.messages.splice(0, conversation.messages.length)
    conversation.messages.push(...resp.messages)
  }
})

const chatRef = ref<HTMLElement | undefined>()

const isAtBottom = () => {
  if (chatRef.value) {
    return chatRef.value.scrollTop >= (chatRef.value.scrollHeight - chatRef.value.clientHeight) - 200
  }
  return false
}

const scrollToBottom = debounce((force?: boolean) => {
  if (chatRef.value && (force || isAtBottom())) {
    chatRef.value.scrollTo({
      top: chatRef.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}, 30)

const smallWindow = ref(window.innerWidth <= 768)
const isMounted = ref(false)

onMounted(() => {
  if (chatRef.value) smallWindow.value = chatRef.value.offsetWidth <= 768
  isMounted.value = true
  focusMsgInput()
})

window.addEventListener('resize', () => {
  if (chatRef.value) smallWindow.value = chatRef.value.offsetWidth <= 768
  else smallWindow.value = window.innerWidth <= 768
})

watch(computed(() => props.scrollBy), () => {
  focusMsgInput()
  if (scrollToBottom) scrollToBottom(true)
})

watch(computed(() => props.conversation_id), async () => {
  conversation.id = props.conversation_id

  if (props.conversation_id) {
    const resp = await listMessageAPI({ conversation_id: props.conversation_id } as ListMessageReq)
    conversation.messages.splice(0, conversation.messages.length)
    conversation.messages.push(...resp.messages)
  } else {
    conversation.messages.splice(0, conversation.messages.length)
  }

  focusMsgInput()
  if (scrollToBottom) scrollToBottom(true)
}, { immediate: true })

function updateLastMsg(msg: Message) {
  const len = conversation.messages.length
  if (!len) {
    return
  }

  const lastMsg = conversation.messages[len - 1]
  lastMsg.id = msg.id
  lastMsg.created_at = msg.created_at
  lastMsg.updated_at = msg.updated_at
  lastMsg.conversation_id = msg.conversation_id
  lastMsg.role = msg.role

  const content = msg.content
  const lastContent = lastMsg.content
  if (lastContent.type !== content.type) {
    return
  }

  switch (content.type) {
    case MessageType.TEXT:
      if (msg.role === MessageRole.ASSISTANT) {
        if (!lastContent.content.text) lastContent.content.text = { text: '' }
        lastContent.content.text.text += content.content.text?.text
      } else lastContent.content.text = content.content.text
      scrollToBottom()
      break
    case MessageType.FUNCTION:
      lastContent.content.func = content.content.func
      scrollToBottom()
      break
    case MessageType.FUNCTION_CALL:
      lastContent.content.func_call = content.content.func_call
      scrollToBottom()
      break
  }
}

interface ChatStatus {
  oldType?: MessageType;
  isNewMessage: boolean;
}

function chat(messages?: MessageContent[]) {
  const status: ChatStatus = { isNewMessage: true }

  chatAPI(
    {
      app_id: appInfo.id,
      conversation_id: conversation.id,
      messages: messages || []
    },
    (event: string, data: ChatResp | string) => {
      switch (event) {
        case 'chunk':
          handleChatChunk(data as ChatResp, status)
          break
        case 'error':
          ArcoMessage.error(data as string)
          break
        case 'done':
          console.log(conversation.messages)
          break
      }
    },
    error => {
      ArcoMessage.error(error)
    }
  )

  if (messages) {
    const now = Date.now()
    conversation.messages.push({
      id: now,
      conversation_id: conversation.id || 0,
      role: MessageRole.USER,
      content: { type: MessageType.TEXT, content: { text: { text: conversation.inputMessage } } },
      created_at: new Time({ timestamp: now }),
      updated_at: new Time({ timestamp: now })
    })
    conversation.inputMessage = ''
  }
}

function handleChatChunk(chunk: ChatResp, status: ChatStatus) {
  if (!conversation.id && chunk.conversation_id) {
    emits('newConversation')
  }
  if (chunk.conversation_title) {
    emits('newConversation')
    return
  }

  conversation.id = chunk.conversation_id

  for (const message of chunk.messages) {
    const content = message.content

    if (message.role !== MessageRole.USER) {
      if (status.oldType !== content.type) {
        status.isNewMessage = true
      }

      if (status.isNewMessage) {
        status.isNewMessage = false

        const now = Date.now()
        const newMsg = {
          id: now,
          conversation_id: chunk.conversation_id,
          role: message.role,
          content: { type: content.type, content: {} },
          created_at: new Time({ timestamp: now }),
          updated_at: new Time({ timestamp: now })
        }

        conversation.messages.push(newMsg)
      }
    }

    status.oldType = content.type

    switch (message.role) {
      case MessageRole.USER:
        updateLastMsg(message)
        scrollToBottom(true)
        break
      case MessageRole.ASSISTANT:
        switch (content.type) {
          case MessageType.TEXT:
            updateLastMsg(message)
            break
          case MessageType.FUNCTION_CALL:
            updateLastMsg(message)
            break
        }

        break
      case MessageRole.FUNCTION:
        updateLastMsg(message)

        break
      default:
        console.log(message)
    }
  }
}

const updateMsgInput = ref<HTMLInputElement | undefined>()

function focusUpdateMsgInput() {
  if (updateMsgInput.value) updateMsgInput.value.focus()
}

const msgInput = ref<HTMLInputElement | undefined>(undefined)

function focusMsgInput() {
  if (isMounted.value && msgInput.value) msgInput.value.focus()
}

function isSendEvent(event?: KeyboardEvent) {
  if (!event) return true

  if (
    !event.isComposing
    && !event.shiftKey
    && !event.ctrlKey
    && !event.altKey
  ) {
    event.preventDefault()
    return true
  }

  return false
}

function sendMsg(e?: Event) {
  const event = e as KeyboardEvent | undefined

  if (isSendEvent(event) && conversation.inputMessage.trim().length) {
    chat([
      {
        type: MessageType.TEXT,
        content: { text: { text: conversation.inputMessage } }
      }
    ])
  }
}

function deleteMessage(messageID: number, idx: number) {
  conversation.messages.splice(idx, 1)
  deleteMessageAPI(messageID).then(_ => {
    ArcoMessage.success('delete message success')
  })
}

const updateMsgStatus = reactive({
  id: undefined,
  text: undefined
} as {
  id?: number;
  text?: string;
})

async function updateMsg(e?: Event) {
  const event = e as KeyboardEvent | undefined

  const text = updateMsgStatus.text?.trim() || ''

  if (isSendEvent(event) && updateMsgStatus.id && text.length) {
    await updateMessageAPI({
      id: updateMsgStatus.id,
      message: {
        type: MessageType.TEXT,
        content: { text: { text } }
      }
    })

    const idx = conversation.messages.findIndex(msg => {
      if (msg?.id === updateMsgStatus.id) {
        if (msg.content.content.text) {
          msg.content.content.text.text = text
        }
        msg.updated_at = NewTime()

        return true
      }

      return false
    })
    conversation.messages.splice(idx + 1)
    updateMsgStatus.id = undefined

    chat()
  }
}

function regenerate(idx: number) {
  for (let i = idx - 1; i >= 0; i--) {
    if (conversation.messages[i].role === MessageRole.USER) {
      const nextMsg = conversation.messages[i + 1]

      deleteMessageAPI(nextMsg.id, true).then(_ => {
        conversation.messages.splice(i + 1)
        chat()
      })

      break
    }
  }
}
</script>

<template>
  <div class="h-screen w-full flex flex-col items-center overflow-y-auto p-10" ref="chatRef">
    <div class="flex flex-col gap-4 mb-10 flex-1 inner-container">
      <div
        v-for="(message, idx) of conversation.messages"
        class="flex flex-col w-full"
        :class="message.role === MessageRole.USER ? 'items-end' : 'items-start'"
      >
        <div
          v-if="message.role === MessageRole.ASSISTANT && message.content.type === MessageType.TEXT"
          class="pt-2 pb-0 rounded-xl marked"
          v-html="mark(message.content.content.text?.text || '')"
        />
        <div
          v-else-if="message.role === MessageRole.USER && message.content.type === MessageType.TEXT"
          class="px-3 py-2 rounded-xl bg-[#ebeced] marked"
          v-text="message.content.content.text?.text"
        />
        <div
          v-else-if="((message.role === MessageRole.ASSISTANT && message.content.type === MessageType.FUNCTION_CALL) ||
              (message.role === MessageRole.FUNCTION && message.content.type === MessageType.FUNCTION))"
          class="bg-[#fafafa] border-[#ccc] border-[0.5px] px-4 py-2 rounded-xl flex flex-col gap-1 text-xs max-w-96 cursor-pointer hover:bg-[#f3f3f3]"
          :class="{'!max-w-full': smallWindow}"
        >
          <div class="truncate flex items-center gap-2 text-gray-700">
            <div class="text-[15px]">
              <icon-plugin class="stroke-[100]" />
            </div>
            {{
              message.content.type === MessageType.FUNCTION_CALL
                ? message.content.content.func_call?.name
                : message.content.content.func?.name
            }}
            <div
              class="bg-white px-1 rounded-sm text-xs !text-[10px]"
              :class="message.content.type === MessageType.FUNCTION_CALL ? 'text-purple-500' : 'text-blue-500'"
            >
              {{
                message.content.type === MessageType.FUNCTION_CALL ? 'call' : 'result'
              }}
            </div>
          </div>
          <div class="truncate text-[10px] text-gray-400">
            {{
              message.content.type === MessageType.FUNCTION_CALL
                ? message.content.content.func_call?.arguments
                : message.content.content.func?.content
            }}
          </div>
        </div>
        <div v-else class="bg-black py-2">{{ message }}</div>
        <div
          class="py-2 px-1 text-gray-400 flex gap-2 text-xs !text-[11px] items-center"
          v-if="message.content.type === MessageType.TEXT"
        >
          <div>{{ new Time(message.updated_at).string() }}</div>
          <a-popconfirm
            content="Are you sure you want to delete?"
            @ok="deleteMessage(message.id, idx)"
          >
            <icon-delete
              class="cursor-pointer"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </a-popconfirm>
          <icon-copy
            class="cursor-pointer"
            stroke-linecap="round"
            stroke-linejoin="round"
            @click="() => {
              const text = message.content.content.text?.text;
              if (text) {
                clipboardCopy(text)
                ArcoMessage.info('Copied to clipboard')
              }
            }"
          />
          <icon-edit
            class="cursor-pointer"
            v-show="message.role === MessageRole.USER"
            stroke-linecap="round"
            stroke-linejoin="round"
            @click="updateMsgStatus.id = message.id; updateMsgStatus.text = message.content.content.text?.text; focusUpdateMsgInput()"
          />
          <icon-refresh
            class="cursor-pointer"
            v-show="message.role === MessageRole.ASSISTANT"
            stroke-linecap="round"
            stroke-linejoin="round"
            @click="regenerate(idx)"
          />
        </div>
      </div>
    </div>
    <div class="inner-container sticky bottom-0">
      <div class="px-2 flex justify-between">
        <div
          class="text-xs pl-3.5 pr-3 py-1 rounded-xl bg-[#f8f8f8] border-[0.5px] flex items-center gap-1"
          v-if="updateMsgStatus.id"
        >
          Editing message
          <div
            class="hover:bg-white text-gray-500 rounded-full w-4 h-4 flex justify-center items-center"
            @click="updateMsgStatus.id = undefined"
          >
            <icon-close />
          </div>
        </div>
      </div>
      <div
        class=" mt-2 px-1.5 py-1 flex gap-4 items-end rounded-[1.5rem] border bg-[#fafafa] question-input shadow-xl shadow-gray-200 "
      >
        <a-textarea
          class="flex-1 !px-2"
          placeholder="Edit your question"
          size="large"
          v-show="updateMsgStatus.id"
          v-model="updateMsgStatus.text"
          @keydown.enter="updateMsg"
          ref="updateMsgInput"
          auto-size
        />
        <a-textarea
          class="flex-1 !px-2"
          placeholder="Enter your question"
          size="large"
          v-show="!updateMsgStatus.id"
          v-model="conversation.inputMessage"
          @keydown.enter="sendMsg"
          ref="msgInput"
          auto-size
        />
        <button
          class="bg-black text-white text-lg rounded-full my-0.5 !w-8 !h-8 flex justify-center items-center"
          @click="() => {
            if (updateMsgStatus.id ) updateMsg()
            else sendMsg()
          } "
        >
          <icon-arrow-up :stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inner-container {
  @apply w-full max-w-[980px];
}
</style>

<style>
.question-input {
  .arco-textarea-wrapper {
    @apply !border-0;
  }

  .arco-textarea-focus {
    @apply !shadow-transparent;
  }
}
</style>