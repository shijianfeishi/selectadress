$(function(){
    _loadRegion("cn",function(){
        publicRegionObj = opreateRegion($('#province'),$('#city'),$('#area'));
    });
});

var publicCityObj = null;
// 加载城市
//新的省市区
var _loadRegion = function(_language, callback) {
    if (publicCityObj) { //如果这个对象存在，说明已经执行过该函数，可以直接退出
        return;
    }
    var provinces = [];
    var city = [];
    var area = [];
    var cityCache = {};
    var areaCache = {};
    var getcityNameCache = {};
    var getProvinceNameCache = {};
    var getAreaNameCache = {};
    var allRegionCache = {};
    var i = 0;
    var allRegion = null;
    var loadRegionSuccess = function() {
        i++;
        if (i == 3) {
            publicCityObj = obj;
            allRegion = [].concat(provinces, city, area);
            if (callback) { callback() }
        }
    }
    $.getJSON('./../js/city/provinces_' + _language + '.json', function(resdata) {
        provinces = resdata;
        loadRegionSuccess()
    })
    var isLoadCityBack = $.getJSON('./../js/city/cities_' + _language + '.json', function(resdata) {
        city = resdata;
        $.each(resdata, function(index, item) {
            if (!cityCache[item.parent_code]) {
                cityCache[item.parent_code] = [];
            }
            cityCache[item.parent_code].push(item)
        })
        loadRegionSuccess()
    })
    $.getJSON('./../js/city/areas_' + _language + '.json', function(resdata) {
        area = resdata;
        $.each(resdata, function(index, item) {
            if (!areaCache[item.parent_code]) {
                areaCache[item.parent_code] = [];
            }
            areaCache[item.parent_code].push(item)
        })
        loadRegionSuccess();
    })

    var obj = {
        getRegionName: function(code) {
            if (!code) {
                return console.log('请输入地区码！')
            }

            if (allRegionCache[code]) {
                return allRegionCache[code];
            }

            var _regionName = '';
            $.each(allRegion, function(index, item) {
                if (item.code == code) {
                    _regionName = item.name;
                }
            })
            return allRegionCache[code] = _regionName;
        },
        getProvinces: function() {
            return provinces;
        },
        getCityName: function(cityCode) {
            if (!cityCode) {
                return console.log('获取市失败, 请传入市码!');
            }

            if (getcityNameCache[cityCode]) {
                return getcityNameCache[cityCode];
            }
            var _cityName = ''
            $.each(city, function(index, item) {
                if (cityCode == item.code) {
                    _cityName = item.name;
                }
            })

            return getcityNameCache[cityCode] = _cityName;


        },
		getAreaName: function(areaCode) {
            if (!areaCode) {
                return console.log('获取市失败, 请传入区码!');
            }

            if (getAreaNameCache[areaCode]) {
                return getAreaNameCache[areaCode];
            }
            var _areaName = ''
            $.each(area, function(index, item) {
                if (areaCode == item.code) {
                    _areaName = item.name;
                }
            })

            return getAreaNameCache[areaCode] = _areaName;
        },
        getProvinceName: function(provinceCode) {
            if (!provinceCode) {
                return console.log('获取市失败, 请传入省码!');
            }

            if (getProvinceNameCache[provinceCode]) {
                return getProvinceNameCache[provinceCode];
            }
            var _proviceName = ''
            $.each(provinces, function(index, item) {
                if (provinceCode == item.code) {
                    _proviceName = item.name;
                }
            })

            return getProvinceNameCache[provinceCode] = _proviceName;

        },
        getCities: function(parentCode) {
            if (!parentCode) {
                return console.log('获取市失败, 请传入省码!');
            }
            //判断有没有缓存，有就直接返回
            if (cityCache[parentCode]) {
                return cityCache[parentCode]
            }

            var _city_arr = [];
            $.each(city, function(index, item) {

                if (item.parent_code == parentCode) {
                    _city_arr.push(item);
                }
            })

            return cityCache[parentCode] = _city_arr;
        },
        getAreas: function(parentCode) {
            if (!parentCode) {
                return console.log('获取获取县, 请传入市码!');;
            }

            //判断有没有缓存，有就直接返回
            if (areaCache[parentCode]) {
                return areaCache[parentCode]
            }

            var _ares_arr = [];
            $.each(area, function(index, item) {
                if (item.parent_code == parentCode) {
                    _ares_arr.push(item);
                }
            })

            return areaCache[parentCode] = _ares_arr;
        }
    }
}

var opreateRegion = function(provinceDom, cityDom, AreaDom) {
    var addRegion = function(dom, provinceArr) {
        if (!dom || !provinceArr) {
            return console.log('')
        }
        dom.find('option[data-add]').remove();
        var _htm = '';
        $.each(provinceArr, function(index, item) {
            _htm += '<option data-add value="' + item.code + '">' + item.name + '</option>'
        })
        dom.append(_htm);
    }
    
    addRegion(provinceDom, publicCityObj.getProvinces());
    provinceDom.on('change', function(e) {
        oooo.init()
        oooo.changeProvince($(this).val());
    })

    cityDom.on('change', function() {
        if($(this).val() == ""){
            AreaDom.find("option").prop("selected",false);
        }else{
            oooo.changeCity($(this).val())
        }
    })
    var oooo = {
        init: function() {
            cityDom.find('option[data-add]').remove().removeClass('hidden');
            AreaDom.find('option[data-add]').remove().removeClass('hidden');
        },
        changeProvince: function(code) {
            var arr = publicCityObj.getCities(code);
            if (arr.length > 0) {
                cityDom.removeClass('hidden');
                AreaDom.removeClass('hidden');
                cityDom.find('option[data-add]').remove();
                addRegion(cityDom, arr)
            } else {
                cityDom.addClass('hidden');
                AreaDom.addClass('hidden');
            }
        },
        changeCity: function(code) {
            var arr = publicCityObj.getAreas(code);
            if (arr.length > 0) {
                AreaDom.removeClass('hidden');
                AreaDom.find('option[data-add]').remove();
                addRegion(AreaDom, arr)
            } else {
                AreaDom.addClass('hidden');
            }
        },
        inputRegionData: function(provincecode, citycode, areacode) {
            if (!provincecode) {
                return;
            }
            provinceDom.find('option[value="' + provincecode + '"]').prop('selected', true);
            if (!citycode) {
                return;
            }
            addRegion(cityDom, publicCityObj.getCities(provincecode))
            cityDom.find('option[value="' + citycode + '"]').prop('selected', true);
            if (!areacode) {
                return;
            }
            addRegion(AreaDom, publicCityObj.getAreas(citycode))
            AreaDom.find('option[value="' + areacode + '"]').prop('selected', true);
        }

    }
    return oooo;
}
// 获取id,进行页面地址的渲染
//解决省、市同名都出现的问题
function fixCity(address){
    if(isUndefined(address)){return address;}
    var res="";
    var adr=address.split(',');
    var adr0 = publicCityObj.getRegionName(adr[0]);
    var adr1 = publicCityObj.getCityName(adr[1]);
    var adr2 = publicCityObj.getAreaName(adr[2]);
    if(adr0 == undefined){
        adr0 = "";
    }
    if(adr1 == undefined){
        adr1 = "";
    }
    if(adr2 == undefined){
        adr2 = "";
    }
    res = adr0 + adr1 + adr2;
    // if(adr[0]==adr[1]){
    //  res=adr[0]+adr[2]+adr[3];
    // }else{
    //  res=adr[0]+adr[1]+adr[2]+adr[3];
    // }
    return res;
}