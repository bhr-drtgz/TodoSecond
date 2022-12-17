import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todolar, setTodolar] = useState(null);
  const [title, setTitle] = useState(" ");
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const todoSil = (id) => {
    axios.delete(`http://localhost:3004/todos/${id}`)
      .then((response) => {
        setResult(true)
        setResultMessage("Silme İşlemi Başarılı")
      })
      .catch((error) => {
        setResult(true)
        setResultMessage("Silme İşlemi Başarısız")
      })

  }

  useEffect(() => {
    axios.get("http://localhost:3004/todos")
      .then((response) => {
        console.log(response.data)
        setTodolar(response.data)
      })

  }, [result])

  const formuDenetle = (event) => {
    event.preventDefault()
    if (title === "") {
      alert("Yapılacal İş Boş Bırakılamaz")
      return
    }
    const newTodo = {
      id: String(new Date().getTime()),
      title: title,
      date: new Date(),
      completed: false
    }
    axios.post("http://localhost:3004/todos", newTodo)
      .then((response) => {
        //setTodolar([...todolar, newTodo])
        setTitle("")
        setResult(true)
        setResultMessage("Kayıt Başarılı")
      })
      .catch((error) => {
        setResult(true)
        setResultMessage("Kayıt Başarısız")
      })
  }

  if (todolar === null) {
    return null
  }

  return (
    <div className="container">
      {result === true && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1
        }}>
          <div class="alert alert-info" role="alert">
            <p> {resultMessage} </p>
            <div className="d-flex justify-content-center  ">
              <button onClick={() => setResult(false)} className="btn btn-sm btn-outline-dark">KAPAT</button>
            </div>
          </div>
        </div>
      )
      }
      <div className="row my-5">
        <form onSubmit={formuDenetle}>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Yapılacak İşler..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button className="btn btn-lg btn-primary" type="submit">EKLE</button>
          </div>
        </form>
      </div>
      {
        todolar.map((todo) => (
          <div key={todo.id} className="alert alert-dark d-flex justify-content-between align-items-center" role="alert">
            <div>
              <h1> {todo.title} </h1>
              <p>{new Date(todo.date).toLocaleString()}</p>
            </div>
            <div>
              <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-lg btn-warning">DÜZENLE</button>
                <button onClick={() => todoSil(todo.id)}
                  type="button" className="btn btn-lg btn-danger">SİL</button>
                <button type="button" className="btn btn-lg btn-primary">
                  {todo.completed === true ? "Yapılmadı" : "Yapıldı"}
                </button>
              </div>
            </div>
          </div>
        )
        )
      }
    </div>
  );
}


export default App;
