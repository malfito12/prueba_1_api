var connect =require('./connect')

let books={
    name:String,
    author:String,
    cant:String
}

const BOOK=connect.model('Book', books)
module.exports=BOOK