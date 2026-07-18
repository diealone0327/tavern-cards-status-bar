<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  protagonist?: {
    姓名?: string;
    年龄?: number;
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

function getRealm(lv: number): string {
  if (lv >= 91) return '仙人';
  if (lv >= 81) return '渡劫';
  if (lv >= 71) return '大乘';
  if (lv >= 61) return '合体';
  if (lv >= 51) return '化神';
  if (lv >= 41) return '元婴';
  if (lv >= 31) return '金丹';
  if (lv >= 21) return '筑基';
  if (lv >= 11) return '炼气';
  return '凡人';
}
</script>

<template>
  <div class="card" v-if="protagonist">
    <div class="card-title">◈ {{ displayName }}</div>

    <div class="grid-2">
      <div class="stat-row">
        <span class="stat-label">💪 力量</span>
        <span class="stat-value primary">Lv.{{ protagonist.身体强化?.力量 ?? 1 }} <span class="realm-tag">（{{ getRealm(protagonist.身体强化?.力量 ?? 1) }}）</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-label">💨 速度</span>
        <span class="stat-value primary">Lv.{{ protagonist.身体强化?.速度 ?? 1 }} <span class="realm-tag">（{{ getRealm(protagonist.身体强化?.速度 ?? 1) }}）</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-label">🛡️ 防御</span>
        <span class="stat-value primary">Lv.{{ protagonist.身体强化?.防御 ?? 1 }} <span class="realm-tag">（{{ getRealm(protagonist.身体强化?.防御 ?? 1) }}）</span></span>
      </div>
      <div class="stat-row">
        <span class="stat-label">🧠 抗性</span>
        <span class="stat-value primary">Lv.{{ protagonist.身体强化?.抗性 ?? 1 }} <span class="realm-tag">（{{ getRealm(protagonist.身体强化?.抗性 ?? 1) }}）</span></span>
      </div>
    </div>

    <div class="divider" />

    <div class="stat-row">
      <span class="stat-label">年龄</span>
      <span class="stat-value primary">{{ protagonist.年龄 ?? '?' }}岁</span>
    </div>
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
