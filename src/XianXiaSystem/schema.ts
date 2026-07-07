export const Schema = z.object({
  // ── 系统 ──
  系统: z.object({
    积分: z.coerce.number().prefault(0),
    今日签到: z.boolean().prefault(false),
    今日任务: z.boolean().prefault(false),
    当前日期: z.string().prefault(''),
    系统任务内容: z.string().prefault(''),
    系统任务进度: z.coerce.number().prefault(0),
    系统任务奖励: z.string().prefault(''),
    宗门任务内容: z.string().prefault(''),
    宗门任务进度: z.coerce.number().prefault(0),
    宗门任务奖励: z.string().prefault(''),
  }),
  // ── 主角 ──
  主角: z.object({
    姓名: z.string().prefault(''),
    年龄: z.coerce.number().prefault(18),
    性别: z.string().prefault(''),
    掩盖修为: z.string().prefault(''),
    境界: z.enum(['炼气', '筑基', '金丹', '元婴', '化神', '合体', '大乘', '渡劫']).prefault('炼气'),
    小境界: z.coerce.number().transform(v => _.clamp(v, 1, 9)).prefault(1),
    修为进度: z.coerce.number().prefault(0),
    寿元: z.coerce.number().prefault(150),
    灵石: z.coerce.number().prefault(0),
    属性: z.object({
      长度: z.coerce.number().transform(v => _.clamp(v, 0, 20)).prefault(10),
      粗度: z.coerce.number().transform(v => _.clamp(v, 0, 5)).prefault(3),
      硬度: z.coerce.number().transform(v => _.clamp(v, 0, 5)).prefault(3),
      耐久度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(30),
      精液量: z.coerce.number().transform(v => _.clamp(v, 100, 1000)).prefault(100),
    }),
    道具: z.array(z.string()).prefault([]),
    丹药: z.array(z.string()).prefault([]),
    法宝: z.array(z.string()).prefault([]),
    武器: z.array(z.string()).prefault([]),
    技能: z.object({
      NSFW技能: z.array(z.string()).prefault([]),
      修为技能: z.array(z.string()).prefault([]),
      生活技能: z.array(z.string()).prefault([]),
    }),
  }),
  // ── NPC关系（动态记录，键为NPC名称） ──
   NPC关系: z.record(z.object({
     好感度: z.coerce.number().transform(v => _.clamp(v, 0, 300)).prefault(30),
     沉沦: z.coerce.number().prefault(0),
     性别: z.string().prefault(''),
     年纪: z.coerce.number().prefault(0),
     修为: z.string().prefault(''),
     小境界: z.coerce.number().transform(v => _.clamp(v, 1, 9)).prefault(1),
     修为进度: z.coerce.number().prefault(0),
     瓶颈: z.boolean().prefault(false),
     寿元: z.coerce.number().prefault(150),
   })).prefault({}),
  // ── 当前互动NPC ──
  当前互动NPC: z.string().prefault(''),
});
export type Schema = z.output<typeof Schema>;
