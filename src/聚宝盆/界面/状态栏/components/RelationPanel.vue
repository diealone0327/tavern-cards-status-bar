<template>
  <div class="section">
    <div class="section-title">人际关系</div>
    <div v-if="heroineKeys.length">
      <div v-for="(val, name) in heroines" :key="name" class="aff-row">
        <span class="aff-name">{{ name }}</span>
        <div class="aff-track"><div class="aff-fill" :style="{ width: Math.min(val, 100) + '%' }"></div></div>
        <span class="aff-val">{{ val }}</span>
      </div>
    </div>
    <div v-else class="empty">暂无</div>

    <div class="section-title" style="margin-top:8px">NPC 关系</div>
    <div v-if="npcKeys.length">
      <div v-for="(att, name) in npcRels" :key="name" class="npc-row">
        <span>{{ name }}</span>
        <span :class="'npc-' + att">{{ att }}</span>
      </div>
    </div>
    <div v-else class="empty">暂无</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';
const store = useDataStore();

const heroines = computed(() => store.data.人际关系 || {});
const heroineKeys = computed(() => Object.keys(heroines.value));
const npcRels = computed(() => store.data.随机NPC关系 || {});
const npcKeys = computed(() => Object.keys(npcRels.value));
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
.empty { color: var(--c-ink-muted); font-size: 12px; padding: 4px 0; }
.aff-row { display: flex; align-items: center; gap: 6px; padding: 3px 0; }
.aff-name { min-width: 48px; font-size: 12px; }
.aff-track { flex: 1; height: 6px; background: rgba(42,36,24,0.06); border-radius: 3px; overflow: hidden; }
.aff-fill { height: 100%; background: linear-gradient(90deg, var(--c-seal), #d4736e); border-radius: 3px; transition: width 0.3s; }
.aff-val { font-size: 11px; color: var(--c-ink-muted); min-width: 24px; text-align: right; }
.npc-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 12px; }
.npc-row span:first-child { color: var(--c-ink-muted); }
.npc-友好 { color: var(--c-friend); font-weight: 600; }
.npc-冷漠 { color: var(--c-neutral); }
.npc-敌对 { color: var(--c-hostile); font-weight: 600; }
</style>
