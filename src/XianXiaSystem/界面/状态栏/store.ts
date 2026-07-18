import { defineStore } from 'pinia';
import { useIntervalFn } from '@vueuse/core';
import { ref, nextTick } from 'vue';
import { Schema } from '../../schema';

export const useDataStore = defineStore('xianxia_status', () => {
  const data = ref(Schema.parse(_.get(getVariables({ type: 'message', message_id: getCurrentMessageId() }), 'stat_data', {}), { reportInput: true }));

  useIntervalFn(() => {
    const msgId = getCurrentMessageId();
    const raw = _.get(getVariables({ type: 'message', message_id: msgId }), 'stat_data', {});
    const result = Schema.safeParse(raw);
    if (!result.error) {
      nextTick(() => { data.value = result.data; });
    }
  }, 2000);

  return { data };
});
