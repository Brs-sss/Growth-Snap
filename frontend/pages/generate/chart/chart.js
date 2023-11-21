// pages/generate/chart/chart.js
const app = getApp()
import * as echarts from '../../../components/ec-canvas/echarts';

var dataList = [];
var selectedKeys = [];
var selectFlag = 0; // 0表示可以多选 1表示必须单选

var heightGlobal, widthGLobal, canvasGlobal, dprGlobal, chartNow;
var chart_template = 0;
var chartType = [];

// 0号chart的数据处理
const dataX = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];
const colors = ['#80ffa5', '#01bfec', '#00ddff', '#4d77ff', '#37a2ff', '#7415db', '#ff0087', '#87009d', '#ffbf00', '#e03e4c']
var seriesDataFor0= []


// 1号chart的数据
var dateList = [];
var valueList = [];

//2号chart的数据
let category = [];
let dottedBase = +new Date();
let lineData = [];
let barData = [];
for (let i = 0; i < 20; i++) {
  let date = new Date((dottedBase += 3600 * 24 * 1000));
  category.push(
    [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
  );
  let b = Math.random() * 200;
  let d = Math.random() * 200;
  barData.push(b);
  lineData.push(d + b);
}

// 3号chart的数据
const dataBJ = [
  [1, 55, 9, 56, 0.46, 18, 6, '良'],
  [2, 25, 11, 21, 0.65, 34, 9, '优'],
  [3, 56, 7, 63, 0.3, 14, 5, '良'],
  [4, 33, 7, 29, 0.33, 16, 6, '优'],
  [5, 42, 24, 44, 0.76, 40, 16, '优'],
  [6, 82, 58, 90, 1.77, 68, 33, '良'],
  [7, 74, 49, 77, 1.46, 48, 27, '良'],
  [8, 78, 55, 80, 1.29, 59, 29, '良'],
  [9, 267, 216, 280, 4.8, 108, 64, '重度污染'],
  [10, 185, 127, 216, 2.52, 61, 27, '中度污染'],
  [11, 39, 19, 38, 0.57, 31, 15, '优'],
  [12, 41, 11, 40, 0.43, 21, 7, '优'],
  [13, 64, 38, 74, 1.04, 46, 22, '良'],
  [14, 108, 79, 120, 1.7, 75, 41, '轻度污染'],
  [15, 108, 63, 116, 1.48, 44, 26, '轻度污染'],
  [16, 33, 6, 29, 0.34, 13, 5, '优'],
  [17, 94, 66, 110, 1.54, 62, 31, '良'],
  [18, 186, 142, 192, 3.88, 93, 79, '中度污染'],
  [19, 57, 31, 54, 0.96, 32, 14, '良'],
  [20, 22, 8, 17, 0.48, 23, 10, '优'],
  [21, 39, 15, 36, 0.61, 29, 13, '优'],
  [22, 94, 69, 114, 2.08, 73, 39, '良'],
  [23, 99, 73, 110, 2.43, 76, 48, '良'],
  [24, 31, 12, 30, 0.5, 32, 16, '优'],
  [25, 42, 27, 43, 1, 53, 22, '优'],
  [26, 154, 117, 157, 3.05, 92, 58, '中度污染'],
  [27, 234, 185, 230, 4.09, 123, 69, '重度污染'],
  [28, 160, 120, 186, 2.77, 91, 50, '中度污染'],
  [29, 134, 96, 165, 2.76, 83, 41, '轻度污染'],
  [30, 52, 24, 60, 1.03, 50, 21, '良'],
  [31, 46, 5, 49, 0.28, 10, 6, '优']
];
const dataGZ = [
  [1, 26, 37, 27, 1.163, 27, 13, '优'],
  [2, 85, 62, 71, 1.195, 60, 8, '良'],
  [3, 78, 38, 74, 1.363, 37, 7, '良'],
  [4, 21, 21, 36, 0.634, 40, 9, '优'],
  [5, 41, 42, 46, 0.915, 81, 13, '优'],
  [6, 56, 52, 69, 1.067, 92, 16, '良'],
  [7, 64, 30, 28, 0.924, 51, 2, '良'],
  [8, 55, 48, 74, 1.236, 75, 26, '良'],
  [9, 76, 85, 113, 1.237, 114, 27, '良'],
  [10, 91, 81, 104, 1.041, 56, 40, '良'],
  [11, 84, 39, 60, 0.964, 25, 11, '良'],
  [12, 64, 51, 101, 0.862, 58, 23, '良'],
  [13, 70, 69, 120, 1.198, 65, 36, '良'],
  [14, 77, 105, 178, 2.549, 64, 16, '良'],
  [15, 109, 68, 87, 0.996, 74, 29, '轻度污染'],
  [16, 73, 68, 97, 0.905, 51, 34, '良'],
  [17, 54, 27, 47, 0.592, 53, 12, '良'],
  [18, 51, 61, 97, 0.811, 65, 19, '良'],
  [19, 91, 71, 121, 1.374, 43, 18, '良'],
  [20, 73, 102, 182, 2.787, 44, 19, '良'],
  [21, 73, 50, 76, 0.717, 31, 20, '良'],
  [22, 84, 94, 140, 2.238, 68, 18, '良'],
  [23, 93, 77, 104, 1.165, 53, 7, '良'],
  [24, 99, 130, 227, 3.97, 55, 15, '良'],
  [25, 146, 84, 139, 1.094, 40, 17, '轻度污染'],
  [26, 113, 108, 137, 1.481, 48, 15, '轻度污染'],
  [27, 81, 48, 62, 1.619, 26, 3, '良'],
  [28, 56, 48, 68, 1.336, 37, 9, '良'],
  [29, 82, 92, 174, 3.29, 0, 13, '良'],
  [30, 106, 116, 188, 3.628, 101, 16, '轻度污染'],
  [31, 118, 50, 0, 1.383, 76, 11, '轻度污染']
];
const dataSH = [
  [1, 91, 45, 125, 0.82, 34, 23, '良'],
  [2, 65, 27, 78, 0.86, 45, 29, '良'],
  [3, 83, 60, 84, 1.09, 73, 27, '良'],
  [4, 109, 81, 121, 1.28, 68, 51, '轻度污染'],
  [5, 106, 77, 114, 1.07, 55, 51, '轻度污染'],
  [6, 109, 81, 121, 1.28, 68, 51, '轻度污染'],
  [7, 106, 77, 114, 1.07, 55, 51, '轻度污染'],
  [8, 89, 65, 78, 0.86, 51, 26, '良'],
  [9, 53, 33, 47, 0.64, 50, 17, '良'],
  [10, 80, 55, 80, 1.01, 75, 24, '良'],
  [11, 117, 81, 124, 1.03, 45, 24, '轻度污染'],
  [12, 99, 71, 142, 1.1, 62, 42, '良'],
  [13, 95, 69, 130, 1.28, 74, 50, '良'],
  [14, 116, 87, 131, 1.47, 84, 40, '轻度污染'],
  [15, 108, 80, 121, 1.3, 85, 37, '轻度污染'],
  [16, 134, 83, 167, 1.16, 57, 43, '轻度污染'],
  [17, 79, 43, 107, 1.05, 59, 37, '良'],
  [18, 71, 46, 89, 0.86, 64, 25, '良'],
  [19, 97, 71, 113, 1.17, 88, 31, '良'],
  [20, 84, 57, 91, 0.85, 55, 31, '良'],
  [21, 87, 63, 101, 0.9, 56, 41, '良'],
  [22, 104, 77, 119, 1.09, 73, 48, '轻度污染'],
  [23, 87, 62, 100, 1, 72, 28, '良'],
  [24, 168, 128, 172, 1.49, 97, 56, '中度污染'],
  [25, 65, 45, 51, 0.74, 39, 17, '良'],
  [26, 39, 24, 38, 0.61, 47, 17, '优'],
  [27, 39, 24, 39, 0.59, 50, 19, '优'],
  [28, 93, 68, 96, 1.05, 79, 29, '良'],
  [29, 188, 143, 197, 1.66, 99, 51, '中度污染'],
  [30, 174, 131, 174, 1.55, 108, 50, '中度污染'],
  [31, 187, 143, 201, 1.39, 89, 53, '中度污染']
];
const schema = [
  { name: 'date', index: 0, text: '日' },
  { name: 'AQIindex', index: 1, text: 'AQI指数' },
  { name: 'PM25', index: 2, text: 'PM2.5' },
  { name: 'PM10', index: 3, text: 'PM10' },
  { name: 'CO', index: 4, text: '一氧化碳（CO）' },
  { name: 'NO2', index: 5, text: '二氧化氮（NO2）' },
  { name: 'SO2', index: 6, text: '二氧化硫（SO2）' }
];
const itemStyle = {
  opacity: 0.8,
  shadowBlur: 10,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: 'rgba(0,0,0,0.3)'
};

function initData(){
  //0号chart
  seriesDataFor0= [];
  for (let i = 0; i < selectedKeys.length; i++) {
    const currentLine = {
      name: selectedKeys[i],
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colors[i * 2]
          },
          {
            offset: 1,
            color: colors[i * 2 + 1]
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [140+10*i, 232+10*i, 101+10*i, 264+10*i, 90+10*i, 340+10*i, 250+10*i] // You can populate this array with your actual data for each line
    };

    // Assuming you have data for each line in separate arrays like dataX
    // for (let j = 0; j < dataX.length; j++) {
      // Populate the data array for each line
      // You should replace this with your actual data structure or source
      // currentLine.data.push(/* Your data for Line i on day j */);
    // }
    seriesDataFor0.push(currentLine);
  }
  //1号chart
  const dataListNow = dataList[dataList.findIndex(item => item.key === selectedKeys[0])].list;
  dateList = dataListNow.map(function (item) {
    return item.date;
  });
  valueList = dataListNow.map(function (item) {
    return item.value;
  });
}

function initChart(canvas, width, height, dpr) {
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

  chartType = [
    // 0号chart
    {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        }
      },
      legend: {
        data: selectedKeys
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
          data: dataX
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: seriesDataFor0
    },
    // 1号chart
    {
      visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 400
        },
        {
          show: false,
          type: 'continuous',
          seriesIndex: 1,
          dimension: 0,
          min: 0,
          max: dateList.length - 1
        }
      ],
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [
        {
          data: dateList
        }
      ],
      yAxis: [
        {}
      ],
      grid: [
        {
          bottom: '10%'
        }
      ],
      series: [
        {
          type: 'line',
          showSymbol: false,
          data: valueList
        }
      ]
    },
    // 2号chart
    {
      backgroundColor: '#0f375f',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: [
        {
          bottom: '10%'
        }
      ],
      legend: {
        data: ['line', 'bar'],
        textStyle: {
          color: '#ccc'
        }
      },
      xAxis: {
        data: category,
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        }
      },
      yAxis: {
        splitLine: { show: false },
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        },
      },
      series: [
        {
          name: 'line',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 15,
          data: lineData
        },
        {
          name: 'bar',
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            borderRadius: 5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#14c8d4' },
              { offset: 1, color: '#43eec6' }
            ])
          },
          data: barData
        },
        {
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
          data: lineData
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
          data: lineData
        }
      ]
    },
    // 3号chart
    {
      color: ['#dd4444', '#fec42c', '#80F1BE'],
      legend: {
        top: 10,
        data: ['北京', '上海', '广州'],
        textStyle: {
          fontSize: 16
        }
      },
      grid: {
        left: '10%',
        right: 150,
        top: '18%',
        bottom: '10%'
      },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        formatter: function (param) {
          var value = param.value;
          // prettier-ignore
          return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                    + param.seriesName + ' ' + value[0] + '日：'
                    + value[7]
                    + '</div>'
                    + schema[1].text + '：' + value[1] + '<br>'
                    + schema[2].text + '：' + value[2] + '<br>'
                    + schema[3].text + '：' + value[3] + '<br>'
                    + schema[4].text + '：' + value[4] + '<br>'
                    + schema[5].text + '：' + value[5] + '<br>'
                    + schema[6].text + '：' + value[6] + '<br>';
        }
      },
      xAxis: {
        type: 'value',
        name: '日期',
        nameGap: 16,
        nameTextStyle: {
          fontSize: 16
        },
        max: 31,
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: 'AQI指数',
        nameLocation: 'end',
        nameGap: 20,
        nameTextStyle: {
          fontSize: 16
        },
        splitLine: {
          show: false
        }
      },
      visualMap: [
        {
          left: 'right',
          top: '10%',
          dimension: 2,
          min: 0,
          max: 250,
          itemWidth: 30,
          itemHeight: 120,
          calculable: true,
          precision: 0.1,
          text: ['圆形大小：PM2.5'],
          textGap: 30,
          inRange: {
            symbolSize: [10, 70]
          },
          outOfRange: {
            symbolSize: [10, 70],
            color: ['rgba(255,255,255,0.4)']
          },
          controller: {
            inRange: {
              color: ['#c23531']
            },
            outOfRange: {
              color: ['#999']
            }
          }
        },
        {
          left: 'right',
          bottom: '5%',
          dimension: 6,
          min: 0,
          max: 50,
          itemHeight: 120,
          text: ['明暗：二氧化硫'],
          textGap: 30,
          inRange: {
            colorLightness: [0.9, 0.5]
          },
          outOfRange: {
            color: ['rgba(255,255,255,0.4)']
          },
          controller: {
            inRange: {
              color: ['#c23531']
            },
            outOfRange: {
              color: ['#999']
            }
          }
        }
      ],
      series: [
        {
          name: '北京',
          type: 'scatter',
          itemStyle: itemStyle,
          data: dataBJ
        },
        {
          name: '上海',
          type: 'scatter',
          itemStyle: itemStyle,
          data: dataSH
        },
        {
          name: '广州',
          type: 'scatter',
          itemStyle: itemStyle,
          data: dataGZ
        }
      ]
    }
  ];
  chart.setOption(chartType[chart_template]);
  chartNow = chart;
  return chart;
}

