// pages/generate/timeline/timeline.js
import * as echarts from '../../../components/ec-canvas/echarts';

var timeline_template = 2;



//时间轴需要的数据
var eventData = [];
var graphData = [];
var titleData = [];
var dotData = [];
var lineData = [];
var imgData = {};
var links; 
var yAxisData = [];

//3号时间轴数据（还需要转化）
const colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555'];
const bgColor = '#2E2733';
const itemStyle = {
  star5: {
    color: colors[0]
  },
  star4: {
    color: colors[1]
  },
  star3: {
    color: colors[2]
  },
  star2: {
    color: colors[3]
  }
};
const data = [
  {
    name: '2023年\n小明读书记录',
    itemStyle: {
      color: colors[2]
    },
    children: [
      {
        name: '1月',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '无界面交互'
              }
            ]
          },
          {
            name: '4☆',
            children: [
              {
                name: '数字绘图的光照与渲染技术'
              }
            ]
          }
        ]
      },
      {
        name: '2月',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '《痛点》'
              }
            ]
          },
          {
            name: '4☆',
            children: [
              {
                name: '《进化》'
              },
              {
                name: '《后物欲时代的来临》'
              }
            ]
          },
          {
            name: '3☆',
            children: [
              {
                name: '《疯癫与文明》'
              }
            ]
          }
        ]
      },
      {
        name: '3月',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '《我们时代的神经症人格》'
              }
            ]
          },
          {
            name: '4☆',
            children: [
              {
                name: '《皮格马利翁效应》'
              },
              {
                name: '《受伤的人》'
              }
            ]
          },
          {
            name: '3☆'
          },
          {
            name: '2☆',
            children: [
              {
                name: '《迷恋》'
              }
            ]
          }
        ]
      },
      {
        name: '4月',
        children: [
          {
            name: '4☆',
            children: [
              {
                name: '《把房子住成家》'
              },
              {
                name: '《只过必要生活》'
              }
            ]
          }
        ]
      },
      {
        name: '5月',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '《设计诗》'
              }
            ]
          },
          {
            name: '4☆',
            children: [
              {
                name: '《假如生活糊弄了你》'
              }
            ]
          },
          {
            name: '3☆',
            children: [
              {
                name: '《方向》'
              }
            ]
          }
        ]
      },
      {
        name: '6月',
        children: [
          {
            name: '4☆',
            children: [
              {
                name: '《人生的智慧》'
              }
            ]
          }
        ]
      },
      {
        name: '7月',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '《代码整洁之道》'
              }
            ]
          }
        ]
      },
      {
        name: '8月',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '《慈悲》'
              },
              {
                name: '《楼下的房客》'
              }
            ]
          },
          {
            name: '4☆',
            children: [
              {
                name: '《虚无的十字架》'
              },
              {
                name: '《童年的终结》'
              }
            ]
          },
          {
            name: '3☆',
            children: [
              {
                name: '《疯癫老人日记》'
              }
            ]
          }
        ]
      },
      {
        name: '9月',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '《纳博科夫短篇小说全集》'
              }
            ]
          },
          {
            name: '4☆',
            children: [
              {
                name: '《安魂曲》'
              },
              {
                name: '《人生拼图版》'
              }
            ]
          },
          {
            name: '3☆',
            children: [
              {
                name: '《比起爱你，我更需要你》'
              }
            ]
          }
        ]
      }
    ]
  }
];
for (let j = 0; j < data.length; ++j) {
  let level1 = data[j].children;
  for (let i = 0; i < level1.length; ++i) {
    let block = level1[i].children;
    let bookScore = [];
    let bookScoreId;
    for (let star = 0; star < block.length; ++star) {
      let style = (function (name) {
        switch (name) {
          case '5☆':
            bookScoreId = 0;
            return itemStyle.star5;
          case '4☆':
            bookScoreId = 1;
            return itemStyle.star4;
          case '3☆':
            bookScoreId = 2;
            return itemStyle.star3;
          case '2☆':
            bookScoreId = 3;
            return itemStyle.star2;
        }
      })(block[star].name);
      block[star].label = {
        color: style.color,
        downplay: {
          opacity: 0.5
        }
      };
      if (block[star].children) {
        style = {
          opacity: 1,
          color: style.color
        };
        block[star].children.forEach(function (book) {
          book.value = 1;
          book.itemStyle = style;
          book.label = {
            color: style.color
          };
          let value = 1;
          if (bookScoreId === 0 || bookScoreId === 3) {
            value = 5;
          }
          if (bookScore[bookScoreId]) {
            bookScore[bookScoreId].value += value;
          } else {
            bookScore[bookScoreId] = {
              color: colors[bookScoreId],
              value: value
            };
          }
        });
      }
    }
    level1[i].itemStyle = {
      color: data[j].itemStyle.color
    };
  }
}




