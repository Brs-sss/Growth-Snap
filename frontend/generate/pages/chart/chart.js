// pages/generate/chart/chart.js
const app = getApp()
import * as echarts from '../../../components/ec-canvas/echarts';

// 数据参考:1.《中国7岁以下儿童生长发育参照标准》2022年 2.首都科研究所生长发育研究室《3~15岁的儿童标准身高表》(2021年)  3.教育部第八次全国学生体质与健康调研结果(2021年)
var heightStandard = [
  [
  {age:'0', height:50.4, weight:3.3}, 
  {age:'1', height:76.5, weight:10.0}, 
  {age:'2', height:88.5, weight:12.5}, 
  {age:'3', height:96.8, weight:14.5}, 
  {age:'4', height:104.5, weight:16.5}, 
  {age:'5', height:112.4, weight:18.5}, 
  {age:'6', height:119.4, weight:21.0}, 
  {age:'7', height:125.8, weight:23.5}, 
  {age:'8', height:131.9, weight:26.5}, 
  {age:'9', height:137.4, weight:29.5}, 
  {age:'10', height:142.3, weight:33.0}, 
  {age:'11', height:147.5, weight:36.5}, 
  {age:'12', height:154.2, weight:40.5}, 
  {age:'13', height:161.9, weight:45.5}, 
  {age:'14', height:168.4, weight:51.0}, 
  {age:'15', height:172.4, weight:56.0}, 
  {age:'16', height:174.3, weight:58.5}, 
  {age:'17', height:175.1, weight:60.0}, 
  {age:'18', height:175.7, weight:61.5}
],
[
  {age:'0', height:50.4, weight:3.2}, 
  {age:'1', height:76.5, weight:9.5}, 
  {age:'2', height:88.5, weight:12.0}, 
  {age:'3', height:96.8, weight:14.0}, 
  {age:'4', height:104.5, weight:16.0}, 
  {age:'5', height:112.4, weight:18.0}, 
  {age:'6', height:119.4, weight:20.5}, 
  {age:'7', height:125.8, weight:23.0}, 
  {age:'8', height:131.9, weight:25.5}, 
  {age:'9', height:137.4, weight:28.5}, 
  {age:'10', height:142.3, weight:31.5}, 
  {age:'11', height:147.5, weight:35.0}, 
  {age:'12', height:154.2, weight:39.0}, 
  {age:'13', height:161.9, weight:43.0}, 
  {age:'14', height:168.4, weight:47.5}, 
  {age:'15', height:172.4, weight:52.0}, 
  {age:'16', height:174.3, weight:54.0}, 
  {age:'17', height:175.1, weight:55.5}, 
  {age:'18', height:175.7, weight:56.5}
]]
var standardList = []

var data_item = []; // 所有数据
var dataList = []; // 当前孩子的所有数据
var selectedKeys = [];
var selectedKidList = [];
var selectFlag = 0; // 0表示可以多选 1表示必须单选

var heightGlobal, widthGLobal, canvasGlobal, dprGlobal, chartNow;
var chart_template = 0;
var chartType = [];

// 0号chart的数据处理
const colors = ['#80ffa5', '#01bfec', '#00ddff', '#4d77ff', '#37a2ff', '#7415db', '#ff0087', '#87009d', '#ffbf00', '#e03e4c']
var seriesDataFor0_event= [] // 按照事件均匀排序
var seriesDataFor0_time= [] // 按照时间均匀排序


// 1号chart的数据

var dateList = [];
var valueList = [];
var timeList = [];

//2号chart的数据
var lineList = [];


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

