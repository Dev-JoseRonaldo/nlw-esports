import express from 'express'
import cors from 'cors';

import { PrismaClient } from '@prisma/client';
import { convertHoursStringToMinutes } from './utils/convert-hour-string-to-minutes';
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string';

const app = express()

app.use(express.json())
app.use(cors({}))

const prisma = new PrismaClient({
  log: ['query']
})

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        }
      }
    }
  });
  // res.sendStatus(200).json(games) 
  return res.status(200).json(games);
})

app.post('/games/:gameId/ads', async (req, res) => {
  const gameId: string = req.params.gameId;
  const body: any = req.body;

  // Validação - zod javascript
  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertHoursStringToMinutes(body.hourStart),
      hourEnd: convertHoursStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    }
  })

  return res.status(201).json(ad);
})

app.get('/games/:id/ads', async (req, res) => {
  const gameId: string = req.params.id;

  const ads = await prisma.ad.findMany({
    select: {
        id: true,
        name: true,
        weekDays: true,
        useVoiceChannel: true,
        yearsPlaying: true,
        hourStart: true,
        hourEnd: true,
    },
    where: {
        gameId,
    },
    orderBy: {
        createAt: 'desc',
    }
  })
  return res.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd),
    }
  }))
})

app.get('/ads/:id/discord', async (req, res) => {
  const adId = req.params.id;
  
  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    }
  })

  return res.json({
    discord: ad.discord,
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server Running in port ${PORT}`)
})