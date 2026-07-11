<script setup lang="ts">
import { ref, computed } from 'vue';
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
const sectOpen = ref(false);
const defaultSect = {
  名称: '青云宗', 品级: '上品',
  介绍: '雄踞青云山脉的上品宗门，立派三千年，以剑修为核心。门内弟子数千，位列上品宗门之列。',
  掌门: '陆渊♂', 掌门修为: '元婴后期',
  长老: ['柳如烟♀·元婴后期', '沈明月♀·金丹大圆满', '鹤云子♂·金丹后期', '陈墨·金丹中期', '赵青崖·金丹中期', '李寒衣·金丹初期'], 长老修为: '',
  太上长老: ['玄冥上人♂·化神初期'], 太上长老修为: '',
  亲传: ['林清雪♀·筑基后期', '苏婉儿♀·筑基中期'], 亲传修为: '',
  核心: 50,
  内门: 500, 外门: 3000,
};
const sect = computed(() => d?.['当前宗门']?.名称 ? d?.['当前宗门'] : defaultSect);
const fmt = (name) => { const p = name.split('·'); return { n: p[0], r: p[1] || '' }; };
</script>

<template>
  <div class="xianxia-status-bar">
    <!-- 顶层状态 -->
    <SystemStatus :system="d?.系统" />
    <TaskPanel :task-data="d?.系统" />
    <ProtagonistPanel :protagonist="d?.主角" />

    <!-- 当前宗门 -->
    <div class="card" style="cursor:pointer;" @click="sectOpen = !sectOpen">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
        <span>◈ {{ sect.名称 }}</span>
        <span style="font-size:10px;color:var(--c-text-dim);">{{ sectOpen ? '▼' : '▶' }}</span>
      </div>
      <div v-if="sectOpen" style="margin-top:4px;font-size:11px;line-height:1.8;">
        <div>掌门 {{ sect.掌门 || '—' }}<span v-if="sect.掌门修为" style="color:var(--c-accent);margin-left:4px;">（{{ sect.掌门修为 }}）</span></div>
        <div v-if="sect.长老?.length">长老 <template v-for="(item,i) in sect.长老" :key="i"><span v-if="i>0">、</span><span>{{ fmt(item).n }}<span v-if="fmt(item).r" style="color:var(--c-accent);margin-left:2px;">（{{ fmt(item).r }}）</span></span></template></div>
        <div v-if="sect.太上长老?.length">太上长老 <template v-for="(item,i) in sect.太上长老" :key="i"><span v-if="i>0">、</span><span>{{ fmt(item).n }}<span v-if="fmt(item).r" style="color:var(--c-accent);margin-left:2px;">（{{ fmt(item).r }}）</span></span></template></div>
        <div v-if="sect.亲传?.length">亲传 <template v-for="(item,i) in sect.亲传" :key="i"><span v-if="i>0">、</span><span>{{ fmt(item).n }}<span v-if="fmt(item).r" style="color:var(--c-accent);margin-left:2px;">（{{ fmt(item).r }}）</span></span></template></div>
        <div v-if="sect.核心 !== undefined">核心 {{ sect.核心 }}人</div>
        <div>内门 {{ sect.内门 ?? '?' }}人</div>
        <div>外门 {{ sect.外门 ?? '?' }}人</div>
      </div>
    </div>

    <!-- 当前在场角色 -->
    <CurrentScene :current-npc="d?.当前互动NPC" />

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
    <ShopPanel :protagonist="d?.主角" />
  </div>
</template>

<style scoped>
.xianxia-status-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
