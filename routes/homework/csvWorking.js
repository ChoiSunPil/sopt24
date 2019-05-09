const fs = require('fs')
const csvtojson = require('csvtojson')
const crypto = require('crypto-promise')
const {Parser} = require('json2csv')
var moment = require('moment');
const path = require('path')
var fields = ['id','title','contents','time','pw','salt']
require('moment-timezone')
moment.tz.setDefault("Asia/Seoul")
const parser = new Parser()
const filePath = path.join(__dirname, '../../public/csvs')
const boardPath =  path.join(filePath,'/table.csv')
const responseMessagePath = path.join(__dirname,"../../module/responseMessage.js")
const responseMessage = require(responseMessagePath)
module.exports = {
    

    loadBoardJsonToCsv : (id)=>{
        return new Promise((resolve,reject)=>{
        
            csvtojson().fromFile(boardPath).then((jsonArray)=>{
                  
                if(jsonArray.length <1)
                reject(responseMessage.SEARCH_TABLE_SUCCESS)

                for(let  i = 0 ; i <jsonArray.length; i++)
                {
                    if(jsonArray[i].id === id)
                         {
                             resolve(jsonArray[i])
                         }
                }
                reject(responseMessage.NO_TABLE)
            })

            

        })

    },

    saveBoardInCsv : (board)=>{
        return new Promise((async(resolve,reject)=>{
            let salt = (await crypto.randomBytes(32)).toString('base64')
            let pw   = (await crypto.hmac('sha1',salt)(board.pw)).toString('base64')
            let boardJson = {
                 id : board.id,
                 title : board.title,
                 contents : board.contents,
                 time : moment().format('YYYY-MM-DD HH:mm:ss'),
                 pw : pw,
                 salt : salt 
             }
            csvtojson().fromFile(boardPath).then((jsonArray)=>{
                if(jsonArray.length > 0)
                {
                for(let  i = 0 ; i <jsonArray.length; i++)
                {
                    if(jsonArray[i].id === boardJson.id)
                         reject(responseMessage.ALREADY_TABLE)
                }    
                 jsonArray.push(boardJson)
                 try{     
                    let csv = parser.parse(jsonArray,fields)
                    fs.writeFileSync(boardPath,csv)
                    resolve()
                    }
                    catch(err)
                    {
                        reject(responseMessage.CREATED_TABLE_FAIL)
                    }
                }
                else
                {
            
                 try{     
                 let csv = parser.parse(boardJson,fields)
                 fs.writeFileSync(boardPath,csv)
                 resolve()
                 }
                 catch(err)
                 {
                    reject(responseMessage.CREATED_TABLE_FAIL)
                 }
                }
            }
            )
         


            

        })
        )},
    modifyBoardInCsv : (json)=>{
        return new Promise((resolve,reject)=>{


            csvtojson().fromFile(boardPath).then(async(jsonArray)=>{
                for(let  i = 0 ; i <jsonArray.length; i++)
                {
                    if(jsonArray[i].id === json.id)
                         {
                            let hashedPw = (await crypto.hmac('sha1',jsonArray[i].salt)(json.pw)).toString('base64')
                            if(jsonArray[i].pw === hashedPw)
                            {
                                jsonArray[i].contents  = json.contents
                                jsonArray[i].title = json.title
                                jsonArray[i].time = moment().format('YYYY-MM-DD HH:mm:ss')
                                try{     
                                    let csv = parser.parse(jsonArray,fields)
                                    fs.writeFileSync(boardPath,csv)
                                    resolve()
                                    }
                                    catch(err)
                                    {
                                        reject(responseMessage.CREATED_TABLE_FAIL)
                                    }
                            }
                            reject(responseMessage.MISS_MATCH_PW)

                



                         }
                }
                reject(responseMessage.NO_TABLE)
            })



        })

    },
    deleteBoardInCsv : (json)=>{

return new Promise((resolve,reject)=>{


    csvtojson().fromFile(boardPath).then(async(jsonArray)=>{
        for(let  i = 0 ; i <jsonArray.length; i++)
        {
            if(jsonArray[i].id === json.id)
                 {
                    let hashedPw = (await crypto.hmac('sha1',jsonArray[i].salt)(json.pw)).toString('base64')
                    if(jsonArray[i].pw === hashedPw)
                    {
                    jsonArray.splice(i,1)
                        try{     
                            let csv = parser.parse(jsonArray,fields)
                            fs.writeFileSync(boardPath,csv)
                            resolve()
                            }
                            catch(err)
                            {
                                reject(responseMessage.DELETE_TABLE_FAIL)
                            }
                    }
                    reject(responseMessage.MISS_MATCH_PW)

        



                 }
        }
        reject(responseMessage.NO_TABLE)
    })

            
        })





    }    



};