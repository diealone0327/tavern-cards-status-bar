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
  '精液疗伤', '精液灌体', '精液破障',
  '玉液功', '催情香体', '灵舌术', '加藤鹰之手',
  '琴心', '棋魂', '书道', '画骨', '厨神之手', '品茶宗师', '品酒宗师', '花艺', '舞艺', '房中术', '医术精通', '炼丹精通', '炼器精通', '阵法精通',
]);

const skillDesc: Record<string, string> = {
  // 修为技能 / NSFW技能
  '精液疗伤': '射在对方伤口上可快速愈合，对内伤也有效',
  '精液灌体': '射入对方体内可提升修为进度+5~10',
  '精液破障': '射入对方体内，有瓶颈时突破瓶颈并小境界+1',
  // NSFW技能
  '玉液功': '精液附带催情效果，对方摄入后情欲大幅提升',
  '共感链接': '可指定两人建立感官链接，双方共享触觉和快感',
  '入梦': '进入他人梦境，交流或窥探记忆秘密',
  '透视眼': '看穿衣物墙壁遮挡，透视储物袋或灵力流转',
  '催情香体': '身体自然散发淡淡香气，对异性有轻微催情效果',
  '灵舌术': '舌头灵活度和敏感度大幅提升',
  '加藤鹰之手': '手指灵活度和敏感度大幅提升，手技出神入化',
  // 生活技能
  '琴心': '琴艺天赋大幅提升，弹奏时附带安抚心神效果',
  '棋魂': '棋艺达到大师级水平',
  '书道': '书法水平大师级，写出的字蕴含一丝道韵',
  '画骨': '画技大师级，所画之物有灵性',
  '厨神之手': '烹饪水平大师级，做出的食物附带微弱增益效果',
  '品茶宗师': '品茶鉴茶水平大师级，能品出茶中残留的灵力',
  '品酒宗师': '品酒鉴酒水平大师级，千杯不醉',
  '花艺': '精通花道，插花作品可小幅改善周围环境灵气',
  '舞艺': '舞技大师级，舞蹈时具有魅惑效果',
  '房中术': '精通房事技巧与闺中秘术，熟悉各种体位、前戏手法和调情技巧，能让伴侣获得更好的体验',
  '医术精通': '精通高级医术',
  '炼丹精通': '掌握炼丹理论与丹方，可指导炼制、辨识品级',
  '炼器精通': '掌握炼器理论与器方，可指导炼器、鉴别品级',
  '阵法精通': '掌握阵道理论与完整阵图，可指导布阵推演',
};

const categories = computed(() => {
  const cats: { key: string; icon: string; label: string; items: { label: string; val: any }[] }[] = [];

  if (props.attributes) {
    cats.push({
      key: '肉身属性', icon: '📏',
      label: 'NSFW属性',
      items: Object.entries(props.attributes).map(([k, v]) => ({
        label: ({ 长度: '📏 长度', 粗度: '🔄 粗度', 硬度: '⛰️ 硬度', 耐久度: '🛡️ 耐久度', 精液量: '💧 精液量' } as Record<string, string>)[k] || k,
        val: v ?? 0,
      })),
    });
  }

  const s = props.skills;
  if (s) {
    const allSkills = [
      ...(s.修为技能 || []).map(n => ({ name: n, icon: '✦' })),
      ...(s.NSFW技能 || []).map(n => ({ name: n, icon: '❤️' })),
      ...(s.生活技能 || []).map(n => ({ name: n, icon: '🛠️' })),
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
      <span>◎ NSFW和其他技能</span>
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
