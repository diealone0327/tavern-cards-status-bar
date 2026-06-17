<template>
  <div class="app">
    <div class="cols">
      <!-- ========== 左列 ========== -->
      <div class="col">
        <!-- 阶段 -->
        <div class="stage-card" :class="stageCls">
          <div class="stage-icon">{{ stageIcon }}</div>
          <div class="stage-name">{{ stageLabel }}</div>
          <div class="stage-desc">{{ stageDesc }}</div>
        </div>

        <!-- 场景 -->
        <div class="section">
          <div class="row"><span class="label">📍 地点</span><span class="val blue">{{ sd?.系统?.当前场景 || '—' }}</span></div>
        </div>

        <!-- 好感度 -->
        <div class="stat-block">
          <div class="stat-h">
            <span>❤️ 好感度</span>
            <span class="stat-num" :style="{ color: affectionColor }">{{ sd?.艳母?.好感度 ?? 0 }}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" :style="{ width: (sd?.艳母?.好感度 ?? 0) + '%', background: affectionGrad }"></div></div>
        </div>

        <!-- 欲望 -->
        <div class="stat-block">
          <div class="stat-h">
            <span>🔥 欲望</span>
            <span class="stat-num" :style="{ color: desireColor }">{{ sd?.艳母?.欲望 ?? 0 }}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" :style="{ width: (sd?.艳母?.欲望 ?? 0) + '%', background: desireGrad }"></div></div>
        </div>

        <!-- 发情 -->
        <div class="stat-block">
          <div class="stat-h">
            <span>💗 发情</span>
            <span class="stat-num pink">{{ sd?.艳母?.发情 ?? 0 }}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" :style="{ width: (sd?.艳母?.发情 ?? 0) + '%', background: arousalGrad }"></div></div>
        </div>
      </div>

      <!-- ========== 右列 ========== -->
      <div class="col">
        <!-- 沉沦 -->
        <div class="stat-block">
          <div class="stat-h">
            <span>🌑 沉沦</span>
            <span class="stat-num" :style="{ color: corruptionColor }">{{ sd?.艳母?.沉沦 ?? 0 }}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" :style="{ width: (sd?.艳母?.沉沦 ?? 0) + '%', background: corruptionGrad }"></div></div>
        </div>

        <!-- 状态总览卡片 -->
        <div class="overview-card" :class="stageCls">
          <div class="ov-title">📊 状态总览</div>
          <div class="ov-grid">
            <div class="ov-item">
              <span class="ov-l">好感度</span>
              <span class="ov-v" :style="{ color: affectionColor }">{{ affLabel }}</span>
            </div>
            <div class="ov-item">
              <span class="ov-l">欲望</span>
              <span class="ov-v" :style="{ color: desireColor }">{{ desLabel }}</span>
            </div>
            <div class="ov-item">
              <span class="ov-l">沉沦</span>
              <span class="ov-v" :style="{ color: corruptionColor }">{{ corrLabel }}</span>
            </div>
            <div class="ov-item">
              <span class="ov-l">发情</span>
              <span class="ov-v pink">{{ aroLabel }}</span>
            </div>
          </div>
        </div>

        <!-- 阶段提示 -->
        <div class="tip-box" :class="stageCls">
          <div class="tip-title">💡 阶段提示</div>
          <div class="tip-text">{{ stageTip }}</div>
        </div>

        <!-- 场景辅助 -->
        <div class="fold" @click="toggle('scenes')">
          <div class="fold-h"><span>🏠 场景列表</span><span class="arrow" :class="{ open: folds.scenes }">▶</span></div>
          <div v-show="folds.scenes" class="fold-b">
            <div class="scene-grid">
              <div v-for="s in scenes" :key="s" class="scene-tag" :class="{ active: sd?.系统?.当前场景 === s }">{{ s }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from './store';

const store = useDataStore();
const { stat_data } = storeToRefs(store);
const sd = stat_data;

const scenes = ['客厅','厨房','餐厅','主卧','次卧','浴室','阳台'];

const folds = reactive({ scenes: false });
function toggle(k: 'scenes') { folds[k] = !folds[k]; }

// ── 阶段 ──
const stageMap: Record<string, { icon: string; label: string; desc: string; tip: string }> = {
  '亲情': { icon: '🏡', label: '亲情期', desc: '日常母子生活，温情中暗流涌动', tip: '自然的肢体接触和日常关心正在悄然改变你们之间的距离感。' },
  '暧昧': { icon: '💫', label: '暧昧期', desc: '越界的试探，欲言又止的默契', tip: '她开始在意你的目光，每一次触碰都带着试探和犹豫。' },
  '乱伦': { icon: '🌙', label: '乱伦期', desc: '已越界的亲密，挣扎与沉沦交织', tip: '她已无法回到过去，背德的快感和罪恶感在心中反复撕扯。' },
};

const stage = computed(() => sd.value?.系统?.当前阶段 || '亲情');
const stageInfo = computed(() => stageMap[stage.value] || stageMap['亲情']);
const stageIcon = computed(() => stageInfo.value.icon);
const stageLabel = computed(() => stageInfo.value.label);
const stageDesc = computed(() => stageInfo.value.desc);
const stageTip = computed(() => stageInfo.value.tip);
const stageCls = computed(() => 'stage-' + stage.value);

// ── 数值标签 ──
const affLabel = computed(() => { const v = sd.value?.艳母?.好感度 ?? 0; return v < 30 ? '冷淡' : v < 60 ? '温和' : v < 80 ? '亲近' : '依恋'; });
const desLabel = computed(() => { const v = sd.value?.艳母?.欲望 ?? 0; return v < 20 ? '平静' : v < 50 ? '萌动' : v < 75 ? '渴望' : '炽烈'; });
const corrLabel = computed(() => { const v = sd.value?.艳母?.沉沦 ?? 0; return v < 20 ? '清醒' : v < 50 ? '动摇' : v < 75 ? '深陷' : '沉沦'; });
const aroLabel = computed(() => { const v = sd.value?.艳母?.发情 ?? 0; return v < 20 ? '平静' : v < 50 ? '微热' : v < 75 ? '燥热' : '迷乱'; });

// ── 颜色 ──
const affectionColor = computed(() => { const v = sd.value?.艳母?.好感度 ?? 0; return v < 30 ? '#8899aa' : v < 60 ? '#5dade2' : v < 80 ? '#bb8fce' : '#f5a0c0'; });
const affectionGrad = computed(() => { const v = sd.value?.艳母?.好感度 ?? 0; return v < 30 ? 'linear-gradient(90deg,#566573,#8899aa)' : v < 60 ? 'linear-gradient(90deg,#2e86c1,#5dade2)' : v < 80 ? 'linear-gradient(90deg,#8e44ad,#bb8fce)' : 'linear-gradient(90deg,#e94560,#f5a0c0)'; });
const desireColor = computed(() => { const v = sd.value?.艳母?.欲望 ?? 0; return v < 20 ? '#8899aa' : v < 50 ? '#f0b27a' : v < 75 ? '#e67e22' : '#e94560'; });
const desireGrad = computed(() => { const v = sd.value?.艳母?.欲望 ?? 0; return v < 20 ? 'linear-gradient(90deg,#566573,#8899aa)' : v < 50 ? 'linear-gradient(90deg,#d4ac0d,#f0b27a)' : v < 75 ? 'linear-gradient(90deg,#e67e22,#e94560)' : 'linear-gradient(90deg,#e94560,#c0392b)'; });
const corruptionColor = computed(() => { const v = sd.value?.艳母?.沉沦 ?? 0; return v < 20 ? '#8899aa' : v < 50 ? '#a569bd' : v < 75 ? '#7d3c98' : '#4a235a'; });
const corruptionGrad = computed(() => { const v = sd.value?.艳母?.沉沦 ?? 0; return v < 20 ? 'linear-gradient(90deg,#566573,#8899aa)' : v < 50 ? 'linear-gradient(90deg,#7d3c98,#a569bd)' : v < 75 ? 'linear-gradient(90deg,#4a235a,#7d3c98)' : 'linear-gradient(90deg,#2c0e3a,#4a235a)'; });
const arousalGrad = 'linear-gradient(90deg,#f5a0c0,#e94560)';
</script>
