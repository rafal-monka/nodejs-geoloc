const moment = require('moment')

exports.metadata = (imei, startDate, endDate) => {
// console.log('exports.metadata', startDate, endDate)
    return [
    {
      '$match': {
        'devicetime': {
          '$gte': new Date(startDate), 
          '$lte': new Date(endDate)
        }, 
        'imei': imei
      }
    }, {
      '$group': {
        '_id': null, 
        'min_lat': {
          '$min': '$latitude'
        }, 
        'max_lat': {
          '$max': '$latitude'
        }, 
        'min_lng': {
          '$min': '$longitude'
        }, 
        'max_lng': {
          '$max': '$longitude'
        }, 
        'min_devicetime': {
          '$min': '$devicetime'
        }, 
        'max_devicetime': {
          '$max': '$devicetime'
        }, 
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$addFields': {
        'devicetime_span': {
          '$divide': [
            {
              '$subtract': [
                '$max_devicetime', '$min_devicetime'
              ]
            }, 1000 /*miliseconds*/
          ]
        }
      }
    }, {
      '$project': {
        'min_lat': 1, 
        'max_lat': 1, 
        'min_lng': 1, 
        'max_lng': 1, 
        'count': 1, 
        'devicetime_span': 1,
        'min_devicetime': 1,
        'max_devicetime': 1
      }
    }
  ]
}

exports.aggregated = (imei, startDate, endDate, minDeviceTime, sectionWidth) => {
    var minDeviceTime = moment(minDeviceTime).utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); 
// console.log('exports.aggregated', startDate, endDate, minDeviceTime, sectionWidth)        
    if (sectionWidth === 0) return null    
    return [
        {
           '$sort': {
              'devicetime': 1
           }
        }, {'$match': {
          'devicetime': {
          '$gte': new Date(startDate), 
          '$lte': new Date(endDate)
        }, 
        'imei': imei
      }
    }, {
      '$addFields': {
        'section': {
          '$round': [
            {
              '$divide': [
                {
                  '$subtract': [
                    '$devicetime', new Date(minDeviceTime)
                  ]
                }, sectionWidth*1000 /*miliseconds*/
              ]
            }, 0
          ]
        }
      }
    }, {
      '$group': {
        '_id': {'section': "$section"}, 
        'avg_lat': {
          '$avg': '$latitude'
        }, 
        'avg_lng': {
          '$avg': '$longitude'
        }, 
        'avg_speed': {
          '$avg': '$speed'
        }, 
        'min_lat': {
          '$min': '$latitude'
        }, 
        'max_lat': {
          '$max': '$latitude'
        }, 
        'min_lng': {
          '$min': '$longitude'
        }, 
        'max_lng': {
          '$max': '$longitude'
        }, 
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$project': {
        '_id': 1,
        'avg_lat': 1, 
        'avg_lng': 1, 
        'avg_speed': 1, 
        'min_lat': 1, 
        'max_lat': 1, 
        'min_lng': 1, 
        'max_lng': 1, 
        'count': 1, 
        'devicetime_span': 1
      }
    }
  ]
}