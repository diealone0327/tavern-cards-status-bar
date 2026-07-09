<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  system?: {
    积分?: number;
    今日签到积分?: number;
    今日任务?: boolean;
    当前日期?: string;
  };
}>();

const allTerms = ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'];

const dateParts = computed(() => {
  const d = props.system?.当前日期 || '';
  if (!d) return { lunar: '', termInfo: '', season: '' };
  // 按逗号分割：年份，农历日期，节气信息
  const parts = d.split(/[,，]\s*/);
  const year = parts[0] || '';
  const lunar = parts[1] || '';
  const termInfo = parts[2] || '';

  // 季节判断（从整段文字里找）
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
    <div class="card-title">✦ 系统状态</div>
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
</style>
