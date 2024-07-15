import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

const { PORT, DATABASE_URL } = process.env;

const {schema, model} = mongoose;

mongoose.connect(DATABASE_URL);

mongoose.connection
.on('connected', () => console.log('Connected to MongoDB'))
.on('disconnected', () => console.log('Disconnected from MongoDB'))
.on('error', (error)=> console.log("err ", error));

var Schema = mongoose.Schema;
const todoSchema = new Schema({
    title: String,
    complete: Boolean
})

const Todo = model('Todo', todoSchema);


//routes
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))


 // get all the todos from the database
app.get("/", async (req, res) => {
    const todos = await Todo.find({});
    res.render("main.ejs", { todos });
  });
  
  
  // CREATE ROUTE - "/todo" - create a new todo
  app.post("/todo", async (req, res) => {
    try {
      req.body.complete = false;
      const newTodo = await Todo.create(req.body);
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  });
  


  // Update Route - marks todo as completed or undone
app.put("/todo/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).send('Todo not found');
    }

    // Toggle the complete status
    todo.complete = !todo.complete;
    await todo.save();

    const todos = await Todo.find({});
    res.render("index.ejs", { todos });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

  
  // delete route - deletes a todo
  app.delete("/todo/:id", async (req, res) => {
    try {
      const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
      // get all the todos from the database
      const todos = await Todo.find({});
      res.render("index.ejs", { todos });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  });

  app.delete('/delete-all', async (req, res) => {
    try {
      const deletedTodos = await Todo.deleteMany({});
      const todos = await Todo.find({});
      res.render('index.ejs', { todos });
    } catch (error) {
      console.log(error);
      res.send(error);
  }});
  

app.listen(PORT, ()=> console.log(`Server is running on  http://localhost:${PORT}/`))
