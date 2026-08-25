<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();
const force = ref(0);
const d = computed(() => { force.value; return store.data; });
setInterval(() => { force.value++; }, 3000);
const maleOpen = ref(true);
const femaleOpen = ref(true);

const stageMeta: Record<string, { label: string; cls: string }> = {
  '开端': { label: '开端', cls: 'tag-accent' },
  '冲突': { label: '冲突', cls: 'tag-warning' },
  '打脸': { label: '打脸', cls: 'tag-danger' },
  '收尾': { label: '收尾', cls: 'tag-primary' },
};

const stageInfo = computed(() => stageMeta[d.value?.剧情?.当前阶段] || stageMeta['开端']);

const timeText = computed(() => {
  const date = d.value?.世界?.当前日期;
  const period = d.value?.世界?.时间段;
  if (!date && !period) return '未知';
  return [date, period].filter(Boolean).join(' ');
});

const npcRecords = computed(() => {
  const records = d.value?.NPC好感度记录 || {};
  return Object.entries(records).map(([name, v]) => ({
    name,
    好感度: v?.好感度 ?? 0,
    阶段: v?.阶段 ?? '普通',
    性别: v?.性别 ?? '男',
    欲望: v?.欲望 ?? 0,
  }));
});

const maleNpcs = computed(() => npcRecords.value.filter(n => n.性别 === '男'));
const femaleNpcs = computed(() => npcRecords.value.filter(n => n.性别 === '女'));

const stageCls = (stage: string): string => {
  switch (stage) {
    case '瞧不起': return 'tag-danger';
    case '普通': return 'tag-warning';
    case '崇拜': return 'tag-success';
    default: return 'tag-warning';
  }
};

const desireCls = (desire: number): string => {
  if (desire >= 80) return 'tag-danger';
  if (desire >= 50) return 'tag-warning';
  return 'tag-accent';
};

const desireLabel = (desire: number): string => {
  if (desire >= 80) return '难耐';
  if (desire >= 50) return '渴望';
  return '平静';
};
</script>

<template>
  <div class="bzc-status-bar">
    <!-- 当前时间 + 剧情阶段 -->
    <div class="card">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
        <span>剧情进度</span>
        <span :class="['tag', stageInfo.cls]">{{ stageInfo.label }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">当前时间</span>
        <span class="stat-value primary">{{ timeText }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">焦点 NPC</span>
        <span class="stat-value primary">{{ d?.当前焦点?.当前NPC || '未确定' }}</span>
      </div>
    </div>

    <!-- 男性 NPC -->
    <div class="card" style="cursor:pointer;" @click="maleOpen = !maleOpen">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
        <span>男性 <span class="gender-mark male-mark">♂</span></span>
        <span style="font-size:10px;color:var(--c-text-dim);">{{ maleOpen ? '▼' : '▶' }}</span>
      </div>
      <div v-if="maleOpen">
        <template v-if="maleNpcs.length">
          <div v-for="npc in maleNpcs" :key="npc.name" style="margin-bottom:6px;">
            <div class="stat-row">
              <span class="stat-label">{{ npc.name }}</span>
              <span>
                <span :class="['tag', stageCls(npc.阶段)]">{{ npc.阶段 }}</span>
                <span class="stat-value" style="margin-left:6px;">{{ npc.好感度 }}</span>
              </span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" :style="{ width: npc.好感度 + '%' }"></div>
            </div>
          </div>
        </template>
        <div v-else class="item-list">
          <span class="item-tag empty">暂无</span>
        </div>
      </div>
    </div>

    <!-- 女性 NPC -->
    <div class="card" style="cursor:pointer;" @click="femaleOpen = !femaleOpen">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
        <span>女性 <span class="gender-mark female-mark">♀</span></span>
        <span style="font-size:10px;color:var(--c-text-dim);">{{ femaleOpen ? '▼' : '▶' }}</span>
      </div>
      <div v-if="femaleOpen">
        <template v-if="femaleNpcs.length">
          <div v-for="npc in femaleNpcs" :key="npc.name" style="margin-bottom:8px;">
            <div class="stat-row">
              <span class="stat-label">{{ npc.name }}</span>
              <span>
                <span :class="['tag', stageCls(npc.阶段)]">{{ npc.阶段 }}</span>
                <span class="stat-value" style="margin-left:6px;">{{ npc.好感度 }}</span>
              </span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" :style="{ width: npc.好感度 + '%' }"></div>
            </div>
            <!-- 女性 NPC 欲望条 -->
            <div class="desire-row">
              <span class="stat-label desire-label">欲望</span>
              <span class="stat-value" style="margin-left:auto;margin-right:6px;">{{ npc.欲望 }}</span>
              <span :class="['tag', desireCls(npc.欲望)]">{{ desireLabel(npc.欲望) }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill desire-fill" :style="{ width: npc.欲望 + '%' }"></div>
            </div>
          </div>
        </template>
        <div v-else class="item-list">
          <span class="item-tag empty">暂无</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bzc-status-bar { display: flex; flex-direction: column; gap: 4px; }
.desire-row { display: flex; align-items: center; gap: 6px; margin-top: 3px; }
.desire-label { font-size: 11px; }
.desire-fill { background: linear-gradient(90deg, #b0609a, #e05080); }
.gender-mark { font-size: 12px; font-weight: 600; }
.male-mark { color: var(--c-accent); }
.female-mark { color: #e05080; }
</style>