const IMG = [
  '/image/generate/events/event_0.png',
  '/image/generate/events/event_1.png',
  '/image/generate/events/event_2.png',
  '/image/generate/events/event_3.png',
  '/image/generate/events/event_4.png',
  '/image/generate/events/event_5.png',
]

function initData(){
  eventData=[
    {date:'2023-02-01', title:'小明今天开始学习钢琴'},
    {date:'2023-03-05', title:'小明学会了第一首曲子'},
    {date:'2023-04-20', title:'小明说好喜欢弹钢琴'},
    {date:'2023-06-04', title:'小明开始准备第一次考级'},
    {date:'2023-07-09', title:'给小明买了一台自己的钢琴'},
    {date:'2023-09-15', title:'小明通过了考级'}
  ];
  titleData = eventData.map(event => event.title);
  if(timeline_template == 0){
    //0号时间轴
    graphData = eventData.map(event => [event.date, 1000]);
    links = graphData.map(function (item, idx) {
      return {
        source: idx,
        target: idx + 1
      };
    });
  }else if(timeline_template == 1){
    //1号时间轴
    graphData = eventData.map(event => ({
      value: eventData.indexOf(event) * 5 + 10,
      name: `${event.date} \n ${event.title}`
    }));
  }else if(timeline_template == 2){
    //2号时间轴
    eventData.forEach(function(event) {
      var dataItem = {
          value: eventData.indexOf(event), 
          name:  event.title,   
      };
      yAxisData.push(dataItem);
    });

    dotData = [];
    lineData = [];
    for (let i = 0; i < eventData.length; i++) {
      dotData.push(100);
      lineData.push(90);
      imgData[`index_${i}`] = {
        height: 120,
        width: 180,
        backgroundColor: {
          image: IMG[i],
        }
      };
    }
  }
}


