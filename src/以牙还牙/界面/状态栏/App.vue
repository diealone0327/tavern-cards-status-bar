<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from './store';
import GirlCard from './components/GirlCard.vue';
import type { SchemaType } from '../../schema';

const store = useDataStore();

const girls = [
  { key: '白凝冰', rel: '林星之妻' },
  { key: '林婉', rel: '林星之妹' },
  { key: '林妙可', rel: '林星之姐' },
  { key: '宋慧茹', rel: '林星之母' },
] as const;

const stageMeta: Record<string, { label: string; cls: string }> = {
  '发现': { label: '发现', cls: 'badge-gray' },
  '布局': { label: '布局', cls: 'badge-blue' },
  '攻略': { label: '攻略', cls: 'badge-orange' },
  '冲突': { label: '冲突', cls: 'badge-red' },
  '收束': { label: '收束', cls: 'badge-gold' },
};
const stageInfo = computed(() => stageMeta[store.data.主线.阶段] || stageMeta['发现']);

const timeText = computed(() => {
  const date = store.data.世界.日期;
  const period = store.data.世界.时间段;
  return [date, period].filter(Boolean).join(' · ') || '时间未知';
});

const locationText = computed(() => store.data.世界.当前位置 || '未知');
const money = computed(() => store.data.user.金钱 ?? 0);
const harem = computed(() => store.data.后宫.已攻略 ?? []);
const haremOpen = useLocalStorage<boolean>('yy_status:harem_open', true);
</script>

<template>
  <div class="yy-status-bar">
    <!-- 顶部：时间 / 位置 / 主线阶段 / 存款 -->
    <div class="dossier-card">
      <div class="dossier-head">
        <span class="dossier-title">以牙还牙<span class="en-mark">AN EYE FOR AN EYE</span></span>
        <span :class="['badge', stageInfo.cls]">{{ stageInfo.label }}</span>
      </div>
      <div class="stat-row" style="padding-top: 5px;">
        <span class="stat-label">时间</span>
        <span class="stat-value primary">{{ timeText }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">位置</span>
        <span class="stat-value">{{ locationText }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">存款</span>
        <span class="stat-value gold">¥ {{ money.toLocaleString() }}</span>
      </div>
    </div>

    <!-- 后宫名单 -->
    <div class="dossier-card">
      <div class="dossier-head">
        <span class="dossier-title">后宫<span class="en-mark">HAREM</span></span>
        <span class="fold-btn" @click="haremOpen = !haremOpen">{{ haremOpen ? '收起 ▲' : '展开 ▼' }}</span>
      </div>
      <div v-if="haremOpen" class="harem-list" style="padding-top: 6px;">
        <span v-for="g in girls" :key="g.key" :class="['harem-chip', { lit: harem.includes(g.key) }]">
          {{ g.key }}
        </span>
      </div>
    </div>

    <!-- 攻略对象档案 -->
    <GirlCard
      v-for="g in girls"
      :key="g.key"
      :name="g.key"
      :rel="g.rel"
      :data="store.data[g.key] as SchemaType['白凝冰']"
    />
  </div>
</template>

<style lang="scss" scoped>
.yy-status-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
