import { useEffect, useRef, useState } from 'react'
import './App.css'
import fillstar from './assets/star-svgrepo-com.svg'
import outlineStar from './assets/fill-star.svg'
import { useFetch } from '../Hooks/useFetch'
import { useLocalStorage } from '../Hooks/useLocalStorage'
export default function App() {
  const [resault,setResault] = useState(0)
  const [movieShow,setMovieShow] = useState("")
  const [movieDetail,setMovieDetail]= useState({})
  const {Title : Title} = movieDetail ;
 
    const{movies,isLoading,isError,errr,setSearch} = useFetch()
    const{watchedmovie,setWatchedmovie} = useLocalStorage()

  function handleAddToList(starrate) {
    const movie = {
      Poster : movieDetail.Poster,
      Title : movieDetail.Title,
      Rate : starrate,
      imdbRating : movieDetail.imdbRating,
      Runtime : movieDetail.Runtime,
      imdbID : movieDetail.imdbID
      }
    setWatchedmovie((watched)=> [...watched,movie])
    setMovieShow(null)
  }

  function handleDeleteMovie(id) {
    setWatchedmovie(watchedmovie=> watchedmovie.filter(movie => movie.imdbID !== id))
    console.log("deleted")
  }
  useEffect(function(){
    setResault(()=>movies.length)
    setMovieShow(null)       
  },
  [movies.length])

  return (
  <>
    <Navbar>
      <Logo/>
      <Search setSearch={setSearch}/>
      <Searchresault resault={resault}/>
    </Navbar>

    <Main>
      <Box 
      isError={isError} 
      errr={errr}
      isLoading={isLoading} 
      movie={movies} 
      setmovieShow={setMovieShow}
      />
      
      <Watchedbox>
        {movieShow == null ? 
        <>
        <center><h2 style={{marginTop:"20px"}}>Watched movies :</h2></center>
        {watchedmovie.map(movie=><Watchedmovie handleDeleteMovie={handleDeleteMovie} movie={movie}/>)}
        </>
        :
        <Showmovie 
        key={movieShow}
        movieDetail={movieDetail}
        setMovieDetail={setMovieDetail} 
        handleAddToList={handleAddToList}
        movieShow={movieShow}
        setMovieShow={setMovieShow}
        setWatchedmovie={setWatchedmovie}
        Title={Title}
        />}
      </Watchedbox>
    </Main>
  </>
  )
}


function Navbar({children}) {
  return <nav>{children}</nav>
}
function Logo() {
  return <h1>MoH</h1>
}
function Search({setSearch}) {

  
  return (
  <input  
  type="text"   
  placeholder='Search ..'  
  onChange={(e)=>setSearch(e.target.value)}
  />)
}
function Searchresault({resault}) {
  return <h2>Found {resault} resault</h2>
}



function Main({children}) {
  return (
  <div className="main">
    {children}
  </div>
  )
}


function Box({setmovieShow,movie,isLoading,isError,errr}) {
  return (
  <div className="box">
    <div className="list">
      {(isLoading ? 
      <h1 style={{textAlign:"center"}}>Loading...</h1>:
      (isError?
        <h3 style={{textAlign:"center"}}>{errr}</h3>:
        movie.map((movie,i) =>
        <MovieItem 
          key={i}
          setmovieShow={setmovieShow} 
          movie={movie}
        />))) } 
    </div>
  </div>
  )
}

function MovieItem({movie, setmovieShow}) {
  return (
    <div className="movie" onClick={()=>setmovieShow(movie.imdbID)}>
      <img src={movie.Poster} />
      <span><h3>{movie.Title}</h3> <br /> <p>{movie.Year}</p></span>
    </div>
  )
}


function Watchedbox({children}) {
  return <div className="box">
    {children}
  </div>
}

 function Watchedmovie({movie,handleDeleteMovie}) {
  return (
    <div className="watched">
      <div> 
        <img 
        src={movie.Poster}
        style={{height:"70px",width:"50px"}} />
      </div> 
      
      <div style={{width:"150px",marginLeft:"10px"}}>
        <h3>{movie.Title}</h3> 
        <br />
        <p>⭐{movie.imdbRating}  , 🌟{movie.Rate} , 🕓 {movie.Runtime}</p> 
      </div> 
      <div 
      className='deletebtn'
      onClick={()=> handleDeleteMovie(movie.imdbID)}>X</div>
    </div>
  )
 } 

function Showmovie({movieShow,setMovieShow,setMovieDetail,movieDetail,handleAddToList,Title}) {
  const[starrate,setStarrate]= useState(0)
  const[temprate,setTemprate]= useState(0)
  const[isLoading,setIsLoading]= useState(false)

  useEffect( function () {
    async function fetchMovie(){
    try{
      setIsLoading(true)
      let res = await fetch(`https://www.omdbapi.com/?apikey=15318346&i=${movieShow}`)
      
      let data = await res.json()
      setMovieDetail(data)
      } 
    catch(err){
      console.log(err.message)
      } 
    finally{
      setIsLoading(false)
      }
    }
      fetchMovie()
  },[movieShow])

  
    useEffect(function () {
          if(!Title) return
          document.title = `Movie | ${Title}`

          return function () {
            document.title = 'MoH'
          }
      },[Title]
    )

    if (movieShow === "") {
      return
    }else{
      return (
      <>
    {isLoading ? <h1 style={{textAlign:"center", marginTop:"50px"}}>Loading...</h1> :
        <>
          <div className="top">
          <img src={movieDetail.Poster}/>
          <span>
            <h2>{movieDetail.Title}</h2>
            <br />
            <span>{movieDetail.Released} , {movieDetail.Runtime}</span>
            <br />
            <span>{movieDetail.Genre}</span>
            <br />
            <span>⭐{movieDetail.imdbRating} IMDb rating</span>
          </span>
        </div>
        <center>
        <Starsrating 
        starrate={starrate} 
        setStarrate={setStarrate} 
        handleAddToList={handleAddToList}
        temprate={temprate}
        setTemprate={setTemprate}
        />
        </center>

        <div className="bottom">
          <p>{movieDetail.Plot}</p>
          <br /><br />
          <button 
          className='backbtn'
          onClick={()=>setMovieShow(null)}>
            Back
          </button>
        </div>
        </>
        }
    </>
  )}
  }


function Starsrating({starrate,handleAddToList,setStarrate,temprate,setTemprate}) {
  const[isRate,setIsRate] = useState(false)

  
  return (
    <div 
    className="starContainer"
    >
      <div 
      className="stars" 
      style={{display:"flex" , gap:"10px"}}
      >
        <div 
        className='stars'
        onClick={()=>setIsRate(true)}
        >
          {Array.from({length : 10}, (_,i)=>(
          <span 
          onClick={()=>setStarrate(i+1)}
          onMouseEnter={()=>setTemprate(i+1)}
          >
            <Stars 
            full={(i+1 <= temprate ? true : false)}/>
          </span>
          ))
          }
        </div>
        <p>{ temprate || starrate || ""}</p>
      </div>
      <br />
      <button 
      style={{display:`${isRate?"block":"none"}`}} 
      className='addbtn'
      onClick={()=>handleAddToList(starrate)}
      >Add to list</button>
    </div>
  )
}
function Stars({full}) {
  return <>
  {(full ? <img className='star' src={fillstar}/>: 
  <img className='star' src={outlineStar}/>)} 
  </>
}
