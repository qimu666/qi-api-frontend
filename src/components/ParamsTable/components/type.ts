export type NewRequestColumn = {
  fieldName: string,
  required: "是" | "否",
  type: 'int' | 'string' | 'boolean' | 'double' | 'long',
  desc?: string,
}
export type NewResponseColumn = {
  fieldName: string,
  type: 'int' | 'string' | 'boolean' | 'double' | 'long',
  desc?: string,
}


