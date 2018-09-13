$(function () {
    //开始的时候设置默认城市
    $.ajax({
        url:`https://www.toutiao.com/stream/widget/local_weather/data/?city=`,
        data:{'city':"太原"},
        type:"get",
        dataType:"jsonp",
        success:function (e) {
            updata(e.data);
        }
    })
    //    语音部分
    $(".audioBtn").click(function (event) {
        event.stopPropagation();
        let speech=window.speechSynthesis;
        let speechset=new SpeechSynthesisUtterance();
        let text=$(".header span").text()+"当前气温"+$("#tem").text()+"摄氏度";
        console.log(text);
        speechset.text=text;
        speech.speak(speechset);
    })
    let citys;
    $.ajax({
        url:"https://www.toutiao.com/stream/widget/local_weather/city/",
        type:"get",
        dataType:"jsonp",
        success:function (e) {
           citys=e.data;
            let str="";
            for (key in citys){
                // console.log(key);
                str+=`<h2>${key}</h2>`;
                 str+="<div class='con'>";
                 for (key2 in citys[key]){
                     // console.log(key2);
                     str+=`<div class="city">${key2}</div>`
                 }
                 str+="</div>"
            }
            $(str).appendTo($(".cityBox"))
        }
    })

    let cityBox=$(".cityBox");
    $(".header").click(function () {
        cityBox.slideDown();
    })
    $(".search button").click(function () {
        cityBox.slideUp();
    })

    cityBox.on("touchstart",function (event) {
        if (event.target.className=="city") {
            // console.log(event.target.innerText);
            cityBox.slideUp();
            let city=event.target.innerText;
            $.ajax({
                url:`https://www.toutiao.com/stream/widget/local_weather/data/?city=${city}`,
                data:{'city':city},
                type:"get",
                dataType:"jsonp",
                success:function (e) {
                    console.log(e.data);
                    updata(e.data);
                }
            })
            //自己代码开始
            // $(".header span").html(event.target.innerText);
            // console.log($(".header span").html());
            // let secity=$(".header span").html();
            // console.log(secity);
            // $.ajax({
            //     url:`https://www.toutiao.com/stream/widget/local_weather/data/?city=${secity}`,
            //     type:"get",
            //     dataType:"jsonp",
            //     success:function (e) {
            //         citycon=e.data;
            //         console.log(e.data);
            //         let str="";
            //         console.log(citycon.weather.aqi);
            //         str+='<div class="aqi">' +
            //             '            <span>'+citycon.weather.aqi+'</span>' +
            //             '            <span>'+citycon.weather.quality_level+'</span>' +
            //             '</div>'+
            //             '<h3>' +
            //             '      <span>'+citycon.weather.current_temperature+'</span>' +
            //             '</h3>' +
            //             '<h4><span>'+citycon.weather.dat_condition+'</span></h4>' +
            //             '<h5><span>'+citycon.weather.wind_direction +citycon.weather.wind_level+'级</span></h5>'
            //         $(".screen").html(str)
            //         // $(str).appendTo($(".screen"));
            //         updata(e.data);
            //
            //     }
            // })
        //    自己代码结束


        }
    })
    function updata(data) {
        $(".header span").text(data.city);
        $("#aqi").text(data.weather.aqi);
        $("#quality").text(data.weather.quality_level);
        $("#tem").text(data.weather.current_temperature);
        $("#daycondition").text(data.weather.dat_condition);
        $("#dirctionWind").text(data.weather.wind_direction+" "+data.weather.wind_level+"级");
        $("#heigh-low").text(data.weather.dat_high_temperature+"/"+data.weather.dat_low_temperature);
        $("#day_condition").text(data.weather.day_condition);
        $("#dat_weather_icon_id").attr("src",`img/${data.weather.dat_weather_icon_id}.png`);
        $("#tomorrow_high_temperature").text(data.weather.tomorrow_high_temperature+"/"+data.weather.tomorrow_low_temperature);
        $("#tomorrow_condition").text(data.weather.tomorrow_condition);
        $("#tomorrow_weather_icon_id").attr("src",`img/${data.weather.tomorrow_weather_icon_id}.png`);

        let str="";
        for(obj of data.weather.hourly_forecast){
            // console.log(obj);
            str+=`<div class="box">
                <div><span>${obj.hour}</span>:00</div>
                <img src="img/${obj.weather_icon_id}.png" alt="">
                <div><span>${obj.temperature}</span>°</div></div>`;
            // console.log(str);
        }
        $(".hours .con").html(str);
        
        let str1="";
        let x=[];
        let high=[];
        let low=[];
        let weeknum=["日","一","二","三","四","五","六"];
        for (obj of data.weather.forecast_list) {
            let date=new Date(obj.date);
            let day=date.getDay();
            x.push(obj.date);
            high.push(obj.high_temperature);
            low.push(obj.low_temperature)
            console.log(day);
            str1+=`<div class="box">
                <span>星期${weeknum[day]}</span>
                <span class="date">${obj.date}</span>
                <span class="daycondition">${obj.high_temperature}°</span>
                <img src="img/${obj.weather_icon_id}.png" alt="" class="dayimg">
                <img src="img/${obj.weather_icon_id}.png" alt="" class="nightimg">
                <span class="nightcondition">${obj.condition}</span>
                <span class="wind_direction">${obj.wind_direction}</span>
                <div><span>${obj.weather_icon_id}</span></div>
            </div>`;
        }
        $(".week .con").html(str1);

        //    折线图

        let myChart = echarts.init($(".canvas")[0]);
        let option = {
            xAxis: {
                data: x,
                show:false,
            },
            grid:{
                left:0,
                right:0,
                width:1430
            },
            yAxis: {
                show:false,
            },
            series: [{
                type: 'line',
                data: high,
                color:'#FFB74D',
                symbol:'circle',
                symbolSize:8,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color:'#333',
                    }
                },
            },
                {
                    type: 'line',
                    data: low,
                    color:"#4FC3F7",
                    symbol:'circle',
                    symbolSize:8,
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            color:'#333',
                        }
                    },
                }

            ]

        };
        myChart.setOption(option);



    }





})