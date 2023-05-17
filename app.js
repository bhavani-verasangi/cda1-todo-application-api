const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const format = require("date-fns/format");
const isMatch = require("date-fns/isMatch");
var isValid = require("date-fns/isValid");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hashPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hashStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hashCategoryAndStatus = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const hashCategoryAndPriority = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

const hashSearchProperty = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};

const hashCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const hashCategoryAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const hashCategoryAndPriorityProperties = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

const hashSearchProperty = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};



const convertDataToResponseObject = (dbObject) => {
  return {
    id: dbObject.id,
    todo: dbObject.todo,
    category: dbObject.category,
    priority: dbObject.priority,
    status: dbObject.status,
    due_date: dbObject.due_date,
  };
};

//API-1
app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status, category } = request.query;
  let data = null;
  let getTodosQuery = ""
  switch (true) {
      const hashStatusProperty(request.query):
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        getTodosQuery = `
            SELECT * FROM todo WHERE status = '${status}';`;

        data = await db.all(getTodosQuery);
        response.send(
          data.map((eachItem) => convertDataToResponseObject(eachItem))
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;

      //Scenario - 2

      case hashPriorityProperty(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        getTodosQuery = `
            SELECT * FROM todo WHERE priority = '${priority}';`;

        data = await db.all(getTodosQuery);
        response.send(
          data.map((eachItem) => convertDataToResponseObject(eachItem))
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

      //Scenario - 3 
      case hashPriorityAndStatusProperties(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        if (
          status === "TO DO" ||
          status === "IN PROGRESS" ||
          status === "DONE"
        ) {
          getTodosQuery = `SELECT * FROM todo
                   WHERE priority = '${priority}'
                   AND status = '${status}';`;

          data = await db.all(getTodosQuery);
          response.send(
            data.map((eachItem) => convertDataToResponseObject(eachItem))
          );
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;

      //Scenario - 4 
      case hasSearchProperty(request.query):
      getTodosQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;

      data = await db.all(getTodosQuery);
      response.send(
        data.map((eachItem) => convertDataIntoResponseObject(eachItem))
      );

      break;

    // SCENARIO - 5 HAS BOTH CATEGORY AND STATUS

    case hashCategoryAndStatusProperties(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        if (
          status === "TO DO" ||
          status === "IN PROGRESS" ||
          status === "DONE"
        ) {
          getTodosQuery = `SELECT * FROM todo 
            WHERE category = '${category}'
            AND status = '${status}';`;

          data = await db.all(getTodosQuery);
          response.send(
            data.map((eachItem) => convertDataToResponseObject(eachItem))
          );
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;

      //Scenario - 6
      case hashCategoryProperty(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        getTodosQuery = `
            SELECT * FROM todo WHERE category = '${category}';`;

        data = await db.all(getTodosQuery);
        response.send(
          data.map((eachItem) => convertDataToResponseObject(eachItem))
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    //SCENARIO -7 HAS BOTH CATEGORY AND PRIORITY

    case hashCategoryAndPriorityProperties(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        if (
          priority === "HIGH" ||
          priority === "MEDIUM" ||
          priority === "LOW"
        ) {
          getTodosQuery = `SELECT * FROM todo 
            WHERE category = '${category}'
            AND priority = '${priority}';`;

          data = await db.all(getTodosQuery);
          response.send(
            data.map((eachItem) => convertDataIntoResponseObject(eachItem))
          );
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;
    //DEFAULT
    default:
      getTodosQuery = `SELECT * FROM todo;`;
      data = await db.all(getTodosQuery);
      response.send(
        data.map((eachItem) => convertDataIntoResponseObject(eachItem))
      );
    }
});

//API - 2 
app.get("/todos/:todoId/", async(request, response) => {
    const{ todoId } = request.params;
    const getTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const todo = await database.get(getTodoQuery);
  response.send(convertDataToResponseObject(todo));
})

//API-3
app.get("/agenda/", async(request, response) =>{
    const { date } = request.params;
    if(isMatch(date, "yyyy-MM-dd")){
        const newDate = format(new Date(date), "yyyy-MM-dd");
        const getDateQuery = `SELECT * FROM todo WHERE due_date = ${newDate};`;
        const dbReaponse = await db.all(getDateQuery);
        response.send(dbResponse.map((eachItem) => convertDataIntoResponseObject(eachItem)));

    };
});

//API-4 
app.post("/todos/", async(request, response) =>{
    const { id, todo, priority, status, category, dueDate } = request.body;
    if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW"){
        if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE"){
            if (category === "WORK" || category === "HOME" || category === "LEARNING"){
                
                if(isMatch(dueDate, "yyyy-MM-dd")){
                    const newDate = format(new Date(dueDate), "yyyy-MM-dd");
                    const postDueDateQuery = 
                        `INSERT INTO 
                            todo(id, todo, priority, status, category, due_date)
                        VALUES 
                            (${id}, '${todo}', '${priority}','${status}', '${category}', '${newDueDate}');`;
                    const dbReaponse = await db.all(postDueDateQuery);
                    response.send("Todo Successfully Added");
                }
                else{
                    response.status(400);
                    response.send("Invalid Due date");
                }

            }
            else{
                response.status(400);
                response.send("Invalid Todo Category");
            }
        }
        else{
            response.status(400);
            response.send("Invalid Todo Status");
        }
    }
    else{
        response.status(400);
        response.send("Invalid Todo Priority");
    }
});

//API-5 
app.put("/todos/:todoId/", async(request, response) => {
    const { todoId } = request.params;
    let updateColumn = "";
  const requestBody = request.body;

  const previousTodoQuery = `SELECT * FROM todo WHERE id =${todoId};`;
  const previousTodo = await db.get(previousTodoQuery);

  const {
    todo = previousTodo.todo,
    priority = previousTodo.priority,
    status = previousTodo.status,
    category = previousTodo.category,
    dueDate = previousTodo.dueDate,
  } = request.body;

  let updateTodo;

  //WE ARE USING SWITCH CASE BECAUSE SCENARIOS ARE GIVEN

  switch (true) {
    //UPDATING STATUS
    case requestBody.status !== undefined:
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        updateTodo = `
              UPDATE 
              TODO
              SET 
                todo='${todo}', 
                priority='${priority}',
                 status='${status}',
                  category='${category}',
                due_date='${dueDate}'
                 WHERE id = ${todoId};`;

        await db.run(updateTodo);
        response.send("Status Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }

      break;

    //UPDATING PRIORITY
    case requestBody.priority !== undefined:
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        updateTodo = `
              UPDATE 
              todo
              SET 
                todo='${todo}', 
                priority='${priority}',
                 status='${status}',
                  category='${category}',
                due_date='${dueDate}'
                 WHERE id = ${todoId};`;

        await db.run(updateTodo);
        response.send("Priority Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;

    //UPDATING TODO
    case requestBody.todo !== undefined:
      updateTodo = `
              UPDATE 
              TODO
              SET 
                todo='${todo}', 
                priority='${priority}',
                 status='${status}',
                  category='${category}',
                due_date='${dueDate}'
                 WHERE id = ${todoId};`;

      await db.run(updateTodo);
      response.send("Todo Updated");

      break;

    //UPDATING CATEGORY
    case requestBody.category !== undefined:
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        updateTodo = `
              UPDATE 
              todo
              SET 
                todo='${todo}', 
                priority='${priority}',
                 status='${status}',
                  category='${category}',
                due_date='${dueDate}'
                 WHERE id = ${todoId};`;

        await db.run(updateTodo);
        response.send("Category Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;

    //UPDATING DUE DATE

    case requestBody.dueDate !== undefined:
      if (isMatch(dueDate, "yyyy-MM-dd")) {
        const newDueDate = format(new Date(dueDate), "yyyy-MM-dd");

        updateTodo = `
              UPDATE 
              todo
              SET 
                todo='${todo}', 
                priority='${priority}',
                 status='${status}',
                  category='${category}',
                due_date='${dueDate}'
                 WHERE id = ${todoId};`;

        await db.run(updateTodo);
        response.send("Due Date Updated");
      } else {
        response.status(400);
        response.send("Invalid Due Date");
      }

      break;
  }
});


//API-6
app.delete("/todos/:todoId/", async(request, response) => {
    const { todoId } = request.params;
    const deleteTodoQuery = `DELETE FROM todo WHERE id = ${todoId};`;
    const dbResponse = await db.run(deleteTodoQuery);
    response.send("Todo Deleted");
});

module.exports = app;








