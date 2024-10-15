import { ResponsivePie } from '@nivo/pie';
import { PieTooltipProps } from '@nivo/pie';
import {useRef} from "react";
import { toPng } from 'html-to-image';
import {Button} from "components/UI/button";

// 自定义工具提示组件
const CustomTooltip: React.FC<PieTooltipProps<any>> = ({ datum }) => {
  return (
    <div
      style={{
        color: datum.color,
        padding: 12,
        borderRadius: 4,
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <strong>{datum.id}</strong>: {datum.value}
    </div>
  );
};

const MyPieChart = ({ series }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const data = series[0].data.map((item) => ({
    id: item.label,
    label: item.label,
    value: item.value,
  }));

const handleDownload = () => {
    if (chartRef.current === null) {
      return;
    }
    toPng(chartRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'piechart.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Failed to download image:', error);
      });
  };

  return (
    <div style={{ height: 600, width: 600 }} className={'flex flex-col align-middle items-center'}>
      <div className={'flex flex-row gap-4 align-middle items-center'}>
        <div>
          {series[0].chartTitle}
        </div>
        <Button
          onClick={handleDownload}
          size={"sm"}
        >
          Download
        </Button>
      </div>
      <div ref={chartRef} className={'w-full h-full'}>
      <ResponsivePie
        data={data}
        margin={{top: 40, right: 80, bottom: 80, left: 80}}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                },
              },
            ],
          },
        ]}
        tooltip={CustomTooltip} // 使用 tooltip 属性
      />
      </div>
    </div>

  );
};

export default MyPieChart;
