<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  system?: {
    积分?: number;
    今日签到积分?: number;
    今日任务?: boolean;
    当前日期?: string;
  };
}>();

const showIntro = ref(false);

const allTerms = ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'];

const dateParts = computed(() => {
  const d = props.system?.当前日期 || '';
  if (!d) return { lunar: '', termInfo: '', season: '' };
  const parts = d.split(/[,，]\s*/);
  const year = parts[0] || '';
  const lunar = parts[1] || '';
  const termInfo = parts[2] || '';

  const fullText = d;
  const springTerms = allTerms.slice(0, 6);
  const summerTerms = allTerms.slice(6, 12);
  const autumnTerms = allTerms.slice(12, 18);
  const winterTerms = allTerms.slice(18, 24);
  let season = '';
  for (const t of springTerms) { if (fullText.includes(t)) { season = '🌸 春'; break; } }
  if (!season) for (const t of summerTerms) { if (fullText.includes(t)) { season = '☀️ 夏'; break; } }
  if (!season) for (const t of autumnTerms) { if (fullText.includes(t)) { season = '🍂 秋'; break; } }
  if (!season) for (const t of winterTerms) { if (fullText.includes(t)) { season = '❄️ 冬'; break; } }
  if (!season) {
    const m: [string[], string][] = [
      [['正', '一', '二', '三'], '🌸 春'], [['四', '五', '六'], '☀️ 夏'],
      [['七', '八', '九'], '🍂 秋'], [['十', '十一', '十二'], '❄️ 冬'],
    ];
    for (const [months, s] of m) { for (const mm of months) { if (fullText.includes(mm + '月')) { season = s; break; } } if (season) break; }
  }
  return { year, lunar, termInfo, season };
});
</script>

