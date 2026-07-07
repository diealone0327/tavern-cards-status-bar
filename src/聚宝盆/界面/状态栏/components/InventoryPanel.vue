<template>
  <div class="section">
    <div class="section-title">持有物品</div>
    <div v-if="itemKeys.length" class="item-list">
      <span v-for="(qty, name) in items" :key="name" class="item-tag">{{ name }} ×{{ qty }}</span>
    </div>
    <div v-else class="empty">空</div>

    <div class="section-title" style="margin-top:8px">功法</div>
    <div v-if="techList.length">
      <div v-for="t in techList" :key="t" class="tech-row">
        <span>{{ t }}</span>
        <span v-if="t === equipped" class="eq-badge">已装备</span>
      </div>
    </div>
    <div v-else class="empty">暂无</div>

    <div class="section-title" style="margin-top:8px">宗门 · 秘境</div>
    <div class="info-row"><span>态势</span><span>{{ store.data.宗门?.宗门态势 || '—' }}</span></div>
    <div class="info-row"><span>事件</span><span class="muted">{{ store.data.宗门?.宗门事件 || '—' }}</span></div>
    <div class="info-row"><span>秘境</span><span>{{ store.data.秘境?.当前活跃秘境 || '无' }}</span></div>
    <div class="info-row"><span>倒计时</span><span>{{ store.data.秘境?.开启倒计时 || '—' }}</span></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';
const store = useDataStore();

const items = computed(() => store.data.user?.持有物品 || {});
const itemKeys = computed(() => Object.keys(items.value));
const techList = computed(() => store.data.user?.已学功法 || []);
const equipped = computed(() => store.data.user?.当前装备的功法 || '');
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
.item-list { display: flex; flex-wrap: wrap; gap: 4px; }
.item-tag {
  display: inline-block; padding: 2px 6px; font-size: 11px;
  border: 1px solid var(--c-stroke); background: rgba(255,255,255,0.4);
}
.tech-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 12px; }
.eq-badge { font-size: 10px; color: var(--c-heal); border: 1px solid var(--c-heal); padding: 0 4px; }
.info-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 12px; }
.info-row span:first-child { color: var(--c-ink-muted); }
.muted { color: var(--c-ink-muted); }
</style>
