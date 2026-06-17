<template>
  <div class="card">
    <WorldSection />

    <div class="strip">
      <span class="realm-badge">{{ sd.user?.修为境界 || '练气' }}</span>
      <div class="bar">
        <div class="bar-fill" :style="{ width: pct + '%' }"></div>
        <div class="bar-glow" :style="{ width: pct + '%' }"></div>
      </div>
      <span class="bar-label">{{ pct }}%</span>
      <span class="hp-indicator">
        <span :class="'hp-dot hp-dot-' + hpCls"></span>
        <span :class="'hp-txt hp-txt-' + hpCls">{{ sd.user?.身体状况 || '健康' }}</span>
      </span>
      <span :class="'sect-badge sect-' + sectStCls">{{ sd.宗门?.宗门态势 || '—' }}</span>
    </div>

    <div class="grid-3col">
      <div class="pane">
        <div class="pane-title">修为</div>
        <div class="pane-row"><span>境界</span><span class="em">{{ sd.user?.修为境界 || '练气' }}</span></div>
        <div class="pane-row"><span>职位</span><span>{{ sd.user?.宗门职位 || '—' }}</span></div>
        <div class="pane-row"><span>穿着</span><span class="mu">{{ sd.user?.穿着 || '—' }}</span></div>
        <div class="pane-row"><span>身体</span><span :class="'hp-txt-'+hpCls">{{ sd.user?.身体状况 || '健康' }}</span></div>
        <div class="pane-row"><span>功法</span><span>{{ techs.length + ' 门' }}{{ eq ? ' · ' + eq : '' }}</span></div>
      </div>

      <div class="pane" style="grid-column:2 / 4">
        <div class="pane-title">灵石</div>
        <div class="split-inline">
          <div class="split-inline-left">
            <div class="pane-row"><span>下品</span><span>{{ sd.user?.下品灵石 ?? 0 }}</span></div>
            <div class="pane-row"><span>中品</span><span>{{ sd.user?.中品灵石 ?? 0 }}</span></div>
            <div class="pane-row"><span>上品</span><span>{{ sd.user?.上品灵石 ?? 0 }}</span></div>
            <div class="pane-row"><span>贡献</span><span>{{ sd.user?.宗门贡献 ?? 0 }}</span></div>
          </div>
          <div class="split-inline-right">
            <div class="present" style="border:none;margin:0;padding:0">
              <div class="pane-title" style="margin-top:0">在场</div>
              <div class="present-chars">
                <div v-for="(v,n) in rels" :key="n" class="present-card">
                  <span class="present-card-name">{{ n }}</span>
                  <span class="present-card-aff">好感 {{ v }}</span>
                </div>
                <div v-for="(a,n) in npcs" :key="'n'+n" class="present-card">
                  <span class="present-card-name">{{ n }}</span>
                  <span :class="'present-card-st present-card-st-'+a">{{ a }}</span>
                </div>
                <span v-if="!relKeys.length && !npcKeys.length" class="mu" style="font-size:10px;padding:4px 0">—</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="split-row">
      <div class="split-left">
        <div class="pane-title" style="margin:10px 12px 0">聚宝盆</div>
        <details class="rpane-details" style="margin:0 12px 6px" open>
          <summary class="rpane-summary" style="padding:4px 0;margin-top:2px">
            <span class="rpane-info">{{ cd ? '可用' : '冷却中' }} · {{ sd.聚宝盆?.盆内物品 || '空' }}</span>
            <span class="fold-chev2">›</span>
          </summary>
          <div class="rpane-body" style="padding:2px 0">
            <div class="pane-row"><span>状态</span><span :class="cd ? 'st-useful' : 'st-cooldown'">{{ cd ? '可用' : '冷却中' }}</span></div>
            <div class="pane-row"><span>盆内</span><span>{{ sd.聚宝盆?.盆内物品 || '空' }}</span></div>
            <div class="pane-row"><span>剩余</span><span>{{ sd.聚宝盆?.剩余时间 || '—' }}</span></div>
            <div class="pane-row"><span>已复制</span><span>{{ (sd.聚宝盆?._复制记录?.length || 0) + ' 次' }}</span></div>
          </div>
        </details>
      </div>

      <div class="split-right">
        <div class="pane-title" style="margin:10px 12px 0">秘境 · 宗门</div>
        <details class="rpane-details" style="margin:0 12px 6px" open>
          <summary class="rpane-summary" style="padding:4px 0;margin-top:2px">
            <span class="rpane-info">{{ sd.秘境?.当前活跃秘境 || '无秘境' }} · {{ sd.宗门?.宗门态势 || '—' }}</span>
            <span class="fold-chev2">›</span>
          </summary>
          <div class="rpane-body" style="padding:2px 0">
            <div class="pane-row"><span>活跃秘境</span><span>{{ sd.秘境?.当前活跃秘境 || '无' }}</span></div>
            <div class="pane-row"><span>开启倒计时</span><span>{{ sd.秘境?.开启倒计时 || '—' }}</span></div>
            <div class="pane-row"><span>已探索</span><span>{{ (sd.秘境?.已探索秘境?.length || 0) + ' 个' }}</span></div>
            <div class="pane-row" v-if="sd.宗门?.宗门事件"><span>事件</span><span class="mu">{{ sd.宗门.宗门事件 }}</span></div>
          </div>
        </details>
      </div>
    </div>

    <div class="rel-section">
      <details class="rpane-details" style="margin:0" open>
        <summary class="rpane-summary" style="padding:10px 14px;border-top:2px solid var(--c-ink);margin:0">
          <span class="fold-label" style="font-size:12px;letter-spacing:0.12em;color:var(--c-ink)">关系</span>
          <span class="rpane-info">{{ relKeys.length + npcKeys.length }} 个</span>
          <span class="fold-chev2">›</span>
        </summary>
        <div class="rpane-body" style="padding:6px 14px 10px">
          <div v-if="relKeys.length" class="aff-compact">
            <div v-for="(v,n) in rels" :key="n" class="aff-line">
              <span class="aff-n">{{ n }}</span>
              <div class="aff-bar"><div class="aff-fill" :style="{width:Math.min(v,100)+'%'}"></div></div>
              <span class="aff-v">{{ v }}</span>
            </div>
          </div>
          <div v-else class="empty">暂无好感度</div>
          <div v-if="npcKeys.length" class="pd-top">
            <div v-for="(a,n) in npcs" :key="'n'+n" class="pane-row"><span class="mu">{{ n }}</span><span :class="'npc-st npc-st-'+a">{{ a }}</span></div>
          </div>
        </div>
      </details>
    </div>

    <details class="inv-block">
      <summary class="inv-summary">
        <span class="inv-label">物品</span>
        <span class="inv-info">{{ itemKeys.length + techs.length }} 项</span>
        <span class="fold-chev2">›</span>
      </summary>
      <div class="inv-body">
        <div v-if="itemKeys.length" class="tags">
          <span v-for="(q,n) in items" :key="n" class="tag">{{ n }}<span class="tag-qty">×{{ q }}</span></span>
        </div>
        <div v-if="techs.length" class="tech-strip">
          <span v-for="t in techs" :key="t" class="tech-tag" :class="{ active: t===eq }">{{ t }}<span v-if="t===eq" class="eq-dot">●</span></span>
        </div>
        <div v-if="!itemKeys.length && !techs.length" class="empty">无</div>
      </div>
    </details>

    <details class="inv-block">
      <summary class="inv-summary">
        <span class="inv-label">任务</span>
        <span class="inv-info">{{ taskKeys.length }} 项</span>
        <span class="fold-chev2">›</span>
      </summary>
      <div class="inv-body">
        <div v-for="(q,n) in tasks" :key="n" class="quest-item">
          <div class="quest-head">
            <span class="quest-name">{{ n }}</span>
            <span :class="'quest-st quest-st-' + q.状态">{{ q.状态 }}</span>
          </div>
          <span class="quest-desc">{{ q.描述 }}</span>
          <span v-if="q.来源" class="quest-src">{{ q.来源 }}</span>
        </div>
        <div v-if="!taskKeys.length" class="empty">暂无任务</div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import WorldSection from './components/WorldSection.vue';
