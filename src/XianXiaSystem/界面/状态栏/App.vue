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
  长老: ['柳如烟♀·元婴后期', '沈明月♀·金丹大圆满', '鹤云子♂·金丹后期', '陈墨·金丹中期', '赵青崖·金丹中期', '李寒衣·金丹初期'],
  太上长老: ['玄冥上人♂·化神初期'],
  亲传: ['林清雪♀·筑基后期', '苏婉儿♀·筑基中期'],
  核心: 50,
  内门: 500, 外门: 3000,
};

const 职位表: Record<string, string> = {
  '陆渊♂': '掌门', '柳如烟♀': '执法堂长老', '沈明月♀': '传功长老',
  '鹤云子♂': '丹阁长老', '陈墨': '器阁长老', '赵青崖': '外务长老',
  '李寒衣': '藏经阁长老', '玄冥上人♂': '太上长老',
  '林清雪♀': '亲传弟子', '苏婉儿♀': '亲传弟子',
};

function stripSubStage(realm: string): string {
  const base = realm.replace(/(初期|中期|后期|大圆满)$/, '');
  return base;
}

const sect = computed(() => {
  const s = d?.['当前宗门']?.名称 ? d?.['当前宗门'] : defaultSect;
  const r = d?.NPC关系 || {};
  const enrich = (arr, showTitle = true) => (arr || []).map(item => {
    const p = item.split('·');
    const base = p[0];
    const title = showTitle ? (r[base]?.职位 || 职位表[base] || '') : '';
    const realm = stripSubStage(p[1] || '');
    const lv = r[base]?.小境界;
    const realmDisplay = realm && lv ? `${realm}·${lv}重` : realm || '';
    return { name: title ? `${title}·${base}` : base, realm: realmDisplay };
  });
  const enrich掌门 = () => {
    const base = s.掌门 || '';
    const realm = stripSubStage(s.掌门修为 || '');
    const lv = r[base]?.小境界;
    const realmDisplay = realm && lv ? `${realm}·${lv}重` : realm || '';
    return { name: base, realm: realmDisplay };
  };
  const zm = enrich掌门();
  return {
    ...s,
    掌门: zm.name,
    掌门修为: zm.realm,
    长老: enrich(s.长老, true),
    太上长老: enrich(s.太上长老, false),
    亲传: enrich(s.亲传, false),
  };
});
</script>

<template>
  <div class="xianxia-status-bar">
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
        <div>掌门 {{ sect.掌门 }}<span v-if="sect.掌门修为" style="color:var(--c-accent);margin-left:4px;">（{{ sect.掌门修为 }}）</span></div>
        <div v-if="sect.太上长老?.length">太上长老 <template v-for="(item,i) in sect.太上长老" :key="i"><span v-if="i>0">、</span><span>{{ item.name }}<span v-if="item.realm" style="color:var(--c-accent);margin-left:2px;">（{{ item.realm }}）</span></span></template></div>
        <div v-if="sect.长老?.length">长老 <template v-for="(item,i) in sect.长老" :key="i"><span v-if="i>0">、</span><span>{{ item.name }}<span v-if="item.realm" style="color:var(--c-accent);margin-left:2px;">（{{ item.realm }}）</span></span></template></div>
        <div v-if="sect.亲传?.length">亲传 <template v-for="(item,i) in sect.亲传" :key="i"><span v-if="i>0">、</span><span>{{ item.name }}<span v-if="item.realm" style="color:var(--c-accent);margin-left:2px;">（{{ item.realm }}）</span></span></template></div>
        <div v-if="sect.核心 !== undefined">核心 {{ sect.核心 }}人</div>
        <div>内门 {{ sect.内门 ?? '?' }}人</div>
        <div>外门 {{ sect.外门 ?? '?' }}人</div>
      </div>
    </div>

    <CurrentScene :current-npc="d?.当前互动NPC" />
    <AttributesSkillsPanel :attributes="d?.主角?.属性" :skills="d?.主角?.技能" />
    <InventoryPanel :protagonist="d?.主角" />
    <NPCRelations :relations="d?.NPC关系" :current-npc="d?.当前互动NPC" />
    <ShopPanel :protagonist="d?.主角" />
  </div>
</template>

<style scoped>
.xianxia-status-bar { display: flex; flex-direction: column; gap: 4px; }
</style>
