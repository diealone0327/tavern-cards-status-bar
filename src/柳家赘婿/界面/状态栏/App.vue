<template>
  <div class="card">
    <!-- 顶部信息条 -->
    <div class="header">
      <span class="time">{{ sd.系统?.当前时间 || '—' }}</span>
      <span class="sep">·</span>
      <span class="scene">{{ sd.系统?.当前场景 || '—' }}</span>
    </div>

    <!-- 好感度面板 -->
    <div class="aff-section">
      <div class="aff-title">好感度</div>
      <div v-for="ch in chars" :key="ch.key" class="aff-row">
        <div class="aff-left">
          <span class="aff-name">{{ ch.name }}</span>
          <span :class="'aff-stage stage-' + ch.stageCls">{{ ch.stage }}</span>
        </div>
        <div class="aff-bar-wrap">
          <div class="aff-bar">
            <div class="aff-fill" :style="{ width: ch.val + '%' }" :class="'fill-' + ch.stageCls"></div>
          </div>
          <span class="aff-val">{{ ch.val }}</span>
        </div>
        <div class="aff-attitude">{{ ch.attitude }}</div>
      </div>
    </div>

    <!-- 最近事件 -->
    <div class="event-bar">
      <span class="event-label">事件</span>
      <span class="event-text">{{ sd.系统?.最近事件 || '—' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();
const sd = computed(() => store.data);

const stageMap: Record<string, [number, string, string][]> = {
  柳清禾: [[0, '0~20', '冷淡'], [21, '21~40', '熟悉'], [41, '41~60', '缓和'], [61, '61~80', '暧昧'], [81, '81~100', '亲密']],
  柳知晚: [[0, '0~20', '冷淡'], [21, '21~40', '熟悉'], [41, '41~60', '缓和'], [61, '61~80', '暧昧'], [81, '81~100', '亲密']],
  柳书瑶: [[0, '0~20', '好奇'], [21, '21~40', '亲近'], [41, '41~60', '好感'], [61, '61~80', '暧昧'], [81, '81~100', '亲密']],
  柳语茉: [[0, '0~20', '考察'], [21, '21~40', '认可'], [41, '41~60', '信任'], [61, '61~80', '暧昧'], [81, '81~100', '亲密']],
};

const stageStyle: Record<string, string> = {
  '冷淡': 'cold', '熟悉': 'warm', '缓和': 'warm', '好奇': 'curious', '亲近': 'warm', '好感': 'warm',
  '考察': 'cold', '认可': 'warm', '信任': 'warm',
  '暧昧': 'heart', '亲密': 'heart',
};

function getStageCls(stage: string): string {
  return stageStyle[stage] || 'cold';
}

const chars = computed(() => {
  const s = sd.value;
  if (!s) return [];
  const list = [
    { key: '柳清禾', name: '柳清禾', val: s.柳清禾?.好感度 ?? 0, attitude: s.柳清禾?.近期态度 || '' },
    { key: '柳知晚', name: '柳知晚', val: s.柳知晚?.好感度 ?? 0, attitude: s.柳知晚?.近期态度 || '' },
    { key: '柳书瑶', name: '柳书瑶', val: s.柳书瑶?.好感度 ?? 0, attitude: s.柳书瑶?.近期态度 || '' },
    { key: '柳语茉', name: '柳语茉', val: s.柳语茉?.好感度 ?? 0, attitude: s.柳语茉?.近期态度 || '' },
  ];
  return list.map(c => {
    const stages = stageMap[c.key] || [];
    let stage = stages[0][2];
    let stageCls = 'cold';
    for (const [min, , name] of stages) {
      if (c.val >= min) { stage = name; stageCls = getStageCls(name); }
    }
    return { ...c, stage, stageCls };
  });
});
</script>

<style scoped>
.card {
  width: 100%; max-width: 480px;
  background-color: var(--c-paper);
  border: 2px solid var(--c-ink);
  box-shadow: 4px 4px 0px var(--c-shadow);
  color: var(--c-ink); font-family: var(--font-body);
  font-size: 13px; line-height: 1.4; margin: 0 auto;
}
.header {
  display: flex; align-items: center; gap: 4px;
  padding: 8px 14px;
  background: linear-gradient(180deg, var(--c-paper-light) 0%, var(--c-paper-deep) 100%);
  border-bottom: 2px solid var(--c-ink);
  font-size: 12px; color: var(--c-ink-muted);
}
.header .time { color: var(--c-ink); font-weight: 600; }
.header .sep { color: var(--c-ink-light); }
.header .scene { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.aff-section {
  padding: 10px 14px;
  display: grid; gap: 8px;
}
.aff-title {
  font-size: 11px; font-weight: 700;
  font-family: var(--font-title); letter-spacing: 0.12em;
  color: var(--c-gold-dark); padding-bottom: 4px;
  border-bottom: 2px solid var(--c-ink);
}
.aff-row {
  display: grid; grid-template-columns: 72px 1fr; gap: 6px;
  align-items: center;
}
.aff-left { display: flex; align-items: center; gap: 4px; }
.aff-name { font-size: 13px; font-weight: 600; white-space: nowrap; }
.aff-stage {
  font-size: 9px; padding: 0 4px; border-radius: 2px;
  white-space: nowrap; line-height: 1.6;
}
.stage-cold { background: rgba(158,158,158,0.15); color: #757575; border: 1px solid rgba(158,158,158,0.3); }
.stage-warm { background: rgba(255,152,0,0.1); color: #e65100; border: 1px solid rgba(255,152,0,0.25); }
.stage-curious { background: rgba(33,150,243,0.1); color: #1565c0; border: 1px solid rgba(33,150,243,0.25); }
.stage-heart { background: rgba(233,30,99,0.1); color: #c2185b; border: 1px solid rgba(233,30,99,0.25); }
.aff-bar-wrap {
  display: flex; align-items: center; gap: 4px;
}
.aff-bar { flex: 1; height: 6px; background: var(--c-paper-deep); border: 1px solid var(--c-stroke-strong); border-radius: 3px; overflow: hidden; }
.aff-fill { height: 100%; border-radius: 2px; transition: width 0.4s ease; }
.fill-cold { background: linear-gradient(90deg, #9e9e9e, #bdbdbd); }
.fill-warm { background: linear-gradient(90deg, #ff9800, #ffb74d); }
.fill-curious { background: linear-gradient(90deg, #2196f3, #64b5f6); }
.fill-heart { background: linear-gradient(90deg, #e91e63, #f06292); }
.aff-val { font-size: 11px; color: var(--c-ink-muted); min-width: 22px; text-align: right; font-variant-numeric: tabular-nums; }
.aff-attitude {
  grid-column: 1 / -1;
  font-size: 10px; color: var(--c-ink-light);
  padding-left: 4px; margin-top: -4px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.event-bar {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  border-top: 2px solid var(--c-ink);
  background: linear-gradient(180deg, var(--c-paper-light) 0%, var(--c-paper) 100%);
  font-size: 11px;
}
.event-label {
  font-size: 10px; font-weight: 700;
  font-family: var(--font-title); letter-spacing: 0.12em;
  color: var(--c-gold-dark); white-space: nowrap;
}
.event-text {
  color: var(--c-ink-muted);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
@media (max-width: 400px) {
  .card { max-width: 100%; }
  .aff-row { grid-template-columns: 60px 1fr; }
  .aff-name { font-size: 12px; }
}
:root {
  --c-ink: #2a2418;
  --c-ink-muted: #7a7264;
  --c-ink-light: #b5aa99;
  --c-paper: #f5f0e6;
  --c-paper-light: #faf7f0;
  --c-paper-deep: #ede6d8;
  --c-gold: #c9a84c;
  --c-gold-dark: #8b6914;
  --c-gold-light: #e8d48b;
  --c-seal: #9b362f;
  --c-seal-light: #c46a63;
  --c-stroke: rgba(42,36,24,0.1);
  --c-stroke-strong: rgba(42,36,24,0.2);
  --c-shadow: rgba(15,12,8,0.18);
  --c-heal: #4caf50;
  --c-harm: #e53935;
  --c-calm: #ff9800;
  --c-friend: #43a047;
  --c-hostile: #e53935;
  --font-title: "KaiTi","STKaiti","Kaiti SC","Noto Serif SC","Songti SC","SimSun",serif;
  --font-body: "Songti SC","SimSun","Noto Serif SC","PingFang SC","Microsoft YaHei",serif;
}
</style>
