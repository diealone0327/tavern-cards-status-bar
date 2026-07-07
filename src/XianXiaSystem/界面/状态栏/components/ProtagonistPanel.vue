<script setup lang="ts">
defineProps<{
  protagonist?: {
    姓名?: string;
    年龄?: number;
    性别?: string;
    掩盖修为?: string;
    境界?: string;
    小境界?: number;
    修为进度?: number;
    寿元?: number;
    灵石?: number;
  };
}>();

function formatJingjie(big?: string, small?: number): string {
  if (!big) return '---';
  if (small && small > 0) {
    const cn = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return `${big}·${cn[small] || small}重`;
  }
  return big;
}
</script>

<template>
  <div class="card" v-if="protagonist">
    <div class="card-title">◈ 主角面板</div>

    <div class="stat-row">
      <span class="stat-label">姓名</span>
      <span class="stat-value primary" style="font-size: 15px; font-weight: 700;">
        {{ protagonist.姓名 || '无名' }}
      </span>
      <span class="stat-label" style="text-align: right;">
        {{ protagonist.年龄 ?? '?' }}岁
      </span>
    </div>

    <div class="divider" />

    <div class="stat-row">
      <span class="stat-label">境界</span>
      <span class="tag tag-primary" style="font-size: 13px; padding: 2px 10px;">
        {{ formatJingjie(protagonist.境界, protagonist.小境界) }}
      </span>
      <span v-if="protagonist.掩盖修为" class="tag tag-accent" style="font-size: 11px; padding: 2px 8px; margin-left: 4px;">
        掩盖:{{ protagonist.掩盖修为 }}
      </span>
      <span class="stat-value primary">{{ protagonist.修为进度 ?? 0 }}%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-bar-fill" :style="{ width: (protagonist.修为进度 ?? 0) + '%' }" />
    </div>

    <div class="divider" />

    <div class="grid-2">
      <div class="stat-row">
        <span class="stat-label">灵石</span>
        <span class="stat-value primary">🪙 {{ protagonist.灵石 ?? 0 }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">寿元</span>
        <span class="stat-value" :class="(protagonist.寿元 ?? 0) < 50 ? 'danger' : 'success'">
          {{ protagonist.寿元 ?? '---' }} 年
        </span>
      </div>
    </div>
  </div>
</template>
