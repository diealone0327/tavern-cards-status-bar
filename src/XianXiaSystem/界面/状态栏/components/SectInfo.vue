<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  sect?: {
    名称?: string;
    品级?: string;
    介绍?: string;
    掌门?: string;
    长老?: string[];
    亲传?: string[];
    核心弟子?: number;
    内门弟子?: number;
    外门弟子?: number;
  };
}>();

const panelOpen = ref(false);
</script>

<template>
  <div class="card" v-if="sect?.名称">
    <div class="card-title fold-toggle" @click="panelOpen = !panelOpen">
      <span>◈ {{ sect.名称 }}
        <span class="realm-tag" v-if="sect.品级">{{ sect.品级 === '顶级' ? '★' : sect.品级 === '上品' ? '◆' : '●' }} {{ sect.品级 }}</span>
      </span>
      <span class="fold-arrow">{{ panelOpen ? '▼' : '▶' }}</span>
    </div>
    <div v-if="panelOpen" class="fold-body">
      <div v-if="sect.介绍" class="sect-desc">{{ sect.介绍 }}</div>

      <div class="divider" />
      <div class="sect-section">
        <div class="sect-section-title">👥 弟子规模</div>
        <div class="grid-2">
          <div class="stat-row"><span class="stat-label">核心弟子</span><span class="stat-value primary">{{ sect.核心弟子 ?? '?' }}人</span></div>
          <div class="stat-row"><span class="stat-label">内门弟子</span><span class="stat-value primary">{{ sect.内门弟子 ?? '?' }}人</span></div>
          <div class="stat-row"><span class="stat-label">外门弟子</span><span class="stat-value primary">{{ sect.外门弟子 ?? '?' }}人</span></div>
        </div>
      </div>

      <div class="divider" />
      <div class="sect-section">
        <div class="sect-section-title">🏛️ 管理层</div>
        <div class="stat-row"><span class="stat-label">掌门</span><span class="stat-value primary">{{ sect.掌门 || '—' }}</span></div>
        <div class="stat-row" v-if="sect.长老?.length"><span class="stat-label">长老</span><span class="stat-value" style="font-size: 11px;">{{ sect.长老.join('、') }}</span></div>
        <div class="stat-row" v-if="sect.亲传?.length"><span class="stat-label">亲传</span><span class="stat-value" style="font-size: 11px;">{{ sect.亲传.join('、') }}</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fold-toggle { display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; }
.fold-toggle:hover { opacity: 0.8; }
.fold-arrow { font-size: 10px; color: var(--c-text-dim); }
.fold-body { margin-top: 4px; }
.sect-desc {
  font-size: 12px;
  color: var(--c-text-dim);
  line-height: 1.6;
  padding: 4px 0;
}
.sect-section { padding: 2px 0; }
.sect-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--c-primary);
  margin-bottom: 3px;
}
.realm-tag { font-size: 10px; color: var(--c-accent); opacity: 0.85; font-weight: 400; }
</style>
