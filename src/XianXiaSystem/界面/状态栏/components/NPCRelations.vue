<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  relations?: Record<string, { 好感度?: number; 沉沦?: number; 寿元?: number; 年纪?: number; 修为?: string; 小境界?: number; 修为进度?: number; 瓶颈?: boolean; 性别?: string; 灵根?: string; 描述?: string }>;
  currentNpc?: string;
}>();

const panelOpen = ref(false);
const expandedNpcs = ref<Set<string>>(new Set());

const red颜 = computed(() => {
  if (!props.relations) return [];
  return Object.entries(props.relations)
    .filter(([, data]) => data.性别 === '女')
    .sort(([, a], [, b]) => (b.好感度 ?? 0) - (a.好感度 ?? 0))
    .map(([name, data]) => ({ name, ...data, isActive: name === props.currentNpc }));
});


function toggleCat(key: string) {
  const s = new Set(catOpen.value);
  s.has(key) ? s.delete(key) : s.add(key);
  catOpen.value = s;
}

function toggleNpc(name: string) {
  const s = new Set(expandedNpcs.value);
  s.has(name) ? s.delete(name) : s.add(name);
  expandedNpcs.value = s;
}

function affinityColor(val: number): string {
  if (val >= 210) return 'var(--c-success)';
  if (val >= 120) return 'var(--c-primary)';
  if (val >= 60) return 'var(--c-warning)';
  return 'var(--c-danger)';
}

function depravityColor(val: number): string {
  if (val >= 201) return 'var(--c-danger)';
  if (val >= 121) return 'var(--c-warning)';
  if (val >= 61) return 'var(--c-primary)';
  return 'var(--c-text-dim)';
}
</script>

<template>
  <div class="card">
    <div class="card-title fold-toggle" @click="panelOpen = !panelOpen">
      <span>♡ 红颜</span>
      <span class="fold-arrow">{{ panelOpen ? '▼' : '▶' }}</span>
    </div>

    <div v-if="panelOpen" class="fold-body">
      <div v-if="red颜.length === 0" class="empty-tip">暂无</div>
      <div v-for="npc in red颜" :key="npc.name" class="npc-item" :class="{ active: npc.isActive }">
        <div class="npc-header" @click="toggleNpc(npc.name)">
              <span class="npc-name">{{ npc.name }}</span>
              <span v-if="npc.灵根" class="tag tag-ligen">{{ npc.灵根 }}</span>
              <span v-if="npc.isActive" class="tag tag-accent">当前</span>
              <span class="fold-arrow tiny">{{ expandedNpcs.has(npc.name) ? '−' : '+' }}</span>
            </div>
            <div v-if="expandedNpcs.has(npc.name)" class="npc-detail">
              <div v-if="npc.描述" class="npc-desc" style="font-size:11px;color:var(--c-text);padding:4px 0 6px;line-height:1.5;border-bottom:1px solid var(--c-border-light);margin-bottom:4px;">{{ npc.描述 }}</div>
              <div class="npc-stat-row"><span class="stat-label">好感</span><div class="mini-bar"><div class="mini-fill" :style="{ width: Math.min(npc.好感度 ?? 0, 100) + '%', background: affinityColor(npc.好感度 ?? 0) }" /></div><span class="stat-value" :style="{ color: affinityColor(npc.好感度 ?? 0) }">{{ npc.好感度 ?? 0 }}</span></div>
              <div class="npc-stat-row" v-if="npc.沉沦 !== undefined"><span class="stat-label">沉沦</span><div class="mini-bar"><div class="mini-fill" :style="{ width: (npc.沉沦 ?? 0) + '%', background: depravityColor(npc.沉沦 ?? 0) }" /></div><span class="stat-value" :style="{ color: depravityColor(npc.沉沦 ?? 0) }">{{ npc.沉沦 ?? 0 }}</span></div>
              <div class="npc-stat-row"><span class="stat-label">年纪</span><span class="stat-value" style="font-size: 11px;">{{ (npc.年纪 && npc.年纪 > 0) ? npc.年纪 + '岁' : '—' }}</span></div>
              <div class="npc-stat-row"><span class="stat-label">修为</span><span class="stat-value" style="font-size: 11px;">{{ npc.修为 || '—' }}<span v-if="npc.瓶颈" class="bottleneck-tag">瓶颈</span></span></div>
              <div class="npc-stat-row" v-if="npc.小境界"><span class="stat-label">小境界</span><span class="stat-value" style="font-size: 11px;">{{ npc.小境界 }}</span></div>
              <div class="npc-stat-row" v-if="npc.灵根"><span class="stat-label">灵根</span><span class="stat-value" style="font-size: 11px;">{{ npc.灵根 }}</span></div>
              <div class="npc-stat-row"><span class="stat-label">修为进度</span><div class="mini-bar"><div class="mini-fill" :style="{ width: (npc.修为进度 ?? 0) + '%', background: 'var(--c-primary)' }" /></div><span class="stat-value primary">{{ npc.修为进度 ?? 0 }}%</span></div>
              <div class="npc-stat-row"><span class="stat-label">寿元</span><span class="stat-value" style="font-size: 11px;">{{ npc.寿元 ?? '?' }}年</span></div>
            </div>
          </div>
    </div>
  </div>
