import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axiosWithAuth from '../axios/index'
import axios from 'axios'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [currentArticle, setCurrentArticle] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const token = localStorage.getItem('token')

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */
    if(!localStorage.getItem('token')) {
      navigate('/')
    }
  }
  const redirectToArticles = () => { /* ✨ implement */
  if(localStorage.getItem('token')) {
    navigate('/articles')
  }
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if(token) {
      localStorage.removeItem('token')
      setMessage('Goodbye!')
      redirectToLogin()
    }
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!

    setMessage('')
    setSpinnerOn(true)
    axios.post('http://localhost:9000/api/login', {username: username, password: password})
      .then(res => {
        console.log(res.data)
        localStorage.setItem('token', res.data.token)
        setMessage(res.data.message)
        redirectToArticles()
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().get('/articles')
      .then(res => {
        setArticles(res.data.articles)
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().post('/articles', article)
      .then(res => {
        console.log(res)
        setMessage(res.data.message)
        setArticles([...articles, res.data.article])
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const updateArticle = article => {
    // ✨ implement
    // You got this!
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().put(`/articles/${currentArticle.article_id}`, article)
      .then(res => {
        setMessage(res.data.message)
        const newArticles = articles.map(art => {
          if(art.article_id === currentArticle.article_id) {
            return res.data.article
          } else {
            return art
          }
        })
        setArticles(newArticles)
        setCurrentArticle()
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().delete(`/articles/${article_id}`)
      .then(res => {
        const newArticles = articles.filter(art => art.article_id !== article_id)
        setMessage(res.data.message)
        setArticles(newArticles)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} currentArticle={currentArticle} setCurrentArticle={setCurrentArticle} updateArticle={updateArticle} />
              <Articles redirectToLogin={redirectToLogin} getArticles={getArticles} articles={articles} deleteArticle={deleteArticle} setCurrentArticle={setCurrentArticle} currentArticle={currentArticle} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
