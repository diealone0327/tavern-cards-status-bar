<template>
  <div class="section">
    <div class="section-title">修行</div>
    <div class="realm-row">
      <span class="realm-badge">{{ store.data.user?.修为境界 || '练气' }}</span>
      <div class="progress-track"><div class="progress-fill" :style="{ width: pct + '%' }"></div></div>
      <span class="progress-label">{{ pct }}%</span>
    </div>
    <div class="info-row"><span>身体</span><span :class="'hp-' + hpCls">{{ store.data.user?.身体状况 || '健康' }}</span></div>
    <div class="info-row"><span>职位</span><span>{{ store.data.user?.宗门职位 || '—' }}</span></div>
    <div class="info-row"><span>穿着</span><span class="muted">{{ store.data.user?.穿着 || '—' }}</span></div>

    <div class="section-title" style="margin-top:8px">灵石</div>
    <div class="info-row"><span>下品</span><span class="gold">{{ store.data.user?.下品灵石 ?? 0 }}</span></div>
    <div class="info-row"><span>中品</span><span class="gold">{{ store.data.user?.中品灵石 ?? 0 }}</span></div>
    <div class="info-row"><span>上品</span><span class="gold">{{ store.data.user?.上品灵石 ?? 0 }}</span></div>
    <div class="info-row"><span>贡献</span><span class="gold">{{ store.data.user?.宗门贡献 ?? 0 }}</span></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';
const store = useDataStore();

const pct = computed(() => Math.min(store.data.user?.修为进度 || 0, 100));
const hpCls = computed(() => {
  const h = store.data.user?.身体状况 || '健康';
  if (h === '健康') return 'ok';
  if (h === '重伤' || h === '濒危') return 'bad';
  return 'warn';
});
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
.realm-row { display: flex; align-items: center; gap: 6px; padding: 2px 0; }
.realm-badge {
  padding: 1px 6px; font-size: 11px; border: 1px solid var(--c-gold);
  background: rgba(201,168,76,0.1); color: var(--c-gold-dark);
  font-weight: 700; white-space: nowrap; font-family: var(--font-title);
}
.progress-track { flex: 1; height: 6px; background: rgba(42,36,24,0.06); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--c-gold-dark), var(--c-gold)); border-radius: 3px; transition: width 0.3s; }
.progress-label { font-size: 11px; color: var(--c-ink-muted); min-width: 28px; text-align: right; }
.info-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 12px; }
.info-row span:first-child { color: var(--c-ink-muted); }
.gold { color: var(--c-gold-dark); font-weight: 600; }
.muted { color: var(--c-ink-muted); }
.hp-ok { color: var(--c-heal); }
.hp-warn { color: var(--c-calm); }
.hp-bad { color: var(--c-harm); }
</style>
