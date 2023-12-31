// pages/user/child/child_detail/child_detail.js
import * as echarts from '../../../../components/ec-canvas/echarts';
const app = getApp();

var child_id = 0;

var plans = 0;
var icon_list = [];
var events = 0;
var event_list = [];
var event_tag_list =  [];
var texts = 0;
var text_tag_list = [];

var colorSet = [
  {id: 0, backgroundColor: '#143e64', colors:["#87ceeb","#59c4e6","#a5e7f0", '#add8e6', '#b5e4e6','#7cb9e8', '#5c9cc2', '#87ceeb', '#add8e6', '#164a7a98']},
  {id: 1, backgroundColor: '#b27466', colors:['#ffd700', '#f0e68c', '#eedc82', '#ffec8b','#ffd700', '#ffdb58', '#f0e68c', '#eedc82', '#ffec8b', '#b9612791']},
  {id: 2, backgroundColor: '#00207496', colors:['#c23531', '#ff6f94', '#ff5983', '#f4506e','#f48fb1', '#ff9eb4', '#ff6f94', '#ff5983', '#f4506e', '#23007471']},
  {id: 3, backgroundColor: '#008080', colors:['#008080', '#bdf9ca', '#c7fdc9', '#d3ffc8', '#e1ffdb', '#e7ffe5', '#c4f5c7', '#a4e7a0', '#83d968','#a4ebb1', ]},
];

// 计划饼图数据
var dataForPlan =[];

// 事件标签饼图数据
var dataFortag1 = [];
var mindataFortag1 = 100;
var maxdataFortag1 = 0;
// 事件数量柱状/折线图数据
var tagForEvent = [];
var seriesForEvent = [];
var seriesForEvent_1 = [];

var glo_canvas_ra;
var glo_width_ra;
var glo_height_ra;
var glo_dpr_ra;

var glo_canvas_ca1;
var glo_width_ca1;
var glo_height_ca1;
var glo_dpr_ca1;

var glo_canvas_ca2;
var glo_width_ca2;
var glo_height_ca2;
var glo_dpr_ca2;

var glo_canvas_e;
var glo_width_e;
var glo_height_e;
var glo_dpr_e;

function initData() {
  // 计划雷达图数据
  dataForPlan = [0, 0, 0, 0, 0]
  for (let item of icon_list) {
    if (item.icon.includes("music") || item.icon.includes("brush"))
      dataForPlan[0] += item.number
    if (item.icon.includes("math") || item.icon.includes("book") || item.icon.includes("article"))
      dataForPlan[1] += item.number
    if (item.icon.includes("sport"))
      dataForPlan[2] += item.number
    if (item.icon.includes("health"))
      dataForPlan[3] += item.number
    if (item.icon.includes("heart"))
      dataForPlan[4] += item.number
  }
  console.log(dataForPlan)
  // 事件标签饼图数据
  dataFortag1 = event_tag_list.map(item => {
    return {
      value: item.number,
      name: item.tag
    };
  });
  if(events == 0){
    dataFortag1=[{name: '还没有添加事件~', value: 0}]
  }
      // 获取图表对应颜色参数
  for (let i = 0; i < dataFortag1.length; i++) {
    if (dataFortag1[i].value > maxdataFortag1) {
      maxdataFortag1 = dataFortag1[i].value;
    }
  
    if (dataFortag1[i].value < mindataFortag1) {
      mindataFortag1 = dataFortag1[i].value;
    }
  }
  console.log('min:',mindataFortag1)
  console.log('max:',maxdataFortag1)
  maxdataFortag1 = maxdataFortag1 * 1.1 + 1;
  mindataFortag1 = mindataFortag1 * 0.8 - 1; 
  console.log('min:',mindataFortag1)
  console.log('max:',maxdataFortag1)

  // 事件数量柱状/折线图数据
  tagForEvent = event_tag_list.map(item => {
    return item.tag;
  });
  console.log(tagForEvent)
  tagForEvent.push('事件总数')
  seriesForEvent = []
  seriesForEvent_1 = []
  seriesForEvent.push({
    name: '事件总数',
    type: 'bar',
    stack: 'Total',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: event_list
  })
  for (let i = 0; i < event_tag_list.length; i++) {
    seriesForEvent.push({
      name: event_tag_list[i].tag,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: event_tag_list[i].month_count,
    }),
    seriesForEvent_1.push({
      name: event_tag_list[i].tag,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: event_tag_list[i].month_count,
    })
  }
  if(events == 0){
    seriesForEvent_1.push({
      name: '事件总数',
      type: 'bar',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: event_list
    })
  }
}

