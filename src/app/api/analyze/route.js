import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL обов’язковий' }, { status: 400 });
    }

    // 1. Запуск браузера та створення скріншота
    const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox'] 
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();

    // 2. Оптимізація зображення для Groq
    const optimizedImage = await sharp(screenshot)
      .resize(1200) // Оптимальний розмір для аналізу
      .jpeg({ quality: 85 })
      .toBuffer();

    const base64Image = optimizedImage.toString('base64');

    // 3. Запит до Groq з використанням моделі Llama 4 Scout
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "Ти професійний UX/UI дизайнер. Проаналізуй цей скріншот сайту: оціни композицію, колірну схему та юзабіліті. Відповідь дай українською мовою."
            },
            {
              "type": "image_url",
              "image_url": {
                "url": `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      "model": "meta-llama/llama-4-scout-17b-16e-instruct",
      "temperature": 1,
      "max_completion_tokens": 1024,
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    return NextResponse.json({ 
      analysis: chatCompletion.choices[0].message.content 
    });

  } catch (error) {
    console.error("Помилка аналізу:", error);
    return NextResponse.json({ 
      error: `Не вдалося обробити сайт: ${error.message}` 
    }, { status: 500 });
  }
}