import { useDataStore } from './store';

const store = useDataStore();
const sd = computed(() => store.data);

const pct = computed(() => Math.min(sd.value?.user?.修为进度 || 0, 100));
const cd = computed(() => sd.value?.聚宝盆?.冷却状态 ?? true);
const rels = computed(() => sd.value?.人际关系 || {});
const relKeys = computed(() => Object.keys(rels.value));
const npcs = computed(() => sd.value?.随机NPC关系 || {});
const tasks = computed(() => sd.value?.任务 || {});
const taskKeys = computed(() => Object.keys(tasks.value));
const npcKeys = computed(() => Object.keys(npcs.value));
const items = computed(() => sd.value?.user?.持有物品 || {});
const itemKeys = computed(() => Object.keys(items.value));
const techs = computed(() => sd.value?.user?.已学功法 || []);
const eq = computed(() => sd.value?.user?.当前装备的功法 || '');

const hpCls = computed(() => {
  const h = sd.value?.user?.身体状况 || '健康';
  if (h === '健康') return 'ok';
  if (h === '重伤' || h === '濒危') return 'bad';
  return 'warn';
});

const sectStCls = computed(() => {
  const s = sd.value?.宗门?.宗门态势 || '';
  if (s === '平静') return 'calm';
  if (s === '暗流') return 'warn';
  if (s === '危机') return 'bad';
  return 'muted';
});
</script>

