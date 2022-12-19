import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todolar, setTodolar] = useState(null);
  const [title, setTitle] = useState(" ");
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [duzenlemeVarMı, setDuzenlemeVarMı] = useState("")
  const [duzenlenecekTodo, setDuzenlenecekTodo] = useState(null);
  const [duzenlenecekTitle, setDuzenlenecekTitle] = useState("")

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
  const changeTodosComledet = (todo) => {
    console.log(todo)
    const updatedTodo = {
      ...todo,
      completed: !todo.completed
    }
    axios.put(`http://localhost:3004/todos/${todo.id}`, updatedTodo)
      .then((response) => {
        setResult(true)
        setResultMessage("Güncelleme İşlemi Başarılı")
      })
      .catch((error) => {
        setResult(true)
        setResultMessage("Güncelleme İşlemi Başarısız")
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

  const todoGuncelleFormuDenetle = (event) => {
    event.preventDefault()
    if (duzenlenecekTitle === "") {
      alert("Title Boş Bırakılamz")
      return
    }
    const updatedTodo = {
      ...duzenlenecekTodo,
      title:duzenlenecekTitle
    }
    axios.put(`http://localhost:3004/todos/${updatedTodo.id}`,updatedTodo)
    .then((response)=>{
      setResult(true)
      setResultMessage("Güncelleme Başarılı")
      setDuzenlemeVarMı(false)
     })
     .catch((error)=>{
      setResult(true)
      setResultMessage("Güncelleme Başarısız")
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
          <div className="alert alert-info" role="alert">
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
      {duzenlemeVarMı === true && (
        <div className="row my-5">
          <form onSubmit={todoGuncelleFormuDenetle}>
            <div className="input-group mb-3">
              <input type="text"
                className="form-control"
                placeholder="Yapılacak İşler..."
                value={duzenlenecekTitle}
                onChange={(event) => setDuzenlenecekTitle(event.target.value)}
              />
              <button onAuxClick={() => setDuzenlemeVarMı(false)} className="btn btn-lg btn-danger" type="submit">VAZGEÇ</button>
              <button className="btn btn-lg btn-primary" type="submit">GÜNCELLE</button>
            </div>
          </form>
        </div>
      )}
      {
        todolar.map((todo) => (
          <div key={todo.id} className="alert alert-dark d-flex justify-content-between align-items-center" role="alert">
            <div>
              <h1 style={{
                textDecoration:
                  todo.completed === true ? "line-through" : "none",
                color: todo.completed === true ? "#0f0" : "black"
              }} > {todo.title} </h1>
              <p>{new Date(todo.date).toLocaleString()}</p>
            </div>
            <div>
              <div className="btn-group" role="group" aria-label="Basic example">
                <button onClick={() => {
                  setDuzenlemeVarMı(true)
                  setDuzenlenecekTodo(todo)
                  setDuzenlenecekTitle(todo.title)

                }} type="button" class="btn btn-lg btn-warning">DÜZENLE</button>
                <button onClick={() => todoSil(todo.id)}
                  type="button" className="btn btn-lg btn-danger">SİL</button>
                <button onClick={() => changeTodosComledet(todo)} type="button" className="btn btn-lg btn-primary">
                  {todo.completed === false ? "Yapılmadı" : "Yapıldı"}
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