//改变数据组时使用
function initData(){
  var dataListNow = [];
  //0号chart&1号chart
  seriesDataFor0_event= [];
  seriesDataFor0_time= [];
  lineList = [];
  dateList = [];
  valueList = [];
  console.log(selectedKeys)
  for (let i = 0; i < selectedKeys.length; i++) {
    dataListNow = dataList[dataList.findIndex(item => item.key === selectedKeys[i])].list;
    dateList = dataListNow.map(function (item) {
      return item.date;
    });
    valueList = dataListNow.map(function (item) {
      return item.value;
    });
    timeList = dataListNow.map(function (item) {
      let date_time = new Date(item.time)
      return [date_time, item.value];
    });
    const currentLine_time = {
      name: selectedKeys[i],
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {},
      data: timeList,
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
      data: timeList
    };
    const currentLine_event = {
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
      data: valueList 
    };
    seriesDataFor0_time.push(currentLine_time);
    seriesDataFor0_event.push(currentLine_event);
  }

  //2号chart
  lineList = []
  console.log(valueList)
  lineList = dataListNow.map(function (item) {
    return item.value*2;
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
  console.log(selectedKeys)
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
          // type: 'time',
          boundaryGap: false,
          data: dateList
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: seriesDataFor0_event
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
          // type: 'time',
          type: 'category',
          boundaryGap: false,
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
          // data: timeList
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
        data: selectedKeys,
        textStyle: {
          color: '#ccc'
        }
      },
      xAxis: {
        type: 'category',
        data: dateList,
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
          data: lineList
        },
        {
          name: selectedKeys[0],
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            borderRadius: 5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#14c8d4' },
              { offset: 0, color: '#14c8d4' },
              { offset: 1, color: '#43eec6' },
            ])
          },
          data: valueList
        },
        {
          name: 'line',
          type: 'bar',
          barGap: '-100%',
          barWidth: 10,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 1, color: 'rgba(20,200,212,0)' }
            ])
          },
          z: -12,
          data: lineList,
          tooltip: {
            show:false
          }
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
          data: lineList,
          tooltip: {
            show:false
          }
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

