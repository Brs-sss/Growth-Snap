// pages/generate/timeline/timeline.js
import * as echarts from '../../../components/ec-canvas/echarts';

const app = getApp();

var heightGlobal, widthGLobal, canvasGlobal, dprGlobal, chartNow;
var timeline_template = 0; // 当前的模板id
var colorSetIdex = 0; // 当前的色彩id
var colorSet = [
  {id: 0, backgroundColor: '#143e64', colors:["#87ceeb","#59c4e6","#a5e7f0", '#add8e6', '#b5e4e6','#7cb9e8', '#5c9cc2', '#87ceeb', '#add8e6', '#164a7a98']},
  {id: 1, backgroundColor: '#b27466', colors:['#ffd700', '#f0e68c', '#eedc82', '#ffec8b','#ffd700', '#ffdb58', '#f0e68c', '#eedc82', '#ffec8b', '#b9612791']},
  {id: 2, backgroundColor: '#00207496', colors:['#f48fb1', '#ff6f94', '#ff5983', '#f4506e','#f48fb1', '#ff9eb4', '#ff6f94', '#ff5983', '#f4506e', '#23007471']},
  {id: 3, backgroundColor: '#008080', colors:['#a4ebb1', '#bdf9ca', '#c7fdc9', '#d3ffc8', '#e1ffdb', '#e7ffe5', '#c4f5c7', '#a4e7a0', '#83d968','#084963a8', ]},
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




/* 与后端联系，获取主页的内容*/
function loadPageInfo(that){
  // 获取存储的openid
  wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      wx.request({
        url: that.data.host_+'user/api/generate/timeline'+'?openid='+openid+'&types=e&tags=false', //e表示只求取event
        method:'GET',
        success:function(res){
          console.log(res.data.blocks_list)
          let uniqueTags = new Set();
          let tag_to_eventIndex_dict = {}
          const eventList = res.data.blocks_list.map((blogCard) => {
              let {imgSrc}=blogCard;
              let { title, event_date} = blogCard;
              (imgSrc==undefined)?imgSrc='/image/show/txt.png':null;
              let date = event_date;
              return { imgSrc, date, title};
            });
            let tag_array=Array.from(uniqueTags).map(tag=>{return {'info':tag,'checked':false}})
            that.setData({
              blog_cards_list: res.data.blocks_list,
              eventList: eventList,

              tags:tag_array,
              isTagsEmpty:tag_array.length==0,
              tag_to_event_index_dict:tag_to_eventIndex_dict,
            })
            eventData = eventIndex.map(function(index) {
              return eventList[index];
            });
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
  // eventData=[
  //   {date:'2023-02-01', title:'小明今天开始学习钢琴'},
  //   {date:'2023-03-05', title:'小明学会了第一首曲子'},
  //   {date:'2023-04-20', title:'小明说好喜欢弹钢琴'},
  //   {date:'2023-06-04', title:'小明开始准备第一次考级'},
  //   {date:'2023-07-09', title:'给小明买了一台自己的钢琴'},
  //   {date:'2023-09-15', title:'小明通过了考级'}
  // ];
  console.log(eventData);
  titleData = eventData.map(event => event.title);
  //0号时间轴
  graphDataFor0 = eventData.map(event => [event.date, 1000, event.title]);
  linksFor0 = graphDataFor0.map(function (item, idx) {
    return {
      source: idx,
      target: idx + 1
    };
  });
  //1号时间轴
  graphDataFor1 = eventData.map(event => ({
    value: (eventData.indexOf(event) + 1) * 20,
    name: `${event.date} \n ${event.title} \n`+ '{' + 'index_' + eventData.indexOf(event) + '| }'
  }));
  //2号时间轴
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
          // color: ["#516b91","#59c4e6","#a5e7f0"]
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
            fontSize: 16
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
        data: yAxisDataFor2, // 数据
        axisLabel: {
          formatter: (params) => {
           return '【' + eventData[params].date + '】'+'\n' + eventData[params].title + '\n' + '{' + 'index_' + params + '| }';
          },
          rich: imgData, //数据
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
    //3号时间轴
    {
      backgroundColor: colorSet[colorSetIdex].backgroundColor,
      color: colorSet[colorSetIdex].colors,
      series: [
        {
          type: 'sunburst',
          center: ['50%', '30%'],
          data: data, //数据
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
                shadowColor: colorSet[colorSetIdex].colors[2],
                color: 'transparent'
              },
              label: {
                rotate: 'tangential',
                fontSize: 5,
                color: colorSet[colorSetIdex].colors[0]
              }
            },
            {
              r0: 140,
              r: 145,
              itemStyle: {
                shadowBlur: 80,
                shadowColor: colorSet[colorSetIdex].colors[0]
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
    colorSet:[
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4}
    ],
    ec: {
      onInit: initChart
    }
  },
  changeTemplate: function(e){
    const { index } = e.currentTarget.dataset;
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
  changeColor:function(e){
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
    }else if(timeline_template == 2){
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
    const eventsSTR = options.events;
    console.log(eventsSTR)
    eventIndex = eventsSTR.split('-').map(Number);
    this.setData({
      ['templates[' + timeline_template + '].selected']: true
    });
    var that = this;
    loadPageInfo(that);
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