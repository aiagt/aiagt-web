<script setup lang="ts">
import ConfigModelNumberInput from '@v/personal/application/components/config-model-number-input.vue'
import ConfigModelSelect from '@v/personal/application/components/config-model-select.vue'
import { useApplicationStore } from '@/store/application.ts'

const appStore = useApplicationStore()
</script>

<template>
    <div class="px-6 py-12 text-black flex flex-col gap-10 min-w-[480px] w-[90%] md:w-[100%] m-auto">
      <div class="flex flex-col gap-4">
        <config-model-select v-model="appStore.inputAppInfo.model_id" />
      </div>

      <div class="flex flex-col gap-4">
        <div class="font-medium text-lg">Advance</div>
        <config-model-number-input
          label="Temperature"
          :min="0"
          :max="2"
          :default-value="1"
          v-model="appStore.inputAppInfo.model_config.temperature"
          tips="What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.\nWe generally recommend altering this or top_p but not both."
        />
        <config-model-number-input
          label="Top p"
          :min="0"
          :max="1"
          :default-value="1"
          v-model="appStore.inputAppInfo.model_config.top_p"
          tips="An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.\nWe generally recommend altering this or temperature but not both."
        />
        <config-model-number-input
          label="Frequency penalty"
          :min="-2"
          :max="2"
          :default-value="0"
          v-model="appStore.inputAppInfo.model_config.frequency_penalty"
          tips="Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim."
        />
        <config-model-number-input
          label="Presence penalty"
          :min="-2"
          :max="2"
          :default-value="0"
          v-model="appStore.inputAppInfo.model_config.presence_penalty"
          tips="Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics."
        />
      </div>

      <div class="flex flex-col gap-4">
        <div class="font-medium text-lg">Input and output included</div>
        <config-model-number-input
          label="Number of context rounds included"
          :min="0"
          :max="100"
          :step="1"
          :default-value="20"
          tips="When you increase this value, the model outputs more diverse and innovative content; when you decrease it, the model outputs less diverse content that strictly follows the given instructions. \nIt is recommended not to adjust this value with 'Top p' at the same time."
        />
        <config-model-number-input
          label="Response max length"
          :min="0"
          :max="4096"
          :step="1"
          :default-value="2048"
          tips="You can specify the maximum length of the tokens output through this value. Typically, 100 tokens are approximately equal to 150 Chinese Characters."
        />
      </div>
    </div>
</template>

<style scoped>

</style>