<style scoped>
.card {
  width: 100%; max-width: 660px;
  background-color: var(--c-paper);
  border: 2px solid var(--c-ink);
  box-shadow: 4px 4px 0px var(--c-shadow);
  display: flex; flex-direction: column;
  color: var(--c-ink); font-family: var(--font-body);
  font-size: 13px; line-height: 1.4; margin: 0 auto;
  position: relative;
}

.card::before {
  content: '';
  position: absolute; inset: 3px;
  border: 1px solid var(--c-stroke-strong);
  pointer-events: none;
}

.strip {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 12px;
  border-bottom: 2px solid var(--c-ink);
  background: linear-gradient(180deg, var(--c-paper-light) 0%, var(--c-paper-deep) 100%);
  flex-wrap: wrap;
}

.realm-badge {
  padding: 2px 8px; font-size: 11px;
  border: 1px solid var(--c-gold);
  background: rgba(201,168,76,0.1); color: var(--c-gold-dark);
  font-weight: 700; font-family: var(--font-title); white-space: nowrap;
  letter-spacing: 0.08em;
}

.sect-badge { font-size: 10px; padding: 1px 6px; border-radius: 2px; white-space: nowrap; }
.sect-calm { background: rgba(76,175,80,0.1); color: var(--c-heal); border: 1px solid var(--c-heal); }
.sect-warn { background: rgba(255,152,0,0.1); color: var(--c-calm); border: 1px solid var(--c-calm); animation: pulse-dot 1.5s ease-in-out infinite; }
.sect-bad { background: rgba(229,57,53,0.1); color: var(--c-harm); border: 1px solid var(--c-harm); animation: pulse-dot 0.8s ease-in-out infinite; }
.sect-muted { background: rgba(42,36,24,0.04); color: var(--c-ink-muted); border: 1px solid var(--c-stroke); }

.bar {
  flex: 1; height: 8px;
  background: var(--c-paper-deep);
  border: 1px solid var(--c-stroke-strong);
  border-radius: 4px; overflow: hidden; min-width: 50px;
  position: relative;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-gold-dark), var(--c-gold));
  border-radius: 3px; transition: width 0.4s ease;
}
.bar-glow {
  position: absolute; top: 0; left: 0; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  animation: shimmer-glow 2s ease-in-out infinite;
  pointer-events: none;
}
.bar-label { font-size: 11px; color: var(--c-ink-muted); min-width: 28px; text-align: right; font-variant-numeric: tabular-nums; }

