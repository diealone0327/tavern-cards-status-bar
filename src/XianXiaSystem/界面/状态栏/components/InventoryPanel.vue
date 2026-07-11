<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  protagonist?: { 道具?: string[]; 丹药?: string[]; 法宝?: string[]; 武器?: string[]; 功法?: string[]; 杂物?: string[]; };
}>();

const panelOpen = ref(false);
const catOpen = ref<Set<string>>(new Set());
const expandedItems = ref<Set<string>>(new Set());

const itemDesc: Record<string, string> = {
  // 道具
  '跳蛋（灵石）': '灵石驱动的小型跳蛋，可用于刺激敏感部位，多档可调，也可以放入体内，适合自慰或前戏挑逗',
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
  '培元丹': '修为进度+5',
  '聚气丹': '修炼速度提升30%，持续7天',
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
  '金梭镖': '金属性法器·极品。三枚金梭遥控飞行攻击，穿梭如电',
  '青藤索': '木属性法器·极品。剑蕴青木之力，挥剑催藤蔓缠绕',
  '分水珠': '水属性法器·极品。剑势如碧波荡漾连绵不绝，以柔克刚',
  '烈火旗': '火属性法器·极品。挥动烈焰升腾，布简易火阵困敌',
  '玄土罩': '土属性法器·极品。土黄护罩挡中阶法术攻击',
  '万象令': '通用型法器·极品。记录一道低阶法术每日复放一次',
  '金刚圈': '金属性灵器·极品。金属性灵器·极品。金虹剑气凌厉无匹，剑出金虹贯日',
  '青木鼎': '木属性灵器·极品。木属性灵器·极品。剑蕴生机，草木精华化为己用',
  '玄冰鉴': '水属性灵器·极品。千年水属性灵器·极品。寒冰剑气冻结经脉气血',
  '紫火钟': '火属性灵器·极品。火属性灵器·极品。紫炎剑气焚尽万物',
  '厚土幡': '土属性灵器·极品。土属性灵器·极品。引大地之力镇敌困敌',
  '混元伞': '通用型灵器·极品。通用型灵器·极品。剑化万千攻守兼备',
  '金罡环': '金属性仙器·极品。金罡之气切割万物挡者披靡',
  '青帝灵藤': '木属性仙器·极品。木属性仙器·极品。青帝剑气所至生机尽收',
  '玄冥珠': '水属性仙器·极品。水属性仙器·极品。沧浪剑意冰封千里',
  '离天鼎': '火属性仙器·极品。火属性仙器·极品。离天剑气焚天煮海',
  '镇天印': '土属性仙器·极品。土属性仙器·极品。不动明王剑罡万法不侵',
  '周天盘': '通用型仙器·极品。通用型仙器·极品。混沌剑意破尽万法，布周天星辰大阵',
  '金蛟剪': '金属性神器·极品。双刃如蛟剪尾可斩同阶法宝护甲',
  '青木灵杖': '木属性神器·极品。生机治愈重伤，修炼事半功倍',
  '玄水珠': '水属性神器·极品。碧水剑意连绵不绝以柔克刚',
  '离火旗': '火属性神器·极品。赤霄剑气横扫万里',
  '厚土印': '土属性神器·极品。玄黄剑气一剑山川崩',
  '天机镜': '通用型神器·极品。七星引星辰之力无属性限制',
  '镇魂钟': '神识类神器·极品。神识类神器·极品。镇魂钟鸣震魂定神',
  '锁神甲': '神识类防御神器·极品。神识类防御神器·极品。锁神甲护持神识海',
  '万象珠': '神识类神器·极品。神识类神器·极品。万象珠大幅增强神识',
  // 武器
  '金锋剑': '金属性法器·极品。飞剑锋锐无匹附带切割之力',
  '青木剑': '木属性法器·极品。剑身蕴草木生机，挥剑催藤蔓缠绕',
  '碧波剑': '水属性法器·极品。剑势连绵以柔克刚如碧波荡漾',
  '赤焰剑': '火属性法器·极品。剑身赤焰缠绕，一剑烈焰席卷',
  '玄石剑': '土属性法器·极品。玄铁精石铸剑，一剑碎石裂地',
  '归元剑': '通用型法器·极品。锋锐随修为提升，各类修士皆宜',
  '金虹剑': '金属性灵器·极品。剑出金虹贯日剑气纵横百丈',
  '青冥剑': '木属性灵器·极品。剑出青虹贯日，木灵之力生生不息',
  '寒冰剑': '水属性灵器·极品。千年寒冰凝剑身冻经脉气血',
  '紫炎剑': '火属性灵器·极品。剑身紫炎升腾，一剑焚百里',
  '厚土剑': '土属性灵器·极品。大地之力凝剑锋，一剑如山岳压顶',
  '无极剑': '通用型灵器·极品。剑身幻化万千，无招无式无迹',
  '天罡剑': '金属性仙器·极品。天罡星辰淬炼一剑出万法破',
  '长生剑': '木属性仙器·极品。剑蕴世界树生机，中者生机流逝',
  '沧浪剑': '水属性仙器·极品。剑势如沧海浪潮绵绵不绝',
  '焚天剑': '火属性仙器·极品。剑引九天神火，一剑焚天煮海',
  '不动明王剑': '土属性仙器·极品。大地之力凝剑罡，不动如山万法不破',
  '混沌剑': '通用型仙器·极品。混沌玄铁所铸，一剑斩因果破万法',
  '金罡剑': '金属性神器·极品。金精玄铁铸就剑气无坚不摧',
  '青灵剑': '木属性神器·极品。剑蕴万年木灵，生机尽收灵力枯竭',
  '碧水剑': '水属性神器·极品。剑势连绵以柔克刚附带水雾迷幻',
  '赤霄剑': '火属性神器·极品。剑引赤霄神火，一剑横扫万里焦土',
  '玄黄剑': '土属性神器·极品。玄黄重铁所铸，一剑大地开裂山川崩',
  '七星剑': '通用型神器·极品。北斗七星引星辰之力无属性限制',
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
  '玉液功': '被动技能。精液附带催情效果，对方摄入后情欲大幅提升',
  '共感链接': '主动技能。指定两人建立感官链接，共享触觉快感',
  '入梦': '主动技能。进入他人梦境，交流或窥探记忆秘密',
  '透视眼': '主动技能。看穿衣物墙壁，透视储物袋或灵力流转',
  '催情香体': '被动技能。身体散发淡淡催情香气，对异性有轻微催情效果',
  '灵舌术': '被动技能。舌头灵活度和敏感度大幅提升',
  '加藤鹰之手': '被动技能。手指灵活度和敏感度大幅提升，手技出神入化',
  // 修为技能
  '精液疗伤': '被动技能。射精时精液自动具备疗伤效果，射在伤口上或口服均可快速愈合',
  '精液灌体': '被动技能。射入时自动提升对方修为+5~10，无使用限制',
  '精液破障': '被动技能。射入时检测瓶颈，有瓶颈则突破瓶颈+小境界+1，无瓶颈不触发',
};

