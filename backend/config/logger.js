import Log from "../models/logModel.js";

const logActivity = async(user, action, relatedId ,model, description) =>{
    const log = new Log({
        user,
        action,
        description
    })
    switch(model){
      case 'Book':
        log.related.Book = relatedId;
        break;
      case 'Copy':
        log.related.Copy = relatedId;
        break;
      case 'Order':
        log.related.Order = relatedId;
        break;
      case 'Rating':
        log.related.Rating = relatedId;
        break;
      case 'Discount':
        log.related.Discount = relatedId;
        break;
    }

    try {
        await log.save();
      } catch (error) {
        console.error('Error logging activity:', error);
      }
}

export default logActivity;