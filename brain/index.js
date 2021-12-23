import fetch from "node-fetch";
import * as cheerio  from "cheerio";
import nodemailer from 'nodemailer'
import Item from "../model/item.js";


export const fetchURL  = async (url) => {

    try {
    
        const response =  (await fetch(url)).text()
        // console.log(response)
        const $ = cheerio.load((await response))
        // B_NuCI
        
        var price = null, title = null, imgSrc = null

        if(url.search('amazon') !== -1){

            price = $('span#priceblock_ourprice')[0].children[0].data
            
            

            title = $('span#productTitle')[0].children[0].data.trim().substring(0,50) + "...."
            imgSrc = $('div#imgTagWrapperId > img')[0].attribs.src
            

        }else if(url.search('flipkart') !== -1){

            title = $('span.B_NuCI')[0].children[0].data.trim().substring(0,50) + "...."
            price = $('div._30jeq3')[0].children[0].data
            imgSrc = $('div.CXW8mj > img')[0].attribs.src
        }
        
        const finalPrice = priceMaker(price)
        
        return {
            price: finalPrice,
            title,
            imgSrc
        }

    } catch (error) {
        return error.message
    }
   
}

const priceMaker = (price) => {

    const priceWithoutDecimal = price.split(".")[0].split("₹")[1]
    const priceArry = priceWithoutDecimal.split(",")
    
    var price = parseInt(priceArry[priceArry.length - 1])
    var tenCount = 1000

    for (let index = priceArry.length - 2; index  >= 0 ; index--) {
    
        price +=  parseInt(priceArry[index] * tenCount)
        tenCount *= 100

    }

    return price    

}

export const sendMail = async (reciverEmail, subject, html) => {
    try {

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: process.env["EMAIL"],
                pass: process.env["PASSWORD"]
            }
        });
  
        let info = await transporter.sendMail({
            from: process.env['EMAIL'],
            to: reciverEmail,
            subject: subject, 
            text: subject, 
            html: html, 
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
   
    } catch (error) {
       console.log(error)
    }
}

export const priceComparisonAndMailSender = async () =>  {
    
    const databaseItems  = await Item.find()
    
    await databaseItems.map( async (item) => {
        const fetchedData = await fetchURL(item.url)
        item.expectedPrice >= fetchedData.price ?  sendMail(item.emailId, "Your deal is here!", `<h1>${item.url}</h1>`) : console.log('false')
    
    })
    

}