const itemTier: Record<string, string> = {
  '金梭镖': '法器', '青藤索': '法器', '分水珠': '法器', '烈火旗': '法器', '玄土罩': '法器', '万象令': '法器',
  '金刚圈': '灵器', '青木鼎': '灵器', '玄冰鉴': '灵器', '紫火钟': '灵器', '厚土幡': '灵器', '混元伞': '灵器',
  '金罡环': '仙器', '青帝灵藤': '仙器', '玄冥珠': '仙器', '离天鼎': '仙器', '镇天印': '仙器', '周天盘': '仙器',
  '金蛟剪': '神器', '青木灵杖': '神器', '玄水珠': '神器', '离火旗': '神器', '厚土印': '神器', '天机镜': '神器',
  '镇魂钟': '神器', '锁神甲': '神器', '万象珠': '神器',
  '金锋剑': '法器', '青木剑': '法器', '碧波剑': '法器', '赤焰剑': '法器', '玄石剑': '法器', '归元剑': '法器',
  '金虹剑': '灵器', '青冥剑': '灵器', '寒冰剑': '灵器', '紫炎剑': '灵器', '厚土剑': '灵器', '无极剑': '灵器',
  '天罡剑': '仙器', '长生剑': '仙器', '沧浪剑': '仙器', '焚天剑': '仙器', '不动明王剑': '仙器', '混沌剑': '仙器',
  '金罡剑': '神器', '青灵剑': '神器', '碧水剑': '神器', '赤霄剑': '神器', '玄黄剑': '神器', '七星剑': '神器',
};

const TIERS = ['法器', '灵器', '仙器', '神器'];

function normalizeName(n: string): string {
  return n.replace(/[（(]?\s*[×x×X]\s*\d+\s*[）)]?/g, '').trim();
}

