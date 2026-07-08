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
  '时间暂停沙漏': '暂停周围时间10秒，仅持有者可自由行动',
  '读心饼干': '食用后10分钟内可听到面前之人内心想法',
  '记忆交换券': '与目标交换一段指定记忆',
  '强制坦白喷雾': '被喷中者3分钟内无法说谎',
  '身体互换卡': '与目标交换身体24小时',
  '情绪稳定剂': '服用后1小时情绪保持平静',
  '存在感降低贴纸': '贴上后存在感降低30分钟',
  '场景回溯沙': '回放指定地点过去1小时内发生的事',
  '语言通晓符': '24小时内可听懂说出任何语言',
  '魅惑香囊': '佩戴后12小时对异性吸引力提升',
  '梦境编织枕': '入睡后可自主设计梦境或进入他人梦境',
  '契约之笔': '双方签署的契约具有强制约束力',
  '瞬间传送符': '传送到100里内任意去过的地方',
  '疼痛转移手环': '将自身疼痛转移到佩戴此环的目标身上',
  '感官增幅眼镜': '视觉听觉嗅觉灵敏度提升3倍，持续15分钟',
  '缩身丸': '身体缩小到一半大小，持续30分钟',
  // 丹药
  '回灵丹': '快速恢复消耗的灵力',
  '疗伤丹': '快速治愈轻中度伤势',
  '凝神丹': '修炼时心魔干扰降低，突破成功率小幅提升',
  '培元丹': '修为进度+5',
  '聚气丹': '修炼速度提升30%，持续7天',
  '淬体丹': '肉身强度提升，耐久度小幅增加',
  '大培元丹': '修为进度+15，每个境界限用5次',
  '筑基丹': '帮助炼气→筑基突破，成功率50%',
  '生息丹': '精液量临时翻倍，持续3天',
  '合欢丹': '双修双方修为进度各+8，快感增强',
  '洗髓丹': '改善体质，修炼速度永久提升10%',
  '破境丹': '大境界突破成功率提升30%',
  '驻颜丹': '容貌恢复延缓衰老20年',
  '延寿丹': '寿元增加10年，每人最多3颗',
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
