<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  attributes?: {
    长度?: number; 粗度?: number; 硬度?: number; 耐久度?: number; 精液量?: number;
  };
  skills?: {
    NSFW技能?: string[]; 修为技能?: string[]; 生活技能?: string[];
  };
}>();

const panelOpen = ref(false);
const catOpen = ref<Set<string>>(new Set());

const passiveSkills = new Set([
  '自动修炼', '百分之百突破', '精元转化', '小境界无瓶颈', '炼丹精通', '炼器精通', '阵法精通',
  '精液疗伤', '精液灌体',
  '玉液功', '催情香体', '灵舌术',
  '琴心', '棋魂', '书道', '画骨', '厨神之手', '品茶宗师', '品酒宗师', '花艺', '舞艺', '房中术', '医术精通', '阵法入门',
]);

const skillDesc: Record<string, string> = {
  // 修为技能
  '自动修炼': '每日修为进度自动+1',
  '百分之百突破': '大境界突破免疫天雷，必定成功',
  '精元转化': '射精时精元转化为修为，+20~30进度',
  '精液疗伤': '射在伤口上可快速愈合',
  '精液灌体': '射入体内提升对方修为+5~10，每日限一次',
  '精液破障': '跳过对方当前一个小境界',
  '小境界无瓶颈': '小境界自动晋升，无需突破剧情',
  '炼丹精通': '掌握基础至宗师级炼丹术',
  '炼器精通': '掌握基础至宗师级炼器术',
  '阵法精通': '掌握基础至宗师级阵道',
  '修为掩盖': '设置虚假修为对外展示，不能超过实际修为',
  // NSFW技能
  '玉液功': '精液附带催情效果',
  '共感链接': '指定两人建立感官链接，共享触觉快感',
  '魅惑之瞳': '对视让对方陷入恍惚，服从指令',
  '催情香体': '身体散发淡淡催情香气',
  '灵舌术': '舌头灵活度和敏感度大幅提升',
  '体态随心': '可微调自身身材比例和体态',
  // 生活技能
  '琴心': '琴艺天赋大幅提升，安抚心神',
  '棋魂': '棋艺大师级水平',
  '书道': '书法大师级，字含道韵',
  '画骨': '画技大师级，所画有灵性',
  '厨神之手': '烹饪大师级，食物带增益效果',
  '品茶宗师': '品茶鉴茶大师级',
  '品酒宗师': '品酒鉴酒大师级，千杯不醉',
  '花艺': '精通花道，改善环境灵气',
  '舞艺': '舞技大师级，舞蹈带魅惑',
  '房中术': '精通双修之法，修为进度额外+3',
  '医术精通': '掌握基础至中级医术丹药知识',
  '阵法入门': '掌握基础阵法知识',
};

const categories = computed(() => {
  const cats: { key: string; icon: string; label: string; items: { label: string; val: any }[] }[] = [];

  if (props.attributes) {
    cats.push({
      key: '肉身属性', icon: '📏',
      label: '肉身属性',
      items: Object.entries(props.attributes).map(([k, v]) => ({
        label: ({ 长度: '📏 长度', 粗度: '🔄 粗度', 硬度: '⛰️ 硬度', 耐久度: '🛡️ 耐久度', 精液量: '💧 精液量' } as Record<string, string>)[k] || k,
        val: v ?? 0,
      })),
    });
  }

  const s = props.skills;
  if (s) {
    const exclude = new Set(['采补术']);
    const allSkills = [
      ...(s.修为技能 || []).filter(n => !exclude.has(n)).map(n => ({ name: n, icon: '✦' })),
      ...(s.NSFW技能 || []).filter(n => !exclude.has(n)).map(n => ({ name: n, icon: '❤️' })),
      ...(s.生活技能 || []).filter(n => !exclude.has(n)).map(n => ({ name: n, icon: '🛠️' })),
    ];
    const passive = allSkills.filter(sk => passiveSkills.has(sk.name));
    const active = allSkills.filter(sk => !passiveSkills.has(sk.name));
    if (passive.length > 0) {
      cats.push({
        key: '被动技能', icon: '🟢', label: '被动技能',
        items: passive.map(i => ({ label: i.icon + ' ' + i.name, val: '', rawName: i.name })),
      });
    }
    if (active.length > 0) {
      cats.push({
        key: '主动技能', icon: '🔴', label: '主动技能',
        items: active.map(i => ({ label: i.icon + ' ' + i.name, val: '', rawName: i.name })),
      });
    }
    if (passive.length === 0 && active.length === 0) {
      cats.push({ key: '技能', icon: '✦', label: '技能', items: [{ label: '（空）', val: '_empty' }] });
    }
  }

  return cats;
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
      <span>◎ 肉身·技能</span>
      <span class="fold-arrow">{{ panelOpen ? '▼' : '▶' }}</span>
    </div>
    <div v-if="panelOpen" class="fold-body">
      <div v-for="cat in categories" :key="cat.key" class="fold-cat">
        <div class="fold-cat-header" @click="toggle(cat.key)">
          <span>{{ cat.icon }} {{ cat.label }}</span>
          <span class="fold-arrow small">{{ catOpen.has(cat.key) ? '▼' : '▶' }}</span>
        </div>
        <div v-if="catOpen.has(cat.key)" class="fold-cat-body">
          <div v-for="item in cat.items" :key="item.label" class="fold-item">
            <span class="stat-label">{{ item.label }}</span>
            <span v-if="item.val === '_empty'" class="stat-value" style="color: var(--c-text-muted); font-style: italic;">（空）</span>
            <span v-else-if="item.val !== ''" class="stat-value primary">{{ item.val }}</span>
            <div v-else class="skill-meta">
              <span class="skill-type" :class="passiveSkills.has(item.rawName) ? 'passive' : 'active'">{{ passiveSkills.has(item.rawName) ? '被动' : '主动' }}</span>
              <span v-if="skillDesc[item.rawName]" class="skill-desc">{{ skillDesc[item.rawName] }}</span>
            </div>
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
.fold-item { display: flex; justify-content: space-between; align-items: center; padding: 2px 0; flex-wrap: wrap; }
.skill-meta { width: 100%; display: flex; align-items: center; gap: 4px; padding: 1px 0 2px 0; }
.skill-type { display: inline-block; padding: 0 4px; border-radius: 2px; font-size: 9px; font-weight: 500; flex-shrink: 0; }
.skill-type.passive { background: rgba(107,191,89,0.15); color: var(--c-success); }
.skill-type.active { background: rgba(224,80,80,0.15); color: var(--c-danger); }
.skill-desc { font-size: 10px; color: var(--c-text-muted); }
</style>
