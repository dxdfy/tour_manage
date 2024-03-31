import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Button, Card, Image, Modal } from 'antd';

const Show = ({ task }) => {
  console.log(task);
  const [isTextShow, setIsTextShow] = useState(false);
  const formatTextForDisplay = (text) => {
    return text.split('\n').map((paragraph, index) => {
      return index === 0 ? paragraph : `\n  ${paragraph}`;
    }).join('\n');
  };
  return (
    <Card title="游记信息">
      <p><strong>游记id：</strong> {task.id}</p>
      <p><strong>用户名称：</strong> {task.name}</p>
      <p><strong>Status：</strong> {task.status}</p>
      <p><strong>游记内容：</strong><Button onClick={() => { setIsTextShow(true) }}>点击查看</Button> </p>
      <Modal
        title="查看详情"
        open={isTextShow}
        maskClosable={false}
        onCancel={() => setIsTextShow(false)}
        destroyOnClose
        footer={null}
      >
        <div style={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
          {formatTextForDisplay(task.text)}
        </div>
      </Modal>
      <p><strong>Title：</strong> {task.title}</p>
      {task.pic_urls && (
        <div>
          <strong>游记照片：</strong><br />
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            {task.pic_urls.map((url, index) => (
              <Image key={index} src={url} alt={`Pic ${index + 1}`} width={200} />
            ))}
          </Image.PreviewGroup>
        </div>
        
      )}
      {task.video_urls && task.video_urls.length > 0 && (
        <div>
          <strong>视频：</strong><br />
          <ReactPlayer url={task.video_urls[0]} controls width="100%" />
        </div>
      )}
    </Card>
  );
};

export default Show;