function initChart(canvas, width, height, dpr) {
  console.log("init");
  const chart = echarts.init(canvas, null, {
    width: width,
    height: 1200,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
 

  const timelineType = [
    //0号时间轴
    {
      tooltip: {
        position: 'top',
        formatter: function (p) {
          const format = echarts.time.format(p.data[0], '{yyyy}-{MM}-{dd}', false);
          return format + ': ' + p.data[1];
        }
      },
      visualMap: {
        min: 0,
        max: 1000,
        calculable: true,
        orient: 'horizontal',
        left: '30',
        top: '0',
        inRange: {
          color: ["#516b91","#59c4e6","#a5e7f0"]
        },
      },
      calendar: [
        {
          top: '100',
          orient: 'vertical',
          range: '2023',
          left: '40'
        }
      ],
      series: [
        {
          type: 'graph',
          edgeSymbol: ['none', 'arrow'],
          coordinateSystem: 'calendar',
          links: links,
          symbolSize: 15,
          calendarIndex: 0,
          itemStyle: {
            color: '#fff',
            shadowBlur: 9,
            shadowOffsetX: 1.5,
            shadowOffsetY: 3,
            shadowColor: '#555'
          },
          lineStyle: {
            color: '#fff',
            shadowBlur: 5,
            width: 2,
            opacity: 1
          },
          data: graphData,
          z: 20
        },
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 0,
          data: getVirtualData('2023'),
        }
      ]
    },
    //1号时间轴
    {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
      },
      series: [
        {
          name: 'Pyramid',
          type: 'funnel',
          width: '10%',
          height: '80%',
          left: '5%',
          sort: 'ascending',
          funnelAlign: 'left',
          data: graphData,
        },
        
      ]
    },
    //2号时间轴
    {
      backgroundColor: '#F3C5B3',
      grid: {
        right: 250
      },
      yAxis: {
        axisTick: { show: false },
        axisLine: { show: false },
        inverse: true,
        position: 'right',
        type: 'category',
        data: yAxisData,
        axisLabel: {
          formatter: (params) => {
           return '【' + eventData[params].date + '】'+'\n' + eventData[params].title + '\n' + '{' + 'index_' + params + '| }';
          },
          rich: imgData,
          fontSize: 16,
          color: '#6894B9',
          fontFamily: 'Arial',
        }
      },
      xAxis: {
        type: 'value',
        inverse: true,
        splitLine: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false }
      },
      series: [
        {
          name: 'line',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          itemStyle: {
            borderRadius: 5,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#edbaa7' },
              { offset: 1, color: '#6894B9' }
            ])
          },
          z: -12,
          data: dotData
        },
        {
          data: lineData,
          name: 'line',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 1,
          lineStyle: {
            width: 20,
            color: '#edbaa7'
          }
        }
      ]
    },
    //3号时间轴
    {
      backgroundColor: bgColor,
      color: colors,
      series: [
        {
          type: 'sunburst',
          center: ['50%', '30%'],
          data: data,
          sort: function (a, b) {
            if (a.depth === 1) {
              return b.getValue() - a.getValue();
            } else {
              return a.dataIndex - b.dataIndex;
            }
          },
          label: {
            rotate: 'radial',
            color: bgColor
          },
          itemStyle: {
            borderColor: bgColor,
            borderWidth: 2
          },
          levels: [
            {},
            {
              r0: 0,
              r: 40,
              label: {
                rotate: 0
              }
            },
            {
              r0: 40,
              r: 105
            },
            {
              r0: 115,
              r: 140,
              itemStyle: {
                shadowBlur: 2,
                shadowColor: colors[2],
                color: 'transparent'
              },
              label: {
                rotate: 'tangential',
                fontSize: 5,
                color: colors[0]
              }
            },
            {
              r0: 140,
              r: 145,
              itemStyle: {
                shadowBlur: 80,
                shadowColor: colors[0]
              },
              label: {
                position: 'outside',
                textShadowBlur: 5,
                textShadowColor: '#333'
              },
              downplay: {
                label: {
                  opacity: 0.5
                }
              }
            }
          ]
        }
      ]
    }

  ]; 

  function getVirtualData(year) {
    const date = +echarts.time.parse(year + '-01-01');
    const end = +echarts.time.parse(+year + 1 + '-01-01');
    const dayTime = 3600 * 24 * 1000;
    const data = [];
    for (let time = date; time < end; time += dayTime) {
      data.push([
        echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
        Math.floor(Math.random() * 1000)
      ]);
    }
    return data;
  }
  console.log(timelineType.length)
  console.log(timeline_template)
  var option = timelineType[timeline_template];
  chart.setOption(option);
 
  return chart;
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    }
  },
  handleSave() {
    const ecComponent = this.selectComponent('#echart');

    // 先保存图片到临时的本地文件，然后存入系统相册
    ecComponent.canvasToTempFilePath({
      success: res => {
        console.log("tempFilePath:", res.tempFilePath)

        // 存入系统相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath || '',
          success: res => {
            console.log("success", res);
            wx.showToast({
              title: "已保存到本地",
              icon: 'success',
              duration: 1000,
            })
          },
          fail: res => {
            console.log("fail", res)
          }
        })
      },
      fail: res => console.log(res)
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("load");
    timeline_template = options.index;
    initData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})