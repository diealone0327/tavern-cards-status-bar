<template>
  <nav class="tabs">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="tab-button"
      :class="{ active: model === tab.id }"
      :aria-expanded="model === tab.id"
      @click="toggleTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string }[];
}>();

const model = defineModel<string | null>({ required: true });

function toggleTab(id: string) {
  model.value = model.value === id ? null : id;
}
</script>

<style scoped>
.tabs {
  display: flex;
  background-color: var(--c-ink-muted);
  border-bottom: 2px solid var(--c-ink);
}

.tab-button {
  flex: 1;
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--c-paper-light);
  font-size: 0.92rem;
  font-family: var(--font-title);
  cursor: pointer;
  border-right: 1px solid var(--c-ink);
  letter-spacing: 0.1em;
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  background-color: var(--c-paper);
  color: var(--c-ink);
}

.tab-button.active {
  background-color: var(--c-paper);
  color: var(--c-ink);
  position: relative;
  bottom: -1px;
  padding-bottom: 10px;
}
</style>