.hp-indicator { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; }
.hp-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.hp-dot-ok { background: var(--c-heal); }
.hp-dot-warn { background: var(--c-calm); animation: pulse-dot 1.5s ease-in-out infinite; }
.hp-dot-bad { background: var(--c-harm); animation: pulse-dot 0.8s ease-in-out infinite; }
.hp-txt-ok { color: var(--c-heal); }
.hp-txt-warn { color: var(--c-calm); }
.hp-txt-bad { color: var(--c-harm); font-weight: 600; }

.grid-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid var(--c-stroke); }
.grid-2col { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--c-stroke); }

.pane { padding: 10px 12px; border-right: 1px solid var(--c-stroke); display: grid; gap: 3px; }
.pane:last-child { border-right: none; }
.rpane { border-right: none; display: block; padding: 0; }
.rpane .pane-title { margin: 10px 12px 0; }

.split-row {
  display: flex; border-bottom: 1px solid var(--c-stroke);
  min-height: 0;
}
.split-left {
  width: 50%; border-right: 1px solid var(--c-stroke);
  flex-shrink: 0; display: flex; flex-direction: column;
}
.split-right {
  width: 50%; display: flex; flex-direction: column;
  flex-shrink: 0;
}
.split-inline {
  display: flex; gap: 12px;
}
.split-inline-left {
  flex: 1;
}
.split-inline-right {
  flex: 1; border-left: 1px solid var(--c-stroke); padding-left: 12px;
}

.pane-title {
  font-size: 11px; font-weight: 700; font-family: var(--font-title);
  letter-spacing: 0.12em; color: var(--c-gold-dark);
  border-bottom: 1px solid rgba(139,105,20,0.2);
  padding-bottom: 3px; margin-bottom: 2px;
}

.pane-row { display: flex; justify-content: space-between; font-size: 11px; gap: 6px; }
.pane-row span:first-child { color: var(--c-ink-muted); white-space: nowrap; }
.pane-row span:last-child { text-align: right; overflow: hidden; text-overflow: ellipsis; }

.em { font-weight: 600; color: var(--c-ink); }
.mu { color: var(--c-ink-muted); }

.st-useful { color: var(--c-heal); font-weight: 600; }
.st-cooldown { color: var(--c-calm); font-weight: 600; padding-right: 0; }

.eq-badge { font-size: 9px; color: var(--c-heal); }

.empty { color: var(--c-ink-muted); font-size: 11px; padding: 8px 12px; text-align: center; }

.fold-chev2 {
  transition: transform 0.25s ease; color: var(--c-ink-light);
  font-size: 13px; line-height: 1;
  margin-left: auto;
}
details[open] .fold-chev2 { transform: rotate(90deg); }

.rpane-details { margin: 0 12px 6px; }
.rpane-summary {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 0; cursor: pointer; user-select: none;
  font-size: 11px; color: var(--c-ink-muted); list-style: none;
  border-top: 1px dashed var(--c-stroke); margin-top: 4px;
}
.rpane-summary::-webkit-details-marker { display: none; }
.rpane-info { flex: 1; }
.rpane-body { padding: 2px 0; }

.inv-block {
  border-top: 2px solid var(--c-ink);
  font-size: 12px;
}
.inv-summary {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(180deg, var(--c-paper-light) 0%, var(--c-paper) 100%);
  font-family: var(--font-title); font-weight: 700; letter-spacing: 0.12em;
  cursor: pointer; user-select: none; font-size: 12px;
}
.inv-label { color: var(--c-ink); }
.inv-info { flex: 1; font-family: var(--font-body); font-weight: 400; font-size: 11px; color: var(--c-ink-muted); letter-spacing: 0; }
.rel-section { border-top: 2px solid var(--c-ink); }
.inv-body { padding: 6px 14px 10px; animation: fold-open 0.2s ease; }

