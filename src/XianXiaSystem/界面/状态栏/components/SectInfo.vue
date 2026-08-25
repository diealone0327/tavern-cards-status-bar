<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ sect?: any }>();
const panelOpen = ref(false);
</script>

<template>
  <div class="card" style="cursor:pointer;" @click="panelOpen = !panelOpen">
    <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
      <span>◈ {{ sect?.名称 || '宗门信息' }}</span>
      <span style="font-size:10px;color:var(--c-text-dim);">{{ panelOpen ? '▼' : '▶' }}</span>
    </div>
    <div v-if="panelOpen" style="margin-top:4px;">
      <div v-if="!sect?.名称" style="font-size:11px;color:var(--c-text-muted);font-style:italic;">尚未加入任何宗门</div>
      <div v-else>
        <div style="font-size:12px;color:var(--c-text-dim);">{{ sect.介绍 }}</div>
        <div style="margin-top:4px;font-size:11px;">
          <div>掌门：{{ sect.掌门 || '—' }}</div>
          <div v-if="sect.长老?.length">长老：{{ sect.长老.join('、') }}</div>
          <div v-if="sect.亲传?.length">亲传：{{ sect.亲传.join('、') }}</div>
          <div>弟子：核心{{ sect.核心弟子 ?? '?' }} / 内门{{ sect.内门弟子 ?? '?' }} / 外门{{ sect.外门弟子 ?? '?' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
