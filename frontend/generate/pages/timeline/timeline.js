// pages/generate/timeline/timeline.js
import * as echarts from '../../../components/ec-canvas/echarts';

const app = getApp();

var heightGlobal, widthGLobal, canvasGlobal, dprGlobal, chartNow=null;
var timeline_template = 0; // 当前的模板id
var colorSetIdex = 0; // 当前的色彩id
var colorSet = [
  {id: 0, backgroundColor: '#143e64', colors:["#87ceeb","#59c4e6","#a5e7f0", '#add8e6', '#b5e4e6','#7cb9e8', '#5c9cc2', '#87ceeb', '#add8e6', '#164a7a98','#59c5e642']},
  {id: 1, backgroundColor: '#b27466', colors:['#ffd700', '#f0e68c', '#eedc82', '#ffec8b','#ffd700', '#ffdb58', '#f0e68c', '#eedc82', '#ffec8b', '#b9612791', '#ffd90042']},
  {id: 2, backgroundColor: '#697cad', colors:['#f48fb1', '#ff6f94', '#ff5983', '#f4506e','#f48fb1', '#ff9eb4', '#ff6f94', '#ff5983', '#f4506e', '#23007471','#f48fb142']},
  {id: 3, backgroundColor: '#008080', colors:['#a4ebb1', '#bdf9ca', '#c7fdc9', '#d3ffc8', '#e1ffdb', '#e7ffe5', '#c4f5c7', '#a4e7a0', '#83d968','#084963a8','#a4ebb142' ]},
];
var timelineType = [];

//时间轴需要的数据
var eventIndex = []; //选择事件的index
var eventData = [];
var graphDataFor0 = [];
var graphDataFor1 = [];
var titleData = [];
var dotDataFor2 = [];
var lineDataFor2 = [];
var imgData = {};
var linksFor0 = []; 
var yAxisDataFor2 = [];

//3号时间轴数据（还需要转化）
const colors = ['#87ceeb', '#4095E5','#4095E5','#5c9cc2', '#87ceeb', '#add8e6', '#bcd4e6'];
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




/* 与后端联系，获取主页的内容*/
function loadPageInfo(that){
  // 获取存储的openid
  wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      wx.request({
        url: that.data.host_+'user/api/show/all'+'?openid='+openid+'&types=e&tags=false&timeline=true', //e表示只求取event
        method:'GET',
        success:function(res){
          console.log(res.data.blocks_list.length)
          let uniqueTags = new Set();
          let tag_to_eventIndex_dict = {}
          var eventList = [];
          // if(res.data.blocks_list.length>6 && timeline_template==1){
          //   eventList = res.data.blocks_list.map((blogCard) => {
          //     let { imgSrc } = blogCard;
          //     let { title, event_date } = blogCard;
          //     (imgSrc == undefined) ? imgSrc = '/image/show/txt.png' : null;
          //     let date = event_date;
          //     return { imgSrc, date, title };
          //   }).slice(0, 7);
          // }else{
            eventList = res.data.blocks_list.map((blogCard) => {
              let {imgSrc}=blogCard;
              let { title, event_date} = blogCard;
              (imgSrc==undefined)?imgSrc='/image/show/txt.png':null;
              let date = event_date;
              return { imgSrc, date, title};
            });
            eventData = eventIndex.map(function(index) {
              return eventList[index];
            });
            if(eventData.length>6){
              wx.showToast({
                title: "选择事件过多，显示前6张",
                icon: 'success',
                duration: 1000,
              })
              var newArray = [];
              newArray[0]=eventData[0];
              newArray[1]=eventData[1];
              newArray[2]=eventData[2];
              newArray[3]=eventData[3];
              newArray[4]=eventData[4];
              newArray[5]=eventData[5];
            }else{
              newArray = eventData
            }
          // }
            let tag_array=Array.from(uniqueTags).map(tag=>{return {'info':tag,'checked':false}})
            that.setData({
              blog_cards_list: res.data.blocks_list,
              eventList: newArray,
              tags:tag_array,
              isTagsEmpty:tag_array.length==0,
              tag_to_event_index_dict:tag_to_eventIndex_dict,
            })
            eventData = newArray;
            initData();
        },
        fail:function(res){
          console.log('load page failed: ',res)
        }
      })
    },
    fail:function(res){
      console.log('get openid failed: ',res)
    }
  })
}

