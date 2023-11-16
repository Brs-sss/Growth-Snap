// pages/generate/timeline/timeline.js
import * as echarts from '../../../components/ec-canvas/echarts';

var timeline_template = 0;

var eventData=[];


//时间轴需要的数据
var graphData = [];

var links;

//时间轴1号需要的数据处理

function initData(){
  eventData=[
    {date:'2023-02-01', title:'小明今天开始学习钢琴'},
    {date:'2023-03-05', title:'小明学会了第一首曲子'},
    {date:'2023-04-20', title:'在上钢琴课时，小明说好喜欢弹钢琴'},
    {date:'2023-06-04', title:'小明开始准备第一次考级'},
    {date:'2023-07-09', title:'和小明说好，考级过了就可以买一台自己的钢琴'}
  ];
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
      name: `${event.date} ${event.title}`
    }));
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
          width: '20%',
          height: '80%',
          left: '5%',
          sort: 'ascending',
          funnelAlign: 'left',
          data: graphData
        },
        
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