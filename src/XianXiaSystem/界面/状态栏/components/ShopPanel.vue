<script setup lang="ts">
import { ref } from 'vue';
import { shopCategories } from '../shop-data';

const panelOpen = ref(false);
const openCategories = ref<Set<number>>(new Set());
const openItems = ref<Set<string>>(new Set());

function toggleCategory(idx: number) {
  const s = new Set(openCategories.value);
  s.has(idx) ? s.delete(idx) : s.add(idx);
  openCategories.value = s;
}

function toggleItem(key: string) {
  const s = new Set(openItems.value);
  s.has(key) ? s.delete(key) : s.add(key);
  openItems.value = s;
}
</script>

<template>
  <div class="card shop-panel" :class="{ open: panelOpen }">
    <div class="card-title shop-toggle" @click="panelOpen = !panelOpen">
      <span>◆ 系统商城</span>
      <span class="shop-arrow">{{ panelOpen ? '▼' : '▶' }}</span>
    </div>

    <div v-if="panelOpen" class="shop-content">

      <!-- 分类循环 -->
      <div
        v-for="(cat, ci) in shopCategories"
        :key="ci"
        class="shop-category"
      >
        <div class="shop-cat-header" @click="toggleCategory(ci)">
          <span>{{ cat.icon }} {{ cat.name }}</span>
          <span class="cat-count">({{ cat.items.length }})</span>
          <span class="shop-arrow small">{{ openCategories.has(ci) ? '▼' : '▶' }}</span>
        </div>

        <div v-if="openCategories.has(ci)" class="shop-items">
          <div
            v-for="item in cat.items"
            :key="item.name"
            class="shop-item"
          >
            <div class="shop-item-header" @click="toggleItem(cat.name + '|' + item.name)">
              <span class="shop-item-name">{{ item.name }}</span>
              <span v-if="item.note.includes('被动')" class="stype-tag passive">被动</span>
              <span v-else-if="item.note.includes('主动')" class="stype-tag active">主动</span>
              <span class="shop-item-price">{{ item.price }}</span>
              <span class="shop-arrow tiny">{{ openItems.has(cat.name + '|' + item.name) ? '−' : '+' }}</span>
            </div>

            <div v-if="openItems.has(cat.name + '|' + item.name)" class="shop-item-detail">
              <div class="stat-row">
                <span class="stat-label">效果</span>
                <span class="stat-value" style="text-align: right; max-width: 200px;">{{ item.effect }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">备注</span>
                <span class="stat-value" style="text-align: right; max-width: 200px;">{{ item.note }}</span>
              </div>
              <div class="stat-row" v-if="item.灵石价">
                <span class="stat-label">灵石价</span>
                <span class="stat-value primary">{{ item.灵石价 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 通用规则 -->
      <div class="divider" />
      <div class="shop-rules">
        <div class="stat-label" style="margin-bottom: 3px;">通用规则</div>
        <div class="shop-rule-item">积分兑换，概不退换</div>
        <div class="shop-rule-item">商品库存无限，每次兑换立即生效</div>
        <div class="shop-rule-item">道具和技能为系统独有，修仙界不存在</div>
        <div class="shop-rule-item">标有灵石价的丹药可用灵石代替积分支付</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.shop-toggle:hover {
  color: var(--c-glow);
}
.shop-arrow {
  font-size: 10px;
  color: var(--c-text-dim);
  transition: transform 0.2s;
}
.shop-arrow.small { font-size: 9px; }
.shop-arrow.tiny { font-size: 8px; }

.shop-content {
  margin-top: 4px;
}

.shop-category {
  margin-bottom: 2px;
  border: 1px solid var(--c-border-light);
  border-radius: 4px;
  overflow: hidden;
}
.shop-cat-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text);
  background: rgba(255,255,255,0.03);
  user-select: none;
}
.shop-cat-header:hover {
  background: var(--c-primary-bg);
}
.cat-count {
  font-size: 10px;
  color: var(--c-text-muted);
  margin-right: auto;
}

.shop-items {
  border-top: 1px solid var(--c-border-light);
}
.shop-item {
  border-bottom: 1px solid var(--c-border-light);
}
.shop-item:last-child {
  border-bottom: none;
}
.shop-item-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 11px;
  user-select: none;
}
.shop-item-header:hover {
  background: rgba(255,255,255,0.04);
}
.shop-item-name {
  flex: 1;
  color: var(--c-text);
}
.shop-item-price {
  font-size: 10px;
  color: var(--c-primary);
  font-weight: 500;
}
.stype-tag { display: inline-block; padding: 0 4px; border-radius: 2px; font-size: 9px; font-weight: 500; }
.stype-tag.passive { background: rgba(107,191,89,0.15); color: var(--c-success); }
.stype-tag.active { background: rgba(224,80,80,0.15); color: var(--c-danger); }
.shop-item-detail {
  padding: 4px 8px 6px;
  background: rgba(0,0,0,0.15);
  border-top: 1px solid var(--c-border-light);
}
.shop-item-detail .stat-row {
  padding: 1px 0;
}

.shop-rules {
  padding: 4px 0;
}
.shop-rule-item {
  font-size: 10px;
  color: var(--c-text-muted);
  padding: 1px 0;
  padding-left: 8px;
  position: relative;
}
.shop-rule-item::before {
  content: '·';
  position: absolute;
  left: 0;
}
</style>
