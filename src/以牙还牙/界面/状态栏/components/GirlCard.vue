<script setup lang="ts">
import { computed } from 'vue';
import type { SchemaType } from '../../../schema';

const props = defineProps<{
  name: string;
  rel: string;
  data: SchemaType['白凝冰'];
}>();

const open = useLocalStorage<boolean>(`yy_status:card_open:${props.name}`, true);

const lineMeta: Record<string, { label: string; cls: string }> = {
  '未接触': { label: '未接触', cls: 'badge-gray' },
  '初识': { label: '初识', cls: 'badge-blue' },
  '暧昧': { label: '暧昧', cls: 'badge-orange' },
  '深入': { label: '深入', cls: 'badge-purple' },
  '达成': { label: '达成', cls: 'badge-gold' },
};
const lineInfo = computed(() => lineMeta[props.data.线阶段] || lineMeta['未接触']);

const intiMeta: Record<string, { label: string; cls: string }> = {
  '未发生': { label: '未发生', cls: 'badge-gray' },
  '暧昧接触': { label: '暧昧接触', cls: 'badge-blue' },
  '亲吻': { label: '亲吻', cls: 'badge-purple' },
  '深入亲密': { label: '深入亲密', cls: 'badge-pink' },
};
const intiInfo = computed(() => intiMeta[props.data.亲密状态] || intiMeta['未发生']);

const affection = computed(() => props.data.好感度 ?? 0);
const desire = computed(() => props.data.欲望度 ?? 0);
const done = computed(() => props.data.线阶段 === '达成');
</script>

<template>
  <div :class="['dossier-card', { done }]">
    <div class="dossier-head">
      <span class="dossier-title">{{ name }}</span>
      <span class="badge" :class="lineInfo.cls">{{ lineInfo.label }}</span>
      <span class="badge" :class="intiInfo.cls">{{ intiInfo.label }}</span>
      <span class="dossier-sub">{{ rel }}</span>
      <span class="fold-btn" @click="open = !open">{{ open ? '收起 ▲' : '展开 ▼' }}</span>
    </div>

    <div v-if="open" class="dual-meters">
      <div class="meter-row">
        <span class="meter-name">好感</span>
        <div class="meter-track">
          <div class="meter-fill affection" :style="{ width: affection + '%' }"></div>
        </div>
        <span class="meter-value affection">{{ affection }}</span>
      </div>
      <div class="meter-row">
        <span class="meter-name">欲望</span>
        <div class="meter-track">
          <div class="meter-fill desire" :style="{ width: desire + '%' }"></div>
        </div>
        <span class="meter-value desire">{{ desire }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dual-meters {
  padding-top: 6px;
}

.meter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
}

.meter-name {
  width: 34px;
  font-size: 11px;
  color: var(--c-text-dim);
  letter-spacing: 1px;
  flex-shrink: 0;
}

.meter-track {
  flex: 1;
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;

  &.affection {
    background: linear-gradient(90deg, #c47f2e, var(--c-affection));
  }

  &.desire {
    background: linear-gradient(90deg, #a83260, var(--c-desire));
  }
}

.meter-value {
  width: 30px;
  text-align: right;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;

  &.affection {
    color: var(--c-affection);
  }

  &.desire {
    color: var(--c-desire);
  }
}
</style>