function groupItems(items: string[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const raw of items) {
    const name = normalizeName(raw);
    // 从原始名字中提取数量: "回灵丹×5" → +5, "回灵丹(×3)" → +3, "回灵丹" → +1
    const m = raw.match(/[×xX]\s*(\d+)/);
    const add = m ? parseInt(m[1], 10) : 1;
    map.set(name, (map.get(name) || 0) + add);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

interface InvSubCat {
  name: string;
  items: { name: string; count: number }[];
}

interface InvCategory {
  label: string;
  icon: string;
  items: { name: string; count: number }[];
  subCategories?: InvSubCat[];
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
    ['其他', '📦', p.杂物 || []],
  ];
  return config.map(([label, icon, items]): InvCategory => {
    if (label !== '法宝' && label !== '武器') {
      return { label, icon, items: items.length > 0 ? groupItems(items) : [{ name: '（空）', count: 0 }] };
    }
    // 法宝/武器按等级分组
    const tierMap: Record<string, { name: string; count: number }[]> = {};
    TIERS.forEach(t => tierMap[t] = []);
    const grouped = groupItems(items);
    grouped.forEach(it => {
      const t = itemTier[it.name];
      if (t && tierMap[t]) tierMap[t].push(it);
    });
    const subs: InvSubCat[] = TIERS.filter(t => tierMap[t].length > 0).map(t => ({ name: t, items: tierMap[t] }));
    if (subs.length === 0) subs.push({ name: '（空）', items: [{ name: '（空）', count: 0 }] });
    return { label, icon, items: [], subCategories: subs };
  });
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

          <!-- 子目录: 按等级 -->
          <div v-if="cat.subCategories">
            <div v-for="sub in cat.subCategories" :key="sub.name" class="inv-subcat">
              <div class="inv-subcat-header" @click="expandedItems.has('_s_'+sub.name) ? expandedItems.delete('_s_'+sub.name) : expandedItems.add('_s_'+sub.name)">
                <span>{{ sub.name }}</span>
                <span class="fold-arrow tiny">{{ expandedItems.has('_s_'+sub.name) ? '▼' : '▶' }}</span>
              </div>
              <div v-if="expandedItems.has('_s_'+sub.name)" class="inv-subcat-body">
                <div v-for="item in sub.items" :key="item.name" class="inv-item">
                  <div class="inv-header" @click="expandedItems.has(item.name) ? expandedItems.delete(item.name) : expandedItems.add(item.name)">
                    <span>{{ item.name }}<span v-if="item.count > 0" class="item-count"> ×{{ item.count }}</span></span>
                    <span class="fold-arrow tiny">{{ expandedItems.has(item.name) ? '−' : '+' }}</span>
                  </div>
                  <div v-if="expandedItems.has(item.name) && itemDesc[item.name]" class="inv-desc">{{ itemDesc[item.name] }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 无子目录: 平铺 -->
          <div v-if="!cat.subCategories">
            <div v-for="item in cat.items" :key="item.name" class="inv-item" :class="{ empty: item.count === 0 }">
              <div class="inv-header" @click="expandedItems.has(item.name) ? expandedItems.delete(item.name) : expandedItems.add(item.name)">
                <span>{{ item.name }}<span v-if="item.count > 0" class="item-count"> ×{{ item.count }}</span></span>
                <span v-if="item.count > 0" class="fold-arrow tiny">{{ expandedItems.has(item.name) ? '−' : '+' }}</span>
              </div>
              <div v-if="expandedItems.has(item.name) && itemDesc[item.name]" class="inv-desc">{{ itemDesc[item.name] }}</div>
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
.fold-arrow.tiny { font-size: 8px; color: var(--c-text-dim); }
.fold-body { margin-top: 4px; }
.fold-cat { margin-bottom: 2px; border: 1px solid var(--c-border-light); border-radius: 4px; overflow: hidden; }
.fold-cat-header { display: flex; align-items: center; gap: 6px; padding: 5px 8px; cursor: pointer; font-size: 12px; font-weight: 500; background: rgba(255,255,255,0.03); user-select: none; }
.fold-cat-header:hover { background: var(--c-primary-bg); }
.fold-cat-body { border-top: 1px solid var(--c-border-light); padding: 4px 8px; }
.inv-subcat { border-bottom: 1px solid var(--c-border-light); }
.inv-subcat:last-child { border-bottom: none; }
.inv-subcat-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 0; cursor: pointer; font-size: 11px; font-weight: 500; color: var(--c-text-dim); user-select: none; }
.inv-subcat-header:hover { opacity: 0.8; }
.inv-subcat-body { padding-left: 8px; }
.inv-item { border-bottom: 1px solid var(--c-border-light); }
.inv-item:last-child { border-bottom: none; }
.inv-item.empty { color: var(--c-text-muted); font-style: italic; }
.inv-header { display: flex; align-items: center; justify-content: space-between; padding: 3px 0; cursor: pointer; font-size: 11px; color: var(--c-text); user-select: none; }
.inv-header:hover { opacity: 0.8; }
.inv-desc { font-size: 10px; color: var(--c-text-muted); padding: 0 0 4px 0; }
.item-count { font-size: 10px; color: var(--c-primary); font-weight: 600; }
</style>