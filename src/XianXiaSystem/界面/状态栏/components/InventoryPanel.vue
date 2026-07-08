<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  protagonist?: { 道具?: string[]; 丹药?: string[]; 法宝?: string[]; 武器?: string[]; 功法?: string[]; };
}>();

const panelOpen = ref(false);
const catOpen = ref<Set<string>>(new Set());
const expandedItems = ref<Set<string>>(new Set());

const itemDesc: Record<string, string> = {
  // 道具
  '跳蛋（灵石）': '灵石驱动的小型振动器具，可放入体内多档可调',
  '遮灵眼罩': '遮蔽视线并隔绝神识探查，感官变得敏锐',
  '灵脂蜡烛': '灵脂炼制，滴落温度温和，带来轻微刺痛与灼热感',
  '封口禁制球': '放入口中后封印说话能力，仅能发出呜咽声',
  '柔骨露': '涂抹后身体柔韧度大幅提升，持续2小时',
  '羽毛挠（灵羽）': '灵禽羽毛制成，轻扫皮肤带来酥痒感',
  '玄铁手铐': '玄铁打造，可束缚手脚，锁扣可调节松紧',
  '玉势': '暖玉雕成，自动贴合体温，表面有螺纹凸起',
  '乳夹（含灵石）': '夹端嵌灵石，可调节夹紧力度，带微弱振动',
  '拉珠（灵石）': '由小到大的灵石珠串，逐颗纳入带来充实胀满感',
  '捆仙索': '注入灵力后自动缠绕束缚目标，越挣扎越紧',
  '振动棒（灵石）': '灵石驱动的大型振动器具，多档变频力度强劲',
  '锁精环': '佩戴后锁住精关，大幅延长房事时间并增强快感',
  '九尾鞭（柔骨藤）': '柔骨藤编织，击打痛感适中但声响惊人',
  // 丹药
  '回灵丹': '快速恢复消耗的灵力',
  '疗伤丹': '快速治愈轻中度伤势',
  '凝神丹': '修炼时心魔干扰降低，突破成功率小幅提升',
  '培元丹': '修为进度+5',
  '聚气丹': '修炼速度提升30%，持续7天',
  '淬体丹': '肉身强度提升，耐久度小幅增加',
  '大培元丹': '修为进度+15',
  '筑基丹': '帮助炼气→筑基突破，成功率50%（失败可再次服用）',
  '凝婴丹': '帮助金丹大圆满突破元婴期，成功率30%',
  '天命洗髓丹': '洗练资质，提升灵根品质。AI根据NPC体质和功法适配保留属性',
  '九转还魂丹': '濒死起死回生，重伤瞬间痊愈',
  '生息丹': '精液量临时翻倍，持续3天',
  '合欢丹': '双修时对方修为进度+8，快感大幅增强',
  '洗髓丹': '改善体质，修炼速度永久提升10%',
  '破境丹': '大境界突破成功率提升30%',
  '驻颜丹': '容貌恢复延缓衰老20年',
  '延寿丹': '寿元增加10年，突破境界时延寿效果保留',
  '破界丹': '直接突破当前大境界（无视天劫）',
  // 法宝
  '金蛟剪': '金属性极品法宝，双刃交错可斩断同阶法宝',
  '青木灵杖': '木属性极品法宝，蕴含生机催生灵药治愈重伤',
  '玄水珠': '水属性极品法宝，操控万水凝聚冰霜攻防一体',
  '离火旗': '火属性极品法宝，烈焰滔天可布离火大阵',
  '厚土印': '土属性极品法宝，引大地之力镇敌困敌',
  '天机镜': '通用型上古异宝，镜光破虚妄洞察本源',
  // 武器
  '金罡剑': '金属性极品武器，剑气凌厉附带金罡破甲',
  '青木弓': '木属性极品武器，无箭凝气为矢汲取灵力',
  '碧水剑': '水属性极品武器，剑势连绵以柔克刚',
  '赤火枪': '火属性极品武器，烈焰席卷霸道无匹',
  '玄黄斧': '土属性极品武器，一斧劈下势不可挡',
  // 功法
  '金煌斩天诀': '金属性至高功法，修炼至大成可斩破虚空',
  '青木长生诀': '木属性至高功法，修炼至大成枯木逢春断肢重生',
  '玄水真诀': '水属性至高功法，修炼至大成身化万千水影',
  '离火焚天诀': '火属性至高功法，修炼至大成可焚天煮海',
  '厚土镇狱诀': '土属性至高功法，修炼至大成可搬山填海',
  '混沌归元诀': '无属性通用功法，任何灵根皆可修炼，中正平和',
  // 心法
  '金罡心法': '金属性修炼心法，灵力附金罡锋锐，修炼速度+20%',
  '青木心法': '木属性修炼心法，灵力蕴含生机，修炼速度+20%',
  '玄水心法': '水属性修炼心法，灵力绵长，修炼速度+20%总量+30%',
  '离火心法': '火属性修炼心法，灵力霸道炽烈，修炼速度+20%',
  '厚土心法': '土属性修炼心法，灵力厚重，修炼速度+20%防御+30%',
  '混元心法': '无属性通用心法，永无走火入魔之虞',
  // 辅助功诀
  '踏风步': '身法类秘术，移动速度大幅提升可短暂踏空而行',
  '幻影步': '身法类秘术，分出三道幻影迷惑对手真身可切换',
  '回春术': '治疗类秘术，快速愈合外伤疏通经脉瘀阻',
  '太乙金针诀': '治疗类秘术，化解丹毒驱散魔气修复丹田',
  '敛息术': '隐匿修为气息的秘术，高一大境界方可看破',
  '望气术': '瞳术秘术，可观他人修为境界辨识灵物宝光',
  // NSFW技能
  '玉液功': '精液附带催情效果，对方摄入后情欲大幅提升',
  '采补术': '双修时从对方吸取修为转化为己用',
  '共感链接': '指定两人建立感官链接，共享触觉快感',
  '魅惑之瞳': '对视让对方陷入恍惚，服从指令',
  '催情香体': '身体散发淡淡催情香气',
  '灵舌术': '舌头灵活度和敏感度大幅提升',
  '体态随心': '可微调自身身材比例和体态',
  // 修为技能
  '精液疗伤': '射在伤口上可快速愈合',
  '精液灌体': '射入体内提升对方修为+5~10，对方每日限一次',
  '精液破障': '跳过对方当前一个小境界',
};

