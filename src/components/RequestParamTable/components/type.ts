export type NewColumn = {
  fieldName: string,
  required: "是" | "否",
  type: 'int' | 'string' | 'boolean' | 'double' | 'long',
  desc?: string,
}
