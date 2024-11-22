import { defineStore } from 'pinia'
import { listModelAPI } from '@/api/model'
import { Model } from '@/models/model'
import { reactive } from 'vue'

export const useModelStore = defineStore('model', () => {
  const modelOptions = reactive([] as Model[])

  listModelAPI({ pagination: { page_size: 100 } }).then(resp => {
    modelOptions.push(...resp.models)
  })

  function getModel(id?: number): Model {
    for (const model of modelOptions) {
      if (model.id === id) {
        return model
      }
    }

    return {} as Model
  }

  return { modelOptions, getModel }
})
