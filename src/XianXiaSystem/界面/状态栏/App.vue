<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from './store';
import SystemStatus from './components/SystemStatus.vue';
import TaskPanel from './components/TaskPanel.vue';
import ProtagonistPanel from './components/ProtagonistPanel.vue';
import CurrentScene from './components/CurrentScene.vue';
import AttributesSkillsPanel from './components/AttributesSkillsPanel.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import NPCRelations from './components/NPCRelations.vue';
import ShopPanel from './components/ShopPanel.vue';

const store = useDataStore();
const d = computed(() => store.data);
</script>

<template>
  <div class="xianxia-status-bar">
    <!-- 顶层状态 -->
    <SystemStatus :system="d?.系统" />
    <TaskPanel :task-data="d?.系统" />
    <ProtagonistPanel :protagonist="d?.主角" />

    <!-- 当前在场角色 -->
    <CurrentScene
      :current-npc="d?.当前互动NPC"
      :relations="d?.NPC关系"
    />

    <!-- 肉身属性 + 已学技能 -->
    <AttributesSkillsPanel
      :attributes="d?.主角?.属性"
      :skills="d?.主角?.技能"
    />

    <!-- 背包 -->
    <InventoryPanel :protagonist="d?.主角" />

    <!-- NPC关系 -->
    <NPCRelations
      :relations="d?.NPC关系"
      :current-npc="d?.当前互动NPC"
    />

    <!-- 系统商城（可折叠） -->
    <ShopPanel />
  </div>
</template>

<style scoped>
.xianxia-status-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
