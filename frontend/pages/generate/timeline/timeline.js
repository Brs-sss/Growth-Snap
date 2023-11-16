// pages/generate/timeline/timeline.js
import * as echarts from '../../../components/ec-canvas/echarts';

var timeline_template = 2;



//时间轴需要的数据
var eventData = [];
var graphData = [];
var titleData = [];
var links; 
var yAxisData = [];

const IMG = [
  '/image/generate/events/event_0.png',
  '/image/generate/events/event_1.png',
  '/image/generate/events/event_2.png',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F061H0102U6%2F20061G02U6-12-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644314407&t=aa49089b06c80ff5c9e3404d3ec85382',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F21042G339292K3-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644314407&t=e3a817c74754fdade94aa51858689928',
  'https://scpic.chinaz.net/Files/pic/icons128/8308/d5.png',
  'https://scpic.chinaz.net/Files/pic/icons128/8304/e7.png'
]

function initData(){
  eventData=[
    {date:'2023-02-01', title:'小明今天开始学习钢琴'},
    {date:'2023-03-05', title:'小明学会了第一首曲子'},
    {date:'2023-04-20', title:'在上钢琴课时，小明说好喜欢弹钢琴'},
    {date:'2023-06-04', title:'小明开始准备第一次考级'},
    {date:'2023-07-09', title:'和小明说好，考级过了就可以买一台自己的钢琴'},
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
    eventData.forEach(function(event) {
      var dataItem = {
          value: event.title, 
          name:  event.title,   // Set name to the current day
          label: {
              rich: {}
          }
      };
      // Set common properties for rich content
      dataItem.label.rich[event.title] = {
          height: 50,
          width: 50,
          backgroundColor: {
              image: IMG[0]
          }
          // Add other common properties if needed
      };
  
      // Add the data item to yAxisRichData
      yAxisData.push(dataItem);
  });
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
      backgroundColor: '#0f375f',
      grid: {
        left: '3%',
        right: '10%',
        containLabel: true
      },
      yAxis: {
        axisTick: { show: false },
        type: 'category',
        data: yAxisData,
      },
      xAxis: {
        type: 'value',
        splitLine: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false }
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110],
          name: 'line',
          type: 'bar',
          barGap: '-100%',
          barWidth: 10,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(20,200,212,0.5)' },
              { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
              { offset: 1, color: 'rgba(20,200,212,0)' }
            ])
          },
          z: -12,
        },
        {
          name: 'dotted',
          type: 'pictorialBar',
          symbol: 'rect',
          itemStyle: {
            color: '#0f375f'
          },
          symbolRepeat: true,
          symbolSize: [12, 4],
          symbolMargin: 1,
          z: -10,
          data: [120, 200, 150, 80, 70, 110]
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