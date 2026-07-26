export const Schema = z.object({
  系统: z.object({
    当前时间: z.string().prefault('傍晚'),
    当前场景: z.string().prefault('柳家别墅客厅'),
    最近事件: z.string().prefault('婚礼结束，正式入住柳家'),
  }),
  柳清禾: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
    近期态度: z.string().prefault('冷淡疏离，把合约丈夫当空气'),
  }),
  柳知晚: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(5),
    近期态度: z.string().prefault('完全不认可这个突然出现的妹夫'),
  }),
  柳书瑶: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(20),
    近期态度: z.string().prefault('对新姐夫充满好奇和好感'),
  }),
  柳语茉: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(15),
    近期态度: z.string().prefault('礼貌观察中，正在评估这个合约女婿'),
  }),
});
export type Schema = z.output<typeof Schema>;
