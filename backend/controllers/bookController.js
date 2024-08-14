import {Book} from '../models/booksModel.js';
import {Copy} from '../models/copyModel.js';
import logActivity from '../config/logger.js';
import { BookRating } from '../models/bookRatingModel.js';

export const getBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json(books);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

export const createBook = async (req, res) => {
    try{
        // let image = ''
        // if(req.file){
        //     image = req.file.path
        // }
        const{title, authors, series, genre} = req.body;
        const newBook = new Book({title, authors, series, genre});
        const book = await newBook.save();
        await BookRating.create({bookId: book._id});
        await logActivity(req._id,'CREATE NEW BOOK', book._id, 'Book', book);
        res.status(200).json(book);
    } catch( error){
        res.status(500).json({error: error.message});
    }
};

export const deleteBook = async (req,res) =>{
    try{
        const {_id} = req.body;
        const deletedBook = await Book.findByIdAndDelete(_id);
        await Copy.findOneAndDelete({bookId: _id});
        if(!deletedBook){
            return res.status(400).json({error: 'Book not found 404'});
        }
        await logActivity(req._id, 'DELETE BOOK', _id, 'Book', deletedBook);
        res.status(200).json({message: 'Book deleted'});
    } catch(error){
        res.status(500).json({error: error.message});
    }

};

export const updateBook = async (req, res) =>{
    try{
        const {_id,title, authors, series, genre} = req.body;
        const updatedBook = await Book.findByIdAndUpdate(
            _id,
            {title, authors, series, genre},
            {new:true}
        );
        if(!updatedBook){
            return res.status(404).json({message: 'Book not found'});
        }
        await logActivity(req._id, 'UPDATE BOOK', _id, 'Book', updatedBook);
        res.status(200).json(updatedBook);
    } catch(error){
        res.status(500).json({error: error.message});
    }
};

export const getAllGenres = async (req,res) =>{
    try {
        const books = await Book.find({}, 'genre'); // Truy vấn tất cả các sách và chỉ lấy trường genres
        const allGenres = books
          .flatMap(book => book.genre) // Trích xuất mảng genres từ mỗi sách và hợp nhất thành một mảng
          .filter((value, index, self) => self.indexOf(value) === index); // Loại bỏ các thể loại trùng lặp
          
    
        res.status(200).json(allGenres.sort())
      } catch (error) {
        res.status(500).json({error: error.message})
      }
}