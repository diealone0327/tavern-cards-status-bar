export const Schema = z.object({
  系统: z.object({
    当前阶段: z.enum(['亲情', '暧昧', '乱伦']).prefault('亲情'),
    当前场景: z.string().prefault('客厅'),
  }).prefault({}),
  艳母: z.object({
    好感度: z.coerce.number().transform(val => _.clamp(val, 0, 100)).prefault(30),
    欲望: z.coerce.number().transform(val => _.clamp(val, 0, 100)).prefault(5),
    沉沦: z.coerce.number().transform(val => _.clamp(val, 0, 100)).prefault(0),
    发情: z.coerce.number().transform(val => _.clamp(val, 0, 100)).prefault(0),
  }).prefault({}),
});
export type Schema = z.output<typeof Schema>;
