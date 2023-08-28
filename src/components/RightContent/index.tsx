import {ExportOutlined, PlusOutlined} from '@ant-design/icons';
import '@umijs/max';
import React from 'react';
import {Button, Tooltip} from "antd";

export type SiderTheme = 'light' | 'dark';
export const Release = () => {
  return (
    <Button shape="round" key="1"><PlusOutlined/> 发布接口 </Button>
  );
};
export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
      }}
    >
      <Tooltip title="分享此网站">
        <ExportOutlined/>
      </Tooltip>
    </div>
  );
};

export const helloWord = `
                                          _    _      _ _        __          __        _     _
                                         | |  | |    | | |       \\ \\        / /       | |   | |
                                         | |__| | ___| | | ___    \\ \\  /\\  / /__  _ __| | __| |
 o()xxxx[{::::::::::::::::::::::::::>    |  __  |/ _ \\ | |/ _ \\    \\ \\/  \\/ / _ \\| '__| |/ _\` |
                                         | |  | |  __/ | | (_) |    \\  /\\  / (_) | |  | | (_| |
                                         |_|  |_|\\___|_|_|\\___/      \\/  \\/ \\___/|_|  |_|\\__,_|

`
