<template>
  <div class="section">
    <div class="section-title">聚宝盆</div>
    <div class="basin-grid">
      <div class="basin-item">
        <span class="label">状态</span>
        <span :style="{ color: cd ? 'var(--c-heal)' : 'var(--c-harm)' }">{{ cd ? '● 可用' : '● 冷却中' }}</span>
      </div>
      <div class="basin-item">
        <span class="label">盆内</span>
        <span>{{ store.data.聚宝盆?.盆内物品 || '空' }}</span>
      </div>
      <div class="basin-item">
        <span class="label">剩余</span>
        <span>{{ store.data.聚宝盆?.剩余时间 || '—' }}</span>
      </div>
      <div class="basin-item">
        <span class="label">复制</span>
        <span>{{ (store.data.聚宝盆?._复制记录?.length || 0) + ' 次' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';
const store = useDataStore();
const cd = computed(() => store.data.聚宝盆?.冷却状态 ?? true);
</script>

<style scoped>
.section {
  border: 1px solid var(--c-stroke);
  padding: 10px; display: grid; gap: 4px;
  background: var(--c-paper-light);
}
.section-title {
  font-size: 12px; font-weight: 700; font-family: var(--font-title);
  letter-spacing: 0.12em; color: var(--c-gold-dark);
  border-bottom: 1px solid rgba(139,105,20,0.2);
  padding-bottom: 3px; display: inline-block;
}
.basin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 2px; }
.basin-item { display: flex; gap: 6px; font-size: 12px; align-items: center; }
.label { color: var(--c-ink-muted); min-width: 28px; }
</style>
