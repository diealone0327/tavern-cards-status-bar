// schema.ts — 《以牙还牙》MVU 变量结构定义
// 运行时已注入全局 z（Zod v4）与 _（lodash），本文件禁止任何 import 语句。
// 顶层结构：世界 / 主线 / user / 白凝冰 / 林婉 / 林妙可 / 宋慧茹 / 柳如烟 / 后宫
// 四位攻略对象（白凝冰/林婉/林妙可/宋慧茹）的好感度与欲望度各自独立，互不联动。
// 所有对象均带 .prefault 以兼容增量更新（JSON patch 删除对象后自动回填默认值）。

export const Schema = z.object({
  // ── 世界：维持场景连续性 ──
  世界: z.object({
    日期: z.string().describe('格式 YYYY/MM/DD，如 2026/08/24；不做格式强校验，仅作时间连续性参考').prefault(''),
    时间段: z.enum(['清晨', '上午', '中午', '下午', '傍晚', '夜晚', '深夜']).prefault('上午'),
    当前位置: z.string().describe('当前场景，如 <user>家 / 林家住宅 / 公司 / 咖啡馆').prefault(''),
  }).prefault({}),
  // ── 主线：驱动阶段指导（剧情流程阶段，非复仇完成度）──
  主线: z.object({
    阶段: z.enum(['发现', '布局', '攻略', '冲突', '收束']).prefault('发现'),
  }).prefault({}),
  // ── user ──
  user: z.object({
    金钱: z.coerce.number().transform(v => _.clamp(v, 0, 999999)).prefault(0),
  }).prefault({}),
  // ── 白凝冰：攻略对象一（冷艳强势）──
  白凝冰: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    欲望度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    线阶段: z.enum(['未接触', '初识', '暧昧', '深入', '达成']).prefault('未接触'),
    亲密状态: z.enum(['未发生', '暧昧接触', '亲吻', '深入亲密']).prefault('未发生'),
  }).prefault({}),
  // ── 林婉：攻略对象二（叛逆，结构同白凝冰）──
  林婉: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    欲望度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    线阶段: z.enum(['未接触', '初识', '暧昧', '深入', '达成']).prefault('未接触'),
    亲密状态: z.enum(['未发生', '暧昧接触', '亲吻', '深入亲密']).prefault('未发生'),
  }).prefault({}),
  // ── 林妙可：攻略对象三（御姐，结构同白凝冰）──
  林妙可: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    欲望度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    线阶段: z.enum(['未接触', '初识', '暧昧', '深入', '达成']).prefault('未接触'),
    亲密状态: z.enum(['未发生', '暧昧接触', '亲吻', '深入亲密']).prefault('未发生'),
  }).prefault({}),
  // ── 宋慧茹：攻略对象四（温婉，结构同白凝冰）──
  宋慧茹: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    欲望度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    线阶段: z.enum(['未接触', '初识', '暧昧', '深入', '达成']).prefault('未接触'),
    亲密状态: z.enum(['未发生', '暧昧接触', '亲吻', '深入亲密']).prefault('未发生'),
  }).prefault({}),
  // ── 柳如烟：剧情中段回归双线 ──
  柳如烟: z.object({
    剧情开关: z.enum(['未回归', '求复合', '挑衅']).prefault('未回归'),
  }).prefault({}),
  // ── 后宫：结局收束判定（已攻略名单去重）──
  后宫: z.object({
    已攻略: z.array(z.enum(['白凝冰', '林婉', '林妙可', '宋慧茹'])).transform(v => _.uniq(v)).prefault([]),
  }).prefault({}),
}).prefault({});

export type SchemaType = z.infer<typeof Schema>;
