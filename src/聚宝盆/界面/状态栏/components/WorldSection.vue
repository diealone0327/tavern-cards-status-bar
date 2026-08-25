<template>
  <div class="world">
    <div class="seal">宝</div>
    <div class="info">
      <div class="title">聚宝盆</div>
      <div class="meta">{{ store.data.系统?.当前时间 || '—' }} · {{ store.data.系统?.当前地点 || '—' }}</div>
    </div>
    <div class="phase">{{ store.data.系统?.剧情阶段 || '—' }}</div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();
</script>

<style scoped>
.world {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  border-bottom: 2px solid var(--c-ink);
  background: linear-gradient(180deg, var(--c-paper-light) 0%, var(--c-paper) 100%);
  position: relative;
}

.world::after {
  content: '';
  position: absolute; bottom: -2px; left: 16px; right: 16px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--c-gold-light), transparent);
}

.seal {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--c-gold-dark), var(--c-gold));
  display: grid; place-items: center;
  font-family: var(--font-title); font-weight: 700; font-size: 16px;
  color: var(--c-ink); box-shadow: 0 2px 8px var(--c-shadow);
  position: relative; flex-shrink: 0;
}

.seal::after {
  content: '';
  position: absolute; inset: 2px;
  border-radius: 50%;
  border: 1px solid rgba(42,36,24,0.15);
}

.info { display: grid; gap: 2px; flex: 1; min-width: 0; }

.title {
  font-family: var(--font-title); font-weight: 700; letter-spacing: 0.15em;
  font-size: 15px; color: var(--c-ink);
}

.meta { font-size: 12px; color: var(--c-ink-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.phase {
  font-size: 11px; padding: 3px 10px; border: 1px solid var(--c-gold);
  color: var(--c-gold-dark); background: rgba(201,168,76,0.08);
  white-space: nowrap; font-family: var(--font-title);
  letter-spacing: 0.08em; flex-shrink: 0;
}
</style>