function groupItems(items: string[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item, (map.get(item) || 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

const categories = computed(() => {
  const p = props.protagonist;
  if (!p) return [];
  const config: [string, string, string[]][] = [
    ['道具', '📦', p.道具 || []],
    ['丹药', '💊', p.丹药 || []],
    ['法宝', '🔮', p.法宝 || []],
    ['武器', '⚔️', p.武器 || []],
    ['功法', '📖', p.功法 || []],
  ];
  return config
    .map(([label, icon, items]) => ({ label, icon, items: items.length > 0 ? groupItems(items) : [{ name: '（空）', count: 0 }] }));
});

function toggle(key: string) {
  const s = new Set(catOpen.value);
  s.has(key) ? s.delete(key) : s.add(key);
  catOpen.value = s;
}
</script>

<template>
  <div class="card">
    <div class="card-title fold-toggle" @click="panelOpen = !panelOpen">
      <span>▣ 背包</span>
      <span class="fold-arrow">{{ panelOpen ? '▼' : '▶' }}</span>
    </div>
    <div v-if="panelOpen" class="fold-body">
      <div v-for="cat in categories" :key="cat.label" class="fold-cat">
        <div class="fold-cat-header" @click="toggle(cat.label)">
          <span>{{ cat.icon }} {{ cat.label }}</span>
          <span class="fold-arrow small">{{ catOpen.has(cat.label) ? '▼' : '▶' }}</span>
        </div>
        <div v-if="catOpen.has(cat.label)" class="fold-cat-body">
          <div v-for="item in cat.items" :key="item.name" class="inv-item" :class="{ empty: item.count === 0 }">
            <div class="inv-header" @click="expandedItems.has(item.name) ? expandedItems.delete(item.name) : expandedItems.add(item.name)">
              <span>{{ cat.icon }} {{ item.name }}<span v-if="item.count > 1" class="item-count"> ×{{ item.count }}</span></span>
              <span v-if="item.count > 0" class="fold-arrow tiny">{{ expandedItems.has(item.name) ? '−' : '+' }}</span>
            </div>
            <div v-if="expandedItems.has(item.name) && itemDesc[item.name]" class="inv-desc">{{ itemDesc[item.name] }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fold-toggle { display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; }
.fold-toggle:hover { opacity: 0.8; }
.fold-arrow { font-size: 10px; color: var(--c-text-dim); }
.fold-arrow.small { font-size: 9px; }
.fold-body { margin-top: 4px; }
.fold-cat { margin-bottom: 2px; border: 1px solid var(--c-border-light); border-radius: 4px; overflow: hidden; }
.fold-cat-header { display: flex; align-items: center; gap: 6px; padding: 5px 8px; cursor: pointer; font-size: 12px; font-weight: 500; background: rgba(255,255,255,0.03); user-select: none; }
.fold-cat-header:hover { background: var(--c-primary-bg); }
.fold-cat-body { border-top: 1px solid var(--c-border-light); padding: 4px 8px; }
.inv-item { border-bottom: 1px solid var(--c-border-light); }
.inv-item:last-child { border-bottom: none; }
.inv-item.empty { color: var(--c-text-muted); font-style: italic; }
.inv-header { display: flex; align-items: center; justify-content: space-between; padding: 3px 0; cursor: pointer; font-size: 11px; color: var(--c-text); user-select: none; }
.inv-header:hover { opacity: 0.8; }
.inv-desc { font-size: 10px; color: var(--c-text-muted); padding: 0 0 4px 0; }
.fold-arrow.tiny { font-size: 8px; color: var(--c-text-dim); }
.item-count { font-size: 10px; color: var(--c-primary); font-weight: 600; }
</style>