.aff-compact { display: grid; gap: 2px; }
.aff-line { display: flex; align-items: center; gap: 4px; }
.aff-n { min-width: 36px; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.aff-bar { flex: 1; height: 5px; background: var(--c-paper-deep); border: 1px solid var(--c-stroke); border-radius: 2px; overflow: hidden; }
.aff-fill { height: 100%; background: linear-gradient(90deg, var(--c-seal), var(--c-seal-light)); border-radius: 2px; transition: width 0.35s; }
.aff-v { font-size: 10px; color: var(--c-ink-muted); min-width: 18px; text-align: right; }

.npc-st { font-size: 10px; }
.npc-st-友好 { color: var(--c-friend); font-weight: 600; }
.npc-st-冷漠 { color: var(--c-neutral); }
.npc-st-敌对 { color: var(--c-hostile); font-weight: 600; }

.pd-top { padding-top: 4px; border-top: 1px dashed var(--c-stroke); margin-top: 2px; }

.present { border-top: 1px dashed var(--c-stroke); margin-top: 4px; padding-top: 2px; }
.present-chars { display: flex; flex-wrap: wrap; gap: 4px; padding: 2px 0; }
.present-card {
  display: grid; gap: 1px;
  padding: 4px 8px; min-width: 64px;
  border: 1px solid var(--c-stroke-strong);
  background: rgba(255,255,255,0.3); border-radius: 3px;
}
.present-card-name { font-size: 11px; font-weight: 600; color: var(--c-ink); }
.present-card-aff { font-size: 10px; color: var(--c-seal-light); font-variant-numeric: tabular-nums; }
.present-card-st { font-size: 10px; }
.present-card-st-友好 { color: var(--c-friend); }
.present-card-st-冷漠 { color: var(--c-neutral); }
.present-card-st-敌对 { color: var(--c-hostile); font-weight: 600; }

.tags { display: flex; flex-wrap: wrap; gap: 3px; padding: 4px 0; }
.tag {
  padding: 1px 6px; font-size: 10px;
  border: 1px solid var(--c-stroke-strong);
  background: rgba(255,255,255,0.4);
  border-radius: 2px;
}
.tag-qty { color: var(--c-ink-muted); margin-left: 2px; }

.tech-strip { display: flex; flex-wrap: wrap; gap: 3px; padding: 2px 0; }
.tech-tag { padding: 1px 6px; font-size: 10px; border: 1px solid var(--c-stroke); border-radius: 2px; }
.tech-tag.active { border-color: var(--c-heal); color: var(--c-heal); }
.eq-dot { margin-left: 2px; font-size: 8px; }

.quest-item {
  display: grid; gap: 2px;
  padding: 6px 8px; margin-bottom: 3px;
  border: 1px solid var(--c-stroke);
  background: rgba(255,255,255,0.3); border-radius: 2px;
  font-size: 11px;
}
.quest-head { display: flex; justify-content: space-between; align-items: center; }
.quest-name { font-weight: 600; color: var(--c-ink); }
.quest-st { font-size: 10px; padding: 0 5px; border-radius: 2px; white-space: nowrap; }
.quest-st-未开始 { color: var(--c-ink-muted); border: 1px solid var(--c-stroke); }
.quest-st-进行中 { color: var(--c-calm); border: 1px solid var(--c-calm); }
.quest-st-已完成 { color: var(--c-heal); border: 1px solid var(--c-heal); }
.quest-st-失败 { color: var(--c-harm); border: 1px solid var(--c-harm); }
.quest-desc { font-size: 10px; color: var(--c-ink-muted); }
.quest-src { font-size: 9px; color: var(--c-ink-light); }

@media (max-width: 400px) {
  .grid-3col { grid-template-columns: 1fr; }
  .grid-3col .pane { grid-column: auto !important; border-right: none; }
  .split-row { flex-direction: column; }
  .split-left { border-right: none; border-bottom: 1px solid var(--c-stroke); padding: 8px; }
  .split-inline { flex-direction: column; }
  .split-inline-right { border-left: none; padding-left: 0; padding-top: 6px; border-top: 1px dashed var(--c-stroke); }
  .strip { padding: 6px 8px; gap: 4px; font-size: 11px; }
  .pane { padding: 8px; }
  .split-left { padding: 8px; }
}
</style>
