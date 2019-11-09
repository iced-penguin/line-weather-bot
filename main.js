function getWeatherInfo(cityId) {
  // Livedoor天気API
  var baseUrl = 'http://weather.livedoor.com/forecast/webservice/json/v1';
  var url = baseUrl + '?city=' + String(cityId);
  var response = UrlFetchApp.fetch(url);
  var data = JSON.parse(response.getContentText());  // JSONデータ
  
  var title = data['title'];
  var link = data['link'];  // 詳細情報のリンク  
  // 今日の天気を取得
  for (i in data['forecasts']) {
    if (data['forecasts'][i]['dateLabel'] === '今日') {
      var weather = data['forecasts'][i]['telop'];
    }
  }

  return {
    title: title,
    weather: weather,
    link: link
  };
}

function createMessage(cityId) {
  var info = getWeatherInfo(cityId);
  var message = '[今日の ' + info.title + ']\n\n';
  message += info.weather + '\n\n';
  message += info.link;
  return message;
}

function pushMessage() {
  var cityId = 260010  // Kyoto
  // LINE APIのURL
  var url = 'https://api.line.me/v2/bot/message/push';
  
  var message = createMessage(cityId);
  
  var options = {
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ACCESS_TOKEN
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': USER_ID,
      'messages': [{
        'type': 'text',
        'text': message
      }]
    })
  };   
  // メッセージを送る
  UrlFetchApp.fetch(url, options);
}