function initRadarChart(canvas, width, height, dpr) {
  glo_canvas_ra = canvas;
  glo_width_ra = width;
  glo_height_ra =height;
  glo_dpr_ra = dpr;
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
  const option = {
    color: colorSet[child_id].colors,
    legend: {},
    radar: [
      {
        indicator: [
          { text: '艺术文化' },
          { text: '知识学习' },
          { text: '运动健康' },
          { text: '日常习惯' },
          { text: '人格发展' }
        ],
        center: ['50%', '50%'],
        radius: 110,
        startAngle: 90,
        splitNumber: 4,
        shape: 'circle',
        axisName: {
          formatter: '{value}',
          color: colorSet[child_id].colors[1]
        },
        splitArea: {
          areaStyle: {
            color: colorSet[child_id].colors,
          }
        },
        axisLine: {
          lineStyle: {
            color: colorSet[child_id].colors[2]
          }
        },
        splitLine: {
          lineStyle: {
            color: colorSet[child_id].colors[2]
          }
        }
      },
    ],
    series: [
      {
        type: 'radar',
        emphasis: {
          lineStyle: {
            width: 4
          }
        },
        data: [
          {
            value: dataForPlan,
            // name: '2023冬',
            areaStyle: {
              color: colorSet[child_id].colors[9]
            }
          }
        ]
      }
    ]
  };
  chart.setOption(option);
  return chart;
}

function initTag1Chart(canvas, width, height, dpr) {
  glo_canvas_ca1 = canvas;
  glo_width_ca1 = width;
  glo_height_ca1 =height;
  glo_dpr_ca1 = dpr;
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      show: false,
      min: mindataFortag1,
      max: maxdataFortag1,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series: [
      {
        name: '事件标签',
        type: 'pie',
        radius: '50%',
        center: ['50%', '30%'],
        data: dataFortag1.sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: 'radius',
        label: {
          color: colorSet[child_id].colors[1]
        },
        labelLine: {
          lineStyle: {
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        },
        itemStyle: {
          color: colorSet[child_id].colors[1],
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };
  chart.setOption(option);
  return chart;
}

function initEventChart(canvas, width, height, dpr) {
  glo_canvas_e = canvas;
  glo_width_e = width;
  glo_height_e =height;
  glo_dpr_e = dpr;
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
  const option = {
    color:colorSet[child_id%4].colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: tagForEvent
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisTick:{
          length: 1,
        }
      }
    ],
    yAxis: [
      {
        axisTick: { show: false },
        type: 'value'
      }
    ],
    series: seriesForEvent,
      }
  chart.setOption(option);
  return chart;
}

function initTag2Chart(canvas, width, height, dpr) {
  glo_canvas_ca2 = canvas;
  glo_width_ca2 = width;
  glo_height_ca2 =height;
  glo_dpr_ca2 = dpr;
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
  const option = {
    color:colorSet[child_id%4].colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: tagForEvent
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisTick:{
          length: 2,
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: seriesForEvent_1
  }
  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec_radar: {
      onInit: initRadarChart,
      onShow: initRadarChart,
    },
    ec_tag1: {
      onInit: initTag1Chart,
    },
    ec_event: {
      onInit: initEventChart
    },
    ec_tag2: {
      onInit: initTag2Chart
    },
    name: '',
    host_: `${app.globalData.localUrl}`,
    plans: 0,
    icon_list: [],
    events: 0,
    event_list: [],
    event_tag_list: [],
    texts: 0,
    text_tag_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    child_id = options.index%4;
    var that = this
    this.setData({
      name: options.name
    })
    wx.request({
      url: this.data.host_+'user/api/user/child_detail'+'?name='+this.data.name,
      method: 'GET',
      success: function(res) {
        plans =  res.data.child_item.plans,
        icon_list = res.data.child_item.icon_list,
        events = res.data.child_item.events,
        event_list = res.data.child_item.event_list,
        event_tag_list = res.data.child_item.event_tag_list,
        texts = res.data.child_item.texts,
        text_tag_list = res.data.child_item.text_tag_list 
        that.setData({
          plans: res.data.child_item.plans,
          icon_list: res.data.child_item.icon_list,
          events: res.data.child_item.events,
          event_list: res.data.child_item.event_list,
          event_tag_list: res.data.child_item.event_tag_list,
          texts: res.data.child_item.texts,
          text_tag_list: res.data.child_item.text_tag_list 
        })
        console.log('plans:', that.data.plans)
        console.log('icon_list:', that.data.icon_list)
        console.log('events:', that.data.events)
        console.log('event_list:', that.data.event_list)
        console.log('event_tag_list:', that.data.event_tag_list)
        console.log('texts:', that.data.texts)
        console.log('text_tag_list:', that.data.text_tag_list)
        initData();
        initRadarChart(glo_canvas_ra, glo_width_ra, glo_height_ra, glo_dpr_ra)
        initTag1Chart(glo_canvas_ca1, glo_width_ca1, glo_height_ca1, glo_dpr_ca1)
        initTag2Chart(glo_canvas_ca2, glo_width_ca2, glo_height_ca2, glo_dpr_ca2)
        initEventChart(glo_canvas_e, glo_width_e, glo_height_e, glo_dpr_e)
      }
    })
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