import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import Cryptr from 'cryptr';
import { CardRepository } from './card.repository';
import { CreateCardDto } from './dto/createCardDto';
import dayjs from 'dayjs';

@Injectable()
export class CardService {
    private cryptr: Cryptr
    constructor(
        private readonly cardRpository: CardRepository
    ) {
        const Cryptr = require('cryptr')
        this.cryptr = new Cryptr(process.env.CRYPTR_SECRET)
    }

    async create(createCardDto: CreateCardDto, userId: number) {
        const findTitle = await this.cardRpository.findTitle(createCardDto.title, userId)
        if (findTitle) throw new ConflictException('This title already exist!')

        createCardDto.password = this.cryptr.encrypt(createCardDto.password)
        createCardDto.cvv = this.cryptr.encrypt(createCardDto.cvv.toString())
        const [month, year] = createCardDto.expiration.split('/')
        let day:string
        if([1, 3, 5, 7, 8, 10, 12].includes(parseInt(month))){
            day = '31'
        }else if(parseInt(month)===2){
            day = '28'
        }else{
            day = '30'
        }
        const fullDate = `${day}/${month}/20${year}`
        const newExpiration = new Date(dayjs(fullDate, 'DD/MM/YYYY').format('YYYY-MM-DD'));
        return await this.cardRpository.create(createCardDto, newExpiration, userId)
    }

    async findAll(userId: number) {
        const result =  await this.cardRpository.findAll(userId);
        result.map(e=>{
            e.password = this.cryptr.decrypt(e.password)
            e.cvv = this.cryptr.decrypt(e.cvv)
        })
        return result
    }

    async findOne(id: number, userId: number) {
        const result = await this.cardRpository.findOne(id)
        if (!result) throw new NotFoundException('Card not found!')
        if (result.userId !== userId) throw new ForbiddenException('This card is not yours!')
        result.password = this.cryptr.decrypt(result.password)
        result.cvv = this.cryptr.decrypt(result.cvv)
        return result
    }

    async remove(id: number, userId: number) {
        const card = await this.cardRpository.findOne(id)
        if (!card) throw new NotFoundException('Card not found!')
        if (card.userId !== userId) throw new ForbiddenException('This card is not yours!')
        return await this.cardRpository.remove(id)
    }
}