<template>
  <div class="card" v-if="system">
    <div class="card-title" style="display: flex; justify-content: space-between; align-items: center;">
      <span>✦ 系统状态</span>
      <span class="intro-btn" @click.stop="showIntro = !showIntro">系统介绍 📖</span>
    </div>

    <!-- 系统介绍弹窗 -->
    <div v-if="showIntro" class="intro-overlay" @click.self="showIntro = false">
      <div class="intro-modal">
        <div class="intro-header">
          <span>📖 系统介绍</span>
          <span class="intro-close" @click="showIntro = false">✕</span>
        </div>
        <div class="intro-body">
          <div class="intro-section">
            <div class="intro-s-title">💎 积分获取方式</div>
            <p><b>每日签到</b>：日期/时间变化时自动签到+5~15积分。时间跳跃按天数×10累计。</p>
            <p><b>每日系统任务</b>：日期更新时若上一轮任务已完成则自动发布新任务（每日限一次），未完成则不发布。完成后+10~20积分。</p>
            <p><b>里程碑奖励</b>：身体强化任意项首次达10/30/50/70/90/100级时分别奖励50/200/600/1500/3000/5000积分。</p>
            <p><b>好感度突破</b>：NPC好感度首次突破60/120/200时分别奖励30/60/100积分。</p>
            <p><b>内射收益</b>：每次内射根据对方好感度获得积分（<60→10点 / 60~119→20点 / 120~199→35点 / 200以上→50点），同角色每日限一次。</p>
          </div>
          <div class="intro-section">
            <div class="intro-s-title">🏪 商城</div>
            <p>消耗积分兑换道具、丹药、法宝、武器、技能、属性点等。支持灵石1:10代替积分支付（身体强化除外）。</p>
          </div>
          <div class="intro-section">
            <div class="intro-s-title">💪 身体强化</div>
            <p>力量·速度·防御·抗性四项，每项1~100级。在商城中消耗积分手动升级，不会随时间自动增长。</p>
            <p style="margin-top:3px;">每10级对应一个修仙境界：<br>
            1~10凡人 → 11~20炼气 → 21~30筑基 → 31~40金丹 → 41~50元婴 → 51~60化神 → 61~70合体 → 71~80大乘 → 81~90渡劫</p>
          </div>
          <div class="intro-section">
            <div class="intro-s-title">🎒 系统背包</div>
            <p>购买物品自动存入，无限容量，仅主角可见可用，第三人无法感知、搜索或抢夺。修仙界拾取/获赠/发现的物品也会自动存入杂物栏。</p>
          </div>
          <div class="intro-section">
            <div class="intro-s-title">❤️ NPC关系</div>
            <p>好感度(0~300)和沉沦(0~100,女角专属)。积极互动/送礼增加好感，亲密接触增加沉沦。</p>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-3">
      <div class="stat-row" style="flex-direction: column; align-items: flex-start; gap: 1px;">
        <span class="stat-label">积分</span>
        <span class="stat-value primary" style="font-size: 16px; font-weight: 700;">
          {{ system.积分 ?? 0 }}
        </span>
      </div>
      <div class="stat-row" style="flex-direction: column; align-items: flex-start; gap: 1px;">
        <span class="stat-label">签到</span>
        <span class="stat-value success" style="font-size: 14px;">
          ✅ 已签到<span v-if="system.今日签到积分" class="signin-bonus">+{{ system.今日签到积分 }}</span>
        </span>
      </div>
      <div class="stat-row" style="flex-direction: column; align-items: flex-start; gap: 1px;">
        <span class="stat-label">任务</span>
        <span class="stat-value" :class="system.今日任务 ? 'success' : 'danger'" style="font-size: 14px;">
          {{ system.今日任务 ? '✅ 已完成' : '⬜ 未完成' }}
        </span>
      </div>
    </div>
    <div class="divider" />
    <div class="stat-row">
      <span class="stat-label">当前日期</span>
      <span class="stat-value primary">
        <span v-if="dateParts.year" class="year-tag">{{ dateParts.year }}</span>
        <span v-if="dateParts.lunar">{{ dateParts.lunar }}</span>
        <span v-else-if="!dateParts.year">---</span>
        <span v-if="dateParts.termInfo" class="solar-tag">{{ dateParts.termInfo }}</span>
        <span v-if="dateParts.season" class="season-tag">{{ dateParts.season }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.year-tag {
  display: inline-block;
  margin-right: 6px;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255,255,255,0.08);
  color: var(--c-text);
  border: 1px solid var(--c-border-light);
}
.signin-bonus {
  display: inline-block;
  margin-left: 4px;
  font-size: 11px;
  font-weight: 400;
  color: var(--c-primary);
}
.solar-tag {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  background: var(--c-accent-bg);
  color: var(--c-accent);
  border: 1px solid rgba(91,155,213,0.3);
}
.season-tag {
  display: inline-block;
  margin-left: 4px;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  background: var(--c-primary-bg);
  color: var(--c-primary);
  border: 1px solid var(--c-border);
}

/* ── 系统介绍按钮 ── */
.intro-btn {
  cursor: pointer;
  font-size: 16px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s;
  user-select: none;
}
.intro-btn:hover { background: var(--c-primary-bg); }

/* ── 弹窗遮罩 ── */
.intro-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.intro-modal {
  background: #1e1e2a;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}
.intro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--c-primary);
  border-bottom: 1px solid var(--c-border-light);
}
.intro-close {
  cursor: pointer;
  font-size: 16px;
  color: var(--c-text-dim);
  padding: 2px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}
.intro-close:hover { background: rgba(255,255,255,0.08); color: var(--c-text); }
.intro-body {
  overflow-y: auto;
  padding: 12px 16px 16px;
}
.intro-section {
  margin-bottom: 12px;
}
.intro-section:last-child { margin-bottom: 0; }
.intro-s-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-primary);
  margin-bottom: 3px;
}
.intro-section p {
  font-size: 12px;
  color: var(--c-text-dim);
  line-height: 1.6;
  margin: 0;
}
</style>
