import React from "react";
import { useEffect, useState } from 'react'


export function useFetch() {
const [movies,setMovies] = useState([])
const [isLoading,setIsLoading] = useState(false)
const [isError,setIsError] = useState(false)
const [errr,setErr] = useState("")
const [search,setSearch] = useState("")

useEffect( function () {
    const controller = new AbortController()
    async function fetchData(){
    try { 
        setIsLoading(true)  
        setErr("")
        setIsError(false)
        let res = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=15318346&s=${search}`,{signal:controller.signal})
        let data = await res.json()

        if(!res.ok){ 
          throw new Error("something went wrong with your connection")
        }
        if(data.Response === "False"){
          throw new Error("Movie is not found")
        }
        if(search === ""){
          throw new Error("enter your movie name in search Box")
        }
        if (search ==="") {
          setMovies([])
          setResault(0)
        }else{
          setMovies(data.Search)
        }
        setIsLoading(false)
        setErr("")
        } 
    catch(err){
        if (err !== "AbortError"){
          setErr(err.message)
        }
        setIsError(true)
        }
    finally{
        setIsLoading(false)
        }
    }
    fetchData()
    return ()=>controller.abort()
    },[search])

return {movies,isLoading,isError,errr,setSearch}
}