// 改变数据组之后加载不同templates中需要的数据
function updateChart() {
  // 缺省状态为按照事件均匀分布
  chartType[0].series = seriesDataFor0_event;
  chartType[0].xAxis.type = 'category';
  chartType[0].xAxis.data = dateList;
  chartType[1].xAxis[0].data = dateList;
  chartType[1].series[0].data = valueList;
  chartType[2].legend.data = selectedKeys;
  chartType[2].xAxis.data = dateList;
  chartType[2].series[0].data = null;
  chartType[2].series[1].name = selectedKeys[0];
  chartType[2].series[1].data = valueList;
  chartType[2].series[2].data = null;
  chartType[2].series[3].data = null;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchChecked : false,
    standardChecked : true,
    standardNote : false,
    templates:[
      {id: 0, selected: false},
      {id: 1, selected: false},
      {id: 2, selected: false}
    ],
    keys : [],
    selectedKeys : [],
    kidList : [],
    selectedKidList : [],
    colorSet : [
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
  toggleChildTag: function(e) {
    //关闭标准数据
    this.setData({
      standardNote: false
    })

    selectedKeys = [];
    const { index } = e.currentTarget.dataset;
    const key = this.data.kidList[index].info;
    const keyIndex = selectedKidList.indexOf(key);
    if (keyIndex !== -1) {
      return
    }
    // 判断选中孩子是否有数据
    console.log(data_item[key])
    if(data_item[key].length == 0){
      wx.showToast({
        title: "未上传"+ key +"数据",
        icon: 'error',
        duration: 2000,
      })
      return
    }
    console.log(data_item)
    if(data_item[key][0].list.length == 1){
      wx.showToast({
        title: key +"数据仅一条，不足",
        icon: 'error',
        duration: 2000,
      })
      return
    }
    // 存在单选限制
    const deleteIndex = this.data.kidList.findIndex(item => item.info === selectedKidList[0]);
    console.log(deleteIndex)
    this.data.kidList[deleteIndex].selected=false;
    selectedKidList = [];
    selectedKidList.push(key); // 选中
    this.data.kidList[index].selected = true ;

    //计算标准数据
    standardList = []
    for (let i = this.data.kidList[index].age; i >= 0; i--) {
      standardList.push({'height':heightStandard[this.data.kidList[index].gender][i].height,'weight':heightStandard[this.data.kidList[index].gender][i].weight})
    }
    console.log(standardList)
    
    // TODO:写个复用的函数
    dataList = data_item[selectedKidList[0]]
    var keys = [];
    console.log(dataList)
    if(selectFlag == 0){
      selectedKeys = dataList.map(function (item) {
        return item.key;
      }); 
      keys = dataList.map(function (item) {
        return {info:item.key,selected: true};
      });
    }else{
      selectedKeys.push(dataList[0].key)
      keys = dataList.map(function (item) {
        return {info:item.key,selected: false};
      });
      keys[0].selected = true;
    }
    this.setData({
      keys: keys
    })

    this.setData({
      selectedKidList: selectedKidList,
      kidList: this.data.kidList,
      ['kidList[' + index + '].selected']: this.data.kidList[index].selected
    });
    
    // 显示标准数据的模板
    console.log(selectedKeys[0],chart_template)
    if((selectedKeys[0]=='身高' || selectedKeys[0]=='体重') && chart_template == 2){
      this.setData({
        standardChecked : false
      })
    }else{
      this.setData({
        standardChecked : true
      })
    }

    initData();
    updateChart();
    this.switchMode();

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
  toggleTag: function(e) {
    const { index } = e.currentTarget.dataset;
    const key = this.data.keys[index].info;
    const keyIndex = selectedKeys.indexOf(key);
    if (keyIndex !== -1) {
      if(selectedKeys.length == 1){
        return
      }
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
    if((key=='身高' || key=='体重') && chart_template == 2){
      this.setData({
        standardChecked : false
      })
    }else{
      this.setData({
        standardChecked : true
      })
    }
    
    // 更新数据
    initData();
    // initChart();
    // 更新option
    updateChart();
    // 更新排布规则
    this.switchMode();

    //关闭标准数据
    this.setData({
      standardNote: false
    })

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
  // 分布模式
  switchChange: function(e){
    this.setData({
      switchChecked: e.detail.value
    });
    console.log(e.detail.value)
    this.switchMode()

    //TODO: 写成可复用函数
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
  // 显示标准数据
  switchStandard: function (e) {
    if(e.detail.value){
      // 计算对应标准身高
      const now = new Date();
      const currentYear = now.getFullYear();
      console.log(standardList)
      var standard = dateList.map(function (item) {
        var then = new Date(item)
        if(selectedKeys[0]=='身高')
          return standardList[currentYear - then.getFullYear()].height;
        else
          return standardList[currentYear - then.getFullYear()].weight;
      }); 
      // 2号chart
      chartType[2]=
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
          data: ['身高','标准身高'],
          textStyle: {
            color: '#ccc'
          }
        },
        xAxis: {
          type: 'category',
          data: dateList,
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
            name: '身高',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 15,
            data: valueList
          },
          {
            name: '标准身高',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              borderRadius: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#14c8d4' },
                { offset: 1, color: '#43eec6' },
              ])
            },
            data: standard
          },
          {
            name: 'line',
            type: 'bar',
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(20,200,212,0.3)' },
                { offset: 0.5, color: 'rgba(20,200,212,0.1)' },
                { offset: 1, color: 'rgba(20,200,212,0)' }
              ])
            },
            z: -12,
            data: valueList,
            tooltip: {
              show:false
            }
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
            data: valueList,
            tooltip: {
              show:false
            }
          }
        ]
      }
    }else{
      updateChart();
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
  changeTemplate: function(e){

    // 数据已经加载，直接改变图的option即可
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
    //当前限制必须单选
    selectFlag = 1;
    updateChart();
    // 显示标准数据的模板
    console.log(selectedKeys[0],chart_template)
    if((selectedKeys[0]=='身高' || selectedKeys[0]=='体重') && chart_template == 2){
      this.setData({
        standardChecked : false
      })
    }else{
      this.setData({
        standardChecked : true
      })
    }

    this.setData({
      standardNote : false
    })

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
  switchMode() {
    if(this.data.switchChecked){
      // 按照时间均匀分布
      // 0号chart数据更新
      chartType[0].series = seriesDataFor0_time;
      chartType[0].xAxis=[{
        type: 'time',
        boundaryGap: false,
      }];
      // 1号chart数据更新
      chartType[1].xAxis = [{
        type: 'time',
        boundaryGap: false,
      }];
      chartType[1].series[0].data = timeList
    }else{
      // 0号chart数据更新
      chartType[0].series = seriesDataFor0_event;
      chartType[0].xAxis=[{
        type: 'category',
        boundaryGap: false,
        data: dateList
      }];
      chartType[0].xAxis.data = dateList;
      // 1号chart数据更新
      chartType[1].xAxis = [{
        data: dateList
      }];
      chartType[1].series[0].data = valueList
    }
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
    // 限制必须单选
    selectFlag = 1;
    selectedKeys = []
    this.setData({
      ['templates[' + chart_template + '].selected']: true
    });
    var that = this;
    let openid
    // 获取存储的openid
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        // 从本地存储中获取数据,在index.js文件中保存建立的
        openid=res.data
        console.log("openid:",openid)
        that.setData({
          openid: openid
        })
        wx.request({
          url: that.data.host_+'user/api/generate/data'+'?openid='+openid,
          method: 'GET',
          success:function(res){
            console.log(res.data)
            data_item = res.data.data_item
            wx.request({
              url: that.data.host_+'user/api/user/children_info'+'?openid='+openid,
              method: 'GET',
              success:function(res){
                let children_list = res.data.children_list
                // 没有孩子的情况
                if(children_list.length == 0){
                  wx.showToast({
                    title: "未上传数据",
                    icon: 'error',
                    duration: 3000,
                  })
                  return
                }
                let temp_kidList = []
                for(let i = 0; i < children_list.length; i++){
                  let name = children_list[i].name
                  var age = +children_list[i].age
                  if(children_list[i].gender=='男'){
                    temp_kidList.push({'info': name, 'selected': false, 'age': 1+age, 'gender': 0})
                  }else{
                    temp_kidList.push({'info': name, 'selected': false, 'age': children_list[i].age, 'gender': 1})
                  }
                  // }
                }
                // 寻找第一个有数据的孩子作为缺省选择的孩子
                for(let i = 0; i < temp_kidList.length; i++){
                  console.log(data_item)
                  if(data_item[temp_kidList[i].info].length != 0){
                    selectedKidList.push(temp_kidList[i].info);
                    temp_kidList[i].selected = true;

                     //计算标准数据
                    standardList = []
                    console.log(temp_kidList[i].info)
                    console.log(temp_kidList[i].age)
                    for (let j = temp_kidList[i].age; j >= 0; j--) {
                      standardList.push({'height':heightStandard[temp_kidList[i].gender][j].height,'weight':heightStandard[temp_kidList[i].gender][j].weight})
                    }
                    console.log(standardList)
                    break;
                  }else{
                    if(i == temp_kidList.length - 1){
                      wx.showToast({
                        title: "未上传数据",
                        icon: 'error',
                        duration: 2000,
                      })
                      return
                    }
                  }
                }
                // 初始化缺省孩子的数据
                dataList = data_item[selectedKidList[0]]
                var keys = [];
                // 当前不支持多选
                
                // if(selectFlag == 0){
                //   selectedKeys = dataList.map(function (item) {
                //     return item.key;
                //   }); 
                //   keys = dataList.map(function (item) {
                //     return {info:item.key,selected: true};
                //   });
                // }else{
                  selectedKeys.push(dataList[0].key)
                  console.log(selectedKeys)
                  keys = dataList.map(function (item) {
                    return {info:item.key,selected: false};
                  });
                  keys[0].selected = true;
                // }


                if((keys[0].info=='身高' || key=='体重') && chart_template == 2){
                  that.setData({
                    standardChecked : false
                  })
                }else{
                  that.setData({
                    standardChecked : true
                  })
                }


                that.setData({
                  kidList: temp_kidList,
                  keys: keys
                })
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
            },
            fail:function(res){
              console.log('load page failed: ',res)
            }
            });
        }
        });
        
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
    return{
      title: '快来看看我的时间轴',
      path: ''
    }
  }
})