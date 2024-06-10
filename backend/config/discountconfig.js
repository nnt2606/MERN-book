import { DiscountBook } from '../models/discountBookModel.js';

export default function updateStatusDiscount(){
    setInterval(async() => {
        let now = new Date();
        const timezoneOffset = now.getTimezoneOffset();
        const offsetMilliseconds = timezoneOffset * 60 * 1000;
        now = new Date(now.getTime() + (420 * 60 * 1000))
        try{
            await DiscountBook.updateMany(
                {startAt: {$lte: now}, endAt: {$gte: now}},
                {status: true}
            );

            await DiscountBook.updateMany(
                {$or: [{ startAt: {$gt: now}}, {endAt:{$lt: now}}]},
                {status: false}
            );
            
        }catch(error){
            console.log('Error to update status');
        }
    }, 60000);
}