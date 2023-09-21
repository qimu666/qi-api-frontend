import {EditableProTable, ProColumns} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';

const ParamsTable: React.FC<{
  defaultNewColumn: any,
  column: ProColumns[];
  value?: string;
  onChange?: (
    value: {
      id: React.Key;
      fieldName?: string;
      type?: string;
      desc?: string;
      required?: string;
    }[],
  ) => void;
}> = ({value, onChange, defaultNewColumn, column}) => {
  const [dataSource, setDataSource] = useState<readonly API.RequestParamsField[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => {
    return dataSource.map((item) => item.id as React.Key);
  });
  const doData = (value: any) => {
    const valueArray = [...value];
    setDataSource(valueArray)
    let requestIds = valueArray?.map((item) => item.id as unknown as string) || [];
    setEditableRowKeys(requestIds)
  }
  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        const parseValue = JSON.parse(value);
        doData(parseValue)
      } else {
        const parseValue = value as any;
        doData(parseValue)
      }
    }

  }, [value])
  const handleInputChange = (e: any) => {
    onChange?.(e);
  };
  const columns: ProColumns[] = [
    ...column,
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            // @ts-ignore
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }
          }
        >
          删除
        </a>,
      ]
    },
  ];

  return (
    <EditableProTable<any>
      columns={columns}
      rowKey="id"
      scroll={{
        y: 180,
      }}
      value={dataSource}
      onChange={setDataSource}
      recordCreatorProps={{
        newRecordType: 'dataSource',
        position: 'bottom',
        record: () => {
          return (
            {
              id: Date.now().toString(),
              ...defaultNewColumn
            })
        },
      }}
      editable={{
        type: 'multiple',
        editableKeys,
        actionRender: (row, config, dom) => {
          return [dom.save || dom.delete, dom.cancel, dom.delete];
        },
        onValuesChange: (record, recordList) => {
          handleInputChange(recordList)
        },
        onChange: setEditableRowKeys,
      }}
    />
  );
};
export default ParamsTable
