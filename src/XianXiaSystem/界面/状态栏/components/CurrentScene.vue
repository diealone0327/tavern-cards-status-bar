<script setup lang="ts">
defineProps<{
  currentNpc?: string;
  relations?: Record<string, { 好感度?: number; 沉沦?: number; 寿元?: number }>;
}>();
</script>

<template>
  <div class="card">
    <div class="card-title">◈ 当前在场</div>
    <div v-if="currentNpc && currentNpc !== ''" class="scene-npc-tag tag tag-primary" style="font-size: 13px; padding: 2px 10px;">
      {{ currentNpc }}
    </div>
    <div v-else class="item-tag empty">—</div>
  </div>
</template>

<style scoped>
.scene-npc-tag { display: inline-block; }
.item-tag.empty { color: var(--c-text-muted); font-style: italic; background: transparent; border: 1px dashed var(--c-border-light); padding: 1px 6px; border-radius: 3px; font-size: 11px; display: inline-block; }
</style>
