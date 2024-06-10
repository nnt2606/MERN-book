export const convertTime = (time) =>{
    const date= new Date(time);
    const gmt7Time = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    return gmt7Time.toISOString();
}