export const Schema = z.object({
  // 系统
  系统: z.object({
    当前时间: z.string().prefault('第1日·清晨'),
    当前地点: z.string().prefault('青云宗·杂役院'),
    剧情阶段: z.string().prefault('初遇'),
  }),

  // 主角
  user: z.object({
    修为境界: z.enum(['练气','筑基','金丹','元婴','化神','合体','大乘','渡劫']).prefault('练气'),
    修为进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    下品灵石: z.coerce.number().transform(v => Math.max(0, v)).prefault(3),
    中品灵石: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
    上品灵石: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
    宗门贡献: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
    宗门职位: z.string().prefault('杂役弟子'),
    持有物品: z.record(z.coerce.number()).prefault({}),
    已学功法: z.array(z.string()).prefault([]),
    当前装备的功法: z.string().prefault(''),
    穿着: z.string().prefault('灰色破旧短褐'),
    身体状况: z.enum(['健康','轻伤','重伤','中毒','濒危']).prefault('健康'),
  }),

  // 聚宝盆
  聚宝盆: z.object({
    冷却状态: z.boolean().prefault(true),
    盆内物品: z.string().prefault(''),
    剩余时间: z.string().prefault(''),
    _复制记录: z.array(z.object({
      物品名: z.string(),
      品质: z.string(),
      日期: z.string(),
    })).prefault([]),
  }),

  // 宗门
  宗门: z.object({
    宗门态势: z.enum(['平静','暗流','危机']).prefault('平静'),
    宗门事件: z.string().prefault(''),
  }),

  // 人际关系
  人际关系: z.record(z.coerce.number()).prefault({}),

  // 随机NPC关系
  随机NPC关系: z.record(z.enum(['友好','冷漠','敌对'])).prefault({}),

  // 秘境
  秘境: z.object({
    当前活跃秘境: z.string().prefault(''),
    开启倒计时: z.string().prefault(''),
    已探索秘境: z.array(z.string()).prefault([]),
  }),

  // 任务
  任务: z.record(z.object({
    状态: z.enum(['未开始', '进行中', '已完成', '失败']).prefault('未开始'),
    来源: z.string().prefault(''),
    描述: z.string().prefault(''),
  })).prefault({}),
});
export type Schema = z.output<typeof Schema>;