function updateChart() {
  chartType[0].series = seriesDataFor0;
  chartType[1].xAxis[0].data = dateList;
  chartType[1].series[0].data = valueList;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    templates:[
      {id: 0, selected: false},
      {id: 1, selected: false},
      {id: 2, selected: false},
      {id: 3, selected: false}
    ],
    keys:[],
    selectedKeys : [],
    colorSet:[
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
    ],
    ec: {
      onInit: initChart
    },
    host_: `${app.globalData.localUrl}`,
  },
  toggleTag: function(e) {
    const { index } = e.currentTarget.dataset;
    const key = this.data.keys[index].info;
    const keyIndex = selectedKeys.indexOf(key);
    if (keyIndex !== -1) {
      selectedKeys.splice(keyIndex, 1); // 取消选中标签
      this.data.keys[index].selected = false ;
    } else {
      if(selectFlag == 1){
        // 存在单选限制
        const deleteIndex = this.data.keys.findIndex(item => item.info === selectedKeys[0]);
        this.data.keys[deleteIndex].selected=false;
        selectedKeys = [];
      }
      selectedKeys.push(key); // 选中
      this.data.keys[index].selected = true ;
    }
    console.log(this.data.keys[index].info);
    this.setData({
      selectedKeys: selectedKeys,
      keys: this.data.keys,
      ['keys[' + index + '].selected']: this.data.keys[index].selected
    });
    
    initData();
    updateChart();

    chartNow.clear();
    const chart = echarts.init(canvasGlobal, null, {
      width: widthGLobal,
      height: heightGlobal,
      devicePixelRatio: dprGlobal
    });
    canvasGlobal.setChart(chart);
    const option = chartType[chart_template];
    chartNow.setOption(option);
    chartNow = chart;
    console.log(selectedKeys)
  },
  changeTemplate: function(e){
    const { index } = e.currentTarget.dataset;
    if(index == chart_template)
      return;
    this.setData({
      ['templates[' + chart_template + '].selected']: false
    });
    chart_template = index;
    this.setData({
      ['templates[' + index + '].selected']: true
    });
    if(chart_template == 0){
      // 可以多选
      selectFlag = 0;
    }else{
      // 必须单选
      if(selectFlag == 0){
        this.clearKey();
      }
      selectFlag = 1;
    }
    chartNow.clear();
    const chart = echarts.init(canvasGlobal, null, {
      width: widthGLobal,
      height: heightGlobal,
      devicePixelRatio: dprGlobal
    });
    canvasGlobal.setChart(chart);
    const option = chartType[chart_template];
    chartNow.setOption(option);
    chartNow = chart;
  },
  clearKey(){
    // 多选变单选时只保留第一组被选中的数据
    var index = 0;
    for (let i = 0; i < this.data.keys.length; i++) {
      this.data.keys[i].selected=false;
    }
    const key = selectedKeys[0];
    selectedKeys = [];
    selectedKeys.push(key);
    index = this.data.keys.findIndex(item => item.info === key);
    this.data.keys[index].selected=true;

    this.setData({
      selectedKeys: selectedKeys,
      keys: this.data.keys
    });
    initData();
    updateChart();
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
    chart_template = options.index;
    if(chart_template == 0){
      // 可以多选
      selectFlag = 0;
    }else{
      // 必须单选
      selectFlag = 1;
    }
    this.setData({
      ['templates[' + chart_template + '].selected']: true
    });
    // var pointer = this
    // wx.getStorage({
    //   key: 'openid',  // 要获取的数据的键名
    //   success: function (res) { 
    //     var openid = res.data
    //     wx.request({
    //       url: pointer.data.host_ + 'user/api/show/data/getkeys' + '?openid=' + openid,
    //       method:'GET',
    //       success:function(res){
    //         console.log(res.data.keyList)
    //         const keys = res.data.keyList.map(function (item) {
    //           return {info:item, selected: false}; 
    //         });
    //         pointer.setData({
    //           keys: keys
    //         })
    //       }
    //     });
    //   },
    //   fail: function(res) {
    //     console.error('获取本地储存失败', res);
    //   }
    // });

    //TODO： 从后端获取数据
    dataList = [
      {key:'data 1', list:[
          {"date": "2023-02-09", "value": 66},
          {"date": "2023-03-10", "value": 91},
          {"date": "2023-04-11", "value": 92},
          {"date": "2023-05-12", "value": 113},
          {"date": "2023-06-13", "value": 207},
          {"date": "2023-07-14", "value": 131},
          {"date": "2023-08-15", "value": 181},
      ]},
      {key:'data 2', list:[
        {"date": "2023-02-09", "value": 576},
        {"date": "2023-03-10", "value": 101},
        {"date": "2023-04-11", "value": 102},
        {"date": "2023-05-12", "value": 123},
        {"date": "2023-06-13", "value": 217},
        {"date": "2023-07-14", "value": 141},
        {"date": "2023-08-15", "value": 191},
      ]},
      {key:'data 3', list:[
        {"date": "2023-02-09", "value": 96},
        {"date": "2023-03-10", "value": 111},
        {"date": "2023-04-11", "value": 100},
        {"date": "2023-05-12", "value": 133},
        {"date": "2023-06-13", "value": 27},
        {"date": "2023-07-14", "value": 151},
        {"date": "2023-08-15", "value": 101},
      ]},
      {key:'data 4', list:[
        {"date": "2023-02-09", "value": 6},
        {"date": "2023-03-10", "value": 91},
        {"date": "2023-04-11", "value": 292},
        {"date": "2023-05-12", "value": 213},
        {"date": "2023-06-13", "value": 207},
        {"date": "2023-07-14", "value": 31},
        {"date": "2023-08-15", "value": 81},
      ]},
      {key:'data 5', list:[
        {"date": "2023-02-09", "value": 66},
        {"date": "2023-03-10", "value": 1},
        {"date": "2023-04-11", "value": 2},
        {"date": "2023-05-12", "value": 13},
        {"date": "2023-06-13", "value": 7},
        {"date": "2023-07-14", "value": 31},
        {"date": "2023-08-15", "value": 81},
      ]},
    ]
    const keys = dataList.map(function (item) {
      return {info:item.key,selected: true};
    });
    selectedKeys = dataList.map(function (item) {
      return item.key;
    }); 

    this.setData({
      keys: keys
    })
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