<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  taskData?: {
    今日任务?: boolean;
    系统任务内容?: string;
    系统任务进度?: number;
    系统任务奖励?: string;
    宗门任务内容?: string;
    宗门任务进度?: number;
    宗门任务奖励?: string;
  };
}>();

const panelOpen = ref(false);
const catOpen = ref<Set<string>>(new Set());

function toggle(key: string) {
  const s = new Set(catOpen.value);
  s.has(key) ? s.delete(key) : s.add(key);
  catOpen.value = s;
}
</script>

<template>
  <div class="card">
    <div class="card-title fold-toggle" @click="panelOpen = !panelOpen">
      <span>⚡ 任务</span>
      <span class="fold-arrow">{{ panelOpen ? '▼' : '▶' }}</span>
    </div>
    <div v-if="panelOpen" class="fold-body">

      <!-- 系统任务 -->
      <div class="fold-cat">
        <div class="fold-cat-header" @click="toggle('系统任务')">
          <span>📋 系统任务</span>
          <span class="tag-success tag" style="font-size: 9px; margin-left: auto;" v-if="taskData?.今日任务">已完成</span>
          <span class="fold-arrow small" style="margin-left: 6px;">{{ catOpen.has('系统任务') ? '▼' : '▶' }}</span>
        </div>
        <div v-if="catOpen.has('系统任务')" class="fold-cat-body">
          <div v-if="taskData?.系统任务内容" class="task-item">
            <div class="task-desc">{{ taskData.系统任务内容 }}</div>
            <div class="task-progress">
              <span class="stat-label">进度</span>
              <div class="mini-bar"><div class="mini-fill" :style="{ width: (taskData.系统任务进度 ?? 0) + '%' }" /></div>
              <span class="stat-value primary">{{ taskData.系统任务进度 ?? 0 }}%</span>
            </div>
            <div class="task-reward" v-if="taskData.系统任务奖励">
              <span class="stat-label">奖励</span>
              <span class="stat-value success">{{ taskData.系统任务奖励 }}</span>
            </div>
          </div>
          <div v-else class="task-empty">今日暂无系统任务，输入"做任务"接取</div>
        </div>
      </div>

      <!-- 宗门任务 -->
      <div class="fold-cat">
        <div class="fold-cat-header" @click="toggle('宗门任务')">
          <span>🏛️ 宗门任务</span>
          <span class="fold-arrow small" style="margin-left: auto;">{{ catOpen.has('宗门任务') ? '▼' : '▶' }}</span>
        </div>
        <div v-if="catOpen.has('宗门任务')" class="fold-cat-body">
          <div v-if="taskData?.宗门任务内容" class="task-item">
            <div class="task-desc">{{ taskData.宗门任务内容 }}</div>
            <div class="task-progress">
              <span class="stat-label">进度</span>
              <div class="mini-bar"><div class="mini-fill" :style="{ width: (taskData.宗门任务进度 ?? 0) + '%' }" /></div>
              <span class="stat-value primary">{{ taskData.宗门任务进度 ?? 0 }}%</span>
            </div>
            <div class="task-reward" v-if="taskData.宗门任务奖励">
              <span class="stat-label">奖励</span>
              <span class="stat-value success">{{ taskData.宗门任务奖励 }}</span>
            </div>
          </div>
          <div v-else class="task-empty">暂无宗门任务</div>
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
.fold-cat-body { border-top: 1px solid var(--c-border-light); padding: 6px 8px; }
.tag-success { background: rgba(107,191,89,0.15); color: var(--c-success); padding: 1px 4px; border-radius: 2px; }

.task-item { }
.task-desc { font-size: 12px; color: var(--c-text); padding: 2px 0; }
.task-progress { display: flex; align-items: center; gap: 6px; padding: 3px 0; }
.task-reward { display: flex; align-items: center; gap: 6px; padding: 2px 0; }
.mini-bar { flex: 1; height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; max-width: 120px; }
.mini-fill { height: 100%; border-radius: 2px; background: var(--c-primary); transition: width 0.3s ease; }
.task-empty { font-size: 11px; color: var(--c-text-muted); font-style: italic; padding: 2px 0; }
.stat-label { color: var(--c-text-dim); font-size: 12px; }
.stat-value { color: var(--c-text); font-weight: 500; font-size: 12px; }
.stat-value.primary { color: var(--c-primary); }
.stat-value.success { color: var(--c-success); }
</style>