function initData(){
  console.log("here")
  console.log(eventData);
  titleData = eventData.map(event => event.title);
  //0号时间轴
  graphDataFor0 = eventData.map(event => [event.date, 1000, event.title]);
  linksFor0 = graphDataFor0.map(function (item, idx) {
    return {
      source: idx + 1,
      target: idx
    };
  });
  //1号时间轴
  graphDataFor1 = eventData.map(event => ({
    value: (eventData.indexOf(event) + 1) * 20,
    name: `${event.date} \n ${event.title} \n`+ '{' + 'index_' + eventData.indexOf(event) + '| }'
  }));
  //2号时间轴
  yAxisDataFor2 = []
  eventData.forEach(function(event) {
    var dataItem = {
        value: eventData.indexOf(event), 
        name:  event.title,   
    };
    yAxisDataFor2.push(dataItem);
  });
  dotDataFor2 = [];
  lineDataFor2 = [];
  for (let i = 0; i < eventData.length; i++) {
    dotDataFor2.push(100+(i%2)*50);
    lineDataFor2.push(90+(i%2)*50);
    imgData[`index_${i}`] = {
      height: 120,
      width: 180,
      backgroundColor: {
        image: eventData[i].imgSrc,
      }
    };
  };
}

function initChart(canvas, width, height, dpr) {
  console.log("init");
  heightGlobal = height;
  widthGLobal = width;
  canvasGlobal = canvas;
  dprGlobal = dpr;
  const chart = echarts.init(canvasGlobal, null, {
    width: widthGLobal,
    height: heightGlobal,
    devicePixelRatio: dprGlobal
  });
  canvasGlobal.setChart(chart);
 

  timelineType = [
    //0号时间轴
    {
      backgroundColor: colorSet[colorSetIdex].backgroundColor,
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
          color: colorSet[colorSetIdex].colors
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
          links: linksFor0,
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
          data: graphDataFor0, // 用到的数据
          z: 20,
          label: {
            show: true,
            position: 'right', // 设置标注文字位置为右侧
            color: colorSet[colorSetIdex].colors[0], // 设置标注文字颜色
            fontSize: 16, // 设置标注文字字体大小
            backgroundColor: colorSet[colorSetIdex].colors[9],
            borderRadius: 5,
            formatter: function (params) {
              return params.data[2] + '{' + 'index_' + params.index + '| }'; // 显示节点的第二个数据（在这里是 y 值）作为标注文字
            },
            rich: imgData,
          }
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
      backgroundColor: colorSet[colorSetIdex].backgroundColor,
      color: colorSet[colorSetIdex].colors,
      series: [
        {
          name: 'Pyramid',
          type: 'funnel',
          width: '20%',
          height: '80%',
          left: '5%',
          sort: 'ascending',
          funnelAlign: 'left',
          data: graphDataFor1, //用到的数据
          label:{
            rich: imgData,
            fontSize: 16,
            borderColor: colorSet[colorSetIdex].colors[1], // Set the border color for the label
            borderWidth: 2, // Set the border width for the label
            borderRadius: 10, // Set the border radius for rounded corners (optional)
            padding: [5, 10], // Set padding for the label content (optional)
            backgroundColor: colorSet[colorSetIdex].colors[10]
          },
          itemStyle: {
            borderColor: 'transparent', // 将边框颜色设置为透明
            borderWidth: 0 // 设置边框宽度为0
          }
        }, 
      ]
    },
    //2号时间轴
    {
      backgroundColor: colorSet[colorSetIdex].backgroundColor,
      grid: {
        right: 250
      },
      yAxis: {
        axisTick: { show: false },
        axisLine: { show: false },
        inverse: true,
        position: 'right',
        type: 'category',
        data: yAxisDataFor2, // 数据
        axisLabel: {
          formatter: (params) => {
           return '【' + eventData[params].date + '】'+'\n' + eventData[params].title + '\n' + '{' + 'index_' + params + '| }';
          },
          rich: imgData, //数据
          fontSize: 16,
          color: '#6894B9',
          fontFamily: 'Arial',
          borderColor: '#6894B9', // Set the border color for the label
          borderWidth: 2, // Set the border width for the label
          borderRadius: 10, // Set the border radius for rounded corners (optional)
          padding: [5, 10], // Set padding for the label content (optional)
          backgroundColor: colorSet[colorSetIdex].colors[10]
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
          data: dotDataFor2 // 数据
        },
        {
          data: lineDataFor2, // 数据
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

  var option = timelineType[timeline_template];
  chart.setOption(option);
  chartNow = chart;
  return chart;
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
    host_: `${app.globalData.localUrl}`,
    templates:[
      {id: 0, selected: false},
      {id: 1, selected: false},
      {id: 2, selected: false},
      {id: 3, selected: false}
    ],
    bgColor:[
      '#143e64',
      '#b27466',
      '#697cad',
      '#008080'
    ],
    curColorIndex: null,
    ec: {
      onInit: initChart
    },
    nextTemplate: null,
    nextColor: null,
  },

  changeTemplate(index){
    if(index == timeline_template)
      return;
    this.setData({
      ['templates[' + timeline_template + '].selected']: false
    });
    timeline_template = index;
    this.setData({
      ['templates[' + index + '].selected']: true
    });
    chartNow.clear();
    const chart = echarts.init(canvasGlobal, null, {
      width: widthGLobal,
      height: heightGlobal,
      devicePixelRatio: dprGlobal
    });
    canvasGlobal.setChart(chart);
    const option = timelineType[timeline_template];
    chartNow.setOption(option);
    chartNow = chart;
    console.log(yAxisDataFor2);
  },

  changeColor(e){
    const { index } = e.currentTarget.dataset;
    if(index == colorSetIdex)
      return;
    colorSetIdex = index;
    timelineType[timeline_template].backgroundColor=colorSet[colorSetIdex].backgroundColor;
    if(timeline_template == 0){
      timelineType[0].visualMap.inRange.color = colorSet[colorSetIdex].colors;
      timelineType[0].series[0].label.color = colorSet[colorSetIdex].colors[0];
      timelineType[0].series[0].label.backgroundColor = colorSet[colorSetIdex].colors[9];
    }else if(timeline_template == 1){
      timelineType[1].color=colorSet[colorSetIdex].colors;
      timelineType[1].series[0].label.borderColor = colorSet[colorSetIdex].colors[1]
      timelineType[1].series[0].label.backgroundColor = colorSet[colorSetIdex].colors[10]
    }else if(timeline_template == 2){
      timelineType[2].yAxis.axisLabel.borderColor = colorSet[colorSetIdex].colors[2]
      timelineType[2].yAxis.axisLabel.backgroundColor = colorSet[colorSetIdex].colors[10]
      timelineType[2].yAxis.axisLabel.color=colorSet[colorSetIdex].colors[0];
      timelineType[2].series[0].itemStyle.color=new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: colorSet[colorSetIdex].colors[1] },
        { offset: 1, color: colorSet[colorSetIdex].colors[9] }
      ]);
      timelineType[2].series[1].lineStyle.color = colorSet[colorSetIdex].colors[1]
    }else if(timeline_template == 3){
      timelineType[3].color = colorSet[colorSetIdex].colors;
      timelineType[3].series[0].itemStyle.borderColor = colorSet[colorSetIdex].backgroundColor;
      timelineType[3].series[0].levels[3].itemStyle.shadowColor =  colorSet[colorSetIdex].colors[2];
      timelineType[3].series[0].levels[3].label.color =  colorSet[colorSetIdex].colors[0];
      timelineType[3].series[0].levels[4].itemStyle.shadowColor =  colorSet[colorSetIdex].colors[2];
    }
    chartNow.clear();
    const chart = echarts.init(canvasGlobal, null, {
      width: widthGLobal,
      height: heightGlobal,
      devicePixelRatio: dprGlobal
    });
    canvasGlobal.setChart(chart);
    const option = timelineType[timeline_template];
    chartNow.setOption(option);
    chartNow = chart;
  },

  reselectEvent: function(e) {
    var pages = getCurrentPages()
    var pre = pages[pages.length - 2]
    pre.setData({
      timeline_template: timeline_template,
      timeline_color: colorSetIdex,
    })
    wx.navigateBack(1)
  },

  reselectTemplate: function(e) {
    wx.navigateTo({
      url: "/generate/pages/reselect/timelineInfo/timelineInfo" +
      "?template=" + timeline_template + "&color=" + colorSetIdex,
    })
  },

  handleSave() {
    console.log("handleSave")
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

  testChange() {
    // console.log("Template Show!")
    var that = this
    var hasChange = false
    // console.log("curTemplate: ", timeline_template)
    // console.log("nextTemplate: ", that.data.nextTemplate)
    // console.log("curColor: ", colorSetIdex)
    // console.log("nextColor: ", that.data.nextColor)
    if(that.data.nextTemplate != null && that.data.nextTemplate != timeline_template){
      hasChange = true
      this.setData({
        ['templates[' + timeline_template + '].selected']: false
      });
      timeline_template = that.data.nextTemplate;
      this.setData({
        ['templates[' + timeline_template + '].selected']: true
      });
    }

    if(that.data.nextColor != null && that.data.nextColor != colorSetIdex){
      hasChange = true
      colorSetIdex = that.data.nextColor;
      this.setData({
        curColorIndex: colorSetIdex
      })
      timelineType[timeline_template].backgroundColor=colorSet[colorSetIdex].backgroundColor;
      if(timeline_template == 0){
        timelineType[0].visualMap.inRange.color = colorSet[colorSetIdex].colors;
        timelineType[0].series[0].label.color = colorSet[colorSetIdex].colors[0];
        timelineType[0].series[0].label.backgroundColor = colorSet[colorSetIdex].colors[9];
      }else if(timeline_template == 1){
        timelineType[1].color=colorSet[colorSetIdex].colors;
        timelineType[1].series[0].label.borderColor = colorSet[colorSetIdex].colors[1]
        timelineType[1].series[0].label.backgroundColor = colorSet[colorSetIdex].colors[10]
      }else if(timeline_template == 2){
        timelineType[2].yAxis.axisLabel.borderColor = colorSet[colorSetIdex].colors[2]
        timelineType[2].yAxis.axisLabel.backgroundColor = colorSet[colorSetIdex].colors[10]
        timelineType[2].yAxis.axisLabel.color=colorSet[colorSetIdex].colors[0];
        timelineType[2].series[0].itemStyle.color=new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: colorSet[colorSetIdex].colors[1] },
          { offset: 1, color: colorSet[colorSetIdex].colors[9] }
        ]);
        timelineType[2].series[1].lineStyle.color = colorSet[colorSetIdex].colors[1]
      }else if(timeline_template == 3){
        timelineType[3].color = colorSet[colorSetIdex].colors;
        timelineType[3].series[0].itemStyle.borderColor = colorSet[colorSetIdex].backgroundColor;
        timelineType[3].series[0].levels[3].itemStyle.shadowColor =  colorSet[colorSetIdex].colors[2];
        timelineType[3].series[0].levels[3].label.color =  colorSet[colorSetIdex].colors[0];
        timelineType[3].series[0].levels[4].itemStyle.shadowColor =  colorSet[colorSetIdex].colors[2];
      }
    }
    if( !hasChange)
      return
    
    chartNow.clear();
    const chart = echarts.init(canvasGlobal, null, {
      width: widthGLobal,
      height: heightGlobal,
      devicePixelRatio: dprGlobal
    });
    canvasGlobal.setChart(chart);
    const option = timelineType[timeline_template];
    chartNow.setOption(option);
    chartNow = chart;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("load");
    timeline_template = options.index;
    timeline_template++;
    const eventsSTR = options.events;
    console.log(eventsSTR)
    eventIndex = eventsSTR.split('-').map(Number);
    this.setData({
      ['templates[' + timeline_template + '].selected']: true,
      curColorIndex: parseInt(options.color)
    })

    colorSetIdex = parseInt(options.color);
    var that = this;
    loadPageInfo(that);
    initData();
    this.changeTemplate(timeline_template);
    console.log("here")
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
    // if(chartNow!=null){
    //   chartNow.clear();
    // }
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