</template>

<style scoped>
.fold-toggle { display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; }
.fold-toggle:hover { opacity: 0.8; }
.fold-arrow { font-size: 10px; color: var(--c-text-dim); }
.fold-arrow.small { font-size: 9px; }
.fold-arrow.tiny { font-size: 8px; margin-left: auto; }
.fold-body { margin-top: 4px; }
.fold-cat { margin-bottom: 2px; border: 1px solid var(--c-border-light); border-radius: 4px; overflow: hidden; }
.fold-cat-header { display: flex; align-items: center; gap: 6px; padding: 5px 8px; cursor: pointer; font-size: 12px; font-weight: 500; background: rgba(255,255,255,0.03); user-select: none; }
.fold-cat-header:hover { background: var(--c-primary-bg); }
.cat-count { font-size: 10px; color: var(--c-text-muted); }
.fold-cat-body { border-top: 1px solid var(--c-border-light); padding: 2px 0; }
.empty-tip { font-size: 11px; color: var(--c-text-muted); font-style: italic; padding: 6px 8px; }
.npc-item { border-bottom: 1px solid var(--c-border-light); }
.npc-item.active { background: var(--c-primary-bg); }
.npc-header { display: flex; align-items: center; gap: 6px; padding: 4px 8px; cursor: pointer; font-size: 11px; user-select: none; }
.npc-header:hover { background: rgba(255,255,255,0.04); }
.npc-name { flex: 1; font-weight: 600; color: var(--c-text); font-size: 12px; }
.npc-detail { padding: 4px 8px 6px; background: rgba(0,0,0,0.15); border-top: 1px solid var(--c-border-light); }
.npc-stat-row { display: flex; align-items: center; gap: 6px; padding: 2px 0; }
.mini-bar { flex: 1; height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; max-width: 60px; }
.mini-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }
.tag-ligen { background: rgba(91,155,213,0.15); color: var(--c-primary); padding: 1px 4px; border-radius: 3px; font-size: 9px; font-weight: 500; }
.tag-accent { background: var(--c-accent-bg); color: var(--c-accent); padding: 1px 4px; border-radius: 3px; font-size: 9px; }
.bottleneck-tag { display: inline-block; margin-left: 4px; padding: 0 4px; border-radius: 2px; font-size: 9px; font-weight: 600; color: #fff; background: var(--c-danger); vertical-align: middle; }
.stat-label { color: var(--c-text-dim); font-size: 11px; }
.stat-value { color: var(--c-text); font-weight: 500; font-size: 11px; }
.stat-value.primary { color: var(--c-primary); }
</style>
