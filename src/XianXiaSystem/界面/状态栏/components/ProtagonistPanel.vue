<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  protagonist?: {
    姓名?: string;
    灵石?: number;
    寿元?: number;
    身体强化?: {
      力量?: number;
      速度?: number;
      防御?: number;
      抗性?: number;
    };
  };
}>();

const displayName = computed(() => {
  try {
    return SillyTavern?.name1 || '{{user}}';
  } catch {
    return '{{user}}';
  }
});
</script>

<template>
  <div class="card" v-if="protagonist">
    <div class="card-title">◈ {{ displayName }}</div>

    <div class="grid-2">
      <div class="stat-row">
        <span class="stat-label">💪 力量</span>
        <span class="stat-value primary">Lv.{{ protagonist.身体强化?.力量 ?? 1 }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">💨 速度</span>
        <span class="stat-value primary">Lv.{{ protagonist.身体强化?.速度 ?? 1 }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">🛡️ 防御</span>
        <span class="stat-value primary">Lv.{{ protagonist.身体强化?.防御 ?? 1 }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">🧠 抗性</span>
        <span class="stat-value primary">Lv.{{ protagonist.身体强化?.抗性 ?? 1 }}</span>
      </div>
    </div>

    <div class="divider" />

    <div class="stat-row">
      <span class="stat-label">灵石</span>
      <span class="stat-value primary">🪙 {{ protagonist.灵石 ?? 0 }}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">寿元</span>
      <span class="stat-value" :class="protagonist.寿元 === -1 ? 'success' : 'primary'">
        {{ protagonist.寿元 === -1 ? '∞ 无限' : (protagonist.寿元 ?? 0) + '年' }}
      </span>
      <span v-if="protagonist.寿元 === -1" class="tag tag-success" style="font-size: 9px;">长生不老</span>
    </div>
  </div>
</template>
