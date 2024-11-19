export interface SseMessage {
  event: string;
  data: string;
  id?: string;
}

export function sse(
  url: string,
  data: object,
  headers: Record<string, string>,
  onMessage: (message: SseMessage) => void,
  onError: (error: any) => void = console.error
): void {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('POST request failed')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      const stream = new ReadableStream({
        start(controller) {
          (async function read() {
            const { done, value } = await reader!.read()
            if (done) {
              controller.close()
              return
            }
            controller.enqueue(value)
            read()
          })()
        }
      })

      const streamReader = new Response(stream).body?.getReader()
      let accumulatedData = ''

      function readStream() {
        streamReader?.read().then(({ done, value }) => {
          if (done) {
            onMessage({ event: 'done', data: '' })
            return
          }

          if (value) {
            accumulatedData += decoder.decode(value, { stream: true })

            const lines = accumulatedData.split('\n')
            accumulatedData = lines.pop() || ''

            let eventData: SseMessage = { event: '', data: '' }

            lines.forEach((line) => {
              if (line.trim() === '') {
                if (eventData.data) {
                  onMessage({ ...eventData })
                }
                eventData = { event: '', data: '' }
              } else {
                const [key, ...rest] = line.split(':')
                const value = rest.join(':').trim()

                switch (key) {
                  case 'event':
                    eventData.event = value
                    break
                  case 'data':
                    eventData.data += (eventData.data ? '\n' : '') + value
                    break
                  case 'id':
                    eventData.id = value
                    break
                  default:
                    break
                }
              }
            })
          }

          readStream()
        })
      }

      readStream()
    })
    .catch(onError)
}