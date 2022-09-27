const express = require('express');

function routes(Book){
const bookRouter = express.Router();

//Añadir libros
bookRouter.route('/books')
  .post((req,res)=>{
    const book= new Book(req.body);
    console.log(book);
    book.save();
    return res.status(201).json(book);
  });

//Listar libros
bookRouter.route('/books')
  .get((req, res) => {
    const { query } = req;
    Book.find(query, (err,books)=>{
      if(err){
        return res.send(err);
      }
        return res.json(books);
    });
  });

//Buscar por id
//Middleware
bookRouter.use('/books/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId,(err,books)=>{
    if(err){
      return res.send(err);
    }
    if(books){
      console.log(req,'req');
      console.log(books,'books');
      req.books=books;
      return next();
    }
      return res.sendStatus(404);
  });
});

bookRouter.route('/books/:bookId')
  .get((req, res) => res.json(req.book))
  .put((req, res) => {
    console.log(req.body,'req.body del put, el que queremos actualizar');
    console.log(req.books,'req.books del put, el antiguo');
    const {books} = req;
    books.title = req.body.title;
    books.genre = req.body.genre;
    books.author = req.body.author;
    books.read = req.body.read;
    req.books.save((err)=>{
      if(err){
        return res.send(err);
      }
      return res.json(books);
    });
  })
  .patch((req,res)=>{
    const {books} = req;
    //Borramos el id que viene con el libro para no añadirlo de nuevo
    //al objeto que estamos modificando
    if(req.body._id){
      delete req.body._id;
    }

    Object.entries(req.body).forEach(item =>{
      console.log(req.body,'req.body');
      console.log(item,'item');

      const key= item[0];
      const value= item [1];
      books[key]=value;
    });
    req.books.save((err)=>{
      if(err){
        return res.send(err);
      }
      return res.json(books);
    });
  })
  .delete((req,res)=>{
    req.books.remove((err)=>{
      if(err){
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  });

return bookRouter;
}

module.exports = routes;