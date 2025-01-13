import React from 'react';
import { ConfigProvider, DatePicker, Space } from 'antd';
import en from 'antd/es/date-picker/locale/en_US';
import enUS from 'antd/es/locale/en_US';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
dayjs.extend(buddhistEra);

const buddhistLocale = {
  ...en,
  lang: {
    ...en.lang,
    fieldDateFormat: 'BBBB-MM-DD',
    fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
    yearFormat: 'BBBB',
    cellYearFormat: 'BBBB',
  },
};

const globalBuddhistLocale = {
  ...enUS,
  DatePicker: {
    ...enUS.DatePicker,
    lang: buddhistLocale.lang,
  },
};

const defaultValue = dayjs('2024-01-01');

const DatePickerCom = () => {
  const onChange = (_, dateStr) => {
    console.log('onChange:', dateStr);
  };
  
  return (
    <div style={{ width: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <ConfigProvider locale={globalBuddhistLocale}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <DatePicker
              defaultValue={defaultValue}
              showTime
              onChange={onChange}
              style={{ width: '100%' }}
            />
          </Space>
        </ConfigProvider>
      </Space>
    </div>
  );
};

export default DatePickerCom;
