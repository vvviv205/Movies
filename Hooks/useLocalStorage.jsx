import React from "react";
import { useState,useEffect } from "react";

export function useLocalStorage() {
    const [watchedmovie,setWatchedmovie] = useState(()=>{
        const stored = localStorage.getItem("watched")
        if (stored == [] || stored === null) {
          return []
        }else{
          return JSON.parse(stored)
        }
      })
      
    useEffect(function () {
        localStorage.setItem("watched", JSON.stringify(watchedmovie))
      },
      [watchedmovie])

    return {watchedmovie,setWatchedmovie}
}