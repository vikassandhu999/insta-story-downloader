const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs');
const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const cors=require('cors');


app.use(bodyParser.json());
app.use(cors());

app.post('/',(async (req,res) => {
  let source=[];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(req.body.username);

  await page.goto(`https://www.instagram.com/stories/${req.body.username}/`);
  
  await page.waitFor(3000);
  if(await page.$('.error-container')!==null){
    res.send([{"status":"invalid username"}]);
  }
  if(page.url()!=`https://www.instagram.com/stories/${req.body.username}/`){
    res.send([{"status":"User hasn't any put stories"}]);
}
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', '<username>');
  await page.type('input[name="password"]', '<password>');
  await page.click('button[type="submit"]');
  await page.waitFor(5000);
  await page.click('._7UhW9');

  await page.waitFor(1500);
 //fetching the content 
  while(page.url()!='https://www.instagram.com/'){
    await page.waitFor(750);

   if(await page.$('.OFkrO')!= null){
    console.log("video");
    source.push({type:'video', src:await page.evaluate(() => document.querySelector('video.OFkrO > source').getAttribute('src'))});
   
   }
  else{
    console.log("image");
    source.push({type:'img', src:await page.evaluate(() => document.querySelector('.y-yJ5').getAttribute('src'))});
   
  }

  await page.click('.ow3u_');
  await page.waitFor(500);
  }
  
 
  await page.screenshot({path: 'example.png'});
  await browser.close();

   res.send(source);
})
);


app.listen(process.env.PORT || 4000,console.log('listening'));

//
